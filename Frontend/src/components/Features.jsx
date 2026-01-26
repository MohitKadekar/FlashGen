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
        <section id="features" className="bg-gray-900 py-16 lg:py-24">
            <div className="py-8 w-full px-6 lg:px-12 mx-auto sm:py-16">
                <div className="max-w-screen-md mb-8 lg:mb-16 text-center mx-auto">
                    <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-white">
                        Designed for <span className="text-indigo-400">Efficient Learning</span>
                    </h2>
                    <p className="text-gray-400 sm:text-xl">
                        Everything you need to master your subjects, from intelligent creation to smart scheduling.
                    </p>
                </div>
                <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-12 md:space-y-0">
                    {features.map((feature, index) => (
                        <div key={index} className="flex flex-col items-center text-center p-6 bg-gray-800 rounded-xl shadow-lg border border-gray-700 hover:shadow-xl hover:shadow-indigo-900/20 transition-all duration-300">
                            <div className="flex justify-center items-center mb-4 w-16 h-16 rounded-full bg-gray-700">
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
