from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Depends
from typing import Optional, List
from database import save_note_to_db, get_notes_from_db, get_note_by_id, save_flashcards_to_db, get_flashcards_from_db
from dependencies import verify_token
import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field


class Flashcard(BaseModel):
    question: str = Field(description="The question for the flashcard")
    answer: str = Field(description="The answer to the question")
    difficulty: str = Field(description="The difficulty level: easy, medium, or hard")

class FlashcardList(BaseModel):
    flashcards: List[Flashcard]

router = APIRouter()

@router.post("")
async def upload_note(
    title: Optional[str] = Form(None),
    content: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    user_id: str = Depends(verify_token)
):
    note_content = ""
    
    if file:
        if not file.filename.endswith(".txt"):
             raise HTTPException(status_code=400, detail="Only .txt files are allowed")
        content_bytes = await file.read()
        try:
            note_content = content_bytes.decode("utf-8")
        except:
             raise HTTPException(status_code=400, detail="File encoding must be UTF-8")
    elif content:
        note_content = content
    else:
        raise HTTPException(status_code=400, detail="Either file or content must be provided")

    if not note_content.strip():
        raise HTTPException(status_code=400, detail="Content cannot be empty")
        
    try:
        note_id = save_note_to_db(user_id, note_content, title)
        return {"success": True, "note_id": note_id, "message": "Note uploaded successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("")
async def get_notes(user_id: str = Depends(verify_token)):
    try:
        notes = get_notes_from_db(user_id)
        return {"success": True, "notes": notes}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{note_id}/generate-cards")
async def generate_flashcards(note_id: int, count: int = 5, user_id: str = Depends(verify_token)):
    # 1. Get note content
    note = get_note_by_id(note_id, user_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    # 2. Setup LangChain
    try:
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
             raise HTTPException(status_code=500, detail="Google API Key not configured")

        llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key=api_key, temperature=0.7)
        parser = PydanticOutputParser(pydantic_object=FlashcardList)

        prompt = PromptTemplate(
            template="You are a helpful study assistant. Create {count} flashcards based on the following text. Each flashcard should have a question, an answer, and a difficulty level (easy, medium, hard).\n\nText: {text}\n\n{format_instructions}\n",
            input_variables=["count", "text"],
            partial_variables={"format_instructions": parser.get_format_instructions()}
        )

        chain = prompt | llm | parser
        
        # 3. Generate
        result = chain.invoke({"count": count, "text": note['content']})
        
        # 4. Save to DB
        flashcards_data = [fc.dict() for fc in result.flashcards]
        save_flashcards_to_db(user_id, note_id, flashcards_data)
        
        return {"success": True, "flashcards": flashcards_data}

    except Exception as e:
        print(f"Error generating flashcards: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate flashcards: {str(e)}")

@router.get("/{note_id}/flashcards")
async def get_flashcards(note_id: int, user_id: str = Depends(verify_token)):
    try:
        flashcards = get_flashcards_from_db(note_id, user_id)
        return {"success": True, "flashcards": flashcards}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from database import delete_note_db

@router.delete("/{note_id}")
async def delete_note(note_id: int, user_id: str = Depends(verify_token)):
    try:
        success = delete_note_db(user_id, note_id)
        if not success:
            raise HTTPException(status_code=404, detail="Note not found or permission denied")
        return {"success": True, "message": "Note deleted successfully"}
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

