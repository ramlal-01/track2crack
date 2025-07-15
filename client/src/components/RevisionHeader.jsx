import React, { useState } from "react";
import { FaBolt } from "react-icons/fa";

const RevisionHeader = ({ onSnoozeAll }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <div className="bg-gradient-to-r from-indigo-20 via-indigo-100 to-white border-gray-200 rounded-xl shadow-md px-6 py-4 mb-6 flex justify-between items-center">
      {/* Heading */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 leading-tight tracking-wide">
          Revision <span className="text-indigo-600">Planner</span>
        </h1>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 relative">
        <button className="px-4 py-1.5 rounded-lg bg-blue-100 text-blue-700 border border-blue-300 text-sm font-semibold hover:bg-blue-200 transition">
          📅 Today
        </button>

        <button className="px-4 py-1.5 rounded-lg bg-purple-100 text-purple-700 border border-purple-300 text-sm font-semibold hover:bg-purple-200 transition">
          📊 Stats
        </button>

        <div className="relative">
          <button
            onClick={() => setShowActions((prev) => !prev)}
            className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-300 text-sm font-semibold flex items-center gap-1 hover:bg-emerald-200 transition"
          >
            <FaBolt className="text-sm" />
            Quick
          </button>

          {showActions && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <button
                onClick={() => {
                  setShowActions(false);
                  onSnoozeAll();
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-emerald-50 transition"
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
