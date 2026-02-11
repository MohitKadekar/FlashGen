import React, { useState, useRef } from 'react';
import { X, Upload, FileText, CheckCircle, AlertCircle, Type, File } from 'lucide-react';
import { auth } from '../firebase';

const UploadNoteForm = ({ isOpen, onClose, onSuccess }) => {
    const [activeTab, setActiveTab] = useState('paste');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const fileInputRef = useRef(null);

    // If not open, don't render
    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        validateAndSetFile(selectedFile);
    };

    const validateAndSetFile = (selectedFile) => {
        if (!selectedFile) return;

        if (selectedFile.type !== 'text/plain') {
            setError('Only .txt files are supported');
            setFile(null);
            return;
        }
        // Check size (e.g., 5MB limit)
        if (selectedFile.size > 5 * 1024 * 1024) {
            setError('File size must be less than 5MB');
            setFile(null);
            return;
        }

        setFile(selectedFile);
        setError('');
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const droppedFile = e.dataTransfer.files[0];
        validateAndSetFile(droppedFile);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            if (!auth.currentUser) {
                throw new Error("You must be logged in to upload notes");
            }

            const token = await auth.currentUser.getIdToken();
            const formData = new FormData();

            if (title.trim()) formData.append('title', title.trim());

            if (activeTab === 'paste') {
                if (!content.trim()) throw new Error("Content cannot be empty");
                formData.append('content', content);
            } else {
                if (!file) throw new Error("Please select a file");
                formData.append('file', file);
            }

            const response = await fetch('http://localhost:8000/api/notes', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || 'Upload failed');
            }

            setSuccess('Note uploaded successfully!');
            setTimeout(() => {
                onSuccess(); // Trigger refresh in parent
                handleClose();
            }, 1000);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        // Reset state
        setTitle('');
        setContent('');
        setFile(null);
        setError('');
        setSuccess('');
        setActiveTab('paste');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                    <h2 className="text-xl font-bold text-white">Add New Note</h2>
                    <button
                        onClick={handleClose}
                        className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-6">
                        {/* Title Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1.5">Note Title (Optional)</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter a title for your note..."
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                            />
                        </div>

                        {/* Tabs */}
                        <div className="flex p-1 bg-black/50 rounded-lg border border-white/5">
                            <button
                                type="button"
                                onClick={() => setActiveTab('paste')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'paste'
                                        ? 'bg-indigo-600 text-white shadow-lg'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <Type className="w-4 h-4" />
                                Paste Text
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('upload')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'upload'
                                        ? 'bg-indigo-600 text-white shadow-lg'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <Upload className="w-4 h-4" />
                                Upload File
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="min-h-[200px]">
                            {activeTab === 'paste' ? (
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Paste your note content here..."
                                    className="w-full h-[200px] bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
                                />
                            ) : (
                                <div
                                    className={`w-full h-[200px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${file
                                            ? 'border-indigo-500/50 bg-indigo-500/10'
                                            : 'border-white/10 hover:border-indigo-400/50 hover:bg-white/5'
                                        }`}
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept=".txt"
                                        onChange={handleFileChange}
                                    />
                                    {file ? (
                                        <div className="text-center animate-in fade-in zoom-in">
                                            <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mx-auto mb-3 text-indigo-400">
                                                <FileText className="w-6 h-6" />
                                            </div>
                                            <p className="text-white font-medium truncate max-w-[200px]">{file.name}</p>
                                            <p className="text-gray-400 text-sm mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setFile(null);
                                                }}
                                                className="mt-3 text-xs text-red-400 hover:text-red-300 underline"
                                            >
                                                Remove file
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="text-center p-4">
                                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3 text-gray-400">
                                                <Upload className="w-6 h-6" />
                                            </div>
                                            <p className="text-white font-medium">Click to upload or drag and drop</p>
                                            <p className="text-gray-500 text-sm mt-1">.txt files only (max 5MB)</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Status Messages */}
                        {error && (
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-in slide-in-from-top-2">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm animate-in slide-in-from-top-2">
                                <CheckCircle className="w-4 h-4 shrink-0" />
                                {success}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-white/10 flex justify-end gap-3 bg-white/5">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || (!content && !file)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium text-white flex items-center gap-2 transition-all ${loading || (!content && !file)
                                    ? 'bg-indigo-600/50 cursor-not-allowed opacity-50'
                                    : 'bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20'
                                }`}
                        >
                            {loading ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    Uploading...
                                </>
                            ) : (
                                <>Upload Note</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UploadNoteForm;
