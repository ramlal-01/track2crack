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

  return (
    <div className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${darkTableRow}`}>
      {/* Mobile Layout */}
      <div className="block md:hidden p-4 space-y-3">
        {/* Question Title and Difficulty */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm leading-tight pr-2">{question.title}</h3>
            <span className={`text-xs font-semibold px-2 py-1 rounded ${getDifficultyColor(question.difficulty)}`}>
              {question.difficulty}
            </span>
          </div>
        </div>

        {/* Actions Row */}
        <div className="flex items-center justify-between">
          {/* Left side - Completion and Bookmark */}
          <div className="flex items-center space-x-4">
            <input
              type="checkbox"
              checked={progress?.isCompleted || false}
              onChange={(e) => handleInteraction(e, () => handleToggle(question._id, "isCompleted"))}
              onClick={(e) => e.stopPropagation()}
              className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <button
              onClick={(e) => handleInteraction(e, () => handleToggle(question._id, "isBookmarked"))}
              className={`text-lg ${progress?.isBookmarked ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-500 transition-colors`}
            >
              {progress?.isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
            </button>
          </div>

          {/* Right side - Links */}
          <div className="flex items-center space-x-3">
            {question.leetcodeLink && (
              <a
                href={question.leetcodeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-500 hover:text-orange-600 text-lg transition-colors"
                title="LeetCode"
                onClick={(e) => e.stopPropagation()}
              >
                <SiLeetcode />
              </a>
            )}
            {question.geeksforgeeksLink && (
              <a
                href={question.geeksforgeeksLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700 text-lg transition-colors"
                title="GeeksforGeeks"
                onClick={(e) => e.stopPropagation()}
              >
                <SiGeeksforgeeks />
              </a>
            )}
          </div>
        </div>

        {/* Reminder and Note Row */}
        <div className="flex items-center justify-between">
          {/* Reminder */}
          <div className="relative">
            <button
              onClick={(e) => {
                handleInteraction(e, () => {
                  setOpenNoteId(null);
                  setOpenReminderId(openReminderId === question._id ? null : question._id);
                });
              }}
              className={`text-sm px-2 py-1 rounded border ${
                progress?.remindOn 
                  ? 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700' 
                  : 'text-blue-600 border-blue-300 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-600 dark:hover:bg-blue-900'
              }`}
            >
              <FaBell className="inline mr-1" />
              {progress?.remindOn
                ? new Date(progress.remindOn).toLocaleDateString()
                : "Remind"}
            </button>
            <ReminderModal
              openReminderId={openReminderId === question._id ? question._id : null}
              progressMap={progressMap}
              handleReminderChange={handleReminderChange}
              darkMode={darkMode}
            />
          </div>

          {/* Note */}
          <div className="relative">
            {progress?.note ? (
              <div className="flex items-center gap-2">
                <span className="text-sm">📄</span>
                <span className={`text-xs max-w-[100px] truncate ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
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
                  className={`text-xs ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}
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
                className={`text-sm px-2 py-1 rounded border ${darkMode ? 'text-blue-400 border-blue-600 hover:bg-blue-900' : 'text-blue-600 border-blue-300 hover:bg-blue-50'}`}
              >
                📝 Note
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

      {/* Desktop Layout */}
      <div className="hidden md:block">
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
            <span className="font-medium text-sm">{question.title}</span>
          </div>

          {/* Difficulty */}
          <div className="col-span-1 text-center">
            <span className={`text-xs font-semibold px-2 py-1 rounded ${getDifficultyColor(question.difficulty)}`}>
              {question.difficulty}
            </span>
          </div>

          {/* Links */}
          <div className="col-span-2 flex justify-center items-center space-x-4">
            {question.leetcodeLink ? (
              <a
                href={question.leetcodeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-500 hover:text-orange-600 text-xl transition-colors p-1"
                title="LeetCode"
                onClick={(e) => e.stopPropagation()}
              >
                <SiLeetcode />
              </a>
            ) : (
              <div className="w-6 h-6"></div>
            )}
            {question.geeksforgeeksLink ? (
              <a
                href={question.geeksforgeeksLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700 text-xl transition-colors p-1"
                title="GeeksforGeeks"
                onClick={(e) => e.stopPropagation()}
              >
                <SiGeeksforgeeks />
              </a>
            ) : (
              <div className="w-6 h-6"></div>
            )}
          </div>

          {/* Bookmark */}
          <div className="col-span-1 flex justify-center">
            <button
              onClick={(e) => handleInteraction(e, () => handleToggle(question._id, "isBookmarked"))}
              className={`text-lg ${progress?.isBookmarked ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-500 transition-colors p-1`}
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
              className={`text-sm p-2 rounded transition-colors ${
                progress?.remindOn 
                  ? 'text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900' 
                  : 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900'
              }`}
              title={progress?.remindOn ? `Reminder set for ${new Date(progress.remindOn).toLocaleDateString()}` : "Set reminder"}
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
                  className={`text-xs ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} transition-colors p-1`}
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
                className={`text-xs px-2 py-1 rounded border transition-colors ${
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