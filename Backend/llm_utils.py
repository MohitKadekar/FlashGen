import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import CommaSeparatedListOutputParser
from dotenv import load_dotenv

load_dotenv()

# Using models/gemini-1.5-flash for speed and cost effectiveness (Free tier eligible)
llm = ChatGoogleGenerativeAI(model="models/gemini-flash-lite-latest", google_api_key=os.getenv("GOOGLE_API_KEY"))

def generate_distractors(question: str, answer: str):
    """
    Generates 3 plausible distractors (incorrect answers) for a given flashcard question and answer.
    """
    output_parser = CommaSeparatedListOutputParser()
    format_instructions = output_parser.get_format_instructions()

    template = """
    You are an expert educational content creator.
    Given a flashcard question and the correct answer, generate 3 plausible but incorrect answers (distractors) for a multiple-choice question.
    
    Question: {question}
    Correct Answer: {answer}
    
    The distractors should be:
    1. Plausible and related to the topic.
    2. Distinctly incorrect compared to the true answer.
    3. Short and concise, similar in length to the correct answer.
    
    Return ONLY a comma-separated list of the 3 distractors. Do not number them.
    {format_instructions}
    """

    prompt = PromptTemplate(
        template=template,
        input_variables=["question", "answer"],
        partial_variables={"format_instructions": format_instructions}
    )

    chain = prompt | llm | output_parser

    try:
        distractors = chain.invoke({"question": question, "answer": answer})
        # Ensure we have exactly 3, if not, fill or slice
        if len(distractors) > 3:
            distractors = distractors[:3]
        while len(distractors) < 3:
            distractors.append("None of the above") # Fallback
        return distractors
    except Exception as e:
        print(f"Error generating distractors: {e}")
        # Fallback distractors
        return ["Incorrect Option A", "Incorrect Option B", "Incorrect Option C"]
