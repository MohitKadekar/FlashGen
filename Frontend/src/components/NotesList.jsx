import React, { useEffect, useState } from 'react';
import { FileText, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { auth } from '../firebase';
import { useNavigate, useSearchParams } from 'react-router-dom';
import NoteCard from './NoteCard';
import NoteDetailModal from './NoteDetailModal';

const NotesList = ({ onUploadClick, refreshTrigger, limit, showViewAll = true }) => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedNote, setSelectedNote] = useState(null);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        fetchNotes();
    }, [refreshTrigger]);

    // Check for "open" query param after notes are loaded
    useEffect(() => {
        const noteIdToOpen = searchParams.get('open');
        if (noteIdToOpen && notes.length > 0) {
            const note = notes.find(n => n.id === parseInt(noteIdToOpen));
            if (note) {
                setSelectedNote(note);
            }
        }
    }, [notes, searchParams]);

    const fetchNotes = async () => {
        try {
            setLoading(true);
            if (!auth.currentUser) {
                setLoading(false);
                return;
            }

            const token = await auth.currentUser.getIdToken();
            const response = await fetch('http://localhost:8000/api/notes', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch notes');

            const data = await response.json();
            setNotes(data.notes || []);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Could not load notes');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setSelectedNote(null);
        // Optional: Clear the query param when closing
        if (searchParams.get('open')) {
            setSearchParams(params => {
                params.delete('open');
                return params;
            });
        }
    };

    const displayedNotes = limit ? notes.slice(0, limit) : notes;

    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-6 shrink-0">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-400" />
                    {limit ? "Recent Notes" : "All Notes"}
                </h2>
                {showViewAll && notes.length > 0 && (
                    <button
                        onClick={() => navigate('/notes')}
                        className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                        View All
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar min-h-0">
                {loading ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                        <p>Loading notes...</p>
                    </div>
                ) : error ? (
                    <div className="h-full flex flex-col items-center justify-center text-red-400 gap-2">
                        <AlertCircle className="w-8 h-8" />
                        <p>{error}</p>
                        <button onClick={fetchNotes} className="text-sm underline hover:text-red-300">Try Again</button>
                    </div>
                ) : notes.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-3">
                        <FileText className="w-12 h-12 opacity-20" />
                        <p>No notes yet</p>
                    </div>
                ) : (
                    displayedNotes.map((note) => (
                        <NoteCard
                            key={note.id}
                            note={note}
                            onClick={() => setSelectedNote(note)}
                        />
                    ))
                )}
            </div>

            <button
                onClick={onUploadClick}
                className="w-full mt-6 py-2 flex items-center justify-center gap-2 text-sm font-medium text-white bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-600/50 rounded-lg transition-all shrink-0"
            >
                Upload New Note
                <ArrowRight className="w-4 h-4" />
            </button>

            {selectedNote && (
                <NoteDetailModal
                    note={selectedNote}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default NotesList;
