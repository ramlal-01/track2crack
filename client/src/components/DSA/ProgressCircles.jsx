import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const ProgressCircles = ({ 
  easyProgress, 
  mediumProgress, 
  hardProgress, 
  progress,
  easyCompleted,
  easyQuestions,
  mediumCompleted,
  mediumQuestions,
  hardCompleted,
  hardQuestions,
  completed,
  total,
  darkMode,
  darkText 
}) => {
  const trailColor = darkMode ? "#374151" : "#e5e7eb";

  return (
    <div className="flex flex-wrap justify-center gap-6 md:gap-8 mb-1">
      {/* Easy Progress */}
      <div className="flex flex-col items-center">
        <div className="w-18 h-18 md:w-24 md:h-24 lg:w-25 lg:h-25 drop-shadow-md relative">
          <CircularProgressbar
            value={easyProgress}
            styles={buildStyles({
              pathTransition: "stroke-dashoffset 0.5s ease 0s",
              pathColor: "#22c55e",
              trailColor: trailColor,
            })}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-sm md:text-lg font-bold ${darkText}`}>
              {easyCompleted}/{easyQuestions.length}
            </span>
          </div>
        </div>
        <div className="text-sm md:text-lg font-semibold text-green-700 dark:text-green-400 mt-1">
          Easy
        </div>
      </div>

      {/* Medium Progress */}
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 md:w-24 md:h-24 lg:w-25 lg:h-25 drop-shadow-md relative">
          <CircularProgressbar
            value={mediumProgress}
            styles={buildStyles({
              pathTransition: "stroke-dashoffset 0.5s ease 0s",
              pathColor: "#eab308",
              trailColor: trailColor,
            })}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-sm md:text-lg font-bold ${darkText}`}>
              {mediumCompleted}/{mediumQuestions.length}
            </span>
          </div>
        </div>
        <div className="text-sm md:text-lg font-semibold text-yellow-700 dark:text-yellow-400 mt-1">
          Medium
        </div>
      </div>

      {/* Hard Progress */}
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 md:w-24 md:h-24 lg:w-25 lg:h-25 drop-shadow-md relative">
          <CircularProgressbar
            value={hardProgress}
            styles={buildStyles({
              pathTransition: "stroke-dashoffset 0.5s ease 0s",
              pathColor: "#ef4444",
              trailColor: trailColor,
            })}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-sm md:text-lg font-bold ${darkText}`}>
              {hardCompleted}/{hardQuestions.length}
            </span>
          </div>
        </div>
        <div className="text-sm md:text-lg font-semibold text-red-700 dark:text-red-400 mt-1">
          Hard
        </div>
      </div>

      {/* Overall Progress */}
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 md:w-24 md:h-24 lg:w-25 lg:h-25 drop-shadow-md relative">
          <CircularProgressbar
            value={progress}
            styles={buildStyles({
              pathTransition: "stroke-dashoffset 0.5s ease 0s",
              pathColor: "#10b981",
              trailColor: trailColor,
            })}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-sm md:text-xl font-bold ${darkText}`}>
              {completed}/{total}
            </span>
          </div>
        </div>
        <div className="text-sm md:text-lg font-semibold text-emerald-700 dark:text-emerald-400 mt-1">
          Overall
        </div>
      </div>
    </div>
  );
};

export default ProgressCircles;