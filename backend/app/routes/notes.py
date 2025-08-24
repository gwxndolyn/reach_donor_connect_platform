from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.ocr_service import extract_text_from_image_url
from app.services.supabase_service import get_supabase_client
from app.routes.student import submit_journal
from app.models.schemas import JournalSubmission 

router = APIRouter(prefix="/notes", tags=["notes"])

class NoteUploadRequest(BaseModel):
    student_id: str
    file_url: str

@router.post("/upload")
async def upload_note(request: NoteUploadRequest):
    supabase = get_supabase_client()

    try:
        # 1️⃣ Extract text from the image
        extracted_text = extract_text_from_image_url(request.file_url)

        # 2️⃣ Insert record into Supabase
        payload = {
            "student_id": request.student_id,
            "image_url": request.file_url,
            "extracted_text": extracted_text,
        }

        supabase.table("journal_entries").insert(payload).execute()

        submission_payload = JournalSubmission(
            student_id = request.student_id,
            journal = extracted_text,
            image_url = request.file_url
        )

        submission_result = await submit_journal(submission_payload)
        print(submission_result)

        return {
            "student_id": request.student_id,
            "image_url": request.file_url,
            "extracted_text": extracted_text
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
