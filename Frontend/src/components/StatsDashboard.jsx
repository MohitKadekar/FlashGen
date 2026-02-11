import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { Activity, Book, Brain, Trophy, Loader2 } from 'lucide-react';

const StatsCard = ({ title, value, icon: Icon, color, subtext }) => (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/10 transition-colors animate-fadeIn shadow-lg">
        <div className="flex items-start justify-between mb-4">
            <div>
                <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">{title}</p>
                <h3 className="text-3xl font-bold text-white mt-1">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${color}`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
        </div>
        {subtext && <p className="text-xs text-gray-500">{subtext}</p>}
    </div>
);

const StatsDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) return;
            const token = await user.getIdToken();

            const response = await fetch('http://localhost:8000/api/flashcards/stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Failed to fetch stats');

            const data = await response.json();
            setStats(data.stats);
        } catch (error) {
            console.error("Stats fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl mx-auto">
            <StatsCard
                title="Total Cards"
                value={stats.total_cards}
                icon={Book}
                color="bg-blue-500/20"
                subtext="All flashcards in your library"
            />
            <StatsCard
                title="Mastered"
                value={stats.mastered_cards}
                icon={Trophy}
                color="bg-yellow-500/20"
                subtext="Cards with > 21 days interval"
            />
            <StatsCard
                title="Learning"
                value={stats.learning_cards}
                icon={Brain}
                color="bg-purple-500/20"
                subtext="Active cards currently being studied"
            />
            <StatsCard
                title="Ease Factor"
                value={stats.avg_ease ? stats.avg_ease.toFixed(2) : '2.50'}
                icon={Activity}
                color="bg-green-500/20"
                subtext="Average difficulty rating (Higher is easier)"
            />
        </div>
    );
};

export default StatsDashboard;
