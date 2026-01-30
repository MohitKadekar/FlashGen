import React from 'react';
import { Calendar } from 'lucide-react';

const NoteCard = ({ note, onClick }) => {
    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div
            onClick={onClick}
            className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5 cursor-pointer group"
        >
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
    );
};

export default NoteCard;
