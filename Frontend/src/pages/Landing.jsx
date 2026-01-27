import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Footer from '../components/Footer';
import FloatingLines from '../components/FloatingLines';

const Landing = () => {
    return (
        <div className="flex flex-col min-h-screen bg-black relative">
            <div className="fixed inset-0 z-0 pointer-events-none">
                <FloatingLines
                    enabledWaves={["top", "middle", "bottom"]}
                    lineCount={5}
                    lineDistance={5}
                    bendRadius={5}
                    bendStrength={-0.5}
                    interactive={true}
                    parallax={true}
                />
            </div>
            <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">
                    <Hero />
                    <Features />
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default Landing;
