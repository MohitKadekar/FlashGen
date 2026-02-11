# Testing and Verification Documentation

This document outlines the testing procedures, application flow, and verification of the Flashcard Generator application.

## 1. Pages and Routes

| Page Name | Route | Protected | Data Displayed | Components Used |
|-----------|-------|-----------|----------------|-----------------|
| Landing | `/` | No | Static marketing content | Navbar, Hero, Features, Footer |
| Signup | `/signup` | No | Signup form | SignupForm |
| Login | `/login` | No | Login form | LoginForm |
| Dashboard | `/dashboard` | Yes | Quick stats, Recent Activity, Navigation | Navbar, StatsOverview, NotesList, FlashcardSets, Footer |
| Notes | `/notes` | Yes | List of uploaded notes | Navbar, UploadNoteForm, NotesList, NoteCard, Footer |
| Flashcards (Search) | `/flashcards` | Yes | Search bar, List of all flashcards, Export button | Navbar, SearchBar, FlashcardList, ExportButton, Footer |
| Flashcard Detail | `/flashcards/:id` | Yes | Single flashcard edit/view | Navbar, FlashcardDetail, EditForm, Footer |
| Study Flip | `/study/flip` | Yes | Flashcards in flip mode | Navbar, FlashcardFlip, RatingButtons, StudyProgressBar, Footer |
| Study Multiple Choice | `/study/multiple-choice` | Yes | Multiple choice questions | Navbar, MultipleChoiceCard, AnswerOptions, StudyProgressBar, Footer |
| Study Typing | `/study/typing` | Yes | Typing answer input | Navbar, TypingCard, AnswerInput, StudyProgressBar, Footer |
| Stats | `/stats` | Yes | Detailed progress statistics | Navbar, StatsDashboard, ProgressCharts, Footer |

## 2. API Endpoints

| Method | Endpoint | Protected | Purpose | LLM Integration |
|--------|----------|-----------|---------|-----------------|
| POST | `/api/notes` | Yes | Upload text note | No |
| GET | `/api/notes` | Yes | Get all user notes | No |
| DELETE | `/api/notes/{id}` | Yes | Delete a note and its cards | No |
| POST | `/api/notes/{id}/generate-cards` | Yes | Generate flashcards from note | **Yes (Gemini)** |
| GET | `/api/notes/{id}/flashcards` | Yes | Get cards for a specific note | No |
| GET | `/api/flashcards/search` | Yes | Global search for flashcards | No |
| GET | `/api/flashcards/user/sets` | Yes | Get flashcard sets (by note) | No |
| GET | `/api/flashcards/recent` | Yes | Get recently created cards | No |
| GET | `/api/flashcards/stats` | Yes | Get user learning statistics | No |
| GET | `/api/flashcards/due` | Yes | Get cards due for review (SM-2) | No |
| POST | `/api/flashcards/{id}/review` | Yes | Submit review rating (SM-2 update) | No |
| GET | `/api/flashcards/{id}` | Yes | Get single flashcard details | No |
| PUT | `/api/flashcards/{id}` | Yes | Update flashcard content | No |
| DELETE | `/api/flashcards/{id}` | Yes | Delete a single flashcard | No |
| GET | `/api/flashcards/{id}/distractors` | Yes | Get distractors for MC mode | No (Uses DB fallback) |
| GET | `/api/flashcards/data/export` | Yes | Export all cards to CSV | No |

## 3. User Interaction Flow

| User Action | What Happens | API Called | Result |
|-------------|--------------|------------|--------|
| **Sign Up** | User enters email/password | Firebase Auth | Account created, redirects to Login/Dashboard |
| **Login** | User enters credentials | Firebase Auth | Authenticated, redirects to Dashboard |
| **Upload Note** | User inputs text/title | `POST /api/notes` | Note saved, appears in list |
| **Generate Cards** | User clicks "Generate" | `POST /api/notes/:id/generate-cards` | AI generates cards, saved to DB |
| **Study (Flip)** | User selects "Flip Mode" | `GET /api/flashcards/due` | Due cards loaded, study session starts |
| **Review Card** | User rates card (1-5) | `POST /api/flashcards/:id/review` | Interval updated (SM-2), next card shown |
| **Search** | User types query | `GET /api/flashcards/search` | Matching cards displayed |
| **Export** | User clicks "Export CSV" | `GET /api/flashcards/data/export` | CSV file downloaded |
| **View Stats** | User navigates to Stats | `GET /api/flashcards/stats` | Visual charts and metrics displayed |

## 4. Protected Routes Verification

The following routes have been implemented with the `<ProtectedRoute>` wrapper, ensuring unauthenticated users are redirected to `/login`:

- `/dashboard`
- `/notes`
- `/flashcards` (and sub-routes)
- `/study` (and sub-routes)
- `/stats`
- `/profile` (if implemented)

## 5. Error Scenarios Tested

| Scenario | Expected Behavior | Status |
|----------|-------------------|--------|
| **Login Invalid Credentials** | Show error alert/message | ✅ Verified |
| **Unauthenticated API Access** | Return 401 Unauthorized | ✅ Verified |
| **Upload Empty Note** | Return 400 Bad Request | ✅ Verified |
| **Generate from Empty Note** | Return error or empty list | ✅ Verified |
| **Export Unknown Format** | Return 400 Bad Request | ✅ Verified |
| **Backend Offline** | Frontend shows fetch error | ✅ Verified |

## 6. Responsive Design

The application utilizes Tailwind CSS for responsive layouts:
- **Navbar:** Collapses/adjusts for mobile screens.
- **Grids:** `grid-cols-1` on mobile, expanding to `md:grid-cols-2` or `lg:grid-cols-3` on larger screens.
- **Cards:** Fluid width with `max-w` constraints for readability.

## 7. Conclusion

The application flow has been verified to logically connect from authentication to core feature usage (Notes -> Flashcards -> Study -> Stats). The separate study modes (Flip, Multiple Choice, Typing) function independently but share the same underlying spaced repetition data.
