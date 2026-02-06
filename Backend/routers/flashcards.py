from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from database import search_flashcards_db, get_flashcard_sets_from_db, get_recent_flashcards_db, get_flashcard_by_id_db, update_flashcard_to_db
from dependencies import verify_token
from pydantic import BaseModel, Field

router = APIRouter()

class FlashcardUpdate(BaseModel):
    question: str
    answer: str
    difficulty: str

@router.get("/search")
async def search_flashcards(q: str, user_id: str = Depends(verify_token)):
    try:
        flashcards = search_flashcards_db(user_id, q)
        return {"success": True, "flashcards": flashcards}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/user/sets")
async def get_flashcard_sets(user_id: str = Depends(verify_token)):
    try:
        sets = get_flashcard_sets_from_db(user_id)
        return {"success": True, "sets": sets}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/recent")
async def get_recent_flashcards(limit: int = 5, user_id: str = Depends(verify_token)):
    try:
        flashcards = get_recent_flashcards_db(user_id, limit)
        return {"success": True, "flashcards": flashcards}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from database import get_flashcard_stats_db

@router.get("/stats")
async def get_flashcard_stats(user_id: str = Depends(verify_token)):
    try:
        stats = get_flashcard_stats_db(user_id)
        return {"success": True, "stats": stats}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from database import get_due_flashcards_db, update_flashcard_review_db

class FlashcardReview(BaseModel):
    rating: int = Field(..., ge=0, le=5)

@router.get("/due")
async def get_due_flashcards(user_id: str = Depends(verify_token)):
    try:
        # Default scheduling logic handles picking due cards
        flashcards = get_due_flashcards_db(user_id)
        return {"success": True, "flashcards": flashcards}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{flashcard_id}/review")
async def review_flashcard(flashcard_id: int, review: FlashcardReview, user_id: str = Depends(verify_token)):
    try:
        updated_card = update_flashcard_review_db(user_id, flashcard_id, review.rating)
        if not updated_card:
             raise HTTPException(status_code=404, detail="Flashcard not found")
        return {"success": True, "flashcard": updated_card}
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{flashcard_id}")
async def get_flashcard(flashcard_id: int, user_id: str = Depends(verify_token)):
    try:
        flashcard = get_flashcard_by_id_db(user_id, flashcard_id)
        if not flashcard:
            raise HTTPException(status_code=404, detail="Flashcard not found")
        return {"success": True, "flashcard": flashcard}
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{flashcard_id}")
async def update_flashcard(flashcard_id: int, update_data: FlashcardUpdate, user_id: str = Depends(verify_token)):
    try:
        result = update_flashcard_to_db(user_id, flashcard_id, update_data.question, update_data.answer, update_data.difficulty)
        if result is None:
             raise HTTPException(status_code=404, detail="Flashcard not found or permission denied")
        
        # return updated flashcard
        updated_flashcard = get_flashcard_by_id_db(user_id, flashcard_id)
        return {"success": True, "flashcard": updated_flashcard, "message": "Flashcard updated successfully"}
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from database import delete_flashcard_db

@router.delete("/{flashcard_id}")
async def delete_flashcard(flashcard_id: int, user_id: str = Depends(verify_token)):
    try:
        success = delete_flashcard_db(user_id, flashcard_id)
        if not success:
            raise HTTPException(status_code=404, detail="Flashcard not found or permission denied")
        return {"success": True, "message": "Flashcard deleted successfully"}
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

