import React from 'react';

const FlashcardPreview = ({ flashcards }) => {
    if (!flashcards || flashcards.length === 0) return null;

    return (
        <div className="mt-6 space-y-4 animate-fadeIn">
            <h3 className="text-lg font-semibold text-gray-200">Generated Flashcards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {flashcards.map((card, index) => (
                    <div key={index} className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-blue-500/50 transition-all shadow-sm hover:shadow-md">
                        <div className="flex justify-between items-start mb-2">
                            <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${card.difficulty === 'easy' ? 'bg-green-900/30 text-green-400 border border-green-800' :
                                    card.difficulty === 'hard' ? 'bg-red-900/30 text-red-400 border border-red-800' :
                                        'bg-yellow-900/30 text-yellow-400 border border-yellow-800'
                                }`}>
                                {card.difficulty}
                            </span>
                        </div>
                        <div className="space-y-2">
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold">Question</p>
                                <p className="text-gray-200 font-medium">{card.question}</p>
                            </div>
                            <div className="pt-2 border-t border-gray-700 mt-2">
                                <p className="text-xs text-gray-500 uppercase font-semibold">Answer</p>
                                <p className="text-gray-300">{card.answer}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FlashcardPreview;
