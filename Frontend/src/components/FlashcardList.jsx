import React from 'react';
import { Link } from 'react-router-dom';

const FlashcardList = ({ flashcards, loading, error }) => {
    if (loading) {
        return (
            <div className="flex justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-8 text-red-400 bg-red-900/10 rounded-xl border border-red-900/20">
                {error}
            </div>
        );
    }

    if (!flashcards || flashcards.length === 0) {
        return (
            <div className="text-center p-12 text-gray-500 border border-dashed border-gray-800 rounded-xl bg-gray-900/30">
                <p>No flashcards found.</p>
                <p className="text-sm mt-2">Try adjusting your search query.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
            {flashcards.map((card, index) => (
                <Link to={`/flashcards/${card.id}`} key={card.id || index} className="block group">
                    <div className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 h-full">
                        <div className="flex justify-between items-start mb-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${card.difficulty === 'easy' ? 'bg-green-900/20 text-green-400 border border-green-800/30' :
                                card.difficulty === 'hard' ? 'bg-red-900/20 text-red-400 border border-red-800/30' :
                                    'bg-yellow-900/20 text-yellow-400 border border-yellow-800/30'
                                }`}>
                                {card.difficulty}
                            </span>
                            {card.note_title && (
                                <span className="text-xs text-gray-500 bg-gray-900/50 px-2 py-1 rounded max-w-[120px] truncate" title={card.note_title}>
                                    {card.note_title}
                                </span>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-indigo-400 uppercase font-bold tracking-wider mb-1 opacity-75 group-hover:opacity-100 transition-opacity">Question</p>
                                <p className="text-gray-100 font-medium leading-relaxed line-clamp-3">{card.question}</p>
                            </div>

                            <div className="pt-4 border-t border-gray-700/50">
                                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Answer</p>
                                <p className="text-gray-300 leading-relaxed text-sm line-clamp-3">{card.answer}</p>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default FlashcardList;
