import React from 'react';
import { Clock, Calendar, FileText, CheckCircle, BrainCircuit } from 'lucide-react';

const FlashcardDetail = ({ flashcard, onEdit }) => {
    return (
        <div className="animate-fadeSlideUp">
            {/* Header / Meta */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold uppercase tracking-wider ${flashcard.difficulty === 'easy' ? 'bg-green-900/30 text-green-400 border border-green-800' :
                            flashcard.difficulty === 'hard' ? 'bg-red-900/30 text-red-400 border border-red-800' :
                                'bg-yellow-900/30 text-yellow-400 border border-yellow-800'
                        }`}>
                        {flashcard.difficulty}
                    </span>
                    <span className="text-gray-500 text-sm">Created {new Date(flashcard.created_at).toLocaleDateString()}</span>
                </div>

                <button
                    onClick={onEdit}
                    className="px-5 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium border border-gray-700 hover:border-gray-600 transition-all shadow-sm"
                >
                    Edit Flashcard
                </button>
            </div>

            {/* Q&A Cards */}
            <div className="grid grid-cols-1 gap-8 mb-10">
                {/* Question */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 shadow-xl relative overflow-hidden group hover:border-indigo-500/30 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <BrainCircuit size={100} />
                    </div>
                    <h3 className="text-indigo-400 uppercase tracking-widest font-bold text-sm mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Question
                    </h3>
                    <p className="text-2xl md:text-3xl font-medium text-white leading-relaxed">
                        {flashcard.question}
                    </p>
                </div>

                {/* Answer */}
                <div className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800 relative group hover:border-gray-700 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <CheckCircle size={80} />
                    </div>
                    <h3 className="text-gray-500 uppercase tracking-widest font-bold text-sm mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-gray-600"></span> Answer
                    </h3>
                    <p className="text-xl text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {flashcard.answer}
                    </p>
                </div>
            </div>

            {/* Additional Context - if linked to a note */}
            {flashcard.note_id && (
                <div className="mt-8 pt-8 border-t border-gray-800">
                    <h4 className="text-gray-400 font-medium mb-4 flex items-center gap-2">
                        <FileText size={16} /> Linked Note
                    </h4>
                    <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-800 text-gray-400 text-sm">
                        Flashcard ID: {flashcard.id} • Note ID: {flashcard.note_id}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FlashcardDetail;
