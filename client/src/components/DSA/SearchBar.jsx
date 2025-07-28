import React from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({ searchQuery, setSearchQuery, darkMode, darkInput }) => {
  return (
    <div className="mb-8">
      <div className="relative max-w-lg mx-auto">
        <FaSearch className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-lg ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`} />
        <input
          type="text"
          placeholder="Search questions by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full pl-12 pr-12 py-3 md:py-4 text-base border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm hover:shadow-md ${
            darkMode 
              ? 'bg-gray-800 border-gray-600 placeholder-gray-400 text-white focus:bg-gray-700' 
              : 'bg-white border-gray-300 placeholder-gray-500 text-gray-900 focus:bg-gray-50'
          }`}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className={`absolute right-4 top-1/2 transform -translate-y-1/2 text-xl hover:scale-110 transition-all duration-200 ${
              darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
            }`}
            title="Clear search"
          >
            ×
          </button>
        )}
      </div>
      {searchQuery && (
        <div className="text-center mt-2">
          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Searching for: <span className="font-semibold text-indigo-600 dark:text-indigo-400">"{searchQuery}"</span>
          </span>
        </div>
      )}
    </div>
  );
};

export default SearchBar;