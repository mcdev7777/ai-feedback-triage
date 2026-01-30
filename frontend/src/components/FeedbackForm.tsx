import React, { useState, useRef, useEffect } from 'react';
import { TriageResponse } from '@/types';
import { triageFeedback } from '@/utils/api';
import { Eraser, Loader2, Sparkles, Brain, Zap } from 'lucide-react';

interface FeedbackFormProps {
  onResult: (result: TriageResponse | null) => void;
  onError: (error: string | null) => void;
  darkMode: boolean;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ onResult, onError, darkMode }) => {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [preview, setPreview] = useState<{ category?: string; urgency?: number } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewTimeoutRef = useRef<NodeJS.Timeout>();

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [text]);

  // Real-time preview (simplified for demo)
  useEffect(() => {
    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current);
    }

    if (text.length > 20) {
      previewTimeoutRef.current = setTimeout(() => {
        // Simple heuristic for preview (in real app, you might call a lightweight API)
        const lowercaseText = text.toLowerCase();
        let category = 'General Inquiry';
        let urgency = 2;

        if (lowercaseText.includes('bug') || lowercaseText.includes('error') || lowercaseText.includes('crash') || lowercaseText.includes('broken')) {
          category = 'Bug Report';
          urgency = 4;
        } else if (lowercaseText.includes('feature') || lowercaseText.includes('request') || lowercaseText.includes('add') || lowercaseText.includes('improve')) {
          category = 'Feature Request';
          urgency = 3;
        } else if (lowercaseText.includes('love') || lowercaseText.includes('great') || lowercaseText.includes('awesome') || lowercaseText.includes('good')) {
          category = 'Praise/Positive Feedback';
          urgency = 1;
        }

        if (lowercaseText.includes('urgent') || lowercaseText.includes('critical') || lowercaseText.includes('immediately')) {
          urgency = 5;
        }

        setPreview({ category, urgency });
      }, 1000);
    } else {
      setPreview(null);
    }

    return () => {
      if (previewTimeoutRef.current) {
        clearTimeout(previewTimeoutRef.current);
      }
    };
  }, [text]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'Enter' && text.trim() && !isLoading) {
        e.preventDefault();
        const form = textareaRef.current?.form;
        if (form) {
          const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
          form.dispatchEvent(submitEvent);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [text, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPreview(null);
    
    // Trim and normalize whitespace
    const cleanedText = text.trim().replace(/\s+/g, ' ');
    
    if (!cleanedText) {
      onError('Please enter some feedback text');
      return;
    }

    if (cleanedText.length < 3) {
      onError('Feedback must be at least 3 characters long');
      return;
    }

    if (cleanedText.length > 1000) {
      onError('Feedback text must be 1000 characters or less');
      return;
    }

    setIsLoading(true);
    onError(null);
    onResult(null);

    try {
      const result = await triageFeedback({ text: cleanedText });
      onResult(result);
    } catch (error) {
      if (error instanceof Error) {
        // Handle specific error types
        if (error.message.includes('Network')) {
          onError('Network error. Please check your connection and try again.');
        } else if (error.message.includes('timeout')) {
          onError('Request timed out. Please try again.');
        } else {
          onError(error.message);
        }
      } else {
        onError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setText('');
    onResult(null);
    onError(null);
    setPreview(null);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const getCharacterCountColor = () => {
    const length = text.length;
    if (length > 900) return darkMode ? 'text-red-400' : 'text-red-500';
    if (length > 750) return darkMode ? 'text-yellow-400' : 'text-yellow-500';
    return darkMode ? 'text-gray-400' : 'text-gray-500';
  };

  const getCharacterCountWidth = () => {
    return `${(text.length / 1000) * 100}%`;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Bug Report': return 'text-red-500';
      case 'Feature Request': return 'text-blue-500';
      case 'Praise/Positive Feedback': return 'text-green-500';
      default: return darkMode ? 'text-gray-400' : 'text-gray-600';
    }
  };

  const getUrgencyColor = (urgency: number) => {
    if (urgency >= 4) return 'text-red-500';
    if (urgency >= 3) return 'text-yellow-500';
    if (urgency >= 2) return 'text-blue-500';
    return 'text-green-500';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Input Section */}
      <div className="relative">
        <label
          htmlFor="feedback-text"
          className={`
            absolute left-4 transition-all duration-200 pointer-events-none
            ${isFocused || text 
              ? `top-2 text-xs ${darkMode ? 'text-blue-400' : 'text-blue-600'} font-medium`
              : `top-4 text-base ${darkMode ? 'text-gray-400' : 'text-gray-500'}`
            }
          `}
        >
          {isFocused || text ? 'Your Feedback' : 'Describe your issue, feature request, or feedback...'}
        </label>
        
        <textarea
          ref={textareaRef}
          id="feedback-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          maxLength={1000}
          disabled={isLoading}
          className={`
            w-full px-4 pt-8 pb-4 rounded-xl border-2 transition-all duration-200 resize-none min-h-[120px] max-h-[200px]
            ${darkMode 
              ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:bg-gray-700/70'
              : 'bg-white/50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-blue-400 focus:bg-white/70'
            }
            ${isLoading ? 'cursor-not-allowed opacity-50' : ''}
            focus:ring-4 focus:ring-blue-400/20 focus:outline-none
            backdrop-blur-sm
          `}
        />
        
        {/* Character Count Progress Bar */}
        <div className="mt-2">
          <div className={`h-1 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden`}>
            <div 
              className={`h-full transition-all duration-300 rounded-full ${
                text.length > 900 ? 'bg-red-500' : text.length > 750 ? 'bg-yellow-500' : 'bg-blue-500'
              }`}
              style={{ width: getCharacterCountWidth() }}
            />
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className={`text-xs ${getCharacterCountColor()}`}>
              {text.length}/1000 characters
            </span>
            {text.length > 950 && (
              <span className={`text-xs ${darkMode ? 'text-red-400' : 'text-red-500'} animate-pulse`}>
                Running low on space!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Live Preview */}
      {preview && (
        <div className={`p-4 rounded-xl border-2 border-dashed ${darkMode ? 'border-blue-500/30 bg-blue-900/10' : 'border-blue-300 bg-blue-50/50'} animate-fade-in`}>
          <div className="flex items-center mb-2">
            <Brain className={`w-4 h-4 mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <span className={`text-sm font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>AI Preview</span>
            <Sparkles className="w-3 h-3 ml-1 text-yellow-400 animate-pulse" />
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Category: </span>
              <span className={`font-medium ${getCategoryColor(preview.category || '')}`}>
                {preview.category}
              </span>
            </div>
            <div>
              <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Urgency: </span>
              <span className={`font-medium ${getUrgencyColor(preview.urgency || 1)}`}>
                {preview.urgency}/5
              </span>
            </div>
          </div>
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isLoading || !text.trim()}
          className={`
            flex-1 flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all duration-200
            ${isLoading || !text.trim()
              ? darkMode 
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : darkMode
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-blue-500/25 transform hover:scale-[1.02]'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-blue-500/25 transform hover:scale-[1.02]'
            }
          `}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5 mr-2" />
              Analyze with AI
            </>
          )}
        </button>
        
        <button
          type="button"
          onClick={handleClear}
          disabled={isLoading}
          className={`
            px-6 py-3 rounded-xl font-semibold transition-all duration-200
            ${isLoading
              ? darkMode 
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : darkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white border border-gray-600'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 border border-gray-300'
            }
          `}
        >
          <Eraser className="w-5 h-5" />
        </button>
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} text-center`}>
        💡 Pro tip: Press <kbd className={`px-1 py-0.5 rounded text-xs ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>Ctrl + Enter</kbd> to submit
      </div>
    </form>
  );
};

export default FeedbackForm;