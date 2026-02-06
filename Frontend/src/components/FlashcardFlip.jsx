import React from 'react';
import { RotateCw, HelpCircle } from 'lucide-react';

const FlashcardFlip = ({ card, isFlipped, onFlip }) => {
    if (!card) return null;

    return (
        <div
            className="w-full max-w-2xl mx-auto perspective-1000 h-[400px] cursor-pointer group"
            onClick={onFlip}
        >
            <div className={`relative w-full h-full transition-all duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>

                {/* Front (Question) */}
                <div className="absolute inset-0 w-full h-full backface-hidden">
                    <div className="h-full w-full bg-gray-800/80 backdrop-blur-md border border-gray-700/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-xl hover:border-indigo-500/30 transition-colors">
                        <span className="absolute top-6 left-6 text-indigo-400 text-sm font-bold tracking-wider uppercase flex items-center gap-2">
                            <HelpCircle className="w-4 h-4" />
                            Question
                        </span>

                        <div className="prose prose-invert max-w-none">
                            <h3 className="text-xl md:text-2xl font-medium text-white leading-relaxed">
                                {card.question}
                            </h3>
                        </div>

                        <div className="absolute bottom-6 text-gray-500 text-sm flex items-center gap-2 opacity-75 group-hover:opacity-100 transition-opacity">
                            <RotateCw className="w-4 h-4" />
                            Click to reveal answer
                        </div>
                    </div>
                </div>

                {/* Back (Answer) */}
                <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                    <div className="h-full w-full bg-indigo-900/20 backdrop-blur-md border border-indigo-500/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-xl relative overflow-hidden">
                        {/* Background decoration */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500" />

                        <span className="absolute top-6 left-6 text-green-400 text-sm font-bold tracking-wider uppercase">
                            Answer
                        </span>

                        <div className="prose prose-invert max-w-none overflow-y-auto w-full custom-scrollbar max-h-[280px]">
                            <p className="text-lg md:text-xl text-gray-100 leading-relaxed whitespace-pre-wrap">
                                {card.answer}
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default FlashcardFlip;
