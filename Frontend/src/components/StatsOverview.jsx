import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { getAuth } from 'firebase/auth';

const StatsOverview = () => {
    const [stats, setStats] = useState({
        total_cards: 0,
        mastered_count: 0,
        hard_count: 0 // Using this for "Due" or "Review"
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const auth = getAuth();
                const user = auth.currentUser;
                if (!user) return;
                const token = await user.getIdToken();

                const response = await fetch('http://localhost:8000/api/flashcards/stats', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    setStats(data.stats);
                }
            } catch (error) {
                console.error("Failed to fetch stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statItems = [
        { label: 'Total Cards', value: stats.total_cards, icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: 'Mastered', value: stats.mastered_count || 0, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
        { label: 'Hard / Review', value: stats.hard_count || 0, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    ];

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6 h-[100px] flex items-center justify-center animate-pulse">
                        <div className="h-4 w-4 bg-white/10 rounded-full"></div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {statItems.map((stat, index) => (
                <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm hover:bg-white/10 transition-colors">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                            <h3 className="text-3xl font-bold text-white mt-1 animate-fadeIn">{stat.value}</h3>
                        </div>
                        <div className={`p-3 rounded-lg ${stat.bg}`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatsOverview;
