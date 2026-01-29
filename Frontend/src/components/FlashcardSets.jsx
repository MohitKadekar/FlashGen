import React from 'react';
import { Layers, Play, Clock, MoreVertical } from 'lucide-react';

const FlashcardSets = () => {
    // Placeholder data
    const sets = [
        { id: 1, title: 'React Fundamentals', cards: 24, mastered: 12, lastStudied: '2 hours ago', color: 'from-blue-500/20 to-indigo-500/20' },
        { id: 2, title: 'Modern JavaScript', cards: 45, mastered: 30, lastStudied: 'Yesterday', color: 'from-emerald-500/20 to-teal-500/20' },
        { id: 3, title: 'CSS Layouts', cards: 18, mastered: 5, lastStudied: '3 days ago', color: 'from-orange-500/20 to-red-500/20' },
    ];

    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm h-full">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-purple-400" />
                    Flashcard Sets
                </h2>
                <button className="text-sm text-purple-400 hover:text-purple-300 transition-colors">View All</button>
            </div>

            <div className="space-y-4">
                {sets.map((set) => (
                    <div key={set.id} className="relative p-4 rounded-lg bg-gradient-to-br border border-white/5 hover:border-white/20 transition-all cursor-pointer group overflow-hidden">
                        {/* Background gradient */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${set.color} opacity-50 group-hover:opacity-100 transition-opacity`} />

                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <h3 className="text-white font-medium group-hover:text-white transition-colors">{set.title}</h3>
                                <div className="flex items-center gap-3 mt-2">
                                    <span className="text-xs text-gray-300 bg-black/20 px-2 py-1 rounded">{set.cards} Cards</span>
                                    <div className="flex items-center gap-1 text-xs text-gray-300">
                                        <Clock className="w-3 h-3" />
                                        <span>{set.lastStudied}</span>
                                    </div>
                                </div>
                            </div>

                            <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                                <Play className="w-4 h-4 fill-current" />
                            </button>
                        </div>

                        {/* Progress bar */}
                        <div className="relative z-10 mt-4 h-1 bg-black/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-white/50"
                                style={{ width: `${(set.mastered / set.cards) * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FlashcardSets;
