from supabase import create_client
from app.config import SUPABASE_URL, SUPABASE_KEY

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def get_supabase_client():
    return supabase

def test_connection():
    try:
        # Fetch the first row in the donor table
        response = supabase.table("donors").select("*").limit(1).execute()
        return response.data
    except Exception as e:
        return {"error": str(e)}
