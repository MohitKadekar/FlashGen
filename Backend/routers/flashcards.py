from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from database import search_flashcards_db
from dependencies import verify_token

router = APIRouter()

@router.get("/search")
async def search_flashcards(q: str, user_id: str = Depends(verify_token)):
    try:
        flashcards = search_flashcards_db(user_id, q)
        return {"success": True, "flashcards": flashcards}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
