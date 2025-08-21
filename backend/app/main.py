from fastapi import FastAPI, UploadFile
import pytesseract
from PIL import Image

app = FastAPI()


@app.get("/")
def root():
    return {"message": "Backend running"}


@app.post("/ocr/")
async def ocr(file: UploadFile):
    image = Image.open(file.file)
    text = pytesseract.image_to_string(image)
    return {"extracted_text": text}
