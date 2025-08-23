from supabase import create_client
from app.config import SUPABASE_URL, SUPABASE_KEY
from app.models.schemas import JournalData

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def get_supabase_client():
    return supabase

class DBServiceClass:
    def test_connection():
        try:
            # Fetch the first row in the donor table
            response = supabase.table("donors").select("*").limit(1).execute()
            return response.data
        except Exception as e:
            return {"error": str(e)}

    async def get_data_by_student(self, student_id: str):
        result = (
            supabase.table("students")
            .select("*")
            .eq("student_id", student_id)
            .execute()
        )
        if result.data:
            row = result.data[0]
            return JournalData(
                student_id=str(row["student_id"]),
                journal_list=row.get("journal_list") or [],
                report_list=row.get("report_list") or [],
                latest_report=row.get("latest_report") or {},
            )
        return None

    async def save_new_submission(
        self, student_id: str, new_journal: str, new_report: dict
    ):
        # Fetch current data
        print("Trying to save new submission...")
        existing = await self.get_data_by_student(student_id)
        journals_list = (
            existing.journal_list + [new_journal] if existing else [new_journal]
        )
        report_list = existing.report_list + [new_report] if existing else [new_report]

        data = {
            "student_id": student_id,
            "journal_list": journals_list,
            "report_list": report_list,
            "latest_report": new_report,
        }
        print("Upserting data:", data)

        try:
            result = (
                supabase.table("students")
                .update(data)
                .eq("student_id", student_id)
                .execute()
            )
            print("Update successful:", result.data)
            return result
        except Exception as e:
            print(f"Error updating student data: {e}")
            print(f"Error type: {type(e)}")
            raise e
