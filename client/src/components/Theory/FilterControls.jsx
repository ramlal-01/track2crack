import React from "react";
import { FaBookmark, FaBell, FaSearch } from "react-icons/fa";

const FilterControls = ({
  activeFilters,
  searchTerm,
  toggleFilter,
  setSearchTerm
}) => {
  const darkCardBg = "dark:bg-gray-800";
  const darkInput = "dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white";

  return (
    <div className={`bg-white p-5 rounded-xl shadow-md mb-8 ${darkCardBg}`}>
      {/* Mobile Layout */}
      <div className="lg:hidden">
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3 mb-4">
          {["All", "Important", "Other", "Bookmarked", "Remind"].map((type) => (
            <button
              key={type}
              onClick={() => toggleFilter(type)}
              className={`px-3 py-3 sm:px-4 sm:py-2 rounded-lg transition-all flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium ${
                activeFilters[type]
                  ? type === "Important"
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-200 dark:border-emerald-700 dark:hover:bg-emerald-900"
                    : type === "Other"
                    ? "bg-blue-100 text-blue-800 border border-blue-300 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-200 dark:border-blue-700 dark:hover:bg-blue-900"
                    : type === "Bookmarked"
                    ? "bg-purple-100 text-purple-800 border border-purple-300 hover:bg-purple-200 dark:bg-purple-900/50 dark:text-purple-200 dark:border-purple-700 dark:hover:bg-purple-900"
                    : type === "Remind"
                    ? "bg-cyan-100 text-cyan-800 border border-cyan-300 hover:bg-cyan-200 dark:bg-cyan-900/50 dark:text-cyan-200 dark:border-cyan-700 dark:hover:bg-cyan-900"
                    : "bg-indigo-100 text-indigo-800 border border-indigo-300 hover:bg-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-200 dark:border-indigo-700 dark:hover:bg-indigo-900"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
              }`}
            >
              {type === "Bookmarked" && (
                <FaBookmark className={`text-sm ${activeFilters[type] ? "text-purple-600 dark:text-purple-400" : "text-gray-500 dark:text-gray-400"}`} />
              )}
              {type === "Remind" && (
                <FaBell className={`text-sm ${activeFilters[type] ? "text-cyan-600 dark:text-cyan-400" : "text-gray-500 dark:text-gray-400"}`} />
              )}
              <span className="hidden sm:inline">
                {type === "Important" ? "Imp" : type === "Bookmarked" ? "Saved" : type}
              </span>
              <span className="sm:hidden">
                {type === "Important" ? "Imp" : type === "Bookmarked" ? "📌" : type === "Remind" ? "🔔" : type}
              </span>
            </button>
          ))}
        </div>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Search topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 sm:py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-gray-400 transition-colors ${darkInput}`}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex flex-wrap justify-between items-center gap-4">
        <div className="flex flex-wrap gap-2">
          {["All", "Important", "Other", "Bookmarked", "Remind"].map((type) => (
            <button
              key={type}
              onClick={() => toggleFilter(type)}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                activeFilters[type]
                  ? type === "Important"
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-200 dark:border-emerald-700 dark:hover:bg-emerald-900"
                    : type === "Other"
                    ? "bg-blue-100 text-blue-800 border border-blue-300 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-200 dark:border-blue-700 dark:hover:bg-blue-900"
                    : type === "Bookmarked"
                    ? "bg-purple-100 text-purple-800 border border-purple-300 hover:bg-purple-200 dark:bg-purple-900/50 dark:text-purple-200 dark:border-purple-700 dark:hover:bg-purple-900"
                    : type === "Remind"
                    ? "bg-cyan-100 text-cyan-800 border border-cyan-300 hover:bg-cyan-200 dark:bg-cyan-900/50 dark:text-cyan-200 dark:border-cyan-700 dark:hover:bg-cyan-900"
                    : "bg-indigo-100 text-indigo-800 border border-indigo-300 hover:bg-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-200 dark:border-indigo-700 dark:hover:bg-indigo-900"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
              }`}
            >
              {type === "Bookmarked" && (
                <FaBookmark className={activeFilters[type] ? "text-purple-600 dark:text-purple-400" : "text-gray-500 dark:text-gray-400"} />
              )}
              {type === "Remind" && (
                <FaBell className={activeFilters[type] ? "text-cyan-600 dark:text-cyan-400" : "text-gray-500 dark:text-gray-400"} />
              )}
              {type}
            </button>
          ))}
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-gray-400 transition-colors ${darkInput}`}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" />
        </div>
      </div>
    </div>
  );
};

export default FilterControls;