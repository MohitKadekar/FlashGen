import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import firebase_admin
from database import init_db
from routers import notes
import google.generativeai as genai

# Load environment variables
load_dotenv()

# Initialize Google Generative AI (Global Config)
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    print("Warning: GOOGLE_API_KEY not found in environment variables.")
else:
    genai.configure(api_key=api_key)

# Initialize Firebase Admin
try:
    if not firebase_admin._apps:
        project_id = os.getenv("FIREBASE_PROJECT_ID")
        
        # Use a dummy credential to bypass ADC requirement for local dev
        # This allows verify_id_token to work (fetching public keys) without a service account
        import google.auth.credentials
        class NoOpCredentials(google.auth.credentials.Credentials):
            def refresh(self, request):
                pass
                
        cred = NoOpCredentials()
        
        if project_id:
             firebase_admin.initialize_app(credential=cred, options={'projectId': project_id})
        else:
             firebase_admin.initialize_app(credential=cred)
    print("Firebase Admin initialized successfully (verify-only mode)")
except Exception as e:
    print(f"Warning: Firebase Admin initialization failed: {e}")

app = FastAPI(title="Backend API", version="0.1.0")

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup Event
@app.on_event("startup")
def startup_event():
    init_db()

# Include Routers
app.include_router(notes.router, prefix="/api/notes", tags=["Notes"])
from routers import flashcards
app.include_router(flashcards.router, prefix="/api/flashcards", tags=["Flashcards"])


# Root Endpoints
@app.get("/")
async def root():
    return {"message": "Hello!"}
