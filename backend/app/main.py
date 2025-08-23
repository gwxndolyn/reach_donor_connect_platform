from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import pytesseract
from PIL import Image

from app.routes import donor

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(donor.router)

@app.get("/")
def root():
    return {"message": "Backend running"}


@app.post("/ocr/")
async def ocr(file: UploadFile):
    image = Image.open(file.file)
    text = pytesseract.image_to_string(image)
    return {"extracted_text": text}
