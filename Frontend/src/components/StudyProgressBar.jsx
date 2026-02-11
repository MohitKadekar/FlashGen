import React from 'react';

const StudyProgressBar = ({ current, total }) => {
    const progress = Math.min(100, (current / total) * 100);

    return (
        <div className="w-full max-w-2xl mx-auto mb-8">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Progress</span>
                <span>{current} / {total}</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
};

export default StudyProgressBar;
