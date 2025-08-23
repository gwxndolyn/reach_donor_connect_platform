from fastapi import APIRouter, HTTPException
from app.services.supabase_service import test_connection

router = APIRouter(prefix="/donor", tags=["Donor"])

@router.get("/test")
def test_db_connection():
    result = test_connection()
    return {"result": result}