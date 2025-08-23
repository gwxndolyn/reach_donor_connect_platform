from pydantic import BaseModel
from typing import List, Dict


class JournalSubmission(BaseModel):
    student_id: str
    journal: str


class LearningReportResponse(BaseModel):
    student_id: str
    updated_report: str
    progress_update: str
    scores: Dict[str, int]
    overall_score: float


class JournalData(BaseModel):
    student_id: str
    journal_list: List[str]
    report_list: List[Dict] = []
    latest_report: Dict = {}
