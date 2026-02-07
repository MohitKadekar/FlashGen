import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';

const ProgressCharts = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) return;
            const token = await user.getIdToken();

            try {
                const response = await fetch('http://localhost:8000/api/flashcards/stats', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                setStats(data.stats);
            } catch (error) {
                console.error("Stats error", error);
            }
        };
        fetchStats();
    }, []);

    if (!stats) return null;

    const calculatePercentage = (value) => {
        if (!stats.total_cards) return 0;
        return ((value / stats.total_cards) * 100).toFixed(1);
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm w-full max-w-6xl mx-auto mt-8">
            <h3 className="text-xl font-semibold text-white mb-6">Learning Distribution</h3>

            <div className="space-y-6">
                {/* Mastery Bar */}
                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Mastered (Mature: Interval &gt; 21d)</span>
                        <span className="text-white font-medium">{stats.mastered_cards} cards ({calculatePercentage(stats.mastered_cards)}%)</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-yellow-500 to-orange-500 h-full rounded-full transition-all duration-1000"
                            style={{ width: `${calculatePercentage(stats.mastered_cards)}%` }}
                        />
                    </div>
                </div>

                {/* Learning Bar */}
                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Learning (Active)</span>
                        <span className="text-white font-medium">{stats.learning_cards} cards ({calculatePercentage(stats.learning_cards)}%)</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-1000"
                            style={{ width: `${calculatePercentage(stats.learning_cards)}%` }}
                        />
                    </div>
                </div>

                {/* New Bar */}
                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">New (Not Started)</span>
                        <span className="text-white font-medium">{stats.new_cards} cards ({calculatePercentage(stats.new_cards)}%)</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full transition-all duration-1000"
                            style={{ width: `${calculatePercentage(stats.new_cards)}%` }}
                        />
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                <p>Keep reviewing daily to convert Learning cards into Mastered cards!</p>
            </div>
        </div>
    );
};

export default ProgressCharts;
