import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import Navbar from '../components/Navbar';
import StatsDashboard from '../components/StatsDashboard';
import ProgressCharts from '../components/ProgressCharts';
import FloatingLines from '../components/FloatingLines';
import { Loader2 } from 'lucide-react';

const StatsPage = () => {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30 relative overflow-hidden flex flex-col">
            <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
                <FloatingLines
                    linesGradient={['#6366f1', '#818cf8', '#a5b4fc']}
                    animationSpeed={0.15}
                    lineCount={[2, 3, 2]}
                />
            </div>

            <Navbar />

            <div className="flex-1 flex flex-col items-center justify-start p-6 relative z-10 pt-24 pb-12 w-full">
                <div className="w-full max-w-6xl mx-auto mb-8 animate-fadeIn">
                    <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-2">
                        Learning Statistics
                    </h1>
                    <p className="text-gray-400">Track your progress and mastery over time</p>
                </div>

                <div className="w-full space-y-8">
                    <StatsDashboard />
                    <ProgressCharts />
                </div>
            </div>
        </div>
    );
};

export default StatsPage;
