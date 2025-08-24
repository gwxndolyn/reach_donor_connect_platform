from supabase import create_client
from app.config import SUPABASE_URL, SUPABASE_KEY
from app.models.schemas import JournalData
import random

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

        try:
            result = (
                supabase.table("students")
                .update(data)
                .eq("student_id", student_id)
                .execute()
            )
            return result
        except Exception as e:
            raise e

    def get_linked_donor_id(self, student_id: str):
        res = (
            supabase.table("student_donor_links")
            .select("donor_id")
            .eq("student_id", student_id)
            .maybe_single()
            .execute()
        )
        if not res:
            return None
        return res.data["donor_id"]

    def pick_random_donor_id(self) -> str:
        res = supabase.table("donors").select("id").execute()
        ids = [row["id"] for row in (res.data or [])]
        if not ids:
            raise RuntimeError("No donors available")
        return random.choice(ids)

    def ensure_student_donor_link(self, student_id: str) -> str:
        donor_id = self.get_linked_donor_id(student_id)
        if donor_id:
            return donor_id
        donor_id = self.pick_random_donor_id()
        # idempotent: student_id is PK in link table, so duplicates won’t create multiple links
        supabase.table("student_donor_links").upsert(
            {"student_id": student_id, "donor_id": donor_id}
        ).execute()
        return donor_id

    def notify_donor_of_new_report(
        self, donor_id: str, student_id: str, learning_report: dict, journal: str
    ):
        try:
            data = {
                "donor_id": donor_id,
                "student_id": student_id,
                "learning_report": learning_report,
                "journal_image": journal,
            }
            res = supabase.table("notifications").insert(data).execute()
            return res
        except Exception as e:
            return {"error": str(e)}

    def get_all_notifications(self, donor_id: str, student_id: str):
        res = (
            supabase.table("notifications")
            .select("*")
            .eq("student_id", student_id)
            .eq("donor_id", donor_id)
            .execute()
        )
        print(res.data)
        return res.data
