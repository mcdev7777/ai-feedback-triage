import React from 'react';
import { AlertCircle, X, RefreshCcw } from 'lucide-react';

interface ErrorDisplayProps {
  error: string;
  onDismiss: () => void;
  darkMode: boolean;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onDismiss, darkMode }) => {
  return (
    <div className={`backdrop-blur-sm ${darkMode ? 'bg-red-900/20 border-red-500/30' : 'bg-red-50/70 border-red-200'} rounded-2xl border shadow-2xl p-6 animate-slide-in-right`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full bg-red-500 mr-3 animate-pulse`}></div>
          <h3 className={`text-xl font-bold ${darkMode ? 'text-red-400' : 'text-red-700'}`}>Something went wrong</h3>
        </div>
        <button
          onClick={onDismiss}
          className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-red-800/50 text-red-400 hover:text-red-300' : 'hover:bg-red-100 text-red-600 hover:text-red-700'}`}
          aria-label="Dismiss error"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Error Content */}
      <div className="flex items-start space-x-4">
        <div className={`flex-shrink-0 p-2 rounded-xl ${darkMode ? 'bg-red-500/20' : 'bg-red-100'}`}>
          <AlertCircle className={`w-6 h-6 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className={`${darkMode ? 'text-red-300' : 'text-red-700'} leading-relaxed`}>
            {error}
          </p>
          
          {/* Action Suggestions */}
          <div className="mt-4 pt-4 border-t border-red-200/50">
            <p className={`text-sm ${darkMode ? 'text-red-400/80' : 'text-red-600/80'} mb-3`}>
              💡 Try these solutions:
            </p>
            <ul className={`text-sm ${darkMode ? 'text-red-300/90' : 'text-red-600/90'} space-y-1`}>
              <li className="flex items-center">
                <RefreshCcw className="w-3 h-3 mr-2 flex-shrink-0" />
                Check your internet connection
              </li>
              <li className="flex items-center">
                <RefreshCcw className="w-3 h-3 mr-2 flex-shrink-0" />
                Try submitting again in a moment
              </li>
              <li className="flex items-center">
                <RefreshCcw className="w-3 h-3 mr-2 flex-shrink-0" />
                Make sure your feedback is under 1000 characters
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Retry Button */}
      <div className="mt-6">
        <button
          onClick={onDismiss}
          className={`w-full px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
            darkMode 
              ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 hover:text-red-300'
              : 'bg-red-100 text-red-700 border border-red-200 hover:bg-red-200 hover:text-red-800'
          }`}
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default ErrorDisplay;