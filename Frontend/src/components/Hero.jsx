import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const Hero = () => {
    return (
        <section id="home" className="min-h-screen flex items-center justify-center pt-20 pb-12 overflow-hidden relative z-10">
            <div className="py-8 w-full px-6 lg:px-12 mx-auto text-center relative max-w-4xl">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-gray-200 mb-8 backdrop-blur-sm cursor-pointer hover:bg-white/10 transition-colors">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span>AI-Powered Flashcards Generation is here!</span>
                </div>

                {/* Heading */}
                <h1 className="mb-6 text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight">
                    Generate Flashcards<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-400">Instantly from Notes</span>
                </h1>

                {/* Subtitle */}
                <p className="mb-10 text-lg md:text-xl font-normal text-gray-400 max-w-2xl mx-auto">
                    Transform your learning materials into interactive study sets with the power of advanced AI.
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link to="/signup" className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-gray-900 bg-white rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                        Get Started
                    </Link>
                    <a href="#features" className="w-full sm:w-auto px-8 py-3.5 text-base font-medium text-white bg-white/10 border border-white/10 rounded-full hover:bg-white/20 backdrop-blur-md transition-all duration-300">
                        Learn More
                    </a>
                </div>
            </div>


        </section>
    );
};

export default Hero;
