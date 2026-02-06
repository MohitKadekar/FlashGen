import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAuth } from "firebase/auth";
import { ArrowLeft, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingLines from '../components/FloatingLines';
import FlashcardDetail from '../components/FlashcardDetail';
import EditFlashcardForm from '../components/EditFlashcardForm';

const FlashcardDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [flashcard, setFlashcard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchFlashcard();
    }, [id]);

    const fetchFlashcard = async () => {
        setLoading(true);
        try {
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) {
                // Wait a bit for auth init if needed or redirect
                // For now assume protected route handles general auth check
                return;
            }
            const token = await user.getIdToken();

            const response = await fetch(`http://localhost:8000/api/flashcards/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                if (response.status === 404) throw new Error('Flashcard not found');
                throw new Error('Failed to load flashcard');
            }

            const data = await response.json();
            setFlashcard(data.flashcard);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (updatedData) => {
        setSaving(true);
        try {
            const auth = getAuth();
            const user = auth.currentUser;
            const token = await user.getIdToken();

            const response = await fetch(`http://localhost:8000/api/flashcards/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });

            if (!response.ok) throw new Error('Failed to update flashcard');

            const data = await response.json();
            setFlashcard(data.flashcard);
            setIsEditing(false);
        } catch (err) {
            console.error(err);
            alert("Failed to save changes: " + err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
                <div className="text-red-400 text-xl font-semibold mb-4">{error}</div>
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={20} /> Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <FloatingLines
                    linesGradient={['#4f46e5', '#818cf8', '#c084fc']}
                    animationSpeed={0.3}
                    lineCount={[2, 4, 2]}
                />
            </div>

            <Navbar />

            <div className="pt-32 pb-20 px-6 md:px-12 max-w-4xl mx-auto relative z-10">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Flashcards
                </button>

                {isEditing ? (
                    <div className="bg-[#1a1b1e] p-8 rounded-2xl border border-gray-700 shadow-2xl">
                        <h2 className="text-2xl font-bold mb-6">Edit Flashcard</h2>
                        <EditFlashcardForm
                            flashcard={flashcard}
                            onSave={handleSave}
                            onCancel={() => setIsEditing(false)}
                            saving={saving}
                        />
                    </div>
                ) : (
                    <>
                        <FlashcardDetail
                            flashcard={flashcard}
                            onEdit={() => setIsEditing(true)}
                        />
                    </>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default FlashcardDetailPage;
