from fastapi import APIRouter, HTTPException
from app.services.supabase_service import DBServiceClass
from app.models.schemas import LearningReportResponse

router = APIRouter(prefix="/donor", tags=["Donor"])

database = DBServiceClass()

# @router.get("/test")
# def test_db_connection():
#     result = DBServiceClass.test_connection()
#     return {"result": result}


# @router.get("/get_latest_learning_report/{student_id}", response_model=LearningReportResponse)
# async def get_latest_learning_report(student_id: str):
#     result = await database.get_data_by_student(student_id)

#     if not result:
#         raise HTTPException(status_code=404, detail="Student not found")

#     latest_report = result.latest_report

#     return LearningReportResponse(
#         student_id=student_id,
#         updated_report=latest_report["summary"],
#         progress_update=latest_report["progress_update"],
#         scores=latest_report["scores"],
#         overall_score=latest_report["overall_score"],
#     )

@router.get("/get_all_notifications/{donor_id}/{student_id}")
async def get_all_notifications(donor_id: str, student_id: str):
    return database.get_all_notifications(donor_id, student_id)
