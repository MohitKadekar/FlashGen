import React, { useState, useRef, useEffect } from 'react';
import { Send, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

const AnswerInput = ({ onSubmit, disabled, autoFocus }) => {
    const [answer, setAnswer] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        if (autoFocus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [autoFocus]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (answer.trim()) {
            onSubmit(answer);
            setAnswer('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative w-full mt-8">
            <input
                ref={inputRef}
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={disabled}
                placeholder="Type your answer here..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 pr-14 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-lg"
            />
            <button
                type="submit"
                disabled={!answer.trim() || disabled}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
                <Send className="w-5 h-5" />
            </button>
        </form>
    );
};

export default AnswerInput;
