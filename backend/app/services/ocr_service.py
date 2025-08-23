# app/services/ocr_service.py
from PIL import Image
import requests
from io import BytesIO
from google import genai

client = genai.Client()

def extract_text_from_image_uri(file_uri: str) -> str:
    """
    Extract text from an image using Google Gemini (gemini-2.5-flash model)
    Args:
        file_uri: Local path or remote URL to the image
    Returns:
        Extracted text as a string
    """
    try:
        # Open image from URL or local file
        if file_uri.startswith("http"):
            response = requests.get(file_uri)
            image = Image.open(BytesIO(response.content))
        else:
            image = Image.open(file_uri)

        prompt = f"""
        You are an OCR assistant. Extract **all handwritten text** from the image below.

        - Return the extracted text as a **single paragraph**. 
        - Do **not** include line breaks, summaries, or any omitted content.
        - Do **not** correct spelling, grammar, or any mistakes in the original text.
        - Do **not** add titles, commentary, or explanations.
        - Output only the raw text in **one continuous paragraph**, exactly as it appears in the handwriting.
        """

        # Call Gemini model
        gemini_response = client.models.generate_content(
            model="gemini-2.5-flash-lite",
            contents=[image, prompt]
        )

        return gemini_response.text

    except Exception as e:
        print(f"Gemini OCR Error: {e}")
        return "Error: Unable to extract text from image."
