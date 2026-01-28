import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StatsOverview from '../components/StatsOverview';
import NotesList from '../components/NotesList';
import FlashcardSets from '../components/FlashcardSets';

const Dashboard = () => {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30">
            <Navbar />

            <div className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white/80 to-indigo-200">
                        Welcome back!
                    </h1>
                    <p className="text-gray-400 mt-2">Here's what's happening with your learning journey.</p>
                </div>

                <StatsOverview />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="h-[500px]">
                        <NotesList />
                    </div>
                    <div className="h-[500px]">
                        <FlashcardSets />
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Dashboard;
