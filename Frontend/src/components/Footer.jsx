import React from 'react';
import { BookOpen, Github, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-black/20 backdrop-blur-lg border-t border-white/10">
            <div className="mx-auto w-full px-6 lg:px-12 p-4 py-6 lg:py-8">
                <div className="md:flex md:justify-between">
                    <div className="mb-6 md:mb-0">
                        <Link to="/" className="flex items-center">
                            <BookOpen className="w-8 h-8 text-indigo-500 mr-3" />
                            <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">FlashGen</span>
                        </Link>
                        <p className="mt-2 text-gray-400 max-w-sm">
                            Transforming the way you study with AI-powered flashcards and smart repetition.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
                        <div>
                            <h2 className="mb-6 text-sm font-semibold text-white uppercase">Resources</h2>
                            <ul className="text-gray-400 font-medium">
                                <li className="mb-4">
                                    <Link to="/" className="hover:underline hover:text-white">Home</Link>
                                </li>
                                <li>
                                    <Link to="/#features" className="hover:underline hover:text-white">Features</Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-6 text-sm font-semibold text-white uppercase">Follow us</h2>
                            <ul className="text-gray-400 font-medium">
                                <li className="mb-4">
                                    <Link to="/" className="hover:underline hover:text-white">Github</Link>
                                </li>
                                <li>
                                    <Link to="/" className="hover:underline hover:text-white">Discord</Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-6 text-sm font-semibold text-white uppercase">Legal</h2>
                            <ul className="text-gray-400 font-medium">
                                <li className="mb-4">
                                    <Link to="/" className="hover:underline hover:text-white">Privacy Policy</Link>
                                </li>
                                <li>
                                    <Link to="/" className="hover:underline hover:text-white">Terms &amp; Conditions</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <hr className="my-6 border-gray-800 sm:mx-auto lg:my-8" />
                <div className="sm:flex sm:items-center sm:justify-between">
                    <span className="text-sm text-gray-400 sm:text-center">© 2026 <Link to="/" className="hover:underline">FlashGen™</Link>. All Rights Reserved.
                    </span>
                    <div className="flex mt-4 sm:justify-center sm:mt-0 space-x-4">
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                            <Github className="w-5 h-5" />
                            <span className="sr-only">GitHub account</span>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                            <Twitter className="w-5 h-5" />
                            <span className="sr-only">Twitter page</span>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                            <Linkedin className="w-5 h-5" />
                            <span className="sr-only">LinkedIn account</span>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
