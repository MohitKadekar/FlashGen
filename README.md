# Flashcard Generator from Notes

A web application that helps students convert their study notes or textbook content into flashcards automatically using AI. The system generates question-answer pairs from uploaded notes or pasted text, implements spaced repetition scheduling (SM-2 algorithm) to optimize learning, and provides multiple study modes to help users master their material efficiently.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Issue Flow](#issue-flow)
- [API Endpoints](#api-endpoints)
- [Frontend Pages and Routes](#frontend-pages-and-routes)
- [Database Schema](#database-schema)
- [Architecture Overview](#architecture-overview)
- [Getting Started](#getting-started)

---

## Project Overview

### Core Features

- **AI-Powered Generation**: Automatically creates flashcards from any text content using LangChain and Google Gemini LLM
- **Spaced Repetition**: Scientifically-proven SM-2 algorithm schedules reviews at optimal intervals for long-term retention
- **Multiple Study Modes**: Different ways to study (flashcard flip, multiple choice, typing) to suit different learning styles
- **Progress Tracking**: Visual analytics showing learning progress, retention rates, and areas needing more practice
- **Export Capability**: Export flashcards to Anki format for use in other study tools

### Target Users

- Students preparing for exams
- Language learners building vocabulary
- Professionals studying for certifications
- Anyone who wants to memorize information effectively

---

## Technology Stack

### Frontend
- React 19
- Vite (build tool)
- Tailwind CSS (styling)
- React Router DOM (routing)
- Firebase Authentication (auth)

### Backend
- Python 3.12+
- FastAPI (REST API)
- Uvicorn (ASGI server)
- Pydantic (data validation)

### Database
- SQLite (for flashcards, notes, progress tracking, scheduling data)

### AI/ML
- LangChain (basic chains)
- Google Gemini LLM (for flashcard generation and distractor creation)

### Development Tools
- UV (Python package manager)
- npm (Node package manager)
- Git (version control)

---

## Project Structure

```
flashcard-generator-from-notes/
├── Backend/                    # FastAPI backend application
│   ├── main.py                 # Main backend server file
│   ├── pyproject.toml          # Python project configuration
│   ├── requirements.txt        # Python dependencies
│   ├── uv.lock                 # UV lock file
│   └── .env                    # Environment variables
│
├── Frontend/                   # React frontend application
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── App.jsx            # Main app component
│   │   └── main.jsx           # React entry point
│   ├── package.json           # Node.js dependencies
│   └── ...
│
├── issues/                     # Project issues (19 issues)
│   ├── issue-01-project-setup.md
│   ├── issue-02-landing-page-ui.md
│   └── ...
│
├── project_details.md         # Detailed project planning document
└── PROJECT-README.md          # This file
```

---

## Issue Flow

The project is broken down into 19 issues, progressing from foundation to advanced features:

### Foundation (Issues 1-8)
1. **Project Setup** - Initial project structure and dependencies
2. **Landing Page UI** - Static landing page with hero, features, footer
3. **Signup Page UI** - Static signup form
4. **Login Page UI** - Static login form
5. **Firebase Auth Setup** - Firebase project configuration
6. **Integrate Signup with Firebase** - Connect signup form to Firebase
7. **Integrate Login with Firebase** - Connect login form to Firebase
8. **Dashboard UI** - Protected dashboard page with stats and lists

### Core Features (Issues 9-14)
9. **Upload Notes Feature** - File upload and text paste functionality
10. **Display Notes** - List user's notes
11. **Generate Flashcards** - AI-powered flashcard generation from notes
12. **Browse Flashcards via Search** - Global search functionality
13. **Flashcard Detail View** - View and edit individual flashcards
14. **Study Mode - Flip** - Flip card study mode with rating

### Advanced Features (Issues 15-18)
15. **Spaced Repetition Algorithm** - SM-2 algorithm implementation
16. **Multiple Study Modes** - Multiple choice and typing modes
17. **Progress Tracking** - Statistics and progress visualization
18. **Search and Export** - Complete search and Anki export

### Final (Issue 19)
19. **Final Testing** - Complete application flow verification
    - [Testing Documentation](./PROJECT-README.md)

---

## API Endpoints

### Notes Endpoints

| Method | Endpoint | Protected | Purpose | LLM Integration |
|--------|----------|-----------|---------|-----------------|
| POST | `/api/notes` | Yes | Upload notes or paste text | Yes (optional analysis) |
| GET | `/api/notes` | Yes | Get all user's notes | No |
| GET | `/api/notes/:id` | Yes | Get single note | No |
| DELETE | `/api/notes/:id` | Yes | Delete note | No |
| POST | `/api/notes/:id/generate-cards` | Yes | Generate flashcards from note | Yes (flashcard generation) |
| GET | `/api/notes/:id/flashcards` | Yes | Get flashcards for specific note | No |

### Flashcards Endpoints

| Method | Endpoint | Protected | Purpose | LLM Integration |
|--------|----------|-----------|---------|-----------------|
| GET | `/api/flashcards/due` | Yes | Get cards due for review (global) | No |
| GET | `/api/flashcards/:id` | Yes | Get single flashcard | No |
| PUT | `/api/flashcards/:id` | Yes | Update flashcard | No |
| DELETE | `/api/flashcards/:id` | Yes | Delete flashcard | No |
| POST | `/api/flashcards/:id/review` | Yes | Submit card review result | Yes (optional distractor generation) |
| GET | `/api/flashcards/stats` | Yes | Get progress statistics (global) | No |
| GET | `/api/flashcards/search` | Yes | Search flashcards globally | No |
| GET | `/api/flashcards/export` | Yes | Export flashcards to Anki (global) | No |

**Note:** All endpoints require Firebase authentication token in request headers. Authentication is handled entirely by Firebase SDK on the frontend.

---

## Frontend Pages and Routes

| Page Name | Route | Protected | Purpose | Main Components |
|-----------|-------|-----------|---------|----------------|
| Landing | `/` | No | Welcome page | Navbar, Hero, Features, Footer |
| Signup | `/signup` | No | User registration | SignupForm |
| Login | `/login` | No | User authentication | LoginForm |
| Dashboard | `/dashboard` | Yes | Main user interface | Navbar, NotesList, FlashcardSets, StatsOverview |
| Notes | `/notes` | Yes | Manage uploaded notes | Navbar, NotesList, UploadNoteForm, NoteCard |
| Note Detail | `/notes/:id` | Yes | View note and flashcards | Navbar, NoteDetail, GenerateCardsButton, FlashcardPreview |
| Study | `/study` | Yes | Study mode selector | Navbar, StudyModeSelector |
| Study Mode - Flip | `/study/flip` | Yes | Flashcard flip mode | Navbar, FlashcardFlip, RatingButtons, ProgressBar |
| Study Mode - Multiple Choice | `/study/multiple-choice` | Yes | Multiple choice mode | Navbar, MultipleChoiceCard, AnswerOptions |
| Study Mode - Typing | `/study/typing` | Yes | Typing mode | Navbar, TypingCard, AnswerInput |
| Flashcards | `/flashcards` | Yes | Search and browse flashcards | Navbar, FlashcardList, SearchBar, ExportButton |
| Flashcard Detail | `/flashcards/:id` | Yes | View/edit flashcard | Navbar, FlashcardDetail, EditForm |
| Stats | `/stats` | Yes | View progress statistics | Navbar, StatsDashboard, ProgressCharts |
| Profile | `/profile` | Yes | User profile settings | Navbar, ProfileForm, SettingsPanel |

---

## Database Schema

### Tables

**notes**
- Stores uploaded notes and pasted text
- Essential fields: identifier, user reference, title, content, timestamps
- Students design exact field names and structure

**flashcards**
- Stores generated flashcards
- Essential fields: identifier, user reference, note reference, question, answer, difficulty, ease_factor, interval, repetition_count, next_review_date, timestamps
- SM-2 algorithm fields: ease_factor, interval, repetition_count, next_review_date

**study_sessions** (optional)
- Tracks study sessions
- Essential fields: identifier, user reference, start time, end time, cards studied count
- Students decide whether to implement this table

### Design Principles

- Keep it simple - only essential tables
- Students design field names and types
- Focus on functionality, not optimization
- Use SQLite for local development
- No authentication data in SQLite (use Firebase)
- SM-2 algorithm requires: ease_factor, interval, repetition_count, next_review_date

---

## Architecture Overview

### Data Flow

```
User Action → Frontend Component → API Call → Backend Endpoint → Database/LLM → Response → UI Update
```

### Example Flows

**Generate Flashcards:**
```
Click Generate → GenerateCardsButton → POST /api/notes/:id/generate-cards → FastAPI → LangChain+LLM → Flashcard Generation → Display Preview
```

**Study Session:**
```
Rate Card → RatingButtons → POST /api/flashcards/:id/review → FastAPI → SM-2 Algorithm → Update Database → Return Next Review Date → Update UI
```

### Authentication Flow

1. User signs up via Firebase SDK (frontend only)
2. User logs in via Firebase SDK (frontend only)
3. Firebase token is included in API request headers
4. Backend validates token to identify user
5. No backend authentication logic needed

---

## Getting Started

### Prerequisites

- Python 3.12+
- UV Package Manager
- Node.js 18+
- npm or yarn
- Google API Key ([Get one here](https://makersuite.google.com/app/apikey))

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd flashcard-generator-from-notes
   ```

2. **Backend Setup**
   ```bash
   cd Backend
   pip install uv
   uv venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   uv add -r requirements.txt
   # Create .env file with GOOGLE_API_KEY
   uvicorn main:app --reload
   ```

3. **Frontend Setup**
   ```bash
   cd Frontend
   npm install
   npm run dev
   ```

4. **Firebase Setup**
   - Create Firebase project
   - Enable Email/Password authentication
   - Register web app
   - Add Firebase config to frontend

### Development Workflow

1. Start with Issue #01 (Project Setup)
2. Follow issues sequentially (1-19)
3. Each issue builds on previous ones
4. Test features as you build
5. Complete final testing in Issue #19

---

## Key Concepts

### Spaced Repetition (SM-2 Algorithm)

The SM-2 algorithm optimizes review scheduling:
- Uses ease factor (EF) to adjust difficulty
- Calculates intervals between reviews
- Increases intervals for cards answered correctly
- Decreases intervals for cards answered incorrectly
- Quality ratings: 0 (complete blackout) to 5 (perfect recall)

### LLM Integration

- LangChain + Google Gemini LLM for flashcard generation
- Generates question-answer pairs from note content
- Creates distractors for multiple choice mode
- Prompt engineering for consistent output

### Hybrid API Structure

- **Note-specific endpoints**: CRUD operations for notes and their flashcards (`GET /api/notes/:id/flashcards`)
- **Global endpoints**: Aggregate operations across all notes (`GET /api/flashcards/search`, `/api/flashcards/due`, `/api/flashcards/stats`, `/api/flashcards/export`)

---

## Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [LangChain Documentation](https://python.langchain.com/docs/get_started/introduction)
- [Google Generative AI Documentation](https://ai.google.dev/docs)
- [SM-2 Algorithm Reference](https://www.supermemo.com/en/archives1990-2015/english/ol/sm2)

---

## License

This is a template project for educational purposes.
