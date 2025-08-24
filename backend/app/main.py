from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import pytesseract
from PIL import Image

from app.routes import donor, notes, student

app = FastAPI()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "https://donorconnect-orcin.vercel.app",  # Production frontend
    "http://localhost:3000"                   # Local dev frontend
]

# ✅ Add this middleware block
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # frontend dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(donor.router)
app.include_router(notes.router)
app.include_router(student.router)

@app.get("/")
def root():
    return {"message": "Backend running"}
