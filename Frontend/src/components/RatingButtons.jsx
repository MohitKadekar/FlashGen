import React from 'react';

const RatingButtons = ({ onRate, disabled }) => {
    const ratings = [
        { value: 0, label: 'Forgot', color: 'bg-red-500 hover:bg-red-600', ring: 'ring-red-500' },
        { value: 2, label: 'Hard', color: 'bg-orange-500 hover:bg-orange-600', ring: 'ring-orange-500' },
        { value: 4, label: 'Good', color: 'bg-blue-500 hover:bg-blue-600', ring: 'ring-blue-500' },
        { value: 5, label: 'Easy', color: 'bg-green-500 hover:bg-green-600', ring: 'ring-green-500' },
    ];

    return (
        <div className="flex flex-wrap justify-center gap-4 mt-8">
            {ratings.map((rating) => (
                <button
                    key={rating.value}
                    onClick={() => onRate(rating.value)}
                    disabled={disabled}
                    className={`
                        px-6 py-3 rounded-xl text-white font-medium shadow-lg
                        transform transition-all duration-200 active:scale-95
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${rating.color}
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 ${rating.ring}
                    `}
                >
                    <div className="flex flex-col items-center">
                        <span className="text-sm uppercase tracking-wide opacity-75">{rating.label}</span>
                    </div>
                </button>
            ))}
        </div>
    );
};

export default RatingButtons;
