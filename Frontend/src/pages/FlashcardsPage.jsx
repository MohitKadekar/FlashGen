import React, { useState, useCallback } from 'react';
import { getAuth } from "firebase/auth";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingLines from '../components/FloatingLines';
import SearchBar from '../components/SearchBar';
import FlashcardList from '../components/FlashcardList';
import ExportButton from '../components/ExportButton';

const FlashcardsPage = () => {
    const [flashcards, setFlashcards] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = useCallback(async (query) => {
        // If query is empty, allow it to pass through to fetch all cards

        setLoading(true);
        setError(null);

        try {
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) return;
            const token = await user.getIdToken();

            const response = await fetch(`http://localhost:8000/api/flashcards/search?q=${encodeURIComponent(query)}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch flashcards');
            }

            const data = await response.json();
            setFlashcards(data.flashcards || []);
        } catch (err) {
            console.error(err);
            setError("Failed to load flashcards. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30 relative overflow-hidden">
            {/* Background Animation */}
            <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
                <FloatingLines
                    linesGradient={['#4f46e5', '#818cf8', '#c084fc']}
                    animationSpeed={0.5}
                    lineCount={[3, 5, 3]}
                    lineDistance={[0.02, 0.015, 0.03]}
                />
            </div>

            <Navbar />

            <div className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-indigo-300 mb-4">
                        Search Flashcards
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Find any concept from your notes instantly. Search by question or answer.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                    <SearchBar onSearch={handleSearch} />
                    <ExportButton />
                </div>

                <FlashcardList
                    flashcards={flashcards}
                    loading={loading}
                    error={error}
                />
            </div>

            <Footer />
        </div>
    );
};

export default FlashcardsPage;
