import React from 'react';
import { Brain, Clock, Layers, BarChart3 } from 'lucide-react';

const Features = () => {
    const features = [
        {
            icon: <Brain className="w-10 h-10 text-indigo-400" />,
            title: "AI-Powered Generation",
            description: "Paste your notes and let our advanced AI generate high-quality question-answer pairs automatically. No more manual typing."
        },
        {
            icon: <Clock className="w-10 h-10 text-purple-400" />,
            title: "Spaced Repetition",
            description: "Optimize your study schedule with the SM-2 algorithm. Review cards at the perfect time to maximize long-term retention."
        },
        {
            icon: <Layers className="w-10 h-10 text-blue-400" />,
            title: "Multiple Study Modes",
            description: "Switch between classic Flip, Multiple Choice, and Typing modes to keep your study sessions engaging and effective."
        },
        {
            icon: <BarChart3 className="w-10 h-10 text-emerald-400" />,
            title: "Progress Tracking",
            description: "Visualize your learning journey with detailed analytics. See what you've mastered and where you need to focus."
        }
    ];

    return (
        <section id="features" className="relative z-10 py-16 lg:py-24 scroll-mt-32">
            <div className="py-8 w-full px-6 lg:px-12 mx-auto sm:py-16">
                <div className="max-w-screen-md mb-8 lg:mb-16 text-center mx-auto">
                    <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-white">
                        Designed for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Efficient Learning</span>
                    </h2>
                    <p className="text-gray-400 sm:text-xl">
                        Everything you need to master your subjects, from intelligent creation to smart scheduling.
                    </p>
                </div>
                <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-12 md:space-y-0">
                    {features.map((feature, index) => (
                        <div key={index} className="flex flex-col items-center text-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 group">
                            <div className="flex justify-center items-center mb-4 w-16 h-16 rounded-full bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="mb-2 text-xl font-bold text-white">{feature.title}</h3>
                            <p className="text-gray-400">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
