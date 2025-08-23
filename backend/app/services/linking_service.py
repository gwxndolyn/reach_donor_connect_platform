# app/services/linking_service.py
import os, random
from app.services.supabase_service import DBServiceClass

database = DBServiceClass()

class LinkingServiceClass:

    def ensure_student_donor_link(self, student_id: str) -> str:
        return database.ensure_student_donor_link(student_id)

    def get_linked_donor_id(self, student_id: str):
        return database.get_linked_donor_id(student_id)
