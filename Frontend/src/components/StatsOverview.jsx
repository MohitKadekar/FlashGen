import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';

const StatsOverview = ({ showDetails = false }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

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
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading || !stats) return null;

    if (!showDetails) {
        // Quick view for Dashboard (smaller, less details)
        return (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm shadow-lg w-full">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-white/5 rounded-xl">
                        <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Total</p>
                        <p className="text-2xl font-bold text-white">{stats.total_cards}</p>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded-xl">
                        <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Mastered</p>
                        <p className="text-2xl font-bold text-yellow-400">{stats.mastered_cards}</p>
                    </div>
                </div>
            </div>
        );
    }

    return null; // Detailed view handled by StatsDashboard
};

export default StatsOverview;
