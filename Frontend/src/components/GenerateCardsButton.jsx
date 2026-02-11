import React, { useState } from 'react';
import { getAuth } from "firebase/auth";

const GenerateCardsButton = ({ noteId, onCardsGenerated, onError }) => {
    const [loading, setLoading] = useState(false);
    const [count, setCount] = useState(5);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) {
                throw new Error("User not authenticated");
            }
            const token = await user.getIdToken();

            const response = await fetch(`http://localhost:8000/api/notes/${noteId}/generate-cards?count=${count}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to generate cards');
            }

            const data = await response.json();
            if (onCardsGenerated) {
                onCardsGenerated(data.flashcards);
            }
        } catch (err) {
            console.error(err);
            if (onError) onError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center space-x-2 mt-4">
            <div className="relative">
                <input
                    type="number"
                    min="1"
                    max="20"
                    value={count}
                    onChange={(e) => setCount(Number(e.target.value))}
                    className="w-16 px-2 py-1 bg-gray-700 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    title="Number of cards"
                />
            </div>
            <button
                onClick={handleGenerate}
                disabled={loading}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 
          ${loading
                        ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg hover:shadow-blue-500/30'
                    }`}
            >
                {loading ? (
                    <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                    </span>
                ) : (
                    'Generate Flashcards'
                )}
            </button>
        </div>
    );
};

export default GenerateCardsButton;
