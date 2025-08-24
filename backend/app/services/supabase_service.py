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

    def get_all_children(self, donor_id: str):
        res = (
            supabase.table("student_donor_links")
            .select("student_id")
            .eq("donor_id", donor_id)
            .execute()
        )
        return res.data

    def get_child_information_by_id(self, student_id: str):
        res = (
            supabase.table("students")
            .select("*")
            .eq("student_id", student_id)
            .execute()
        )
        if res.data:
            return res.data[0]
        return None

    def get_donor_by_supabase_id(self, supabase_id: str):
        res = (
            supabase.table("donors").select("id").eq("auth_uid", supabase_id).execute()
        )
        if res.data:
            return res.data
        return None

    def get_latest_notification(self, donor_id: str, student_id: str):
        """Get the most recent notification for a donor-student pair"""
        res = (
            supabase.table("notifications")
            .select("*")
            .eq("donor_id", donor_id)
            .eq("student_id", student_id)
            .order("created_at", desc=True)
            .limit(1)
            .execute()
        )
        if res.data:
            return res.data[0]
        return None

    def count_unread_notifications(self, donor_id: str, student_id: str):
        """Count unread notifications for a donor-student pair"""
        # For now, return a default count since we don't have an is_read field
        # You can add an 'is_read' boolean column to notifications table later
        res = (
            supabase.table("notifications")
            .select("*", count="exact")
            .eq("donor_id", donor_id)
            .eq("student_id", student_id)
            .execute()
        )
        return res.count or 0

    def mark_notifications_as_read(self, donor_id: str, student_id: str):
        """Mark all notifications as read for a donor-student pair"""
        supabase.table("notifications").update({"is_read": True}).eq("donor_id", donor_id).eq("student_id", student_id).execute()
        return {"success": True, "message": "Notifications marked as read"}
