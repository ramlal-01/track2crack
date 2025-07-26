import React from "react";
import { FaBookmark, FaRegBookmark, FaBell } from "react-icons/fa";
import { SiLeetcode, SiGeeksforgeeks } from "react-icons/si";
import ReminderModal from "./ReminderModal";
import NoteModal from "./NoteModal";

const QuestionRow = ({ 
  question, 
  progress, 
  handleToggle, 
  setOpenReminderId, 
  setOpenNoteId, 
  openReminderId, 
  openNoteId, 
  noteText, 
  setNoteText, 
  progressMap, 
  updateProgress, 
  setProgressMap, 
  handleReminderChange, 
  darkMode, 
  darkTableRow, 
  darkInput 
}) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return darkMode ? 'text-green-400' : 'text-green-600';
      case 'medium': return darkMode ? 'text-yellow-400' : 'text-yellow-600';
      case 'hard': return darkMode ? 'text-red-400' : 'text-red-600';
      default: return darkMode ? 'text-gray-400' : 'text-gray-600';
    }
  };

  // Prevent event bubbling for all interactive elements
  const handleInteraction = (e, callback) => {
    e.stopPropagation();
    e.preventDefault();
    if (callback) callback();
  };

  // Handle question text click to toggle completion
  const handleQuestionClick = (e) => {
    e.stopPropagation();
    handleToggle(question._id, "isCompleted");
  };

  // Add this helper function at the top of the component (after imports)
  const getPlatformIcon = (platform) => {
    if (platform === "GFG") return <SiGeeksforgeeks className="text-green-600 dark:text-green-400" title="GFG" />;
    if (platform === "LeetCode") return <SiLeetcode className="text-orange-500 dark:text-orange-400" title="LeetCode" />;
    return null;
  };

  return (
    <div className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${darkTableRow}`}>
      {/* Mobile Layout */}
      <div className="block md:hidden p-5 space-y-4">
        {/* Question Title and Difficulty */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <input
                type="checkbox"
                checked={progress?.isCompleted || false}
                onChange={(e) => handleInteraction(e, () => handleToggle(question._id, "isCompleted"))}
                onClick={(e) => e.stopPropagation()}
                className="w-5 h-5 mt-0.5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 flex-shrink-0"
              />
              <h3 
                className={`font-medium text-base leading-tight cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${progress?.isCompleted ? 'line-through opacity-75' : ''}`}
                onClick={handleQuestionClick}
              >
                {question.title}
              </h3>
              <span className={`text-xs font-semibold px-2 py-1 rounded flex-shrink-0 ${getDifficultyColor(question.difficulty)}`}>{question.difficulty}</span>
            </div>
            <div className="flex items-center gap-3 ml-2">
              {question.link && question.platform && (
                <a
                  href={question.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  title={question.platform}
                >
                  {getPlatformIcon(question.platform)}
                </a>
              )}
              <button
                onClick={(e) => handleInteraction(e, () => handleToggle(question._id, "isBookmarked"))}
                className={`text-xl ${progress?.isBookmarked ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-500 transition-colors p-1`}
              >
                {progress?.isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
              </button>
            </div>
          </div>
        </div>
        {/* Reminder and Note Row */}
        <div className="flex items-center justify-between gap-3 mt-2 relative z-[999]">
          {/* Reminder */}
          <div className="relative flex-1">
            <button
              onClick={(e) => {
                handleInteraction(e, () => {
                  setOpenNoteId(null);
                  setOpenReminderId(openReminderId === question._id ? null : question._id);
                });
              }}
              className={`w-full text-sm px-3 py-2 rounded-lg border transition-colors ${progress?.remindOn ? 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700' : 'text-blue-600 border-blue-300 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-600 dark:hover:bg-blue-900'}`}
            >
              <div className="flex items-center justify-center gap-2">
                <FaBell className="text-sm" />
                <span>
                  {progress?.remindOn ? new Date(progress.remindOn).toLocaleDateString() : "Set Reminder"}
                </span>
              </div>
            </button>
            <ReminderModal
              openReminderId={openReminderId === question._id ? question._id : null}
              progressMap={progressMap}
              handleReminderChange={handleReminderChange}
              darkMode={darkMode}
            />
          </div>
          {/* Note */}
          <div className="relative flex-1">
            {progress?.note ? (
              <button
                onClick={(e) => {
                  handleInteraction(e, () => {
                    setOpenReminderId(null);
                    setOpenNoteId(openNoteId === question._id ? null : question._id);
                    setNoteText(progress.note || '');
                  });
                }}
                className={`w-full text-sm px-3 py-2 rounded-lg border transition-colors bg-yellow-50 text-yellow-700 border-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-600`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>📄</span>
                  <span className="truncate max-w-[80px]">{progress.note}</span>
                  <span>✏️</span>
                </div>
              </button>
            ) : (
              <button
                onClick={(e) => {
                  handleInteraction(e, () => {
                    setOpenReminderId(null);
                    setOpenNoteId(openNoteId === question._id ? null : question._id);
                    setNoteText('');
                  });
                }}
                className={`w-full text-sm px-3 py-2 rounded-lg border transition-colors ${darkMode ? 'text-blue-400 border-blue-600 hover:bg-blue-900' : 'text-blue-600 border-blue-300 hover:bg-blue-50'}`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>📝</span>
                  <span>Add Note</span>
                </div>
              </button>
            )}
            <NoteModal
              openNoteId={openNoteId === question._id ? question._id : null}
              noteText={noteText}
              setNoteText={setNoteText}
              setOpenNoteId={setOpenNoteId}
              progressMap={progressMap}
              updateProgress={updateProgress}
              setProgressMap={setProgressMap}
              darkMode={darkMode}
              darkInput={darkInput}
            />
          </div>
        </div>
      </div>

      {/* Desktop Layout - Like Original Backup */}
      <div className="hidden md:block relative z-[999]">
        <div className="grid grid-cols-12 gap-3 items-center p-4">
          {/* Completion Checkbox */}
          <div className="col-span-1 flex justify-center">
            <input
              type="checkbox"
              checked={progress?.isCompleted || false}
              onChange={(e) => handleInteraction(e, () => handleToggle(question._id, "isCompleted"))}
              onClick={(e) => e.stopPropagation()}
              className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          {/* Question Title */}
          <div className="col-span-4">
            <span 
              className={`font-medium text-sm cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${
                progress?.isCompleted ? 'line-through opacity-75' : ''
              }`}
              onClick={handleQuestionClick}
            >
              {question.title}
            </span>
          </div>

          {/* Difficulty */}
          <div className="col-span-1 text-center">
            <span className={`text-xs font-semibold px-2 py-1 rounded ${getDifficultyColor(question.difficulty)}`}>
              {question.difficulty}
            </span>
          </div>

          {/* Links - Simple like original backup */}
          <div className="col-span-2 flex justify-center items-center gap-4">
            {question.link && question.platform && (
              <a
                href={question.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                title={question.platform}
              >
                {getPlatformIcon(question.platform)}
              </a>
            )}
          </div>

          {/* Bookmark */}
          <div className="col-span-1 flex justify-center">
            <button
              onClick={(e) => handleInteraction(e, () => handleToggle(question._id, "isBookmarked"))}
              className={`text-lg ${progress?.isBookmarked ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-500 transition-colors p-1 hover:scale-110`}
            >
              {progress?.isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
            </button>
          </div>

          {/* Reminder */}
          <div className="col-span-1 flex justify-center relative">
            <button
              onClick={(e) => {
                handleInteraction(e, () => {
                  setOpenNoteId(null);
                  setOpenReminderId(openReminderId === question._id ? null : question._id);
                });
              }}
              className={`text-sm p-2 rounded transition-colors hover:scale-110 ${
                progress?.remindOn 
                  ? 'text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900' 
                  : 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900'
              }`}
              title={progress?.remindOn ? `Reminder: ${new Date(progress.remindOn).toLocaleDateString()}` : "Set reminder"}
            >
              <FaBell />
            </button>
            <ReminderModal
              openReminderId={openReminderId === question._id ? question._id : null}
              progressMap={progressMap}
              handleReminderChange={handleReminderChange}
              darkMode={darkMode}
            />
          </div>

          {/* Note */}
          <div className="col-span-2 flex justify-center relative">
            {progress?.note ? (
              <div className="flex items-center gap-2 max-w-full">
                <span className="text-sm">📄</span>
                <span 
                  className={`text-xs max-w-[80px] truncate ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}
                  title={progress.note}
                >
                  {progress.note}
                </span>
                <button
                  onClick={(e) => {
                    handleInteraction(e, () => {
                      setOpenReminderId(null);
                      setOpenNoteId(openNoteId === question._id ? null : question._id);
                      setNoteText(progress.note || '');
                    });
                  }}
                  className={`text-xs ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} transition-colors p-1 hover:scale-110`}
                >
                  ✏️
                </button>
              </div>
            ) : (
              <button
                onClick={(e) => {
                  handleInteraction(e, () => {
                    setOpenReminderId(null);
                    setOpenNoteId(openNoteId === question._id ? null : question._id);
                    setNoteText('');
                  });
                }}
                className={`text-xs px-2 py-1 rounded border transition-colors hover:scale-105 ${
                  darkMode 
                    ? 'text-blue-400 border-blue-600 hover:bg-blue-900' 
                    : 'text-blue-600 border-blue-300 hover:bg-blue-50'
                }`}
              >
                📝 Add Note
              </button>
            )}
            <NoteModal
              openNoteId={openNoteId === question._id ? question._id : null}
              noteText={noteText}
              setNoteText={setNoteText}
              setOpenNoteId={setOpenNoteId}
              progressMap={progressMap}
              updateProgress={updateProgress}
              setProgressMap={setProgressMap}
              darkMode={darkMode}
              darkInput={darkInput}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionRow;