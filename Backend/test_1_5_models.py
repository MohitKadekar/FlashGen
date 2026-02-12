
import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

models_to_test = [
    "models/gemini-1.5-flash",
    "models/gemini-1.5-flash-001",
    "models/gemini-1.5-flash-002",
    "models/gemini-1.5-flash-8b",
    "models/gemini-flash-lite-latest"
]

with open("test_results.txt", "w") as f:
    for model_name in models_to_test:
        f.write(f"Testing {model_name}...")
        try:
            model = genai.GenerativeModel(model_name)
            response = model.generate_content("Hello")
            f.write(" SUCCESS\n")
        except Exception as e:
            f.write(f" FAILED: {e}\n")
