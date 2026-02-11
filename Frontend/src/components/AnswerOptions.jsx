import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const AnswerOptions = ({ options, selectedOption, onSelect, correctAnswer, showResult }) => {
    return (
        <div className="grid grid-cols-1 gap-3 w-full mt-6">
            {options.map((option, index) => {
                const isSelected = selectedOption === option;
                const isCorrect = option === correctAnswer;

                let buttonStyle = "bg-white/5 border-white/10 hover:bg-white/10 text-gray-200";

                if (showResult) {
                    if (isCorrect) {
                        buttonStyle = "bg-green-500/20 border-green-500/50 text-green-300";
                    } else if (isSelected && !isCorrect) {
                        buttonStyle = "bg-red-500/20 border-red-500/50 text-red-300";
                    } else {
                        buttonStyle = "bg-white/5 border-white/10 opacity-50";
                    }
                } else if (isSelected) {
                    buttonStyle = "bg-indigo-600 border-indigo-500 text-white";
                }

                return (
                    <button
                        key={index}
                        onClick={() => !showResult && onSelect(option)}
                        disabled={showResult}
                        className={`
                            relative flex items-center justify-between p-4 rounded-xl border transition-all duration-200
                            ${buttonStyle}
                        `}
                    >
                        <span className="text-left font-medium">{option}</span>

                        {showResult && isCorrect && (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                        )}

                        {showResult && isSelected && !isCorrect && (
                            <XCircle className="w-5 h-5 text-red-500" />
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default AnswerOptions;
