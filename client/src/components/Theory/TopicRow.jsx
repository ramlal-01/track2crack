import React from "react";
import { FaBookmark, FaRegBookmark, FaBell } from "react-icons/fa";
import { SiYoutube, SiGeeksforgeeks } from "react-icons/si";
import { MdQuiz } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TopicRow = ({
  topic,
  index,
  filteredTopics,
  progress,
  activeTopic,
  isTopicEnabled,
  updateProgress,
  handleReminderChange,
  handleSingleTopicQuiz,
  openReminderId,
  openNoteId,
  noteText,
  setOpenReminderId,
  setOpenNoteId,
  setNoteText,
  reminderRefs,
  noteRefs,
  darkMode
}) => {
  const { isCompleted, isBookmarked, remindOn, note, quizTaken, quizScore } = progress[topic._id] || {};
  
  const gfg = topic.resources?.find((r) => 
    r.label?.toLowerCase().includes("gfg") || 
    r.url?.toLowerCase().includes("geeksforgeeks")
  );
  
  const yt = topic.resources?.find((r) => 
    r.label?.toLowerCase().includes("youtube") || 
    r.url?.toLowerCase().includes("youtube") ||
    r.label?.toLowerCase().includes("yt") || 
    r.url?.toLowerCase().includes("youtu.be")
  );
  
  const isEnabled = isTopicEnabled(topic._id, index, filteredTopics);
  const isCurrentTopic = topic._id === activeTopic;
  const canAttemptQuiz = isEnabled && (isCurrentTopic || progress[topic._id]?.isCompleted);

  const darkText = "dark:text-gray-200";
  const darkCardBg = "dark:bg-gray-800";
  const darkBorder = "dark:border-gray-700";
  const darkInput = "dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white";

  return (
    <>
      {/* Desktop Layout - Hidden on Mobile */}
      <div className={`hidden lg:grid lg:grid-cols-[100px_6fr_1fr_1fr_1fr_1.5fr_1fr_200px] items-center p-4 rounded-xl transition-all border-gray-200 ${
        isCompleted 
          ? "bg-green-50 border-2 border-green-400 hover:border-green-500 dark:bg-green-900/20 dark:border-green-700 dark:hover:border-green-600" 
          : isCurrentTopic 
          ? "bg-indigo-50 border-2 border-indigo-400 dark:bg-indigo-900/20 dark:border-indigo-700"
          : !isEnabled
          ? "bg-gray-100 border border-gray-300 opacity-60 dark:bg-gray-700/50 dark:border-gray-600"
          : "bg-white border border-gray-200 hover:border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600"
      }`}>
        {/* Status */}
        <div className="flex justify-center">
          {isCompleted ? (
            <span className="text-green-600 text-xl dark:text-green-400">✓</span>
          ) : (
            <span className="text-gray-400 text-xl dark:text-gray-500">○</span>
          )}
        </div>

        {/* Topic Title */}
        <div className="pl-3">
          <div className={`font-bold ${
            isCompleted 
              ? "text-green-800 dark:text-green-300" 
              : isCurrentTopic 
              ? "text-indigo-800 text-lg dark:text-indigo-300" 
              : !isEnabled 
              ? "text-gray-500 dark:text-gray-400" 
              : "text-gray-700 dark:text-gray-200"
          }`}>
            {topic.title}
          </div>
          {topic.notes && (
            <div className={`text-sm text-gray-700 mt-1 ${darkText} dark:text-gray-300`}>{topic.notes}</div>
          )}
        </div>

        {/* GFG Link */}
        <div className="flex justify-center">
          {gfg ? (
            <a 
              href={gfg.url} 
              target="_blank" 
              rel="noreferrer" 
              className={`hover:scale-125 transition-transform duration-200 text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400 ${!isEnabled ? 'opacity-50 pointer-events-none' : ''}`}
              title="GeeksforGeeks Resource"
            >
              <SiGeeksforgeeks className="text-2xl" />
            </a>
          ) : (
            <span className="text-gray-400 dark:text-gray-500">-</span>
          )}
        </div>
        
        {/* YouTube Link */}
        <div className="flex justify-center">
          {yt ? (
            <a 
              href={yt.url} 
              target="_blank" 
              rel="noreferrer" 
              className={`hover:scale-125 transition-transform duration-200 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-500 ${!isEnabled ? 'opacity-50 pointer-events-none' : ''}`}
              title="YouTube Resource"
            >
              <SiYoutube className="text-2xl" />
            </a>
          ) : (
            <span className="text-gray-400 dark:text-gray-500">-</span>
          )}
        </div>
        
        {/* Quiz Button */}
        <div className="flex justify-center">
          <button 
            onClick={() => handleSingleTopicQuiz(topic.title)}
            disabled={!canAttemptQuiz}
            className={`text-xl hover:scale-125 transition-transform duration-200 ${
              canAttemptQuiz 
                ? "text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300" 
                : "text-gray-400 cursor-not-allowed dark:text-gray-500"
            }`}
            title="Take quiz"
          >
            <MdQuiz />
          </button>
        </div>

        {/* Bookmark */}
        <div className="flex justify-center">
          <button
            onClick={() => updateProgress(topic._id, "isBookmarked")}
            disabled={!isEnabled}
            className={`text-xl hover:scale-125 transition-transform duration-200 ${
              isBookmarked 
                ? "text-yellow-500 hover:text-yellow-600 dark:text-yellow-400 dark:hover:text-yellow-300" 
                : isEnabled 
                  ? "text-gray-400 hover:text-yellow-500 dark:text-gray-500 dark:hover:text-yellow-400" 
                  : "text-gray-300 cursor-not-allowed dark:text-gray-600"
            }`}
            title="Bookmark topic"
          >
            {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
          </button>
        </div>

        {/* Reminder */}
        <div ref={(el) => (reminderRefs.current[topic._id] = el)} className="relative flex justify-center">
          {remindOn ? (
            <div className="flex items-center gap-1">
              <span 
                className={`text-sm text-blue-600 cursor-pointer hover:underline hover:text-blue-700 transition-colors dark:text-blue-400 dark:hover:text-blue-300 ${!isEnabled ? 'opacity-50 pointer-events-none' : ''}`}
                onClick={() => setOpenReminderId(topic._id)}
              >
                {new Date(remindOn).toLocaleDateString('en-IN')}
              </span>
              {isEnabled && (
                <button 
                  onClick={() => handleReminderChange(topic._id, null)}
                  className="text-sm text-red-500 hover:text-red-700 transition-colors dark:text-red-400 dark:hover:text-red-300"
                >
                  ×
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                setOpenNoteId(null);
                setOpenReminderId(openReminderId === topic._id ? null : topic._id);
              }}
              disabled={!isEnabled}
              className={`text-xl hover:scale-125 transition-transform duration-200 text-yellow-500 hover:text-yellow-600 dark:text-yellow-400 dark:hover:text-yellow-300 ${!isEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              title="Set reminder"
            >
              <FaBell />
            </button>
          )}

          {openReminderId === topic._id && (
            <div className={`absolute z-50 top-8 bg-white border border-gray-200 shadow-lg rounded-lg p-2 ${darkCardBg} ${darkBorder}`}>
              <DatePicker
                selected={remindOn ? new Date(remindOn) : null}
                onChange={(date) => handleReminderChange(topic._id, date)}
                dateFormat="dd/MM/yyyy"
                minDate={new Date()}
                inline
                className="dark:bg-gray-800"
              />
            </div>
          )}
        </div>

        {/* Notes */}
        <div ref={(el) => (noteRefs.current[topic._id] = el)} className="relative flex justify-center">
          {note ? (
            <div className="flex items-center gap-1 group">
              <span className={`text-lg text-yellow-600 max-w-[100px] truncate dark:text-yellow-400 ${!isEnabled ? 'opacity-50' : ''}`}>
                {note}
              </span>
              {isEnabled && (
                <button
                  onClick={() => {
                    setOpenReminderId(null);
                    setOpenNoteId(openNoteId === topic._id ? null : topic._id);
                    setNoteText(note);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-gray-700 transition-opacity dark:text-gray-400 dark:hover:text-gray-300"
                >
                  ✏️
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                setOpenReminderId(null);
                setOpenNoteId(openNoteId === topic._id ? null : topic._id);
                setNoteText('');
              }}
              disabled={!isEnabled}
              className={`text-blue-500 hover:text-blue-700 text-sm flex items-center gap-1 transition-colors dark:text-blue-400 dark:hover:text-blue-300 ${!isEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span>📝</span>
              <span>Add</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Layout - Hidden on Desktop */}
      <div className={`lg:hidden p-5 border-b border-gray-200 dark:border-gray-700 ${
        isCompleted 
          ? "bg-green-50 dark:bg-green-900/20" 
          : isCurrentTopic 
            ? "bg-indigo-50 dark:bg-indigo-900/20"
            : !isEnabled
              ? "bg-gray-100 opacity-60 dark:bg-gray-700/50"
              : "bg-white dark:bg-gray-800"
      }`}>
        {/* Topic Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex-shrink-0">
              {isCompleted ? (
                <span className="text-green-600 text-2xl dark:text-green-400">✓</span>
              ) : (
                <span className="text-gray-400 text-2xl dark:text-gray-500">○</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`font-bold text-base leading-tight ${
                isCompleted 
                  ? "text-green-800 dark:text-green-300" 
                  : isCurrentTopic 
                    ? "text-indigo-800 dark:text-indigo-300" 
                    : !isEnabled 
                      ? "text-gray-500 dark:text-gray-400" 
                      : "text-gray-700 dark:text-gray-200"
              }`}>
                {topic.title}
              </h3>
            </div>
          </div>
          
          {/* Bookmark - Top Right */}
          <button
            onClick={() => updateProgress(topic._id, "isBookmarked")}
            disabled={!isEnabled}
            className={`p-2 flex-shrink-0 ${
              isBookmarked 
                ? "text-yellow-500 dark:text-yellow-400" 
                : isEnabled 
                  ? "text-gray-400 dark:text-gray-500" 
                  : "text-gray-300 cursor-not-allowed dark:text-gray-600"
            }`}
          >
            {isBookmarked ? <FaBookmark className="text-xl" /> : <FaRegBookmark className="text-xl" />}
          </button>
        </div>

        {/* Action Buttons - Better Mobile Layout */}
        <div className="space-y-3">
          {/* Resources Row */}
          <div className="flex gap-3">
            {gfg && (
              <a 
                href={gfg.url} 
                target="_blank" 
                rel="noreferrer" 
                className={`flex-1 flex items-center justify-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200 text-green-700 hover:bg-green-100 transition-colors dark:bg-green-900/30 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-900/50 ${!isEnabled ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <SiGeeksforgeeks className="text-lg flex-shrink-0" />
                <span className="text-sm font-medium">GFG</span>
              </a>
            )}
            {yt && (
              <a 
                href={yt.url} 
                target="_blank" 
                rel="noreferrer" 
                className={`flex-1 flex items-center justify-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200 text-red-700 hover:bg-red-100 transition-colors dark:bg-red-900/30 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/50 ${!isEnabled ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <SiYoutube className="text-lg flex-shrink-0" />
                <span className="text-sm font-medium">YouTube</span>
              </a>
            )}
            {!gfg && !yt && (
              <div className="flex-1 flex items-center justify-center p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-400 dark:bg-gray-700/50 dark:border-gray-600 dark:text-gray-500">
                <span className="text-sm">No Resources</span>
              </div>
            )}
          </div>

          {/* Quiz Button */}
          <button
            onClick={() => handleSingleTopicQuiz(topic.title)}
            disabled={!canAttemptQuiz}
            className={`w-full flex items-center justify-center gap-2 p-3 rounded-lg border transition-colors ${
              canAttemptQuiz 
                ? "bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/30 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900/50" 
                : "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700/50 dark:border-gray-600 dark:text-gray-500"
            }`}
          >
            <MdQuiz className="text-lg flex-shrink-0" />
            <span className="text-sm font-medium">Take Quiz</span>
          </button>

          {/* Reminder and Notes Row */}
          <div className="flex gap-3">
            <div ref={(el) => (reminderRefs.current[topic._id] = el)} className="relative flex-1">
              {remindOn ? (
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200 dark:bg-blue-900/30 dark:border-blue-700">
                  <div className="flex items-center gap-2">
                    <FaBell className="text-blue-600 dark:text-blue-300 text-sm flex-shrink-0" />
                    <span className={`text-xs text-blue-600 dark:text-blue-300 truncate ${!isEnabled ? 'opacity-50' : ''}`}>
                      {new Date(remindOn).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  {isEnabled && (
                    <button 
                      onClick={() => handleReminderChange(topic._id, null)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 ml-2 flex-shrink-0"
                    >
                      ×
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => {
                    setOpenNoteId(null);
                    setOpenReminderId(openReminderId === topic._id ? null : topic._id);
                  }}
                  disabled={!isEnabled}
                  className={`w-full flex items-center justify-center gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200 text-yellow-700 hover:bg-yellow-100 transition-colors dark:bg-yellow-900/30 dark:border-yellow-700 dark:text-yellow-300 dark:hover:bg-yellow-900/50 ${!isEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <FaBell className="text-sm flex-shrink-0" />
                  <span className="text-sm font-medium">Reminder</span>
                </button>
              )}

              {openReminderId === topic._id && (
                <div 
                  className={`absolute z-50 top-full mt-1 left-0 bg-white border border-gray-200 shadow-lg rounded-lg p-2 ${darkCardBg} ${darkBorder}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <DatePicker
                    selected={remindOn ? new Date(remindOn) : null}
                    onChange={(date) => handleReminderChange(topic._id, date)}
                    dateFormat="dd/MM/yyyy"
                    minDate={new Date()}
                    inline
                    className="dark:bg-gray-800"
                    portalId="root"
                  />
                </div>
              )}
            </div>

            <div ref={(el) => (noteRefs.current[topic._id] = el)} className="relative flex-1">
              {note ? (
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-700">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-yellow-600 dark:text-yellow-300 text-sm flex-shrink-0">📝</span>
                    <span className={`text-xs text-yellow-600 dark:text-yellow-300 truncate ${!isEnabled ? 'opacity-50' : ''}`}>
                      {note}
                    </span>
                  </div>
                  {isEnabled && (
                    <button
                      onClick={() => {
                        setOpenReminderId(null);
                        setOpenNoteId(openNoteId === topic._id ? null : topic._id);
                        setNoteText(note);
                      }}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 ml-2 flex-shrink-0"
                    >
                      ✏️
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => {
                    setOpenReminderId(null);
                    setOpenNoteId(openNoteId === topic._id ? null : topic._id);
                    setNoteText('');
                  }}
                  disabled={!isEnabled}
                  className={`w-full flex items-center justify-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-100 transition-colors dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900/50 ${!isEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span className="text-sm flex-shrink-0">📝</span>
                  <span className="text-sm font-medium">Add Note</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Note Modal - Mobile Optimized */}
      {openNoteId === topic._id && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setOpenNoteId(null);
            }
          }}
        >
          <div className={`bg-white rounded-lg shadow-xl p-5 w-full max-w-md mx-4 ${darkCardBg}`}>
            <h3 className={`font-semibold text-lg mb-4 text-gray-800 ${darkText} leading-tight`}>
              Notes for: {topic.title}
            </h3>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              rows={4}
              placeholder="Type your notes here..."
              className={`w-full p-3 border border-gray-300 rounded-lg text-sm mb-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none ${darkInput}`}
              autoFocus
            />
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
              {note && (
                <button
                  onClick={() => {
                    updateProgress(topic._id, "note", "");
                    setOpenNoteId(null);
                  }}
                  className={`text-sm px-4 py-2 text-red-600 hover:bg-red-50 rounded transition-colors dark:text-red-400 dark:hover:bg-red-900/30 order-2 sm:order-1`}
                >
                  Clear Note
                </button>
              )}
              <div className="flex gap-3 order-1 sm:order-2">
                <button 
                  onClick={() => setOpenNoteId(null)} 
                  className={`flex-1 sm:flex-none text-sm px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors dark:border-gray-600 dark:hover:bg-gray-700`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    updateProgress(topic._id, "note", noteText);
                    setOpenNoteId(null);
                  }}
                  className="flex-1 sm:flex-none text-sm px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors dark:bg-indigo-700 dark:hover:bg-indigo-800"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TopicRow;