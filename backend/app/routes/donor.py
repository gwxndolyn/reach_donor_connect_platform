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


@router.get("/get_all_children/{donor_id}")
async def get_all_children(donor_id: str):
    try:
        # Get the student-donor links
        links = database.get_all_children(donor_id)
        print("Links:", links)

        if not links:
            return []

        # Extract student IDs from the links
        student_ids = [link["student_id"] for link in links]
        print("Student IDs:", student_ids)

        # Get student data for each ID
        students_data = []
        for student_id in student_ids:
            # Remove await since get_child_information_by_id is not async
            student_data = database.get_child_information_by_id(str(student_id))

            print("Student Data:", student_data)
            if student_data:
                # Get the latest notification/message for this student
                latest_notification = database.get_latest_notification(
                    donor_id, str(student_id)
                )
                last_message = "No messages yet"
                timestamp = ""
                unread_count = 0

                if latest_notification:
                    # Extract a preview of the latest message
                    if latest_notification.get(
                        "learning_report"
                    ) and latest_notification["learning_report"].get("progress_update"):
                        last_message = (
                            latest_notification["learning_report"]["progress_update"][
                                :50
                            ]
                            + "..."
                        )
                    elif latest_notification.get("journal_image"):
                        last_message = "📝 New journal entry"

                    # Get and format timestamp
                    if latest_notification.get("created_at"):
                        from datetime import datetime

                        try:
                            # Parse the ISO timestamp and format it nicely
                            dt = datetime.fromisoformat(
                                latest_notification["created_at"].replace("Z", "+00:00")
                            )
                            # Format as "2 days ago", "Yesterday", "Today", etc.
                            now = datetime.now(dt.tzinfo)
                            diff = now - dt

                            if diff.days == 0:
                                timestamp = "Today"
                            elif diff.days == 1:
                                timestamp = "Yesterday"
                            elif diff.days < 7:
                                timestamp = f"{diff.days}d ago"
                            else:
                                timestamp = dt.strftime("%m/%d")
                        except:
                            timestamp = "Recent"

                    # Count unread notifications (you might want to add an 'is_read' field to notifications table)
                    unread_count = database.count_unread_notifications(
                        donor_id, str(student_id)
                    )

                # student_data is now a dictionary, not a Pydantic model
                students_data.append(
                    {
                        "id": student_data.get("student_id") or student_data.get("id"),
                        "name": student_data.get("name")
                        or f"Student {student_data.get('student_id', 'Unknown')}",
                        "age": student_data.get("age"),
                        "location": student_data.get("location") or "Unknown",
                        "journal_count": len(student_data.get("journal_list", [])),
                        "report_count": len(student_data.get("report_list", [])),
                        "online": False,  # Default value
                        "unread": unread_count,
                        "lastMessage": last_message,
                        "timestamp": timestamp,
                    }
                )

        print("Final students data:", students_data)
        return students_data

    except Exception as e:
        print(f"Error in get_all_children: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error fetching children: {str(e)}"
        )


@router.get("/get_donor_id_by_supabase_id/{supabase_id}")
async def get_donor_id_by_supabase_id(supabase_id: str):
    try:
        donor_id = database.get_donor_by_supabase_id(supabase_id)
        if not donor_id:
            raise HTTPException(status_code=404, detail="Donor not found")
        return donor_id
    except Exception as e:
        print(f"Error in get_donor_id_by_supabase_id: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching donor: {str(e)}")


@router.post("/mark_notifications_read/{donor_id}/{student_id}")
async def mark_notifications_read(donor_id: str, student_id: str):
    try:
        result = database.mark_notifications_as_read(donor_id, student_id)
        return {"success": True, "message": "Notifications marked as read"}
    except Exception as e:
        print(f"Error marking notifications as read: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error marking notifications as read: {str(e)}"
        )

@router.get("/unread_count/{donor_id}/{student_id}")
async def get_unread_count(donor_id: str, student_id: str):
    try:
        count = database.count_unread_notifications(donor_id, student_id)
        return {"unread_count": count}
    except Exception as e:
        print(f"Error getting unread count: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error marking notifications as read: {str(e)}"
        )
