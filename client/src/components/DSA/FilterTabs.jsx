import React from "react";

const FilterTabs = ({ 
  filter, 
  setFilter, 
  difficultyFilter, 
  setSearchQuery, 
  setDifficultyFilter, 
  darkMode 
}) => {
  const tabs = ["All", "Solved", "Bookmarked", "Reminders"];

  return (
    <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 p-4 md:p-6 rounded-xl shadow-sm ${
      darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
    }`}>
      {/* Filter Tabsdfss */}
      <div className="flex flex-wrap justify-center items-center gap-2 md:gap-6 px-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            data-filter-button
            onClick={() => {
              setFilter(tab);
              setSearchQuery(''); // Clear search when changing tabs
            }}
            className={`px-2.5 py-1 md:px-1 md:py-1 text-xs md:text-sm font-medium rounded-full border-2 transition-all duration-200 transform hover:scale-105 ${
              tab === filter
                ? "bg-indigo-600 text-white border-indigo-600 shadow-lg scale-105 dark:bg-indigo-700 dark:border-indigo-800"
                : "bg-transparent text-gray-700 border-gray-300 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 dark:bg-transparent dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Difficulty Dropdown */}
      <div className="flex items-center gap-3 self-center">
        <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Difficulty:
        </label>
        <div className="relative">
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className={`appearance-none px-4 py-2 md:px-5 md:py-2.5 pr-10 text-sm md:text-base font-medium rounded-xl border-2 transition-all duration-200 cursor-pointer hover:scale-105 ${
              darkMode 
                ? "bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600 hover:border-gray-500 focus:bg-gray-600 focus:border-indigo-500"
                : "bg-white text-gray-900 border-gray-300 hover:bg-gray-50 hover:border-indigo-300 focus:bg-white focus:border-indigo-500"
            } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm`}
          >
            <option value="All">All Levels</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
            <svg 
              className={`fill-current h-4 w-4 transition-colors ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`} 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterTabs;