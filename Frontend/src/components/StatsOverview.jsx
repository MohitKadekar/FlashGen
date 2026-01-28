import React from 'react';
import { BookOpen, CheckCircle, Clock } from 'lucide-react';

const StatsOverview = () => {
    const stats = [
        { label: 'Total Cards', value: '124', icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: 'Mastered', value: '86', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
        { label: 'Due Today', value: '12', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
                <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm hover:bg-white/10 transition-colors">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                            <h3 className="text-3xl font-bold text-white mt-1">{stat.value}</h3>
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
