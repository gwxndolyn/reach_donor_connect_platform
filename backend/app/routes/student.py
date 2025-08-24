from fastapi import APIRouter, HTTPException
from app.models.schemas import JournalSubmission
from app.services.learning_report import LearningReportClass
from app.services.linking_service import LinkingServiceClass
from app.services.notification_service import NotificationService

router = APIRouter(prefix="/student", tags=["Student"])
lr = LearningReportClass()
notifier = NotificationService()
linking_service = LinkingServiceClass()


@router.post("/submit")
async def submit_journal(payload: JournalSubmission):
    print("Received payload:", payload)
    report = await lr.generate_learning_report(payload.student_id, payload.journal, payload.journal_topic)
    if report is None:
        raise HTTPException(status_code=500, detail="Report generation failed")
    
    print("Before calling linking service")
    linking_service.ensure_student_donor_link(payload.student_id)
    print("After calling linking service")
    print("Before calling notifier")
    resp_dict = report.model_dump()
    notifier.notify_donor_of_new_report(
        student_id=payload.student_id,
        learning_report=resp_dict,
        image_url=payload.image_url,
        journal_topic=payload.journal_topic
    )
    print("After calling notifier")
    return {"message": "Journal submitted and report generated.", "report": report}
