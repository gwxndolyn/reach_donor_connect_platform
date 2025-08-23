from app.services.supabase_service import DBServiceClass
from app.services.llm_service import LLMClass
from app.models.schemas import LearningReportResponse


class LearningReportClass:
    def __init__(self):
        self.db = DBServiceClass()
        self.llm = LLMClass()

    async def generate_learning_report(self, student_id: str, new_journal: str):
        existing_data = await self.db.get_data_by_student(student_id)

        latest_report = existing_data.latest_report if existing_data else {}

        report = self.llm.get_updated_learning_report(new_journal, latest_report)
        print("Generated Report:", report)

        await self.db.save_new_submission(
            student_id=student_id,
            new_journal=new_journal,
            new_report=report
        )

        return LearningReportResponse(
            student_id=student_id,
            updated_report=report.get("summary", ""),
            progress_update=report.get("progress_update", ""),
            scores=report.get("scores", {}),
            overall_score=report.get("overall_score", 0.0),
        )
