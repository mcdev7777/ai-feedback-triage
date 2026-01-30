import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Navigation from '@/components/Navigation';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
  RadialBarChart,
  RadialBar,
  Legend
} from 'recharts';
import { 
  MessageSquare, 
  AlertTriangle, 
  TrendingUp, 
  Clock,
  Search,
  Filter,
  RefreshCw,
  Bug,
  Lightbulb,
  Heart,
  HelpCircle,
  Download,
  Calendar,
  Users,
  Zap,
  Target,
  Activity,
  Award,
  FileDown,
  Eye,
  BarChart3,
  PieChart as PieChartIcon,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Sparkles
} from 'lucide-react';
import { format } from 'date-fns';

interface DashboardStats {
  total_feedback: number;
  category_distribution: Record<string, number>;
  urgency_distribution: Record<string, number>;
  avg_processing_time_ms: number;
  daily_trend: Array<{ date: string; count: number }>;
  urgent_feedback: Array<any>;
  time_period_days: number;
}

interface FeedbackItem {
  id: number;
  feedback_text: string;
  category: string;
  urgency_score: number;
  created_at: string;
  processing_time_ms?: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [feedbackHistory, setFeedbackHistory] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [timeRange, setTimeRange] = useState(30);
  const [darkMode, setDarkMode] = useState(false);
  const [activeView, setActiveView] = useState<'overview' | 'trends' | 'details'>('overview');

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

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const categoryColors = {
    'Bug Report': '#ef4444',
    'Feature Request': '#3b82f6', 
    'Praise/Positive Feedback': '#10b981',
    'General Inquiry': '#6b7280'
  };

  const categoryIcons = {
    'Bug Report': Bug,
    'Feature Request': Lightbulb,
    'Praise/Positive Feedback': Heart,
    'General Inquiry': HelpCircle
  };

