# app/services/ocr_service.py
from PIL import Image
import requests
from io import BytesIO
from google import genai

client = genai.Client()

def extract_text_from_image_url(file_url: str) -> str:
    """
    Extract text from an image using Google Gemini (gemini-2.5-flash model)
    Args:
        file_url: Local path or remote URL to the image
    Returns:
        Extracted text as a string
    Raises:
        ValueError: if the image cannot be processed or Gemini fails
    """
    try:
        # Open image from URL or local file
        if file_url.startswith("http"):
            response = requests.get(file_url)
            response.raise_for_status()
            image = Image.open(BytesIO(response.content))
        else:
            image = Image.open(file_url)

        prompt = """
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

        if not gemini_response or not getattr(gemini_response, "text", None):
            raise ValueError("No text extracted from the image.")

        return gemini_response.text

    except requests.RequestException as req_err:
        raise ValueError(f"Failed to fetch image from URL: {req_err}")
    except IOError as img_err:
        raise ValueError(f"Invalid image format or corrupted file: {img_err}")
    except Exception as e:
        raise ValueError(f"Gemini OCR Error: {e}")
