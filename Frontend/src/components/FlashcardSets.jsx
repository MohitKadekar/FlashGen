import React, { useState, useEffect } from 'react';
import { Layers, Loader2, ArrowRight } from 'lucide-react';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const FlashcardSets = () => {
    const [flashcards, setFlashcards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRecentFlashcards();
    }, []);

    const fetchRecentFlashcards = async () => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) return;
            const token = await user.getIdToken();

            const response = await fetch('http://localhost:8000/api/flashcards/recent?limit=5', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Failed to load recent flashcards');

            const data = await response.json();

            // Map the data and add some UI properties if needed
            const mappedCards = data.flashcards.map((card, index) => ({
                ...card,
                // Assign a consistent color gradient based on index
                color: [
                    'from-blue-500/20 to-indigo-500/20',
                    'from-emerald-500/20 to-teal-500/20',
                    'from-orange-500/20 to-red-500/20',
                    'from-purple-500/20 to-pink-500/20',
                    'from-cyan-500/20 to-blue-500/20'
                ][index % 5],
            }));

            setFlashcards(mappedCards);
        } catch (err) {
            console.error(err);
            setError("Could not load recent flashcards.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm h-full flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
            </div>
        );
    }

    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm h-full overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-purple-400" />
                    Recent Flashcards
                </h2>
                <button
                    onClick={() => navigate('/flashcards')}
                    className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                >
                    View All
                </button>
            </div>

            {flashcards.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <p>No flashcards yet.</p>
                    <p className="text-sm mt-2">Generate flashcards from your notes to get started.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {flashcards.map((card) => (
                        <div
                            key={card.id}
                            onClick={() => navigate(`/flashcards/${card.id}`)}
                            className="relative p-4 rounded-lg bg-gradient-to-br border border-white/5 hover:border-white/20 transition-all cursor-pointer group overflow-hidden"
                        >
                            {/* Background gradient */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-50 group-hover:opacity-100 transition-opacity`} />

                            <div className="relative z-10 flex items-center justify-between gap-4">
                                <div className="min-w-0 flex-1">
                                    <h3
                                        className="text-white font-medium group-hover:text-white transition-colors truncate"
                                        title={card.question}
                                    >
                                        {card.question}
                                    </h3>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className={`text-xs px-2 py-0.5 rounded capitalize bg-black/20 text-gray-300`}>
                                            {card.difficulty}
                                        </span>
                                        {card.note_title && (
                                            <span className="text-xs text-gray-400 truncate max-w-[150px]">
                                                {card.note_title}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-white/50 group-hover:text-white transition-colors flex-shrink-0" />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FlashcardSets;
