from llm_utils import generate_distractors
import os

# Check if API key is loaded
print(f"API Key present: {bool(os.getenv('GOOGLE_API_KEY'))}")

question = "What is the capital of France?"
answer = "Paris"

print("Testing distractor generation...")
try:
    distractors = generate_distractors(question, answer)
    print("Generated Distractors:")
    for d in distractors:
        print(f"- {d}")
except Exception as e:
    print(f"Failed: {e}")
