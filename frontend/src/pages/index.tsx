import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import FeedbackForm from '@/components/FeedbackForm';
import ResultDisplay from '@/components/ResultDisplay';
import ErrorDisplay from '@/components/ErrorDisplay';
import Navigation from '@/components/Navigation';
import ToastContainer from '@/components/ToastContainer';
import { TriageResponse } from '@/types';
import { Moon, Sun, Sparkles, Brain } from 'lucide-react';

const Home: React.FC = () => {
  const [result, setResult] = useState<TriageResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [toasts, setToasts] = useState<Array<{id: string, message: string, type: 'success' | 'error'}>>([]);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const addToast = (message: string, type: 'success' | 'error') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  };

  const handleSuccess = (result: TriageResponse | null) => {
    if (result) {
      setResult(result);
      addToast('Feedback analyzed successfully! 🎉', 'success');
    }
  };

  const handleError = (errorMessage: string | null) => {
    if (errorMessage) {
      setError(errorMessage);
      addToast('Something went wrong. Please try again.', 'error');
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <>
      <Head>
        <title>AI-Powered Feedback Triage</title>
        <meta name="description" content="Automatically classify and prioritize user feedback using AI" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
        </div>

        <Navigation darkMode={darkMode} toggleDarkMode={toggleDarkMode} currentPage="home" />
        
        <main className="relative container mx-auto px-4 py-8 max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <Brain className={`w-16 h-16 ${darkMode ? 'text-blue-400' : 'text-blue-600'} animate-pulse`} />
                <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2 animate-bounce" />
              </div>
            </div>
            <h1 className={`text-5xl font-bold mb-4 bg-gradient-to-r ${darkMode ? 'from-blue-400 to-purple-400' : 'from-blue-600 to-purple-600'} bg-clip-text text-transparent animate-gradient`}>
              AI-Powered Feedback Triage
            </h1>
            <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto leading-relaxed`}>
              Transform your feedback into actionable insights with our intelligent AI system. 
              <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Instant classification and priority scoring.
              </span>
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Form Section */}
            <div className="space-y-6">
              <div className={`backdrop-blur-sm ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/70 border-white/50'} rounded-2xl border shadow-2xl p-8 transform hover:scale-[1.02] transition-all duration-300`}>
                <div className="flex items-center mb-6">
                  <div className={`w-3 h-3 rounded-full ${darkMode ? 'bg-green-400' : 'bg-green-500'} mr-3 animate-pulse`}></div>
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Submit Feedback</h2>
                </div>
                <FeedbackForm 
                  onResult={handleSuccess} 
                  onError={handleError} 
                  darkMode={darkMode}
                />
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {error && (
                <div className="animate-slide-in-right">
                  <ErrorDisplay error={error} onDismiss={() => setError(null)} darkMode={darkMode} />
                </div>
              )}

              {result && (
                <div className="animate-slide-in-right">
                  <ResultDisplay result={result} darkMode={darkMode} />
                </div>
              )}

              {!result && !error && (
                <div className={`backdrop-blur-sm ${darkMode ? 'bg-gray-800/30 border-gray-700' : 'bg-white/50 border-white/30'} rounded-2xl border p-8 text-center`}>
                  <Brain className={`w-16 h-16 ${darkMode ? 'text-gray-400' : 'text-gray-300'} mx-auto mb-4`} />
                  <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>Ready to Analyze</h3>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Enter your feedback to see AI-powered insights appear here</p>
                </div>
              )}
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            <div className={`text-center p-6 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-sm border ${darkMode ? 'border-gray-700' : 'border-white/50'} transform hover:scale-105 transition-all duration-300`}>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-2`}>Smart Classification</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Automatically categorizes feedback into Bug Reports, Feature Requests, and more</p>
            </div>
            
            <div className={`text-center p-6 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-sm border ${darkMode ? 'border-gray-700' : 'border-white/50'} transform hover:scale-105 transition-all duration-300`}>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-2`}>Priority Scoring</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Intelligent urgency assessment from 1-5 based on content analysis</p>
            </div>
            
            <div className={`text-center p-6 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-sm border ${darkMode ? 'border-gray-700' : 'border-white/50'} transform hover:scale-105 transition-all duration-300`}>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-2`}>Analytics Dashboard</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Comprehensive insights and trends visualization for all feedback</p>
            </div>
          </div>
        </main>

        <ToastContainer toasts={toasts} darkMode={darkMode} />
      </div>
    </>
  );
};

export default Home;