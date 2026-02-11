import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { getAuth } from 'firebase/auth';
import AnswerOptions from './AnswerOptions';

const MultipleChoiceCard = ({ card, onAnswer, onNext }) => {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showResult, setShowResult] = useState(false);

    // Shuffle helper
    const shuffleArray = (array) => {
        let currentIndex = array.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    };

    useEffect(() => {
        // Reset state when card changes
        setOptions([]);
        setLoading(true);
        setSelectedOption(null);
        setShowResult(false);

        fetchDistractors();
    }, [card]);

    const fetchDistractors = async () => {
        if (!card) return;

        try {
            const auth = getAuth();
            const user = auth.currentUser;
            const token = await user.getIdToken();

            const response = await fetch(`http://localhost:8000/api/flashcards/${card.id}/distractors`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Failed to fetch distractors');

            const data = await response.json();
            const distractors = data.distractors || [];

            // Combine correct answer + distractors and shuffle
            const allOptions = [card.answer, ...distractors];
            const shuffled = shuffleArray(allOptions);

            setOptions(shuffled);
        } catch (error) {
            console.error(error);
            // Fallback: just show correct answer + generic options if API fails
            setOptions([card.answer, "Option A", "Option B", "Option C"].sort(() => Math.random() - 0.5));
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (option) => {
        setSelectedOption(option);
        setShowResult(true);

        // Wait a bit then move to next or let parent handle it
        setTimeout(() => {
            const isCorrect = option === card.answer;
            // Map correctness to SM-2 rating (0-5)
            // Correct = 5 (perfect)
            // Incorrect = 2 (standard simple fail)
            const rating = isCorrect ? 5 : 2;
            onAnswer(rating);
        }, 1500);
    };

    if (loading) {
        return (
            <div className="w-full max-w-lg bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 flex flex-col items-center justify-center min-h-[300px]">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-400 mb-4" />
                <p className="text-gray-400">Generating options...</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-lg bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-xl animate-fadeIn">
            <h3 className="text-xl font-semibold text-white mb-6 leading-relaxed">
                {card.question}
            </h3>

            <AnswerOptions
                options={options}
                selectedOption={selectedOption}
                correctAnswer={card.answer}
                onSelect={handleSelect}
                showResult={showResult}
            />
        </div>
    );
};

export default MultipleChoiceCard;
