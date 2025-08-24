import os
import json
from typing import Optional
import google.generativeai as genai
import re


genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


class LLMClass:
    def __init__(self):
        self.score_categories = {
            "Spelling and Punctuation": "Accuracy in basic mechanics.",
            "Sentence Variety": "Uses different sentence types.",
            "Cohesion and Coherence": "Logical flow using connectors.",
            "Paragraphing": "Organized structure (start–end).",
            "Clarity of Expression": "Meaning conveyed clearly.",
            "Content Relevance": "Stays on topic and appropriate.",
            "Detail and Elaboration": "Goes beyond basic responses.",
            "Creativity in Expression": "Interesting or vivid language.",
            "Tone and Formality": "Respectful, donor-appropriate.",
            "Length of Writing": "Increased word/sentence count.",
            "Error Reduction": "Fewer repeated mistakes.",
            "Lexical Sophistication": "Richer vocabulary.",
        }
        self.model = genai.GenerativeModel(
            "gemini-1.5-flash"
        )  # ✅ Use updated model name

    def build_prompt(self, new_entry: str, previous_report: Optional[dict], journal_topic: str) -> str:
        prev = json.dumps(previous_report, indent=2) if previous_report else "None"

        categories = "\n".join(
            [
                f"{i+1}. {key} – {desc}"
                for i, (key, desc) in enumerate(self.score_categories.items())
            ]
        )

        output_format = {
            "scores": {key: "int (1-5)" for key in self.score_categories},
            "overall_score": "float",
            "progress_update": "string",
            "summary": "string",
        }

        return f"""
        You are an educational language assessor.

        You will receive:
        - A new journal entry from a child
        - The previous learning report (or None)
        - A journal topic to guide your evaluation

        Your tasks:
        1. Score the journal in each of the 13 categories (1–5 scale) based on the journal topic provided
        2. Provide the average overall score (1 decimal)
        3. Compare the new journal to the previous report and describe improvements or regressions
        4. Write a donor-friendly summary of this submission

        Scoring Categories:
        {categories}

        New Journal Entry:
        {new_entry}

        Previous Report:
        {prev}

        Journal Topic:
        {journal_topic}

        Output format (must follow this JSON structure):
        {json.dumps(output_format, indent=2)}
        """.strip()

    def get_updated_learning_report(
        self, new_journal: str, previous_report: Optional[dict] = None, journal_topic: str = ""
    ) -> dict:
        prompt = self.build_prompt(new_journal, previous_report, journal_topic)

        try:
            response = self.model.generate_content(prompt)
            raw_text = response.text.strip()

            # Remove markdown-style code block wrapper ```json ... ```
            if raw_text.startswith("```json"):
                raw_text = raw_text.removeprefix("```json").removesuffix("```").strip()
            elif raw_text.startswith("```"):
                raw_text = raw_text.removeprefix("```").removesuffix("```").strip()

            # Optional fallback: extract JSON block
            json_match = re.search(r'\{.*\}', raw_text, re.DOTALL)
            if json_match:
                json_str = json_match.group(0)
            else:
                raise ValueError(f"Could not extract JSON from Gemini response:\n{raw_text}")

            return json.loads(json_str)

        except Exception as e:
            raise ValueError(f"Error parsing Gemini JSON response: {e}")
