import React from "react";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
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

  return (
    <div 
      ref={(el) => {
        if (topicRefs && topicRefs.current) {
          topicRefs.current[topic] = el;
        }
      }}
      className={`${darkCardBg} ${darkBorder} border rounded-lg mb-6 overflow-hidden shadow-sm`}
    >
      {/* Topic Header */}
      <div 
        className={`p-4 md:p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors select-none`}
        onClick={toggleTopic}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Topic Title and Progress */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className={`text-lg ${darkText} hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors`}>
              {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className={`text-lg md:text-xl font-semibold ${darkText} truncate`}>
                {topic}
              </h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                {completedCount}/{totalCount} completed ({Math.round(progressPercent)}%)
              </p>
            </div>
          </div>

          {/* Progress Bar and Reset Button */}
          <div className="flex items-center gap-4">
            {/* Progress Bar */}
            <div className="w-32 md:w-48 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${animatedWidths[topic] || 0}%` }}
              />
            </div>

            {/* Reset Button */}
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
          </div>
        </div>
      </div>

      {/* Questions Table */}
      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700">
          {/* Desktop Table Header */}
          <div className={`hidden md:block ${darkTableHeader} border-b border-gray-200 dark:border-gray-700`}>
            <div className="grid grid-cols-12 gap-3 items-center p-4 text-sm font-semibold">
              <div className="col-span-1 text-center">Done</div>
              <div className="col-span-4">Question</div>
              <div className="col-span-1 text-center">Level</div>
              <div className="col-span-2 text-center">Links</div>
              <div className="col-span-1 text-center">Save</div>
              <div className="col-span-1 text-center">Remind</div>
              <div className="col-span-2 text-center">Note</div>
            </div>
          </div>

          {/* Questions List */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {questions.map((question) => (
              <QuestionRow
                key={question._id}
                question={question}
                progress={progressMap[question._id]}
                handleToggle={handleToggle}
                setOpenReminderId={setOpenReminderId}
                setOpenNoteId={setOpenNoteId}
                openReminderId={openReminderId}
                openNoteId={openNoteId}
                noteText={noteText}
                setNoteText={setNoteText}
                progressMap={progressMap}
                updateProgress={updateProgress}
                setProgressMap={setProgressMap}
                handleReminderChange={handleReminderChange}
                darkMode={darkMode}
                darkTableRow={darkTableRow}
                darkInput={darkInput}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicSection;