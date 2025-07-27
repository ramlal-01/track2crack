import React from "react";
import DatePicker from "react-datepicker";

const CurrentTopicSection = ({
  currentTopic,
  topicProgress,
  topicScores,
  userKnowsTopic,
  showResources,
  showQuiz,
  openReminderId,
  theme,
  handleUserResponse,
  handleSingleTopicQuiz,
  updateProgress,
  setUserKnowsTopic,
  setShowResources,
  setShowQuiz,
  setOpenReminderId,
  getIconUrl
}) => {
  if (!currentTopic) return null;

  const darkCardBg = "dark:bg-gray-800";
  const darkBorder = "dark:border-gray-700";
  const darkText = "dark:text-gray-200";
  const darkInput = "dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white";
  const darkHover = "dark:hover:bg-gray-700";

  return (
    <div className={`bg-white rounded-xl shadow-md p-4 lg:p-6 mb-8 border-2 border-indigo-200 relative ${darkCardBg} ${darkBorder} dark:border-indigo-800`}>
      <div className="flex flex-col lg:flex-row justify-between gap-6">
        <div className="flex-1">
          <h3 className={`text-xl lg:text-2xl font-bold text-indigo-700 mb-4 ${darkText} dark:text-indigo-300`}>
            Current Topic: {currentTopic.title}
          </h3>

          {/* Mobile-friendly Yes/No Selection */}
          {userKnowsTopic === null && !topicProgress.quizTaken && (
            <div className="mb-6">
              <p className={`text-gray-700 mb-4 ${darkText}`}>Do you already know this topic?</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleUserResponse(true)}
                  className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors dark:bg-green-600 dark:hover:bg-green-700 text-center"
                >
                  Yes, I know it
                </button>
                <button
                  onClick={() => handleUserResponse(false)}
                  className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors dark:bg-red-600 dark:hover:bg-red-700 text-center"
                >
                  No, I need to learn
                </button>
              </div>
            </div>
          )}

          {/* Back Button */}
          {userKnowsTopic !== null && !topicProgress.quizTaken && (
            <div className="mb-6">
              <button
                onClick={() => {
                  setUserKnowsTopic(null);
                  setShowResources(false);
                  setShowQuiz(false);
                }}
                className={`mt-2 px-3 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors text-sm ${darkHover} dark:bg-gray-600 dark:text-gray-200`}
              >
                ⬅ Back
              </button>
            </div>
          )}

          {/* Resources - Mobile Responsive */}
          {showResources && (
            <div className="mb-6">
              <h4 className={`font-semibold text-gray-800 mb-3 ${darkText}`}>Learning Resources:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentTopic.resources?.map((resource, idx) => (
                  <a
                    key={idx}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors ${darkHover} dark:border-gray-700 dark:hover:bg-gray-700`}
                  >
                    <img
                      src={getIconUrl(resource.type, resource.url)}
                      alt={resource.type}
                      className="w-8 h-8 mr-3 flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className={`font-medium text-gray-800 ${darkText} truncate`}>
                        {resource.title || resource.type}
                      </p>
                      <p className={`text-xs text-gray-500 ${darkText} dark:text-gray-400 truncate`}>
                        {new URL(resource.url).hostname}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
              <button
                onClick={() => {
                  setShowQuiz(true);
                  setShowResources(false);
                }}
                className="mt-4 w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors dark:bg-indigo-700 dark:hover:bg-indigo-800"
              >
                I've reviewed the resources, test me now
              </button>
            </div>
          )}

          {/* Quiz Block - Mobile Responsive */}
          {showQuiz && (
            <div className="mb-6">
              <h4 className={`font-semibold text-gray-800 mb-3 ${darkText}`}>Test Your Knowledge:</h4>
              <p className={`text-gray-700 mb-4 ${darkText}`}>
                Take a short quiz on this topic to assess your understanding.
              </p>
              <button
                onClick={() => handleSingleTopicQuiz(currentTopic.title)}
                className="w-full sm:w-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors dark:bg-purple-700 dark:hover:bg-purple-800"
              >
                Start Quiz
              </button>
              {topicProgress.quizTaken && (
                <div className={`mt-4 p-3 bg-blue-50 rounded-lg ${darkHover} dark:bg-blue-900/30`}>
                  <p className={`text-blue-800 ${darkText} dark:text-blue-300`}>
                    Quiz score: {topicProgress.quizScore}%
                    {topicProgress.quizScore >= 70
                      ? " - Great job!"
                      : " - Keep practicing!"}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Bookmark, Reminder, Notes - Mobile Responsive */}
          <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t border-gray-200 gap-4 ${darkBorder}`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={!!topicProgress.isBookmarked}
                  onChange={() => updateProgress(currentTopic._id, "isBookmarked")}
                  className="w-5 h-5 accent-amber-500 mr-2 dark:accent-amber-400"
                  id={`bookmark-${currentTopic._id}`}
                />
                <label htmlFor={`bookmark-${currentTopic._id}`} className={`text-gray-700 ${darkText}`}>
                  Bookmark
                </label>
              </div>

              <div className="relative">
                <button 
                  onClick={() => setOpenReminderId(openReminderId === currentTopic._id ? null : currentTopic._id)} 
                  className={`flex items-center gap-1 ${topicProgress.remindOn ? "text-sky-600 dark:text-sky-400" : "text-gray-500 dark:text-gray-400"}`}
                >
                  <span>{topicProgress.remindOn ? "⏰" : "🕒"}</span>
                  <span className="text-sm sm:text-base">{topicProgress.remindOn ? "Change Reminder" : "Set Reminder"}</span>
                </button>
                {openReminderId === currentTopic._id && (
                  <div className={`absolute z-50 top-8 left-0 sm:left-auto bg-white border border-gray-200 shadow-lg rounded-lg p-2 ${darkCardBg} ${darkBorder}`}>
                    <DatePicker
                      selected={topicProgress.remindOn ? new Date(topicProgress.remindOn) : null}
                      onChange={(date) => updateProgress(currentTopic._id, "remindOn", date)}
                      dateFormat="dd/MM/yyyy"
                      minDate={new Date()}
                      inline
                      className="dark:bg-gray-800"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Current Highest Score Card - Mobile Responsive */}
        <div className="w-full lg:w-75 lg:ml-6">
          <div className={`bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-sm lg:sticky lg:top-6 ${darkCardBg} ${darkBorder} dark:border-blue-800`}>
            <h4 className={`text-lg font-bold text-blue-700 mb-2 ${darkText} dark:text-blue-300`}>Current Topic Highest Score</h4>

            {topicScores[currentTopic?.title] ? (
              <div className={`text-2xl lg:text-4xl font-extrabold text-blue-600 mb-2 ${darkText} dark:text-blue-400`}>
                {`${topicScores[currentTopic.title].score}/${topicScores[currentTopic.title].total}`}
              </div>
            ) : (
              <div className={`text-xl lg:text-2xl font-semibold text-gray-500 mb-2 ${darkText} dark:text-gray-400`}>
                Not Attempted
              </div>
            )}

            {topicScores[currentTopic?.title] ? (
              topicScores[currentTopic.title].score >= (0.7 * topicScores[currentTopic.title].total) ? (
                <p className={`text-sm text-green-600 ${darkText} dark:text-green-400`}>
                  You've passed! You can move to next topic.
                </p>
              ) : (
                <p className={`text-sm text-red-600 ${darkText} dark:text-red-400`}>
                  Score below 70%. Retake quiz to proceed.
                </p>
              )
            ) : (
              <p className={`text-sm text-gray-600 ${darkText} dark:text-gray-400`}>
                Take quiz to assess your knowledge
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentTopicSection;