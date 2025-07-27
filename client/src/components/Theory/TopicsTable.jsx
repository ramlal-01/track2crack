import React from "react";
import TopicRow from "./TopicRow";

const TopicsTable = ({
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
  const darkCardBg = "dark:bg-gray-800";
  const darkBorder = "dark:border-gray-700";
  const darkText = "dark:text-gray-200";

  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 ${darkCardBg} ${darkBorder}`}>
      {/* Desktop Table Header - Hidden on Mobile */}
      <div className={`hidden lg:grid lg:grid-cols-[100px_6fr_1fr_1fr_1fr_1.5fr_1fr_200px] font-bold text-gray-700 bg-gray-100 p-4 border-b border-gray-300 dark:bg-gray-700 ${darkText} dark:border-gray-600`}>
        <div className="text-center text-base uppercase tracking-wider">Status</div>
        <div className="pl-5 text-base uppercase tracking-wider">Topic</div>
        <div className="text-center text-base uppercase tracking-wider">GFG</div>
        <div className="text-center text-base uppercase tracking-wider">YT</div>
        <div className="text-center text-base uppercase tracking-wider">Quiz</div>
        <div className="text-center text-base uppercase tracking-wider">Bookmark</div>
        <div className="text-center text-base uppercase tracking-wider">Reminder</div>
        <div className="text-center text-base uppercase tracking-wider">Notes</div>
      </div>

      {/* Topics List */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {filteredTopics.map((topic, index) => (
          <TopicRow
            key={topic._id}
            topic={topic}
            index={index}
            filteredTopics={filteredTopics}
            progress={progress}
            activeTopic={activeTopic}
            isTopicEnabled={isTopicEnabled}
            updateProgress={updateProgress}
            handleReminderChange={handleReminderChange}
            handleSingleTopicQuiz={handleSingleTopicQuiz}
            openReminderId={openReminderId}
            openNoteId={openNoteId}
            noteText={noteText}
            setOpenReminderId={setOpenReminderId}
            setOpenNoteId={setOpenNoteId}
            setNoteText={setNoteText}
            reminderRefs={reminderRefs}
            noteRefs={noteRefs}
            darkMode={darkMode}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredTopics.length === 0 && (
        <div className="p-8 text-center">
          <p className={`text-gray-500 ${darkText} dark:text-gray-400`}>
            No topics found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default TopicsTable;