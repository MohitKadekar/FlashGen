import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] md:w-[600px] rounded-full border border-white/10 bg-black/50 backdrop-blur-md px-6 py-4">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="p-2 bg-indigo-600 rounded-lg">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <span className="text-lg font-medium text-white">FlashGen</span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-sm font-medium text-white/90 hover:text-white transition-colors">Home</Link>
          <Link to="/#features" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Features</Link>
          <Link to="/login" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
            Log In
          </Link>
        </div>

        <div className="flex md:hidden">
          <Link to="/login" className="text-sm font-medium text-white">Login</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
