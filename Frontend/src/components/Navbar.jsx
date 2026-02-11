import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, LayoutDashboard, Activity } from 'lucide-react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] md:w-[600px] rounded-full border border-white/10 bg-black/50 backdrop-blur-md px-6 py-4">
      <div className="flex items-center justify-between">
        <Link to={user ? "/dashboard" : "/"} className="flex items-center space-x-2">
          <div className="p-2 bg-indigo-600 rounded-lg">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <span className="text-lg font-medium text-white">FlashGen</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm font-medium text-white/90 hover:text-white transition-colors flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <Link to="/flashcards" className="text-sm font-medium text-white/90 hover:text-white transition-colors flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Cards
              </Link>
              <Link to="/stats" className="text-sm font-medium text-white/90 hover:text-white transition-colors flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Stats
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-white/70 hover:text-white transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/" className="text-sm font-medium text-white/90 hover:text-white transition-colors">Home</Link>
              <Link to="/#features" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Features</Link>
              <Link to="/login" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                Log In
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="flex md:hidden">
          {user ? (
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-white flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
            </button>
          ) : (
            <Link to="/login" className="text-sm font-medium text-white">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
