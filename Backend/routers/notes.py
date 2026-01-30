from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Depends
from typing import Optional
from database import save_note_to_db, get_notes_from_db
from dependencies import verify_token

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
