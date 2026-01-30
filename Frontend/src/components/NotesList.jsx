import React, { useEffect, useState } from 'react';
import { FileText, Calendar, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const NotesList = ({ onUploadClick, refreshTrigger, limit, showViewAll = true }) => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotes();
    }, [refreshTrigger]);

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

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
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
                        <div key={note.id} className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5 cursor-pointer group">
                            <h3 className="text-white font-medium group-hover:text-indigo-400 transition-colors truncate">
                                {note.title || 'Untitled Note'}
                            </h3>
                            <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                                {note.content}
                            </p>
                            <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                                <Calendar className="w-3 h-3" />
                                <span>{formatDate(note.created_at)}</span>
                            </div>
                        </div>
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
        </div>
    );
};

export default NotesList;
