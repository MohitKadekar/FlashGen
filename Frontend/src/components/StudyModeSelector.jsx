import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, CheckCircle, Type } from 'lucide-react';

const modes = [
    {
        id: 'flip',
        label: 'Flip Cards',
        icon: BookOpen,
        path: '/study/flip',
        description: 'Traditional spaced repetition'
    },
    {
        id: 'multiple-choice',
        label: 'Quiz Mode',
        icon: CheckCircle,
        path: '/study/multiple-choice',
        description: 'Select the correct answer'
    },
    {
        id: 'typing',
        label: 'Type Answer',
        icon: Type,
        path: '/study/typing',
        description: 'Practice recall by typing'
    }
];

const StudyModeSelector = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="flex flex-col sm:flex-row gap-4 mb-8 w-full max-w-4xl mx-auto px-4">
            {modes.map((mode) => {
                const isActive = location.pathname === mode.path;
                const Icon = mode.icon;

                return (
                    <button
                        key={mode.id}
                        onClick={() => navigate(mode.path)}
                        className={`
                            flex-1 p-4 rounded-xl border transition-all duration-300 relative overflow-hidden group
                            ${isActive
                                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20'
                            }
                        `}
                    >
                        <div className="flex items-center gap-3 relative z-10">
                            <div className={`
                                p-2 rounded-lg transition-colors
                                ${isActive ? 'bg-white/20 text-white' : 'bg-white/5 text-gray-400 group-hover:bg-white/10 group-hover:text-gray-300'}
                            `}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <h3 className={`font-semibold ${isActive ? 'text-white' : 'text-gray-200 group-hover:text-white'}`}>
                                    {mode.label}
                                </h3>
                                <p className="text-xs opacity-70 mt-0.5">{mode.description}</p>
                            </div>
                        </div>

                        {isActive && (
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-white/5 to-indigo-500/0 animate-shimmer" />
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default StudyModeSelector;
