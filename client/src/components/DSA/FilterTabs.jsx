import React from "react";

const FilterTabs = ({ 
  filter, 
  setFilter, 
  difficultyFilter, 
  setDifficultyFilter, 
  setSearchQuery, 
  darkMode 
}) => {
  const tabs = ["All", "Solved", "Bookmarked", "Reminders"];

  return (
    <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 p-4 rounded-lg ${
      darkMode ? 'bg-gray-800' : 'bg-gray-100'
    }`}>
      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 md:gap-3">
        {tabs.map((tab) => (
          <button
            key={tab}
            data-filter-button
            onClick={() => {
              setFilter(tab);
              setSearchQuery(''); // Clear search when changing tabs
            }}
            className={`px-3 py-1.5 md:px-4 text-sm md:text-lg rounded-full border transition-all duration-200 ${
              tab === filter
                ? "bg-indigo-600 text-white border-indigo-600 shadow-md scale-105 dark:bg-indigo-700 dark:border-indigo-800"
                : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-purple-50 hover:border-purple-400 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Difficulty Dropdown */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className={`appearance-none px-3 py-1.5 md:px-4 pr-8 text-sm md:text-lg rounded-full border transition-all duration-200 ${
              darkMode 
                ? "bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600 hover:border-gray-500"
                : "bg-white text-gray-900 border-gray-400 hover:bg-purple-50 hover:border-purple-400"
            } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          >
            <option value="All">All Levels</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterTabs;