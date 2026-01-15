import React, { useEffect, useState } from "react";
import { FaBookReader, FaFilter, FaChartLine, FaSmile, FaMeh, FaFrown } from "react-icons/fa";
import { toast } from "react-toastify";
import API from '../../api/api';
import { useTheme } from "../../context/ThemeContext";

const QuizHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [performanceFilter, setPerformanceFilter] = useState("All");
  const [subjectFromQuiz, setSubjectFromQuiz] = useState(null);
  const [sourceFromQuiz, setSourceFromQuiz] = useState(null);
  const token = localStorage.getItem("token");
  const { theme } = useTheme();
  const darkMode = theme === "dark";
// 
  // Dark mode color classes
  const darkBg = "dark:bg-gray-900 dark:text-white";
  const darkCardBg = "dark:bg-gray-800";
  const darkBorder = "dark:border-gray-700";
  const darkText = "dark:text-gray-200";
  const darkInput = "dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white";
  const darkHover = "dark:hover:bg-gray-700";

  useEffect(() => {
    if (!token) {
      toast.error("Please login to view quiz history");
      return;
    }

    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await API.get("/quiz/history");
        const data = res.data;
        
        const savedSubject = localStorage.getItem("viewHistoryFor");
        const savedSource = localStorage.getItem("viewHistorySource");
        if (savedSubject) setSubjectFromQuiz(savedSubject);
        if (savedSource) setSourceFromQuiz(savedSource);
        setHistory(data.quizzes || []);
      } catch (err) {
        toast.error(err.response?.data?.message || "Error fetching quiz history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [token]);

  const getPerformanceLevel = (quiz) => {
    const percentage = (quiz.score / quiz.totalQuestions) * 100;
    if (percentage >= 80) return "Excellent";
    if (percentage >= 50) return "Good";
    return "Needs Work";
  };

  const getRowBgColor = (performance) => {
    const baseColors = {
      Excellent: darkMode ? "hover:bg-green-900/20" : "hover:bg-green-50",
      Good: darkMode ? "hover:bg-yellow-900/20" : "hover:bg-yellow-50",
      "Needs Work": darkMode ? "hover:bg-pink-900/20" : "hover:bg-pink-50",
    };
    return baseColors[performance] || (darkMode ? "hover:bg-blue-900/20" : "hover:bg-blue-50");
  };

  const filteredHistory = history.filter((item) => {
    const performance = getPerformanceLevel(item);
    const matchPerf = performanceFilter === "All" || performance === performanceFilter;
    const matchSubj = !subjectFromQuiz || item.subject === subjectFromQuiz;
    return matchPerf && matchSubj;
  });

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return isNaN(date)
      ? "Invalid Date"
      : date.toLocaleDateString("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
  };

  const summary = {
    total: filteredHistory.length,
    Excellent: filteredHistory.filter((q) => getPerformanceLevel(q) === "Excellent").length,
    Good: filteredHistory.filter((q) => getPerformanceLevel(q) === "Good").length,
    "Needs Work": filteredHistory.filter((q) => getPerformanceLevel(q) === "Needs Work").length,
  };

  const perfColors = {
    Excellent: darkMode 
      ? "bg-green-900/30 text-green-300 border-green-700" 
      : "bg-green-100 text-green-800 border-green-200",
    Good: darkMode 
      ? "bg-yellow-900/30 text-yellow-300 border-yellow-700" 
      : "bg-yellow-100 text-yellow-800 border-yellow-200",
    "Needs Work": darkMode 
      ? "bg-pink-900/30 text-pink-300 border-pink-700" 
      : "bg-pink-100 text-pink-800 border-pink-200",
  };

  const perfIcons = {
    Excellent: <FaSmile className={darkMode ? "text-green-400" : "text-green-500"} />,
    Good: <FaMeh className={darkMode ? "text-yellow-400" : "text-yellow-500"} />,
    "Needs Work": <FaFrown className={darkMode ? "text-pink-400" : "text-pink-500"} />,
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkBg}`}>
        <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${darkMode ? "border-purple-400" : "border-purple-500"}`}></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen px-6 py-8 bg-gradient-to-br ${darkMode ? "from-gray-900 to-gray-800" : "from-blue-50 to-purple-50"} ${darkBg}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <FaBookReader className={`text-5xl ${darkMode ? "text-indigo-400" : "text-indigo-600"}`} />
          <h2 className={`text-2xl font-bold ${darkText}`}>My Quiz Journey</h2>
        </div>

        {/* Summary */}
        <div className={`flex items-center gap-4 rounded-xl px-5 py-3 shadow-lg border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-purple-100"}`}>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${darkText}`}>Total Attempts:</span>
            <span className={`text-lg font-bold ${darkMode ? "text-purple-400" : "text-purple-600"}`}>{summary.total}</span>
          </div>
          <div className="flex items-center gap-2">
            {perfIcons.Excellent}
            <span className={`text-sm font-medium ${darkMode ? "text-green-400" : "text-green-600"}`}>{summary.Excellent}</span>
          </div>
          <div className="flex items-center gap-2">
            {perfIcons.Good}
            <span className={`text-sm font-medium ${darkMode ? "text-yellow-400" : "text-yellow-600"}`}>{summary.Good}</span>
          </div>
          <div className="flex items-center gap-2">
            {perfIcons["Needs Work"]}
            <span className={`text-sm font-medium ${darkMode ? "text-pink-400" : "text-pink-600"}`}>{summary["Needs Work"]}</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={`mb-8 p-4 rounded-xl shadow border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-purple-100"}`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-2">
            <FaFilter className={darkMode ? "text-purple-400" : "text-purple-500"} />
            <span className={`text-sm font-medium ${darkText}`}>Filter Performance:</span>
          </div>

          <div className="w-full flex justify-start gap-2 flex-wrap">
            {["All", "Excellent", "Good", "Needs Work"].map((level) => (
              <button
                key={level}
                onClick={() => setPerformanceFilter(level)}
                className={`px-4 py-2 rounded-lg border font-medium text-sm transition-all duration-200 flex items-center gap-2
                  ${
                    performanceFilter === level
                      ? perfColors[level] || (darkMode 
                          ? "bg-purple-900/30 text-purple-300 border-purple-700 shadow-inner" 
                          : "bg-purple-100 text-purple-800 border-purple-300 shadow-inner")
                      : darkMode 
                        ? "bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600 hover:shadow-md"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:shadow-md"
                  }`}
              >
                {level !== "All" && perfIcons[level]}
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className={`rounded-xl shadow-lg overflow-hidden border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-purple-100"}`}>
        <table className="min-w-full text-sm">
          <thead className={`bg-gradient-to-r ${darkMode ? "from-purple-800 to-blue-800" : "from-purple-400 to-blue-400"}`}>
            <tr>
              {["#", "Subject", "Topics", "Score", "Date", "Performance"].map((head, i) => (
                <th 
                  key={i} 
                  className="px-6 py-4 text-left font-semibold text-white hover:text-purple-100 transition-colors"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`divide-y ${darkMode ? "divide-gray-700" : "divide-purple-50"}`}>
            {filteredHistory.length > 0 ? (
              filteredHistory.map((item, index) => {
                const performance = getPerformanceLevel(item);
                const rowStyle = getRowBgColor(performance);
                return (
                  <tr 
                    key={index} 
                    className={`${rowStyle} transition-all duration-150`}
                  >
                    <td className={`px-6 py-4 font-medium ${darkMode ? "text-gray-200" : "text-gray-900"}`}>{index + 1}</td>
                    <td className={`px-6 py-4 font-medium ${darkMode ? "text-blue-300" : "text-blue-600"}`}>{item.subject}</td>
                    <td className={`px-6 py-4 ${darkMode ? "text-gray-300" : "text-gray-600"} max-w-xs truncate`} title={item.topicsCovered?.join(", ")}>
                      {item.topicsCovered?.join(", ") || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${darkMode ? "bg-blue-900/30 text-blue-300" : "bg-blue-100 text-blue-800"}`}>
                        {item.score}/{item.totalQuestions}
                      </span>
                    </td>
                    <td className={`px-6 py-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{formatDate(item.takenAt)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${perfColors[performance]}`}>
                        {perfIcons[performance]}
                        {performance}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className={`text-center px-6 py-16 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  <div className="flex flex-col items-center gap-3">
                    <FaChartLine className={`text-5xl ${darkMode ? "text-purple-700" : "text-purple-200"}`} />
                    <p className={`text-xl font-semibold ${darkMode ? "text-purple-300" : "text-purple-800"}`}>No quizzes found</p>
                    <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Try adjusting your filters</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {subjectFromQuiz && sourceFromQuiz && (
          <div className="mt-10 text-center">
            <button
              onClick={() =>
                window.location.href = `/dashboard/${sourceFromQuiz}/${subjectFromQuiz.toLowerCase()}`
              }
              className={`px-6 py-3 font-medium rounded-lg shadow transition-all ${
                darkMode 
                  ? "bg-purple-700 hover:bg-purple-600 text-white" 
                  : "bg-purple-600 hover:bg-purple-700 text-white"
              }`}
            >
              ← Back to {sourceFromQuiz.toUpperCase()} / {subjectFromQuiz}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizHistory;