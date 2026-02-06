import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FlashcardFlip from '../components/FlashcardFlip';
import RatingButtons from '../components/RatingButtons';
import StudyProgressBar from '../components/StudyProgressBar';
import FloatingLines from '../components/FloatingLines';
import { Loader2, CheckCircle, ArrowRight } from 'lucide-react';

const StudyFlipPage = () => {
    const [cards, setCards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [finished, setFinished] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDueCards();
    }, []);

    const fetchDueCards = async () => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) return;
            const token = await user.getIdToken();

            const response = await fetch('http://localhost:8000/api/flashcards/due', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Failed to fetch due cards');

            const data = await response.json();
            setCards(data.flashcards || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    const handleRate = async (rating) => {
        if (submitting) return;
        setSubmitting(true);

        try {
            const auth = getAuth();
            const user = auth.currentUser;
            const token = await user.getIdToken();
            const card = cards[currentIndex];

            await fetch(`http://localhost:8000/api/flashcards/${card.id}/review`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ rating })
            });

            // Move to next card
            if (currentIndex < cards.length - 1) {
                setIsFlipped(false);
                setTimeout(() => {
                    setCurrentIndex(prev => prev + 1);
                    setSubmitting(false);
                }, 150); // Small delay to allow card to flip back visually if needed, though we hide it usually
            } else {
                setFinished(true);
            }

        } catch (error) {
            console.error("Failed to submit review:", error);
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    if (finished) {
        return (
            <div className="min-h-screen bg-black text-white relative overflow-hidden flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 text-center">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 backdrop-blur-md max-w-lg w-full animate-fadeIn">
                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-500" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4">Session Complete!</h2>
                        <p className="text-gray-400 mb-8">
                            You've reviewed all your due cards for now. Great job keeping up with your studies!
                        </p>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                            Back to Dashboard
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                {/* Background Animation */}
                <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
                    <FloatingLines linesGradient={['#10b981', '#34d399', '#6ee7b7']} animationSpeed={0.3} />
                </div>
            </div>
        );
    }

    if (cards.length === 0) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 max-w-lg w-full">
                        <h2 className="text-2xl font-bold text-white mb-2">No Cards Due</h2>
                        <p className="text-gray-400 mb-6">You're all caught up! There are no flashcards due for review right now.</p>
                        <button
                            onClick={() => navigate('/flashcards')}
                            className="text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                            Browse all flashcards
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const currentCard = cards[currentIndex];

    return (
        <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30 relative overflow-hidden flex flex-col">
            {/* Background Animation */}
            <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
                <FloatingLines
                    linesGradient={['#4f46e5', '#818cf8', '#c084fc']}
                    animationSpeed={0.2}
                    lineCount={[2, 4, 2]}
                />
            </div>

            <Navbar />

            <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 pt-24 pb-12">
                <div className="w-full max-w-3xl">
                    <StudyProgressBar current={currentIndex + 1} total={cards.length} />

                    <FlashcardFlip
                        card={currentCard}
                        isFlipped={isFlipped}
                        onFlip={handleFlip}
                    />

                    <div className={`transition-all duration-500 ease-out transform ${isFlipped ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'}`}>
                        {isFlipped && (
                            <RatingButtons onRate={handleRate} disabled={submitting} />
                        )}
                    </div>

                    {!isFlipped && (
                        <div className="text-center mt-8 text-gray-500 text-sm animate-pulse">
                            Tap card to show answer
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudyFlipPage;
