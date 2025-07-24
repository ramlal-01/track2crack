import React, { useState } from "react";
import { FaBolt } from "react-icons/fa";

const RevisionHeader = ({ onSnoozeAll }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <div className="bg-gradient-to-r from-indigo-20 via-indigo-100 to-white dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 border-gray-200 dark:border-gray-700 rounded-xl shadow-md dark:shadow-lg px-6 py-4 mb-6 flex justify-between items-center transition-colors duration-200">
      {/* Heading */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 leading-tight tracking-wide">
          Revision <span className="text-indigo-600 dark:text-indigo-400">Planner</span>
        </h1>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 relative">
        <button className="px-4 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700 text-sm font-semibold hover:bg-blue-200 dark:hover:bg-blue-800 transition">
          📅 Today
        </button>

        <button className="px-4 py-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-700 text-sm font-semibold hover:bg-purple-200 dark:hover:bg-purple-800 transition">
          📊 Stats
        </button>

        <div className="relative">
          <button
            onClick={() => setShowActions((prev) => !prev)}
            className="px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-sm font-semibold flex items-center gap-1 hover:bg-emerald-200 dark:hover:bg-emerald-800 transition"
          >
            <FaBolt className="text-sm" />
            Quick
          </button>

          {showActions && (
            <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg dark:shadow-xl z-50">
              <button
                onClick={() => {
                  setShowActions(false);
                  onSnoozeAll();
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition text-gray-800 dark:text-gray-200"
              >
                ⏸ Snooze All
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RevisionHeader;