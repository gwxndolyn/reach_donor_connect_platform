from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from app.services.ocr_service import extract_text_from_image_uri

router = APIRouter(prefix="/notes", tags=["notes"])

class NoteUploadRequest(BaseModel):
    beneficiary_name: str
    file_uri: str

@router.post("/upload")
async def upload_note(request: NoteUploadRequest):
    try:
        extracted_text = extract_text_from_image_uri(request.file_uri)
        print(extracted_text)
        return {"beneficiary_name": request.beneficiary_name, "extracted_text": extracted_text}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
