from fastapi import APIRouter, HTTPException
from app.models.schemas import JournalSubmission
from app.services.learning_report import LearningReportClass

router = APIRouter(prefix="/student", tags=["Student"])
lr = LearningReportClass()


@router.post("/submit")
async def submit_journal(payload: JournalSubmission):
    report = await lr.generate_learning_report(payload.student_id, payload.journal)
    if report is None:
        raise HTTPException(status_code=500, detail="Report generation failed")
    return {"message": "Journal submitted and report generated.", "report": report}
