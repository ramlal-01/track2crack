import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { 
  FiBook, 
  FiCalendar, 
  FiAward, 
  FiTrendingUp, 
  FiClock,
  FiFilter,
  FiChevronDown,
  FiX,
  FiSearch,
  FiBarChart2
} from "react-icons/fi";

const MainHistory = () => {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [performanceFilter, setPerformanceFilter] = useState("All");
  const [dateSort, setDateSort] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const token = localStorage.getItem("token");

  // Get unique subjects for filter dropdown
  const subjects = ["All", ...new Set(history.map(quiz => quiz.subject))];

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/quiz/history", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setHistory(data.quizzes);
          setFilteredHistory(data.quizzes);
        } else {
          toast.error(data.message || "Failed to fetch history");
        }
      } catch (error) {
        toast.error("Error loading quiz history");
      }
    };

    if (token) fetchHistory();
  }, [token]);

  // Apply filters whenever filters change
  useEffect(() => {
    let results = [...history];
    
    // Apply subject filter
    if (subjectFilter !== "All") {
      results = results.filter(quiz => quiz.subject === subjectFilter);
    }
    
    // Apply performance filter
    if (performanceFilter !== "All") {
      results = results.filter(quiz => {
        const percentage = (quiz.score / quiz.totalQuestions) * 100;
        if (performanceFilter === "Excellent") return percentage >= 80;
        if (performanceFilter === "Good") return percentage >= 60 && percentage < 80;
        return percentage < 60;
      });
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(quiz => 
        quiz.subject.toLowerCase().includes(query) ||
        quiz.source.toLowerCase().includes(query) ||
        (quiz.topicsCovered?.join(", ")?.toLowerCase().includes(query) ?? false)
      );
    }
    
    // Apply date sorting
    results.sort((a, b) => {
      const dateA = new Date(a.takenAt);
      const dateB = new Date(b.takenAt);
      return dateSort === "newest" ? dateB - dateA : dateA - dateB;
    });
    
    setFilteredHistory(results);
  }, [history, subjectFilter, performanceFilter, dateSort, searchQuery]);

  const getPerformanceBadge = (score, total) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80)
      return (
        <span className="bg-gradient-to-r from-green-100 to-green-50 text-green-800 text-xs font-semibold px-3 py-1 rounded-full flex items-center border border-green-200">
          <FiTrendingUp className="mr-1" /> Excellent
        </span>
      );
    if (percentage >= 60)
      return (
        <span className="bg-gradient-to-r from-amber-100 to-amber-50 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full flex items-center border border-amber-200">
          <FiAward className="mr-1" /> Good
        </span>
      );
    return (
      <span className="bg-gradient-to-r from-red-100 to-red-50 text-red-800 text-xs font-semibold px-3 py-1 rounded-full flex items-center border border-red-200">
        <FiClock className="mr-1" /> Needs Practice
      </span>
    );
  };

  const clearFilters = () => {
    setSubjectFilter("All");
    setPerformanceFilter("All");
    setDateSort("newest");
    setSearchQuery("");
  };

  // Calculate performance statistics
  const performanceStats = filteredHistory.reduce((acc, quiz) => {
    const percentage = (quiz.score / quiz.totalQuestions) * 100;
    if (percentage >= 80) acc.excellent++;
    else if (percentage >= 60) acc.good++;
    else acc.needsPractice++;
    return acc;
  }, { excellent: 0, good: 0, needsPractice: 0 });

  return (
    <div className="min-h-screen px-4 py-8 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 flex items-center">
              <FiBook className="mr-3" /> Quiz History
            </h1>
            <p className="text-purple-600/80">Track your learning progress and performance</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-white px-4 py-2 rounded-xl shadow-sm text-purple-600 font-medium border border-purple-100 flex items-center">
              <FiBarChart2 className="mr-2" />
              <span>Attempts: {filteredHistory.length}</span>
            </div>
            
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              <FiFilter /> Filters
              <FiChevronDown className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-purple-100 bg-gradient-to-br from-white to-purple-50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h3 className="text-lg font-semibold text-purple-800 flex items-center">
                <FiFilter className="mr-2" /> Filter Options
              </h3>
              <button 
                onClick={clearFilters}
                className="text-sm text-purple-600 hover:text-purple-800 flex items-center transition-colors"
              >
                <FiX className="mr-1" /> Clear all filters
              </button>
            </div>
            
            {/* Search Bar */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-purple-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search quizzes..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white shadow-sm"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-purple-700 mb-2">Subject</label>
                <div className="relative">
                  <select
                    value={subjectFilter}
                    onChange={(e) => setSubjectFilter(e.target.value)}
                    className="appearance-none w-full rounded-xl border-purple-200 shadow-sm focus:border-purple-500 focus:ring-purple-500 bg-white px-4 py-2 border pr-8 bg-gradient-to-b from-white to-purple-50"
                  >
                    {subjects.map((subject, index) => (
                      <option key={index} value={subject}>{subject}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <FiChevronDown className="text-purple-400" />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-purple-700 mb-2">Performance</label>
                <div className="relative">
                  <select
                    value={performanceFilter}
                    onChange={(e) => setPerformanceFilter(e.target.value)}
                    className="appearance-none w-full rounded-xl border-purple-200 shadow-sm focus:border-purple-500 focus:ring-purple-500 bg-white px-4 py-2 border pr-8 bg-gradient-to-b from-white to-purple-50"
                  >
                    <option value="All">All Performances</option>
                    <option value="Excellent">Excellent (80%+)</option>
                    <option value="Good">Good (60-79%)</option>
                    <option value="Needs Practice">Needs Practice (&lt;60%)</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <FiChevronDown className="text-purple-400" />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-purple-700 mb-2">Sort By Date</label>
                <div className="relative">
                  <select
                    value={dateSort}
                    onChange={(e) => setDateSort(e.target.value)}
                    className="appearance-none w-full rounded-xl border-purple-200 shadow-sm focus:border-purple-500 focus:ring-purple-500 bg-white px-4 py-2 border pr-8 bg-gradient-to-b from-white to-purple-50"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <FiChevronDown className="text-purple-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Performance Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-green-800 font-medium">Excellent</h3>
              <span className="text-green-600 font-bold text-xl">{performanceStats.excellent}</span>
            </div>
            <div className="mt-2 h-2 bg-green-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500" 
                style={{ width: `${(performanceStats.excellent / filteredHistory.length) * 100 || 0}%` }}
              ></div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-amber-800 font-medium">Good</h3>
              <span className="text-amber-600 font-bold text-xl">{performanceStats.good}</span>
            </div>
            <div className="mt-2 h-2 bg-amber-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-500" 
                style={{ width: `${(performanceStats.good / filteredHistory.length) * 100 || 0}%` }}
              ></div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-red-800 font-medium">Needs Practice</h3>
              <span className="text-red-600 font-bold text-xl">{performanceStats.needsPractice}</span>
            </div>
            <div className="mt-2 h-2 bg-red-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-red-500" 
                style={{ width: `${(performanceStats.needsPractice / filteredHistory.length) * 100 || 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-purple-100">
            <div className="text-purple-200 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-medium text-purple-800 mb-2">
              {history.length === 0 ? 'No quiz attempts yet' : 'No results match your filters'}
            </h3>
            <p className="text-purple-600/80">
              {history.length === 0 
                ? 'Complete some quizzes to see your history here.' 
                : 'Try adjusting your filters or search query.'}
            </p>
            {history.length > 0 && (
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all shadow-md"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-purple-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                    <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                      <div className="flex items-center">
                        <FiBook className="mr-2" /> Subject
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                      Topics
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                      <div className="flex items-center">
                        <FiCalendar className="mr-2" /> Date
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                      Performance
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-100">
                  {filteredHistory.map((quiz, index) => (
                    <tr 
                      key={index} 
                      className={`transition-colors hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-purple-50'
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-purple-900">
                        {quiz.subject}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-blue-800">
                        {quiz.source}
                      </td>
                      <td className="px-6 py-4 text-purple-800 max-w-xs truncate hover:max-w-none hover:whitespace-normal">
                        {quiz.topicsCovered?.join(", ") || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-purple-700">
                        {new Date(quiz.takenAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          quiz.score / quiz.totalQuestions >= 0.8 
                            ? 'bg-green-100 text-green-800 border border-green-200' 
                            : quiz.score / quiz.totalQuestions >= 0.6 
                              ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                              : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                          {quiz.score}/{quiz.totalQuestions}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getPerformanceBadge(quiz.score, quiz.totalQuestions)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainHistory;