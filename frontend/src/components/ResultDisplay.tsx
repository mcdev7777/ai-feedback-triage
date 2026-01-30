import React from 'react';
import { TriageResponse } from '@/types';
import { CheckCircle, AlertTriangle, Clock, MessageSquare, Sparkles, Copy } from 'lucide-react';

interface ResultDisplayProps {
  result: TriageResponse;
  darkMode: boolean;
}

const getUrgencyLabel = (score: number): string => {
  switch (score) {
    case 1: return 'Not Urgent';
    case 2: return 'Low';
    case 3: return 'Medium';
    case 4: return 'High';
    case 5: return 'Critical';
    default: return 'Unknown';
  }
};

const getCategoryColor = (category: string, darkMode: boolean) => {
  switch (category) {
    case 'Bug Report': 
      return darkMode ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-red-50 text-red-700 border-red-200';
    case 'Feature Request': 
      return darkMode ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Praise/Positive Feedback': 
      return darkMode ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-green-50 text-green-700 border-green-200';
    case 'General Inquiry': 
      return darkMode ? 'bg-gray-500/20 text-gray-400 border-gray-500/30' : 'bg-gray-50 text-gray-700 border-gray-200';
    default: 
      return darkMode ? 'bg-gray-500/20 text-gray-400 border-gray-500/30' : 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Bug Report': return AlertTriangle;
    case 'Feature Request': return Sparkles;
    case 'Praise/Positive Feedback': return CheckCircle;
    case 'General Inquiry': return MessageSquare;
    default: return MessageSquare;
  }
};

const getUrgencyColor = (score: number, darkMode: boolean): string => {
  switch (score) {
    case 1: return darkMode ? 'bg-gray-500/20 text-gray-400 border-gray-500/30' : 'bg-gray-100 text-gray-700 border-gray-300';
    case 2: return darkMode ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-blue-100 text-blue-700 border-blue-300';
    case 3: return darkMode ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 'bg-yellow-100 text-yellow-700 border-yellow-300';
    case 4: return darkMode ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' : 'bg-orange-100 text-orange-700 border-orange-300';
    case 5: return darkMode ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-red-100 text-red-700 border-red-300';
    default: return darkMode ? 'bg-gray-500/20 text-gray-400 border-gray-500/30' : 'bg-gray-100 text-gray-700 border-gray-300';
  }
};

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, darkMode }) => {
  const CategoryIcon = getCategoryIcon(result.category);

  const copyToClipboard = () => {
    const text = `Feedback: "${result.feedback_text}"\nCategory: ${result.category}\nUrgency: ${result.urgency_score}/5 (${getUrgencyLabel(result.urgency_score)})`;
    navigator.clipboard.writeText(text);
  };

  return (
    <div className={`backdrop-blur-sm ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/70 border-white/50'} rounded-2xl border shadow-2xl p-8 animate-fade-in`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full bg-green-500 mr-3 animate-pulse`}></div>
          <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Analysis Complete</h3>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={copyToClipboard}
            className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'}`}
            title="Copy results"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Results */}
      <div className="space-y-6">
        {/* Feedback Text */}
        <div className="space-y-3">
          <label className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wide`}>
            Original Feedback
          </label>
          <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'} border-l-4 border-l-blue-500`}>
            <p className={`${darkMode ? 'text-gray-200' : 'text-gray-700'} italic leading-relaxed`}>
              "{result.feedback_text}"
            </p>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Category */}
          <div className="space-y-3">
            <label className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wide`}>
              Category
            </label>
            <div className={`flex items-center p-4 rounded-xl border ${getCategoryColor(result.category, darkMode)}`}>
              <CategoryIcon className="w-5 h-5 mr-3" />
              <span className="font-semibold">{result.category}</span>
            </div>
          </div>

          {/* Urgency */}
          <div className="space-y-3">
            <label className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wide`}>
              Urgency Level
            </label>
            <div className={`flex items-center p-4 rounded-xl border ${getUrgencyColor(result.urgency_score, darkMode)}`}>
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold mr-3 ${getUrgencyColor(result.urgency_score, darkMode)}`}>
                  {result.urgency_score}
                </div>
                <div>
                  <div className="font-semibold">{getUrgencyLabel(result.urgency_score)}</div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Score: {result.urgency_score}/5</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Urgency Scale Reference */}
        <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50/50'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
          <h4 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4 flex items-center`}>
            <Clock className="w-5 h-5 mr-2" />
            Urgency Scale Reference
          </h4>
          <div className="grid grid-cols-5 gap-3">
            {[1, 2, 3, 4, 5].map((score) => (
              <div key={score} className="text-center">
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold mb-2 mx-auto transition-all duration-200 ${result.urgency_score === score ? 'ring-4 ring-blue-400/50 scale-110' : ''} ${getUrgencyColor(score, darkMode)}`}>
                  {score}
                </div>
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} block`}>
                  {getUrgencyLabel(score)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Suggestions */}
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-blue-900/20 border-blue-500/30' : 'bg-blue-50 border-blue-200'} border`}>
          <h5 className={`font-semibold ${darkMode ? 'text-blue-400' : 'text-blue-700'} mb-2`}>💡 Recommended Actions</h5>
          <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
            {result.urgency_score >= 4 
              ? "High priority - Consider immediate attention and response within 24 hours."
              : result.urgency_score >= 3
              ? "Medium priority - Address within 2-3 business days."
              : "Low priority - Can be addressed in regular workflow."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;