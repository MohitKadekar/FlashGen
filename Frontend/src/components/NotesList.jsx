import React from 'react';
import { FileText, Calendar, ArrowRight } from 'lucide-react';

const NotesList = () => {
    // Placeholder data
    const notes = [
        { id: 1, title: 'Introduction to React Hooks', date: '2023-10-15', preview: 'Hooks are a new addition in React 16.8. They let you use state and other React features without writing a class.' },
        { id: 2, title: 'JavaScript ES6 Features', date: '2023-10-12', preview: 'ECMAScript 2015 is also known as ES6 and ECMAScript 6. Some important features are: The let keyword, The const keyword, Arrow Functions...' },
        { id: 3, title: 'CSS Grid vs Flexbox', date: '2023-10-10', preview: 'Grid is for two-dimensional layout - rows and columns at the same time. Flexbox is for one-dimensional layout.' },
    ];

    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm h-full">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-400" />
                    Recent Notes
                </h2>
                <button className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">View All</button>
            </div>

            <div className="space-y-4">
                {notes.map((note) => (
                    <div key={note.id} className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5 cursor-pointer group">
                        <h3 className="text-white font-medium group-hover:text-indigo-400 transition-colors">{note.title}</h3>
                        <p className="text-gray-400 text-sm mt-1 line-clamp-2">{note.preview}</p>
                        <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            <span>{note.date}</span>
                        </div>
                    </div>
                ))}
            </div>

            <button className="w-full mt-6 py-2 flex items-center justify-center gap-2 text-sm font-medium text-white bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-600/50 rounded-lg transition-all">
                Upload New Note
                <ArrowRight className="w-4 h-4" />
            </button>
        </div>
    );
};

export default NotesList;
