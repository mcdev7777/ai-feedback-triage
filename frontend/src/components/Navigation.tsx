import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Moon, Sun, Brain, BarChart3, MessageSquare, Sparkles } from 'lucide-react';

interface NavigationProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  currentPage: 'home' | 'dashboard';
}

const Navigation: React.FC<NavigationProps> = ({ darkMode, toggleDarkMode, currentPage }) => {
  // const router = useRouter(); // Unused for now

  return (
    <nav className={`sticky top-0 z-50 backdrop-blur-md ${darkMode ? 'bg-gray-900/80 border-gray-700' : 'bg-white/80 border-white/50'} border-b transition-all duration-300`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <Brain className={`w-8 h-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'} group-hover:scale-110 transition-transform duration-200`} />
              <Sparkles className="w-3 h-3 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} hidden sm:block`}>
              AI Triage
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <Link href="/" className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                currentPage === 'home'
                  ? darkMode 
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                    : 'bg-blue-50 text-blue-600 border border-blue-200'
                  : darkMode
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}>
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:block">Submit</span>
              </Link>

              <Link href="/dashboard" className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                currentPage === 'dashboard'
                  ? darkMode 
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                    : 'bg-purple-50 text-purple-600 border border-purple-200'
                  : darkMode
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}>
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:block">Dashboard</span>
              </Link>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-xl transition-all duration-200 ${
                darkMode 
                  ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;