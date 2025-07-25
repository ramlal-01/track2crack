import React, { useEffect, useState } from "react";
import {
  FaBookReader,
  FaFilter,
  FaChartLine,
  FaSmile,
  FaMeh,
  FaFrown,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API from '../api/api';
import { useTheme } from "../context/ThemeContext";

const MainHistory = () => {
  const [history, setHistory] = useState([]);
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [performanceFilter, setPerformanceFilter] = useState("All");
  const [dateSort, setDateSort] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const { theme } = useTheme();
  const darkMode = theme === "dark";

  // Dark mode classes
  const darkBg = "dark:bg-gray-900 dark:text-white";
  const darkCardBg = "dark:bg-gray-800";
  const darkBorder = "dark:border-gray-700";
  const darkText = "dark:text-gray-200";
  const darkInput = "dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white";
  const darkHover = "dark:hover:bg-gray-700";

  const token = localStorage.getItem("token");
  const allSubjects = ["All", "Java", "OOPS", "DSA", "CN", "DBMS", "OS"];

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get("/quiz/history");
        setHistory(res.data.quizzes || []);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to fetch quiz history");
      }
    };
    if (token) fetchHistory();
  }, [token]);

  const getPerformanceLevel = (quiz) => {
    const pct = (quiz.score / quiz.totalQuestions) * 100;
    if (pct >= 80) return "Excellent";
    if (pct >= 50) return "Good";
    return "Needs Work";
  };

  const perfIcons = {
    Excellent: <FaSmile className="text-green-500 dark:text-green-400" />,
    Good: <FaMeh className="text-yellow-500 dark:text-yellow-400" />,
    "Needs Work": <FaFrown className="text-pink-500 dark:text-pink-400" />,
  };

  const perfColors = {
    Excellent: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800",
    Good: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-800",
    "Needs Work": "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/50 dark:text-pink-300 dark:border-pink-800",
    All: "bg-white text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600",
  };

  let results = history.filter((quiz) => {
    const perf = getPerformanceLevel(quiz);
    return (
      (subjectFilter === "All" || quiz.subject === subjectFilter) &&
      (performanceFilter === "All" || perf === performanceFilter) &&
      (searchQuery === "" ||
        quiz.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quiz.topicsCovered?.join(", ").toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  results.sort((a, b) => {
    return dateSort === "newest"
      ? new Date(b.takenAt) - new Date(a.takenAt)
      : new Date(a.takenAt) - new Date(b.takenAt);
  });

  const formatDate = (d) => {
    const dt = new Date(d);
    return isNaN(dt)
      ? "Invalid Date"
      : dt.toLocaleDateString("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
  };

  const clearFilters = () => {
    setSubjectFilter("All");
    setPerformanceFilter("All");
    setDateSort("newest");
    setSearchQuery("");
  };

  const summary = {
    total: results.length,
    Excellent: results.filter((q) => getPerformanceLevel(q) === "Excellent").length,
    Good: results.filter((q) => getPerformanceLevel(q) === "Good").length,
    "Needs Work": results.filter((q) => getPerformanceLevel(q) === "Needs Work").length,
  };

  return (
    <div className={`min-h-screen px-6 py-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 ${darkBg}`}>
      <ToastContainer position="top-center" theme={darkMode ? "dark" : "light"} />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <FaBookReader className="text-5xl text-indigo-400 dark:text-indigo-500" />
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-pink-400">
              My Quiz Journey
            </h2>
            <p className="text-sm text-indigo-400 dark:text-indigo-300">Track your learning progress</p>
          </div>
        </div>
        <div className={`flex items-center gap-4 bg-white rounded-xl px-5 py-3 shadow-lg border border-purple-100 ${darkCardBg} ${darkBorder} dark:border-purple-900`}>
          <div className="flex flex-col items-center">
            <div className="text-xs font-medium text-indigo-400 dark:text-indigo-300">Showing</div>
            <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
              {results.length}/{history.length}
            </div>
          </div>
          <div className={`flex items-center gap-2 ${perfColors.Excellent} px-3 py-1 rounded-lg`}>
            {perfIcons.Excellent}
            <span className="text-sm font-medium text-green-600 dark:text-green-400">{summary.Excellent}</span>
          </div>
          <div className={`flex items-center gap-2 ${perfColors.Good} px-3 py-1 rounded-lg`}>
            {perfIcons.Good}
            <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">{summary.Good}</span>
          </div>
          <div className={`flex items-center gap-2 ${perfColors["Needs Work"]} px-3 py-1 rounded-lg`}>
            {perfIcons["Needs Work"]}
            <span className="text-sm font-medium text-pink-600 dark:text-pink-400">{summary["Needs Work"]}</span>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="mb-8">
        {/* Top Row - Clear Filter Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={clearFilters}
            className={`flex items-center gap-2 bg-gradient-to-r from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200 text-pink-700 px-4 py-2 rounded-lg border border-pink-200 shadow-sm hover:shadow-md transition dark:from-pink-900/50 dark:to-purple-900/50 dark:text-pink-300 dark:border-pink-800 dark:hover:from-pink-800 dark:hover:to-purple-800`}
          >
            <FaTimes /> Clear All Filters
          </button>
        </div>

        {/* Filter Row */}
        <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl shadow-md border border-amber-400 ${darkCardBg} ${darkBorder} dark:border-amber-600`}>
          <div>
            <label className={`block text-xs font-medium text-pink-400 mb-1 dark:text-pink-300`}>Subject</label>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className={`w-full rounded-lg border border-pink-200 px-3 py-2 shadow-sm hover:shadow-md transition bg-gradient-to-r from-pink-50 to-purple-50 text-purple-700 ${darkInput} dark:from-pink-900/30 dark:to-purple-900/30 dark:text-purple-300 dark:border-pink-800`}
            >
              {allSubjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={`block text-xs font-medium text-pink-400 mb-1 dark:text-pink-300`}>Performance</label>
            <select
              value={performanceFilter}
              onChange={(e) => setPerformanceFilter(e.target.value)}
              className={`w-full rounded-lg border border-pink-200 px-3 py-2 shadow-sm hover:shadow-md transition bg-gradient-to-r from-pink-50 to-purple-50 text-purple-700 ${darkInput} dark:from-pink-900/30 dark:to-purple-900/30 dark:text-purple-300 dark:border-pink-800`}
            >
              {["All", "Excellent", "Good", "Needs Work"].map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={`block text-xs font-medium text-pink-400 mb-1 dark:text-pink-300`}>Sort By</label>
            <select
              value={dateSort}
              onChange={(e) => setDateSort(e.target.value)}
              className={`w-full rounded-lg border border-pink-200 px-3 py-2 shadow-sm hover:shadow-md transition bg-gradient-to-r from-pink-50 to-purple-50 text-purple-700 ${darkInput} dark:from-pink-900/30 dark:to-purple-900/30 dark:text-purple-300 dark:border-pink-800`}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
          <div className="relative">
            <label className={`block text-xs font-medium text-pink-400 mb-1 dark:text-pink-300`}>Search</label>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              placeholder="Search quizzes..."
              className={`w-full rounded-lg border border-pink-200 px-3 py-2 pl-10 shadow-sm hover:shadow-md focus:outline-none transition bg-gradient-to-r from-pink-50 to-purple-50 text-purple-700 ${darkInput} dark:from-pink-900/30 dark:to-purple-900/30 dark:text-purple-300 dark:border-pink-800`}
            />
            <FaSearch className="absolute left-3 top-8 text-purple-400 dark:text-purple-300" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className={`bg-white rounded-xl shadow-lg overflow-hidden border border-purple-100 ${darkCardBg} ${darkBorder} dark:border-purple-900`}>
        <table className="min-w-full text-sm">
          <thead className={`bg-gradient-to-r from-indigo-300 to-pink-300 dark:from-indigo-700 dark:to-pink-700`}>
            <tr>
              {["#", "Subject", "Topics", "Score", "Date", "Performance"].map((h) => (
                <th
                  key={h}
                  className="px-6 py-4 text-left font-semibold text-white"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-50 dark:divide-gray-700">
            {results.length > 0 ? (
              results.map((quiz, i) => {
                const perf = getPerformanceLevel(quiz);
                const bgHover =
                  perf === "Excellent"
                    ? "hover:bg-green-50 dark:hover:bg-green-900/30"
                    : perf === "Good"
                    ? "hover:bg-yellow-50 dark:hover:bg-yellow-900/30"
                    : "hover:bg-pink-50 dark:hover:bg-pink-900/30";
                return (
                  <tr key={i} className={`${bgHover} transition-all`}>
                    <td className="px-6 py-4 font-medium text-indigo-700 dark:text-indigo-300">{i + 1}</td>
                    <td className="px-6 py-4 text-blue-500 font-medium dark:text-blue-400">
                      {quiz.subject}
                    </td>
                    <td className="px-6 py-4 text-indigo-600 max-w-xs truncate dark:text-indigo-300">
                      {quiz.topicsCovered?.join(", ") || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300`}>
                        {quiz.score}/{quiz.totalQuestions}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-indigo-500 dark:text-indigo-400">
                      {formatDate(quiz.takenAt)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${perfColors[perf]}`}
                      >
                        {perfIcons[perf]}
                        {perf}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center px-6 py-16 text-gray-500 dark:text-gray-400"
                >
                  <div className="flex flex-col items-center gap-3">
                    <FaChartLine className="text-5xl text-indigo-200 dark:text-indigo-700" />
                    <p className="text-xl font-semibold text-indigo-500 dark:text-indigo-400">
                      No quizzes found
                    </p>
                    <p className="text-sm text-indigo-400 dark:text-indigo-300">
                      Try adjusting filters or take some quizzes
                    </p>
                    <button
                      onClick={clearFilters}
                      className={`mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200 text-pink-700 px-4 py-2 rounded-lg border border-pink-200 shadow-sm hover:shadow-md transition dark:from-pink-900/50 dark:to-purple-900/50 dark:text-pink-300 dark:border-pink-800 dark:hover:from-pink-800 dark:hover:to-purple-800`}
                    >
                      <FaTimes /> Clear All Filters
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MainHistory;