import React from "react";
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";

const ProgressCards = ({ 
  total, 
  completed, 
  bookmarked, 
  progressPercent, 
  quizCount, 
  darkMode 
}) => {
  const darkCardBg = "dark:bg-gray-800";
  const darkText = "dark:text-gray-200";
  const darkBorder = "dark:border-gray-700";

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-12 mb-6 lg:mb-10">
      {/* Total Topics Card */}
      <div className={`bg-white p-3 sm:p-4 rounded-xl min-h-[100px] shadow-md border-l-4 border-blue-500 transition-all duration-300 hover:shadow-lg hover:scale-[1.03] hover:border-blue-600 ${darkCardBg} ${darkBorder} dark:border-l-blue-500 dark:hover:border-l-blue-600`}>
        {/* Mobile Layout */}
        <div className="flex items-center justify-between lg:hidden">
          <div>
            <div className={`text-xl sm:text-2xl font-bold text-blue-800 ${darkText} dark:text-blue-300`}>{total}</div>
            <div className={`text-gray-600 text-sm sm:text-base ${darkText} dark:text-gray-300`}>Total</div>
          </div>
          <div className="flex items-center justify-center" style={{ width: 28, height: 28 }}>
            <div className={`bg-blue-100 p-1.5 rounded-full transition-all duration-300 group-hover:bg-blue-200 dark:bg-blue-900/50`}>
              <div className="w-3 h-3 bg-blue-500 rounded-full dark:bg-blue-400"></div>
            </div>
          </div>
        </div>
        
        {/* Desktop Layout */}
        <div className="hidden lg:flex justify-between items-center">
          <div>
            <div className={`text-2xl font-bold text-blue-800 ${darkText} dark:text-blue-300`}>{total}</div>
            <div className={`text-gray-600 text-lg ${darkText} dark:text-gray-300`}>Total Topics</div>
          </div>
          <div className={`bg-blue-100 p-2 rounded-full transition-all duration-300 group-hover:bg-blue-200 dark:bg-blue-900/50`}>
            <div className="w-5 h-5 bg-blue-500 rounded-full dark:bg-blue-400"></div>
          </div>
        </div>
      </div>

      {/* Completed Card */}
      <div className={`bg-white p-3 sm:p-4 rounded-xl min-h-[100px] shadow-md border-l-4 border-green-500 transition-all duration-300 hover:shadow-lg hover:scale-[1.03] hover:border-green-600 ${darkCardBg} ${darkBorder} dark:border-l-green-500 dark:hover:border-l-green-600`}>
        {/* Mobile Layout */}
        <div className="flex items-center justify-between lg:hidden">
          <div>
            <div className={`text-xl sm:text-2xl font-bold text-green-800 ${darkText} dark:text-green-300`}>{completed}</div>
            <div className={`text-gray-600 text-sm sm:text-base ${darkText} dark:text-gray-300`}>Done</div>
          </div>
          <div className="flex items-center justify-center" style={{ width: 28, height: 28 }}>
            <div className={`bg-green-100 p-1.5 rounded-full transition-all duration-300 group-hover:bg-green-200 dark:bg-green-900/50`}>
              <div className="w-3 h-3 bg-green-500 rounded-full dark:bg-green-400"></div>
            </div>
          </div>
        </div>
        
        {/* Desktop Layout */}
        <div className="hidden lg:flex justify-between items-center">
          <div>
            <div className={`text-2xl font-bold text-green-800 ${darkText} dark:text-green-300`}>{completed}</div>
            <div className={`text-gray-600 text-lg ${darkText} dark:text-gray-300`}>Completed</div>
          </div>
          <div className={`bg-green-100 p-2 rounded-full transition-all duration-300 group-hover:bg-green-200 dark:bg-green-900/50`}>
            <div className="w-5 h-5 bg-green-500 rounded-full dark:bg-green-400"></div>
          </div>
        </div>
      </div>

      {/* Bookmarked Card */}
      <div className={`bg-white p-3 sm:p-4 rounded-xl min-h-[100px] shadow-md border-l-4 border-amber-500 transition-all duration-300 hover:shadow-lg hover:scale-[1.03] hover:border-amber-600 ${darkCardBg} ${darkBorder} dark:border-l-amber-500 dark:hover:border-l-amber-600`}>
        {/* Mobile Layout */}
        <div className="flex items-center justify-between lg:hidden">
          <div>
            <div className={`text-xl sm:text-2xl font-bold text-amber-700 ${darkText} dark:text-amber-300`}>{bookmarked}</div>
            <div className={`text-gray-600 text-sm sm:text-base ${darkText} dark:text-gray-300`}>Saved</div>
          </div>
          <div className="flex items-center justify-center" style={{ width: 28, height: 28 }}>
            <div className={`bg-amber-100 p-1.5 rounded-full transition-all duration-300 group-hover:bg-amber-200 dark:bg-amber-900/50`}>
              <div className="w-3 h-3 bg-amber-500 rounded-full dark:bg-amber-400"></div>
            </div>
          </div>
        </div>
        
        {/* Desktop Layout */}
        <div className="hidden lg:flex justify-between items-center">
          <div>
            <div className={`text-2xl font-bold text-amber-700 ${darkText} dark:text-amber-300`}>{bookmarked}</div>
            <div className={`text-gray-600 text-lg ${darkText} dark:text-gray-300`}>Bookmarked</div>
          </div>
          <div className={`bg-amber-100 p-2 rounded-full transition-all duration-300 group-hover:bg-amber-200 dark:bg-amber-900/50`}>
            <div className="w-5 h-5 bg-amber-500 rounded-full dark:bg-amber-400"></div>
          </div>
        </div>
      </div>

      {/* Quiz Progress Card */}
      <div className={`bg-white p-3 sm:p-4 rounded-xl min-h-[100px] shadow-md border-l-4 border-purple-500 transition-all duration-300 hover:shadow-lg hover:scale-[1.03] hover:border-purple-600 ${darkCardBg} ${darkBorder} dark:border-l-purple-500 dark:hover:border-l-purple-600`}>
        {/* Mobile Layout */}
        <div className="flex items-center justify-between lg:hidden">
          <div>
            <div className={`text-xl sm:text-2xl font-bold text-purple-800 ${darkText} dark:text-purple-300`}>{progressPercent}%</div>
            <div className={`text-gray-600 text-sm sm:text-base ${darkText} dark:text-gray-300`}>Progress</div>
            {quizCount > 0 && (
              <div className={`text-xs text-purple-600 dark:text-purple-300 mt-1`}>
                {quizCount} attempt{quizCount > 1 ? 's' : ''}
              </div>
            )}
          </div>
          <div style={{ width: 28, height: 28 }} className="flex items-center justify-center">
            <CircularProgressbarWithChildren 
              value={progressPercent} 
              styles={buildStyles({ 
                pathColor: darkMode ? "#a78bfa" : "#7c3aed",
                trailColor: darkMode ? "#4c1d95" : "#e9d5ff",
                pathTransitionDuration: 0.8
              })}
            />
          </div>
        </div>
        
        {/* Desktop Layout */}
        <div className="hidden lg:flex justify-between items-center">
                  <div>
                    <div className={`text-2xl font-bold text-purple-800 ${darkText} dark:text-purple-300`}>{progressPercent}%</div>
                    <div className={`text-gray-600 text-lg ${darkText} dark:text-gray-300`}>Progress</div>
                  </div>
                  <div style={{ width: 50, height: 50 }}>
                    <CircularProgressbarWithChildren 
                      value={progressPercent} 
                      styles={buildStyles({ 
                        pathColor: darkMode ? "#a78bfa" : "#7c3aed",
                        trailColor: darkMode ? "#4c1d95" : "#e9d5ff",
                        pathTransitionDuration: 0.8
                      })}
                    />
                  </div>
                  {quizCount > 0 && (
                    <div className={`text-lg text-purple-600 mt-1 ${darkText} dark:text-purple-300`}>
                      {quizCount} attempt{quizCount > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
      </div>
    </div>
  );
};

export default ProgressCards;