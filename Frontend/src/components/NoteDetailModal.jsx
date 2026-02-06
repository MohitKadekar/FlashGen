import React, { useState, useEffect } from 'react';
import { X, FileText, Loader2 } from 'lucide-react';
import { getAuth } from "firebase/auth";
import GenerateCardsButton from './GenerateCardsButton';
import FlashcardPreview from './FlashcardPreview';

const NoteDetailModal = ({ note, onClose }) => {
    const [flashcards, setFlashcards] = useState([]);
    const [loadingCards, setLoadingCards] = useState(false);

    useEffect(() => {
        if (note) {
            fetchFlashcards();
        }
    }, [note]);

    const fetchFlashcards = async () => {
        try {
            setLoadingCards(true);
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) return;
            const token = await user.getIdToken();

            const response = await fetch(`http://localhost:8000/api/notes/${note.id}/flashcards`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setFlashcards(data.flashcards || []);
            }
        } catch (error) {
            console.error("Failed to fetch flashcards", error);
        } finally {
            setLoadingCards(false);
        }
    };

    if (!note) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="bg-[#1a1b1e] border border-gray-700 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slideUp">
                {/* Header */}
                <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-gray-900/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/20 rounded-lg">
                            <FileText className="w-5 h-5 text-indigo-400" />
                        </div>
                        <h2 className="text-xl font-bold text-white truncate max-w-md">{note.title || 'Untitled Note'}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-700/50 rounded-lg text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    <div className="prose prose-invert max-w-none mb-8">
                        <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/50 leading-relaxed text-gray-300">
                            {note.content}
                        </div>
                    </div>

                    <div className="border-t border-gray-700 pt-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-white">Flashcards</h3>
                            <GenerateCardsButton
                                noteId={note.id}
                                onCardsGenerated={(newCards) => setFlashcards(newCards)}
                                onError={(msg) => alert(msg)}
                            />
                        </div>

                        {loadingCards ? (
                            <div className="flex justify-center p-10">
                                <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
                            </div>
                        ) : (
                            <FlashcardPreview flashcards={flashcards} />
                        )}

                        {!loadingCards && flashcards.length === 0 && (
                            <div className="text-center py-10 text-gray-500 border border-dashed border-gray-700 rounded-xl">
                                <p>No flashcards generated yet.</p>
                                <p className="text-sm">Click the button above to generate some using AI.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoteDetailModal;
