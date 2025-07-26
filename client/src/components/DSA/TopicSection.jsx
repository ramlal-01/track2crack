import React from "react";
import { FaChevronRight, FaChevronDown, FaBookmark, FaBell } from "react-icons/fa";
import QuestionRow from "./QuestionRow";

const TopicSection = ({ 
  topic, 
  questions, 
  expandedTopics, 
  setExpandedTopics, 
  animatedWidths, 
  progressMap, 
  handleToggle, 
  setOpenReminderId, 
  setOpenNoteId, 
  openReminderId, 
  openNoteId, 
  noteText, 
  setNoteText, 
  updateProgress, 
  setProgressMap, 
  handleReminderChange, 
  handleResetTopic, 
  resettingTopic,
  topicRefs, 
  darkMode, 
  darkCardBg, 
  darkBorder, 
  darkText, 
  darkTableHeader, 
  darkTableRow, 
  darkInput 
}) => {
  const isExpanded = expandedTopics[topic];
  const completedCount = questions.filter(q => progressMap[q._id]?.isCompleted).length;
  const totalCount = questions.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  
  // Calculate bookmark and reminder counts
  const bookmarkCount = questions.filter(q => progressMap[q._id]?.isBookmarked).length;
  const reminderCount = questions.filter(q => progressMap[q._id]?.remindOn).length;

  const toggleTopic = (e) => {
    // Prevent event bubbling
    e.stopPropagation();
    setExpandedTopics(prev => ({
      ...prev,
      [topic]: !prev[topic]
    }));
  };

  const handleResetClick = (e) => {
    e.stopPropagation();
    handleResetTopic(topic);
  };

  const hasProgress = questions.some(q => {
    const p = progressMap[q._id] || {};
    return p.isCompleted || p.isBookmarked || p.remindOn || p.note;
  });

  return (
    <div 
      ref={(el) => {
        if (topicRefs && topicRefs.current) {
          topicRefs.current[topic] = el;
        }
      }}
      className={`${darkCardBg} ${darkBorder} border rounded-lg mb-6 shadow-sm`}
    >
      {/* Topic Header */}
      <div 
        className={`p-4 md:p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors select-none`}
        onClick={toggleTopic}
      >
        <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:items-center justify-between">
          {/* Topic Title and Stats */}
          <div className="flex items-center gap-3 min-w-0 flex-1 w-full justify-between md:justify-start">
            <div className={`text-lg ${darkText} hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors`}>
              {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className={`text-lg md:text-xl font-semibold ${darkText} truncate`}>
                {topic}
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}> 
                  {completedCount}/{totalCount} completed ({Math.round(progressPercent)}%)
                </p>
                {/* Stats badges */}
                <div className="flex items-center gap-5 mt-1">
                  {bookmarkCount > 0 && (
                    <div className="flex items-center gap-2 px-2 py-1 bg-yellow-50 dark:bg-yellow-900/20 rounded-full">
                      <FaBookmark className={`text-xs ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{bookmarkCount}</span>
                    </div>
                  )}
                  {reminderCount > 0 && (
                    <div className="flex items-center gap-2 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                      <FaBell className={`text-xs ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{reminderCount}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Reset Button for mobile view (right aligned) */}
            <div className="block md:hidden ml-auto">
              {hasProgress && (
                <button
                  onClick={handleResetClick}
                  disabled={resettingTopic === topic}
                  className={`px-3 py-1 text-xs md:text-sm rounded border transition-colors ${
                    resettingTopic === topic
                      ? 'opacity-50 cursor-not-allowed'
                      : `${darkMode 
                          ? 'text-red-400 border-red-500 hover:bg-red-900/20' 
                          : 'text-red-600 border-red-300 hover:bg-red-50'
                        }`
                  }`}
                >
                  {resettingTopic === topic ? 'Resetting...' : 'Reset'}
                </button>
              )}
            </div>
          </div>
          {/* Progress Bar and Reset Button (desktop) */}
          <div className="flex items-center gap-4 mt-3 md:mt-0">
            {/* Progress Bar */}
            <div className="flex justify-center md:justify-start w-full">
              <div className="w-32 md:w-48 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${animatedWidths[topic] || 0}%` }}
                />
              </div>
            </div>
            {/* Reset Button for desktop */}
            <div className="hidden md:block">
              {hasProgress && (
                <button
                  onClick={handleResetClick}
                  disabled={resettingTopic === topic}
                  className={`