  const urgencyColors = ['#6b7280', '#3b82f6', '#f59e0b', '#ef4444', '#dc2626'];

  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load dashboard stats
      const statsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/dashboard/stats?days_back=${timeRange}`);
      const statsData = await statsResponse.json();
      setStats(statsData);

      // Load feedback history
      const feedbackResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/dashboard/feedback?limit=100`);
      const feedbackData = await feedbackResponse.json();
      setFeedbackHistory(feedbackData.feedback || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadDashboardData();
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/dashboard/search?q=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      setFeedbackHistory(data.feedback || []);
    } catch (error) {
      console.error('Error searching feedback:', error);
    }
  };

  const filterByCategory = async (category: string) => {
    setSelectedCategory(category);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/dashboard/feedback?category=${encodeURIComponent(category)}&limit=100`);
      const data = await response.json();
      setFeedbackHistory(data.feedback || []);
    } catch (error) {
      console.error('Error filtering feedback:', error);
    }
  };

  const getUrgencyLabel = (score: number): string => {
    const labels = ['', 'Not Urgent', 'Low', 'Medium', 'High', 'Critical'];
    return labels[score] || 'Unknown';
  };

  const exportData = (format: 'csv' | 'json') => {
    if (format === 'csv') {
      const csvContent = feedbackHistory.map(item => 
        `"${item.feedback_text}","${item.category}",${item.urgency_score},"${item.created_at}"`
      ).join('\n');
      const header = 'Feedback,Category,Urgency,Date\n';
      const blob = new Blob([header + csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `feedback-data-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    }
  };

  if (loading && !stats) {
    return (
      <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-blue-50'}`}>
        <Navigation darkMode={darkMode} toggleDarkMode={toggleDarkMode} currentPage="dashboard" />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="relative mb-8">
              <div className={`w-20 h-20 rounded-full border-4 ${darkMode ? 'border-blue-400/20' : 'border-blue-200'} animate-pulse mx-auto`}></div>
              <div className={`absolute top-0 left-0 w-20 h-20 rounded-full border-4 border-transparent border-t-blue-500 animate-spin`}></div>
              <BarChart3 className={`w-8 h-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'} absolute top-6 left-6`} />
            </div>
            <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} mb-2`}>Loading Dashboard</h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Fetching your analytics data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Transform data for better visualization
  const categoryData = Object.entries(stats?.category_distribution || {}).map(([category, count]) => ({
    name: category === 'Feature Request' ? 'Features' : category.replace(/\/.*/, ''), // Shorten labels
    fullName: category,
    value: count,
    color: categoryColors[category as keyof typeof categoryColors],
    percentage: ((count / (stats?.total_feedback || 1)) * 100).toFixed(1)
  }));

  const urgencyData = Object.entries(stats?.urgency_distribution || {}).map(([urgency, count]) => ({
    urgency: `Level ${urgency}`,
    count,
    label: getUrgencyLabel(parseInt(urgency)),
    fill: urgencyColors[parseInt(urgency) - 1] || '#6b7280'
  }));

  // Enhanced trend data with areas
  const trendData = stats?.daily_trend?.map((item, index) => ({
    ...item,
    date: format(new Date(item.date), 'MMM dd'),
    avgCount: stats.daily_trend.slice(0, index + 1).reduce((sum, curr) => sum + curr.count, 0) / (index + 1)
  })) || [];

  const totalUrgent = (stats?.urgency_distribution['4'] || 0) + (stats?.urgency_distribution['5'] || 0);
  const avgDaily = Math.round((stats?.total_feedback || 0) / (stats?.time_period_days || 1));
  const processingTime = Math.round(stats?.avg_processing_time_ms || 0);

  return (
    <>
      <Head>
        <title>Analytics Dashboard - AI-Powered Feedback Triage</title>
        <meta name="description" content="Advanced analytics dashboard for feedback triage system" />
      </Head>

      <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-blue-50'}`}>
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute -top-40 -right-40 w-80 h-80 ${darkMode ? 'bg-blue-500/10' : 'bg-blue-200/40'} rounded-full mix-blend-multiply filter blur-xl animate-pulse`}></div>
          <div className={`absolute -bottom-40 -left-40 w-80 h-80 ${darkMode ? 'bg-purple-500/10' : 'bg-purple-200/40'} rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000`}></div>
          <div className={`absolute top-1/2 left-1/2 w-80 h-80 ${darkMode ? 'bg-green-500/10' : 'bg-green-200/40'} rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500`}></div>
        </div>

        <Navigation darkMode={darkMode} toggleDarkMode={toggleDarkMode} currentPage="dashboard" />
        
        <div className="relative container mx-auto px-4 py-8 max-w-7xl">
          {/* Header Section */}
          <div className="mb-8 animate-fade-in">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              <div>
                <div className="flex items-center mb-2">
                  <BarChart3 className={`w-8 h-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'} mr-3`} />
                  <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} bg-gradient-to-r ${darkMode ? 'from-blue-400 to-purple-400' : 'from-blue-600 to-purple-600'} bg-clip-text text-transparent`}>
                    Analytics Dashboard
                  </h1>
                  <Sparkles className="w-6 h-6 text-yellow-400 ml-2 animate-pulse" />
                </div>
                <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Insights from the last <span className="font-semibold text-blue-500">{timeRange} days</span>
                </p>
              </div>
              
              <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(parseInt(e.target.value))}
                  className={`px-4 py-2 rounded-xl border transition-colors ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-600 text-white focus:border-blue-400' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                  } focus:ring-2 focus:ring-blue-400/20 focus:outline-none`}
                >
                  <option value={7}>Last 7 days</option>
                  <option value={30}>Last 30 days</option>
                  <option value={90}>Last 90 days</option>
                  <option value={365}>Last year</option>
                </select>
                
                <button
                  onClick={loadDashboardData}
                  className={`flex items-center px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    darkMode
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  } shadow-lg hover:shadow-blue-500/25 transform hover:scale-105`}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
                
                <button
                  onClick={() => exportData('csv')}
                  className={`flex items-center px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    darkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 border border-gray-600'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
                  } transform hover:scale-105`}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </button>
              </div>
            </div>

            {/* View Toggle */}
            <div className={`flex space-x-1 p-1 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} w-fit`}>
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'trends', label: 'Trends', icon: TrendingUp },
                { id: 'details', label: 'Details', icon: Activity }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveView(id as any)}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeView === id
                      ? darkMode
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-blue-600 text-white shadow-lg'
                      : darkMode
                        ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in">
            {[
              {
                title: 'Total Feedback',
                value: stats?.total_feedback || 0,
                icon: MessageSquare,
                color: 'blue',
                trend: '+12%',
                trendUp: true
              },
              {
                title: 'Urgent Items',
                value: totalUrgent,
                icon: AlertTriangle,
                color: 'red',
                trend: '-8%',
                trendUp: false
              },
              {
                title: 'Avg Response',
                value: `${processingTime}ms`,
                icon: Clock,
                color: 'green',
                trend: '-15%',
                trendUp: false
              },
              {
                title: 'Daily Average',
                value: avgDaily,
                icon: TrendingUp,
                color: 'purple',
                trend: '+23%',
                trendUp: true
              }
            ].map((stat, index) => (
              <div 
                key={index}
                className={`backdrop-blur-sm ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/70 border-white/50'} rounded-2xl border shadow-xl p-6 transform hover:scale-105 transition-all duration-300 animate-slide-in-right`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${
                    stat.color === 'blue' ? 'from-blue-500 to-blue-600' :
                    stat.color === 'red' ? 'from-red-500 to-red-600' :
                    stat.color === 'green' ? 'from-green-500 to-green-600' :
                    'from-purple-500 to-purple-600'
                  } flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`flex items-center text-sm font-medium ${
                    stat.trendUp 
                      ? 'text-green-500' 
                      : 'text-red-500'
                  }`}>
                    {stat.trendUp ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                    {stat.trend}
                  </div>
                </div>
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>{stat.title}</p>
                  <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Based on Active View */}
          {activeView === 'overview' && (
            <div className="space-y-8">
              {/* Charts Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Enhanced Category Distribution */}
                <div className={`xl:col-span-1 backdrop-blur-sm ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/70 border-white/50'} rounded-2xl border shadow-xl p-8 animate-fade-in`}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
                      <PieChartIcon className="w-5 h-5 mr-2 text-blue-500" />
                      Category Split
                    </h3>
                    <Award className="w-5 h-5 text-yellow-500" />
                  </div>
                  
                  {categoryData.length > 0 ? (
                    <div className="space-y-6">
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={100}
                            dataKey="value"
                            label={false} // Remove default labels to prevent truncation
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value, name) => [value, categoryData.find(d => d.name === name)?.fullName || name]}
                            contentStyle={{
                              backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                              border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                              borderRadius: '12px',
                              color: darkMode ? '#ffffff' : '#000000'
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      
                      {/* Custom Legend */}
                      <div className="space-y-3">
                        {categoryData.map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div 
                                className="w-3 h-3 rounded-full mr-3" 
                                style={{ backgroundColor: item.color }}
                              />
                              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {item.fullName}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {item.value}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                                {item.percentage}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center">
                      <div className="text-center">
                        <PieChartIcon className={`w-12 h-12 ${darkMode ? 'text-gray-600' : 'text-gray-400'} mx-auto mb-3`} />
                        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No data available</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Enhanced Urgency Distribution */}
                <div className={`xl:col-span-1 backdrop-blur-sm ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/70 border-white/50'} rounded-2xl border shadow-xl p-8 animate-fade-in`}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
                      <Target className="w-5 h-5 mr-2 text-orange-500" />
                      Urgency Levels
                    </h3>
                    <Zap className="w-5 h-5 text-yellow-500" />
                  </div>
                  
                  {urgencyData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={urgencyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                        <XAxis 
                          dataKey="urgency" 
                          tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }}
                          axisLine={{ stroke: darkMode ? '#4b5563' : '#d1d5db' }}
                        />
                        <YAxis 
                          tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }}
                          axisLine={{ stroke: darkMode ? '#4b5563' : '#d1d5db' }}
                        />
                        <Tooltip 
                          labelFormatter={(label, payload) => {
                            const item = urgencyData.find(d => d.urgency === label);
                            return item ? item.label : label;
                          }}
                          contentStyle={{
                            backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                            border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                            borderRadius: '12px',
                            color: darkMode ? '#ffffff' : '#000000'
                          }}
                        />
                        <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-64 flex items-center justify-center">
                      <div className="text-center">
                        <Target className={`w-12 h-12 ${darkMode ? 'text-gray-600' : 'text-gray-400'} mx-auto mb-3`} />
                        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No data available</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className={`xl:col-span-1 backdrop-blur-sm ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/70 border-white/50'} rounded-2xl border shadow-xl p-8 animate-fade-in`}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
                      <Star className="w-5 h-5 mr-2 text-purple-500" />
                      Quick Actions
                    </h3>
                  </div>
                  
                  <div className="space-y-4">
                    <button className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${darkMode ? 'bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30' : 'bg-blue-50 hover:bg-blue-100 border border-blue-200'} group`}>
                      <div className="flex items-center">
                        <Eye className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'} mr-3`} />
                        <span className={`font-medium ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>View All Feedback</span>
                      </div>
                      <ArrowUpRight className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'} group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform`} />
                    </button>
                    
                    <button 
                      onClick={() => exportData('csv')}
                      className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${darkMode ? 'bg-green-600/20 hover:bg-green-600/30 border border-green-500/30' : 'bg-green-50 hover:bg-green-100 border border-green-200'} group`}
                    >
                      <div className="flex items-center">
                        <FileDown className={`w-5 h-5 ${darkMode ? 'text-green-400' : 'text-green-600'} mr-3`} />
                        <span className={`font-medium ${darkMode ? 'text-green-300' : 'text-green-700'}`}>Export Data</span>
                      </div>
                      <ArrowUpRight className={`w-4 h-4 ${darkMode ? 'text-green-400' : 'text-green-600'} group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform`} />
                    </button>
                    
                    <button className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${darkMode ? 'bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30' : 'bg-purple-50 hover:bg-purple-100 border border-purple-200'} group`}>
                      <div className="flex items-center">
                        <Calendar className={`w-5 h-5 ${darkMode ? 'text-purple-400' : 'text-purple-600'} mr-3`} />
                        <span className={`font-medium ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>Schedule Report</span>
                      </div>
                      <ArrowUpRight className={`w-4 h-4 ${darkMode ? 'text-purple-400' : 'text-purple-600'} group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform`} />
                    </button>
                  </div>
                  
                  {/* Top Categories */}
                  <div className="mt-8">
                    <h4 className={`text-sm font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4 uppercase tracking-wide`}>Top Categories</h4>
                    <div className="space-y-3">
                      {categoryData.slice(0, 3).map((item, index) => {
                        const IconComponent = categoryIcons[item.fullName as keyof typeof categoryIcons];
                        return (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3`} style={{ backgroundColor: `${item.color}20` }}>
                                <IconComponent className="w-4 h-4" style={{ color: item.color }} />
                              </div>
                              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{item.name}</span>
                            </div>
                            <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.value}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeView === 'trends' && (
            <div className="space-y-8">
              {/* Daily Trend Chart */}
              {trendData.length > 0 && (
                <div className={`backdrop-blur-sm ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/70 border-white/50'} rounded-2xl border shadow-xl p-8 animate-fade-in`}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
                      <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                      Feedback Trends Over Time
                    </h3>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Daily Count</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Moving Average</span>
                      </div>
                    </div>
                  </div>
                  
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }}
                        axisLine={{ stroke: darkMode ? '#4b5563' : '#d1d5db' }}
                      />
                      <YAxis 
                        tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }}
                        axisLine={{ stroke: darkMode ? '#4b5563' : '#d1d5db' }}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                          border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                          borderRadius: '12px',
                          color: darkMode ? '#ffffff' : '#000000'
                        }}
                      />
                      <Area type="monotone" dataKey="count" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCount)" strokeWidth={3} />
                      <Line type="monotone" dataKey="avgCount" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Performance Metrics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className={`backdrop-blur-sm ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/70 border-white/50'} rounded-2xl border shadow-xl p-8 animate-fade-in`}>
                  <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6 flex items-center`}>
                    <Activity className="w-5 h-5 mr-2 text-blue-500" />
                    Processing Performance
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Average Response Time</span>
                      <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{processingTime}ms</span>
                    </div>
                    <div className={`h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden`}>
                      <div className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Fastest</p>
                        <p className={`text-lg font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>850ms</p>
                      </div>
                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Slowest</p>
                        <p className={`text-lg font-bold ${darkMode ? 'text-red-400' : 'text-red-600'}`}>3.2s</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`backdrop-blur-sm ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/70 border-white/50'} rounded-2xl border shadow-xl p-8 animate-fade-in`}>
                  <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6 flex items-center`}>
                    <Users className="w-5 h-5 mr-2 text-purple-500" />
                    User Engagement
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Peak Hour</span>
                      <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>2-3 PM</span>
                    </div>
                    
                    <div className="space-y-3">
                      {['Morning', 'Afternoon', 'Evening', 'Night'].map((time, index) => (
                        <div key={time} className="flex items-center justify-between">
                          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{time}</span>
                          <div className="flex items-center space-x-2">
                            <div className={`h-2 w-20 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden`}>
                              <div 
                                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" 
                                style={{ width: `${[65, 85, 45, 25][index]}%` }}
                              ></div>
                            </div>
                            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              {[65, 85, 45, 25][index]}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeView === 'details' && (
            <div className="space-y-8">
              {/* Search and Filter */}
              <div className={`backdrop-blur-sm ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/70 border-white/50'} rounded-2xl border shadow-xl p-8 animate-fade-in`}>
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'} w-5 h-5`} />
                      <input
                        type="text"
                        placeholder="Search feedback..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-colors ${
                          darkMode 
                            ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400' 
                            : 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                        } focus:ring-2 focus:ring-blue-400/20 focus:outline-none`}
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleSearch}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                  >
                    Search
                  </button>
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setSelectedCategory('');
                      loadDashboardData();
                    }}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      selectedCategory === ''
                        ? 'bg-blue-600 text-white'
                        : darkMode
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All Categories
                  </button>
                  {Object.keys(categoryColors).map((category) => {
                    const IconComponent = categoryIcons[category as keyof typeof categoryIcons];
                    return (
                      <button
                        key={category}
                        onClick={() => filterByCategory(category)}
                        className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                          selectedCategory === category
                            ? 'text-white'
                            : darkMode
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        style={{
                          backgroundColor: selectedCategory === category ? categoryColors[category as keyof typeof categoryColors] : undefined
                        }}
                      >
                        <IconComponent className="w-4 h-4 mr-2" />
                        {category === 'Feature Request' ? 'Features' : category.split('/')[0]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Feedback History */}
              <div className={`backdrop-blur-sm ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/70 border-white/50'} rounded-2xl border shadow-xl animate-fade-in`}>
                <div className="p-6 border-b border-gray-200/50">
                  <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
                    <MessageSquare className="w-5 h-5 mr-2 text-blue-500" />
                    Recent Feedback
                    <span className={`ml-3 px-3 py-1 rounded-full text-sm font-medium ${darkMode ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                      {feedbackHistory.length}
                    </span>
                  </h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {feedbackHistory.length > 0 ? (
                    <div className="divide-y divide-gray-200/50">
                      {feedbackHistory.map((item, index) => (
                        <div 
                          key={item.id} 
                          className={`p-6 hover:${darkMode ? 'bg-gray-700/30' : 'bg-gray-50/50'} transition-colors animate-slide-in-right`}
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <p className={`${darkMode ? 'text-gray-200' : 'text-gray-900'} mb-3 leading-relaxed`}>
                                {item.feedback_text}
                              </p>
                              <div className="flex items-center space-x-4 text-sm">
                                <div className="flex items-center">
                                  <span
                                    className="w-2 h-2 rounded-full mr-2"
                                    style={{ backgroundColor: categoryColors[item.category as keyof typeof categoryColors] }}
                                  />
                                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{item.category}</span>
                                </div>
                                <div className="flex items-center">
                                  <Target className="w-3 h-3 mr-1 text-orange-500" />
                                  <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Urgency: {item.urgency_score}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <Clock className="w-3 h-3 mr-1 text-blue-500" />
                                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                                    {format(new Date(item.created_at), 'MMM dd, yyyy HH:mm')}
                                  </span>
                                </div>
                                {item.processing_time_ms && (
                                  <div className="flex items-center">
                                    <Activity className="w-3 h-3 mr-1 text-green-500" />
                                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                                      {Math.round(item.processing_time_ms)}ms
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div
                                className="px-3 py-1 rounded-full text-xs font-medium text-white shadow-lg"
                                style={{ backgroundColor: urgencyColors[item.urgency_score - 1] || '#6b7280' }}
                              >
                                {getUrgencyLabel(item.urgency_score)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 text-center">
                      <MessageSquare className={`w-12 h-12 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                      <p className={`text-lg font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>No feedback found</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {selectedCategory ? 'Try selecting a different category' : 'Submit some feedback to see analytics'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;