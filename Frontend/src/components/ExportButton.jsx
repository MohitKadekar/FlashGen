import React, { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { Download, Loader2, FileDown } from 'lucide-react';

const ExportButton = () => {
    const [loading, setLoading] = useState(false);

    const handleExport = async (format) => {
        setLoading(true);
        try {
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) return;
            const token = await user.getIdToken();
            console.log("Export token:", token);

            const response = await fetch(`http://localhost:8000/api/flashcards/data/export?format=${format}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Export failed: ${response.status} ${response.statusText} - ${errorText}`);
            }

            // Handle file download
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `flashcards_export_${new Date().toISOString().slice(0, 10)}.${format}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

        } catch (error) {
            console.error("Export error detailed:", error);
            alert(`Failed to export flashcards: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative group">
            <button
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-50"
            >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                Export
            </button>

            {/* Dropdown for formats */}
            <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900 border border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-1">
                <button
                    onClick={() => handleExport('csv')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white rounded-lg flex items-center gap-2"
                >
                    <FileDown className="w-4 h-4" />
                    Export as CSV
                </button>
                {/* Future: Add Anki export option here */}
                {/* 
                <button
                    onClick={() => handleExport('anki')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white rounded-lg flex items-center gap-2"
                >
                    <Image className="w-4 h-4" />
                    Export for Anki (.apkg)
                </button> 
                */}
            </div>
        </div>
    );
};

export default ExportButton;
