# app/services/notification_service.py
from app.services.supabase_service import DBServiceClass
from app.services.linking_service import LinkingServiceClass

database = DBServiceClass()
linking_service = LinkingServiceClass()


class NotificationService:

    def notify_donor_of_new_report(
        self,
        student_id: str,
        learning_report: dict,
        image_url: str,
    ):
        try:
            donor_id = LinkingServiceClass.get_linked_donor_id(self, student_id)

            return database.notify_donor_of_new_report(
                donor_id=donor_id,
                student_id=student_id,
                learning_report=learning_report,
                journal=image_url
            )
        except Exception as e:
            raise e
    
