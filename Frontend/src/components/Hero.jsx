import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const Hero = () => {
    return (
        <section id="home" className="bg-gray-900 min-h-screen flex items-center pt-20 pb-12 overflow-hidden relative">
            <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-full z-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-500 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <div className="py-8 w-full px-6 lg:px-12 mx-auto text-center lg:py-16 relative z-10">
                <div className="inline-flex justify-between items-center py-1 px-1 pr-4 mb-7 text-sm text-gray-300 bg-gray-800 rounded-full hover:bg-gray-700" role="alert">
                    <span className="text-xs bg-indigo-600 rounded-full text-white px-3 py-1.5 mr-3">New</span>
                    <span className="text-sm font-medium mr-2">AI-Powered Flashcard Generation is here!</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                </div>
                <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-6xl">
                    Master Your Studies with <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">AI Flashcards</span>
                </h1>
                <p className="mb-8 text-lg font-normal text-gray-400 lg:text-xl sm:px-16 xl:px-48">
                    Instantly convert your notes, textbooks, and documents into interactive flashcards.
                    Use scientifically-proven spaced repetition to retain information longer and ace your exams.
                </p>
                <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
                    <Link to="/signup" className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-900 shadow-lg shadow-indigo-500/30 hover:scale-105 transition-transform duration-200">
                        Get Started for Free
                        <ArrowRight className="ml-2 -mr-1 w-5 h-5" />
                    </Link>
                    <a href="#features" className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg border border-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-700">
                        <Sparkles className="mr-2 -ml-1 w-5 h-5 text-yellow-400" />
                        See How It Works
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Hero;
