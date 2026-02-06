import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NotesPage from './pages/NotesPage';
import ProtectedRoute from './components/ProtectedRoute';
import FlashcardsPage from './pages/FlashcardsPage';
import FlashcardDetailPage from './pages/FlashcardDetailPage';
import StudyFlipPage from './pages/StudyFlipPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notes"
        element={
          <ProtectedRoute>
            <NotesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/flashcards"
        element={
          <ProtectedRoute>
            <FlashcardsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/flashcards/:id"
        element={
          <ProtectedRoute>
            <FlashcardDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/study/flip"
        element={
          <ProtectedRoute>
            <StudyFlipPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
