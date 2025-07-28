// components/SubjectCard.jsx
import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

const SubjectCard = ({ icon, title, progress, onClick }) => {
  // Color based on progress percentage
  const getProgressColor = (progress) => {
    if (progress < 30) return "from-red-500 to-red-400";
    if (progress < 70) return "from-yellow-500 to-yellow-400";
    return "from-green-500 to-green-400";
  };
  
  const { theme } = useTheme();

  return (
    <motion.div
      role="button"
      aria-label={`Subject: ${title}, ${progress}% completed`}
      tabIndex={0}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative cursor-pointer bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-gray-800 
                 rounded-2xl p-3 sm:p-5 shadow-lg hover:shadow-xl border border-gray-100 dark:border-gray-700 
                 flex flex-col justify-between transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] 
                 min-h-[120px] sm:min-h-[140px] overflow-hidden group`}
    >
      {/* Decorative left border - now gradient blue */}
      <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-blue-400 to-blue-600"></div>
       

      {/* Animated background highlight */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${getProgressColor(progress)} 
                      transition-opacity duration-500`}></div>
      
      {/* Glow effect */}
      <div className={`absolute -inset-1 opacity-0 group-hover:opacity-30 blur-md ${getProgressColor(progress)} 
                      transition-opacity duration-500`}></div>

      {/* Top Content */}
      <div className="flex justify-between items-start z-10">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          {/* Enhanced icon container - responsive sizing */}
          <motion.div 
            whileHover={{ y: -2 }}
            className="p-2 sm:p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 
                      shadow-sm group-hover:shadow-md transition-all flex items-center justify-center flex-shrink-0"
          >
            <img
              src={icon}
              alt={`${title} icon`}
              className="w-6 h-6 sm:w-10 sm:h-10 dark:invert opacity-80 dark:opacity-90"
            />
          </motion.div>
          
          <div className="min-w-0 flex-1">
            <h3 className="text-sm sm:text-base font-semibold text-gray-800 dark:text-white line-clamp-1">{title}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
              {progress < 30 ? "Keep going!" : 
               progress < 70 ? "Good progress!" : 
               "Almost mastered!"}
            </p>
          </div>
        </div>

        {/* Progress percentage with animated circle - responsive sizing */}
        <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
          <svg className="w-full h-full" viewBox="0 0 36 36">
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="3"
              className="dark:stroke-gray-700"
            />
            <motion.path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ strokeDasharray: '100, 100' }}
              animate={{ strokeDasharray: `${progress}, 100` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className={progress < 30 ? "stroke-red-500" : 
                        progress < 70 ? "stroke-yellow-500" : 
                        "stroke-green-500"}
            />
          </svg>
          <span className={`absolute inset-0 flex items-center justify-center text-xs font-bold 
                          ${progress < 30 ? "text-red-600 dark:text-red-400" : 
                            progress < 70 ? "text-yellow-600 dark:text-yellow-400" : 
                            "text-green-600 dark:text-green-400"}`}>
            {progress}%
          </span>
        </div>
      </div>

      {/* Bottom Progress Bar */}
      <div className="relative z-10 w-full h-2 sm:h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mt-3 sm:mt-4">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={`absolute top-0 left-0 h-full ${progress < 30 ? "bg-red-500" : 
                     progress < 70 ? "bg-yellow-500" : "bg-green-500"} 
                     shadow-sm`}
        />
        {/* Animated dots overlay */}
        <div className="absolute inset-0 opacity-20 pattern-dots pattern-gray-400 dark:pattern-gray-600 pattern-size-2 pattern-opacity-50"></div>
      </div>

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5 pattern-grid pattern-gray-400 dark:pattern-gray-600 pattern-size-4 pattern-opacity-50"></div>
    </motion.div>
  );
};

export default SubjectCard;