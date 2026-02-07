import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import AnswerInput from './AnswerInput';

const TypingCard = ({ card, onAnswer }) => {
    const [status, setStatus] = useState('input'); // input, correct, incorrect
    const [userAnswer, setUserAnswer] = useState('');

    // Reset when card changes
    useEffect(() => {
        setStatus('input');
        setUserAnswer('');
    }, [card]);

    const handleAnswer = (answer) => {
        setUserAnswer(answer);

        const normalizedUser = answer.trim().toLowerCase();
        const normalizedCorrect = card.answer.trim().toLowerCase();

        const isCorrect = normalizedUser === normalizedCorrect;
        setStatus(isCorrect ? 'correct' : 'incorrect');

        // Wait and proceed
        setTimeout(() => {
            // Rating logic: 5 for correct, 2 for incorrect
            onAnswer(isCorrect ? 5 : 2);
        }, 2000);
    };

    return (
        <div className="w-full max-w-lg bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-xl animate-fadeIn relative overflow-hidden">
            <h3 className="text-xl font-semibold text-white mb-8 leading-relaxed">
                {card.question}
            </h3>

            {status === 'input' ? (
                <AnswerInput onSubmit={handleAnswer} autoFocus={true} />
            ) : (
                <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className={`p-4 rounded-xl border flex items-start gap-4 ${status === 'correct'
                            ? 'bg-green-500/20 border-green-500/50 text-green-300'
                            : 'bg-red-500/20 border-red-500/50 text-red-300'
                        }`}>
                        {status === 'correct' ? <CheckCircle className="w-6 h-6 shrink-0" /> : <XCircle className="w-6 h-6 shrink-0" />}
                        <div>
                            <p className="font-semibold mb-1">
                                {status === 'correct' ? 'Correct!' : 'Incorrect'}
                            </p>
                            <p className="text-sm opacity-90">
                                Your answer: {userAnswer}
                            </p>
                        </div>
                    </div>

                    {status === 'incorrect' && (
                        <div className="p-4 rounded-xl bg-indigo-500/20 border border-indigo-500/50 text-indigo-300">
                            <p className="font-semibold text-xs uppercase tracking-wider mb-1 opacity-70">Correct Answer</p>
                            <p className="font-medium">{card.answer}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TypingCard;
