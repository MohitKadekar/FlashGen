import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NotesList from '../components/NotesList';
import UploadNoteForm from '../components/UploadNoteForm';
import FloatingLines from '../components/FloatingLines';

const NotesPage = () => {
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30 flex flex-col relative overflow-hidden">
            {/* Background Animation */}
            <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
                <FloatingLines
                    linesGradient={['#4f46e5', '#818cf8', '#c084fc']}
                    animationSpeed={0.5}
                    lineCount={[4, 6, 4]}
                    lineDistance={[0.02, 0.01, 0.03]}
                />
            </div>

            <Navbar />

            <div className="flex-1 pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto w-full relative z-10">
                <div className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white/80 to-indigo-200">
                        My Notes
                    </h1>
                    <p className="text-gray-400 mt-2">Manage and review all your uploaded notes.</p>
                </div>

                <div className="h-[600px]">
                    <NotesList
                        onUploadClick={() => setIsUploadOpen(true)}
                        refreshTrigger={refreshTrigger}
                        showViewAll={false}
                    />
                </div>
            </div>

            <UploadNoteForm
                isOpen={isUploadOpen}
                onClose={() => setIsUploadOpen(false)}
                onSuccess={() => setRefreshTrigger(prev => prev + 1)}
            />

            <Footer />
        </div>
    );
};

export default NotesPage;
