import React from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({ searchQuery, setSearchQuery, darkMode, darkInput }) => {
  return (
    <div className="mb-6">
      <div className="relative max-w-md mx-auto">
        <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`} />
        <input
          type="text"
          placeholder="Search questions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full pl-10 pr-4 py-2 md:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${darkInput}`}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
              darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
            } transition-colors`}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;