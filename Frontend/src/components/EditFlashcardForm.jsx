import React, { useState } from 'react';

const EditFlashcardForm = ({ flashcard, onSave, onCancel, saving }) => {
    const [formData, setFormData] = useState({
        question: flashcard.question,
        answer: flashcard.answer,
        difficulty: flashcard.difficulty
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Question</label>
                <textarea
                    name="question"
                    value={formData.question}
                    onChange={handleChange}
                    rows="3"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Answer</label>
                <textarea
                    name="answer"
                    value={formData.answer}
                    onChange={handleChange}
                    rows="5"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Difficulty</label>
                <div className="flex gap-4">
                    {['easy', 'medium', 'hard'].map((level) => (
                        <label key={level} className={`cursor-pointer border rounded-lg p-3 flex-1 text-center transition-all ${formData.difficulty === level
                                ? 'bg-indigo-600/20 border-indigo-500 text-white'
                                : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                            }`}>
                            <input
                                type="radio"
                                name="difficulty"
                                value={level}
                                checked={formData.difficulty === level}
                                onChange={handleChange}
                                className="sr-only"
                            />
                            <span className="capitalize font-medium">{level}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-700/50">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                    disabled={saving}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-6 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    disabled={saving}
                >
                    {saving ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                        </>
                    ) : 'Save Changes'}
                </button>
            </div>
        </form>
    );
};

export default EditFlashcardForm;
