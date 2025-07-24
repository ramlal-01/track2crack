import API from "../../api/api";
import React, { useEffect, useState, useRef } from "react";
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaBookmark, FaRegBookmark, FaBell, FaSearch } from "react-icons/fa";
import { SiYoutube, SiGeeksforgeeks } from "react-icons/si";
import { MdQuiz } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const TheoryPage = ({ subject, title }) => {
  const [topics, setTopics] = useState([]);
  const [progress, setProgress] = useState({});
  const [activeTopic, setActiveTopic] = useState(null);
  const [userKnowsTopic, setUserKnowsTopic] = useState(null);
  const [showResources, setShowResources] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [openReminderId, setOpenReminderId] = useState(null);
  const [openNoteId, setOpenNoteId] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [progressPercent, setProgressPercent] = useState(0);
  const [quizCount, setQuizCount] = useState(0);
  const [topicScores, setTopicScores] = useState({});
  const [activeFilters, setActiveFilters] = useState({
    All: true,
    Important: false,
    Other: false,
    Bookmarked: false,
    Remind: false,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const reminderRefs = useRef({});
  const noteRefs = useRef({});
  const navigate = useNavigate();
  const { theme, toggleDarkMode } = useTheme();
  const darkMode = theme === "dark";

  // Dark mode color classes
  const darkBg = "dark:bg-gray-900 dark:text-white";
  const darkCardBg = "dark:bg-gray-800";
  const darkBorder = "dark:border-gray-700";
  const darkText = "dark:text-gray-200";
  const darkInput = "dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white";
  const darkHover = "dark:hover:bg-gray-700";

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchQuizProgress = async () => {
      try {
        const res = await API.get(`/quiz/progress?subject=${subject}&source=Theory`);
        setProgressPercent(res.data.progressPercent || 0);
        setQuizCount(res.data.attemptedTopics || 0);
        if (res.data.highestScoresPerTopic) {
          setTopicScores(res.data.highestScoresPerTopic);
        }
      } catch (err) {
        console.error("❌ Failed to fetch quiz-based progress:", err);
      }
    };

    if (token && subject) fetchQuizProgress();
  }, [token, subject]);

  useEffect(() => {
    const fetchData = async () => {
      const [topicsRes, progressRes] = await Promise.all([
        API.get(`/theory/topics?subject=${subject}`),
        API.get(`/theory/progress/${userId}`),
      ]);

      const topicsData = topicsRes.data;
      const progressData = progressRes.data;
      const progressMap = {};

      (progressData?.progress || []).forEach((p) => {
        progressMap[p.topicId] = {
          isCompleted: p.isCompleted,
          isBookmarked: p.isBookmarked,
          remindOn: p.remindOn,
          note: p.note || "",
          quizTaken: p.quizTaken || false,
          quizScore: p.quizScore || 0
        };
      });

      setTopics(topicsData.topics || []);
      setProgress(progressMap);
      
      // Find the first incomplete topic to set as active
      const firstIncomplete = topicsData.topics?.find(t => !progressMap[t._id]?.isCompleted);
      setActiveTopic(firstIncomplete?._id || null);
    };

    if (token && userId) fetchData();
  }, [token, userId, subject]);

  useEffect(() => {
    const handleQuizCompletion = async () => {
      const quizData = localStorage.getItem('quizCompleted');
      if (quizData) {
        const { topicId, score } = JSON.parse(quizData);
        
        // Update progress for the quiz
        const updatedProgress = {
          ...progress,
          [topicId]: {
            ...progress[topicId] || {},
            quizTaken: true,
            quizScore: score
          }
        };
        
        setProgress(updatedProgress);
        toast.success(`Quiz completed! Score: ${score}%`);
        localStorage.removeItem('quizCompleted');

        // Save to backend
        await API.post("/theory/progress", {
          topicId,
          isCompleted: updatedProgress[topicId]?.isCompleted || false,
          isBookmarked: updatedProgress[topicId]?.isBookmarked || false,
          remindOn: updatedProgress[topicId]?.remindOn || null,
          note: updatedProgress[topicId]?.note || "",
          quizTaken: true,
          quizScore: score
        });

        // If score is >= 70, mark as completed and move to next topic
        if (score >= 70) {
          const completedProgress = {
            ...updatedProgress,
            [topicId]: {
              ...updatedProgress[topicId],
              isCompleted: true
            }
          };
          
          setProgress(completedProgress);
          
          await API.post("/theory/progress", {
            topicId,
            isCompleted: true,
            isBookmarked: completedProgress[topicId]?.isBookmarked || false,
            remindOn: completedProgress[topicId]?.remindOn || null,
            note: completedProgress[topicId]?.note || "",
            quizTaken: true,
            quizScore: score
          });

          // Find next incomplete topic
          const currentIndex = topics.findIndex(t => t._id === topicId);
          const nextTopics = topics.slice(currentIndex + 1);
          const nextIncomplete = nextTopics.find(t => !completedProgress[t._id]?.isCompleted);
          
          if (nextIncomplete) {
            setActiveTopic(nextIncomplete._id);
            setUserKnowsTopic(null);
            setShowResources(false);
            setShowQuiz(false);
          }
        }
      }
    };

    if (token && userId) handleQuizCompletion();
  }, [activeTopic, progress, topics, token, userId]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (openNoteId && noteRefs.current[openNoteId] && !noteRefs.current[openNoteId].contains(e.target)) {
        setOpenNoteId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openNoteId]);

  // Calculate subject-specific topic IDs
  const subjectTopicIds = topics.map(t => t._id);
  const completed = subjectTopicIds.filter(id => progress[id]?.isCompleted).length;
  const bookmarked = subjectTopicIds.filter(id => progress[id]?.isBookmarked).length;
  const total = subjectTopicIds.length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  const toggleFilter = (filterName) => {
    if (["All", "Important", "Other"].includes(filterName)) {
      setActiveFilters({
        All: filterName === "All",
        Important: filterName === "Important",
        Other: filterName === "Other",
        Bookmarked: activeFilters.Bookmarked,
        Remind: activeFilters.Remind,
      });
    } else {
      setActiveFilters((prev) => ({
        ...prev,
        [filterName]: !prev[filterName],
      }));
    }
  };

  const updateProgress = async (topicId, field, value = null) => {
    const prev = progress[topicId] || {};
    const updated = {
      ...prev,
      [field]: field === "remindOn" || field === "quizScore" ? value : field === "note" ? value : !prev?.[field],
    };
    
    try {
      await API.post("/theory/progress", {
        topicId,
        isCompleted: updated.isCompleted,
        isBookmarked: updated.isBookmarked,
        remindOn: updated.remindOn ?? null,
        note: updated.note ?? "",
        quizTaken: updated.quizTaken || false,
        quizScore: updated.quizScore || 0
      });
      
      setProgress(prev => ({ ...prev, [topicId]: updated }));
      
      if (field === "isCompleted") {
        toast.success(updated.isCompleted ? "Marked as completed!" : "Marked as incomplete!");
      } else if (field === "isBookmarked") {
        toast.success(updated.isBookmarked ? "Bookmarked!" : "Removed bookmark!");
      } else if (field === "remindOn") {
        toast.success(value ? "Reminder set!" : "Reminder removed!");
      } else if (field === "note") {
        toast.success("Note saved!");
      }

      // If marking as complete, move to next topic
      if (field === 'isCompleted' && value === true) {
        const currentIndex = topics.findIndex(t => t._id === topicId);
        const nextTopics = topics.slice(currentIndex + 1);
        const nextIncomplete = nextTopics.find(t => !progress[t._id]?.isCompleted);
        
        if (nextIncomplete) {
          setActiveTopic(nextIncomplete._id);
          setUserKnowsTopic(null);
          setShowResources(false);
          setShowQuiz(false);
        }
      }
    } catch (err) {
      toast.error("Failed to save changes");
      console.error(err);
    }
  };

  const handleReminderChange = (topicId, date) => {
    updateProgress(topicId, "remindOn", date);
    setOpenReminderId(null);
  };

  const handleSingleTopicQuiz = async (topicTitle) => {
    try {
      const response = await API.post("/quiz/generate", {
        subject: subject,
        topics: [topicTitle],
        source: "Theory"
      });

      const data = response.data;

      localStorage.setItem('activeQuiz', JSON.stringify({
        ...data,
        topicId: activeTopic,
      }));

      navigate("/quiz");
    } catch (err) {
      console.error("Error generating quiz:", err);
      const msg = err?.response?.data?.message || "Something went wrong while generating the quiz";
      alert(msg);
    }
  };

  const getIconUrl = (type, url) => {
    if (type === "video") return "https://img.icons8.com/color/32/youtube-play.png";
    if (url.includes("geeksforgeeks")) return "https://upload.wikimedia.org/wikipedia/commons/4/43/GeeksforGeeks.svg";
    return "https://img.icons8.com/ios-filled/32/000000/read.png";
  };

  const handleUserResponse = (knowsTopic) => {
    setUserKnowsTopic(knowsTopic);
    if (knowsTopic) {
      setShowQuiz(true);
    } else {
      setShowResources(true);
    }
  };

  const isTopicEnabled = (topicId, index, filteredList) => {
    if (index === 0) return true;

    const prevTopic = filteredList[index - 1];
    const prevProgress = progress[prevTopic._id] || {};

    return (
      (prevProgress.quizTaken && prevProgress.quizScore >= 70) ||
      prevProgress.isCompleted
    );
  };

  const filteredTopics = topics.filter((t) => {
    const matchType =
      activeFilters.All ||
      (activeFilters.Important && t.type === "Important") ||
      (activeFilters.Other && t.type !== "Important");
    const matchBookmark = !activeFilters.Bookmarked || progress[t._id]?.isBookmarked;
    const matchRemind = !activeFilters.Remind || progress[t._id]?.remindOn;
    const matchSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());

    return matchType && matchBookmark && matchRemind && matchSearch;
  });

  const currentTopic = topics.find(t => t._id === activeTopic);
  const topicProgress = activeTopic ? progress[activeTopic] || {} : {};

  return (
    <div className={`px-10 py-3 max-w-8xl mx-auto min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 ${darkBg}`}>
      <ToastContainer position="bottom-right" autoClose={3000} />
      
      {/* Dashboard */}
      <div 
        className={`text-center mb-8 p-6 rounded-2xl shadow-lg max-w-xl mx-auto ${darkCardBg}`}
        style={{ background: theme === 'dark' ? '#1e3a8a' : '#043E86' }}
      >
        <h2 className="text-3xl font-bold text-white mb-3 font-serif tracking-wide">{title} Learning Path</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-10">
        <div className={`bg-white p-4 rounded-xl min-h-[100px] shadow-md border-l-4 border-blue-500 transition-all duration-300 hover:shadow-lg hover:scale-[1.03] hover:border-blue-600 ${darkCardBg} ${darkBorder} dark:border-l-blue-500 dark:hover:border-l-blue-600`}>
          <div className="flex justify-between items-center">
            <div>
              <div className={`text-2xl font-bold text-blue-800 ${darkText} dark:text-blue-300`}>{total}</div>
              <div className={`text-gray-600 text-lg ${darkText} dark:text-gray-300`}>Total Topics</div>
            </div>
            <div className={`bg-blue-100 p-2 rounded-full transition-all duration-300 group-hover:bg-blue-200 dark:bg-blue-900/50`}>
              <div className="w-5 h-5 bg-blue-500 rounded-full dark:bg-blue-400"></div>
            </div>
          </div>
        </div>
        
        <div className={`bg-white p-4 rounded-xl shadow-md border-l-4 border-green-500 transition-all duration-300 hover:shadow-lg hover:scale-[1.03] hover:border-green-600 ${darkCardBg} ${darkBorder} dark:border-l-green-500 dark:hover:border-l-green-600`}>
          <div className="flex justify-between items-center">
            <div>
              <div className={`text-2xl font-bold text-green-800 ${darkText} dark:text-green-300`}>{completed}</div>
              <div className={`text-gray-600 text-lg ${darkText} dark:text-gray-300`}>Completed</div>
            </div>
            <div className={`bg-green-100 p-2 rounded-full transition-all duration-300 group-hover:bg-green-200 dark:bg-green-900/50`}>
              <div className="w-5 h-5 bg-green-500 rounded-full dark:bg-green-400"></div>
            </div>
          </div>
        </div>
        
        <div className={`bg-white p-4 rounded-xl shadow-md border-l-4 border-amber-500 transition-all duration-300 hover:shadow-lg hover:scale-[1.03] hover:border-amber-600 ${darkCardBg} ${darkBorder} dark:border-l-amber-500 dark:hover:border-l-amber-600`}>
          <div className="flex justify-between items-center">
            <div>
              <div className={`text-2xl font-bold text-amber-700 ${darkText} dark:text-amber-300`}>{bookmarked}</div>
              <div className={`text-gray-600 text-lg ${darkText} dark:text-gray-300`}>Bookmarked</div>
            </div>
            <div className={`bg-amber-100 p-2 rounded-full transition-all duration-300 group-hover:bg-amber-200 dark:bg-amber-900/50`}>
              <div className="w-5 h-5 bg-amber-500 rounded-full dark:bg-amber-400"></div>
            </div>
          </div>
        </div>
        
        <div className={`bg-white p-4 rounded-xl shadow-md border-l-4 border-purple-500 transition-all duration-300 hover:shadow-lg hover:scale-[1.03] hover:border-purple-600 ${darkCardBg} ${darkBorder} dark:border-l-purple-500 dark:hover:border-l-purple-600`}>
          <div className="flex justify-between items-center">
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
                {quizCount} quiz taken
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Current Active Topic */}
      {currentTopic && (
        <div className={`bg-white rounded-xl shadow-md p-6 mb-8 border-2 border-indigo-200 relative ${darkCardBg} ${darkBorder} dark:border-indigo-800`}>
          <div className="flex justify-between">
            <div className="flex-1">
              <h3 className={`text-2xl font-bold text-indigo-700 mb-4 ${darkText} dark:text-indigo-300`}>
                Current Topic: {currentTopic.title}
              </h3>
              
              {userKnowsTopic === null && !topicProgress.quizTaken && (
                <div className="mb-6">
                  <p className={`text-gray-700 mb-4 ${darkText}`}>Do you already know this topic?</p>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => handleUserResponse(true)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors dark:bg-green-600 dark:hover:bg-green-700"
                    >
                      Yes, I know it
                    </button>
                    <button 
                      onClick={() => handleUserResponse(false)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors dark:bg-red-600 dark:hover:bg-red-700"
                    >
                      No, I need to learn
                    </button>
                  </div>
                </div>
              )}

              {/* Back Button */}
              {(userKnowsTopic !== null || showResources || showQuiz) && !topicProgress.quizTaken && (
                <div className="mb-6">
                  <button
                    onClick={() => {
                      setUserKnowsTopic(null);
                      setShowResources(false);
                      setShowQuiz(false);
                    }}
                    className={`mt-2 px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors text-sm ${darkHover} dark:bg-gray-600 dark:text-gray-200`}
                  >
                    ⬅ Back
                  </button>
                </div>
              )}

              {showResources && (
                <div className="mb-6">
                  <h4 className={`font-semibold text-gray-800 mb-3 ${darkText}`}>Learning Resources:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          className="w-8 h-8 mr-3"
                        />
                        <div>
                          <p className={`font-medium text-gray-800 ${darkText}`}>{resource.title || resource.type}</p>
                          <p className={`text-xs text-gray-500 ${darkText} dark:text-gray-400`}>{new URL(resource.url).hostname}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setShowQuiz(true);
                      setShowResources(false);
                    }}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors dark:bg-indigo-700 dark:hover:bg-indigo-800"
                  >
                    I've reviewed the resources, test me now
                  </button>
                </div>
              )}

              {showQuiz && (
                <div className="mb-6">
                  <h4 className={`font-semibold text-gray-800 mb-3 ${darkText}`}>Test Your Knowledge:</h4>
                  <p className={`text-gray-700 mb-4 ${darkText}`}>
                    Take a short quiz on this topic to assess your understanding.
                  </p>
                  <button
                    onClick={() => handleSingleTopicQuiz(currentTopic.title)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors dark:bg-purple-700 dark:hover:bg-purple-800"
                  >
                    Start Quiz
                  </button>
                  {topicProgress.quizTaken && (
                    <div className={`mt-4 p-3 bg-blue-50 rounded-lg ${darkHover} dark:bg-blue-900/30`}>
                      <p className={`text-blue-800 ${darkText} dark:text-blue-300`}>
                        Quiz score: {topicProgress.quizScore}%
                        {topicProgress.quizScore >= 70 ? " - Great job!" : " - Keep practicing!"}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className={`flex justify-between items-center pt-4 border-t border-gray-200 ${darkBorder}`}>
                <div className="flex items-center gap-4">
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
                      <span>{topicProgress.remindOn ? "Change Reminder" : "Set Reminder"}</span>
                    </button>
                    {openReminderId === currentTopic._id && (
                      <div className={`absolute z-50 top-8 bg-white border border-gray-200 shadow-lg rounded-lg p-2 ${darkCardBg} ${darkBorder}`}>
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

                <div className="flex items-center gap-4">
                  {topicProgress.quizTaken && (
                    <button
                      onClick={() => {
                        updateProgress(activeTopic, "isCompleted", true);
                        // Find next incomplete topic
                        const currentIndex = topics.findIndex(t => t._id === activeTopic);
                        const nextTopics = topics.slice(currentIndex + 1);
                        const nextIncomplete = nextTopics.find(t => !progress[t._id]?.isCompleted);
                        
                        if (nextIncomplete) {
                          setActiveTopic(nextIncomplete._id);
                          setUserKnowsTopic(null);
                          setShowResources(false);
                          setShowQuiz(false);
                        }
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors dark:bg-green-700 dark:hover:bg-green-800"
                    >
                      Mark as Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Current Highest Score Card - Right Side */}
            <div className="ml-6 w-64">
              <div className={`bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-sm sticky top-6 ${darkCardBg} ${darkBorder} dark:border-blue-800`}>
                <h4 className={`text-lg font-bold text-blue-700 mb-2 ${darkText} dark:text-blue-300`}>Current Topic Highest Score</h4>

                {topicScores[currentTopic?.title] ? (
                  <div className={`text-4xl font-extrabold text-blue-600 mb-2 ${darkText} dark:text-blue-400`}>
                    {`${topicScores[currentTopic.title].score}/${topicScores[currentTopic.title].total}`}
                  </div>
                ) : (
                  <div className={`text-2xl font-semibold text-gray-500 mb-2 ${darkText} dark:text-gray-400`}>
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
      )}

      {/* Filters and Search */}
      <div className={`bg-white p-5 rounded-xl shadow-md mb-8 ${darkCardBg}`}>
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex flex-wrap gap-2">
            {["All", "Important", "Other", "Bookmarked", "Remind"].map((type) => (
              <button
                key={type}
                onClick={() => toggleFilter(type)}
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                  activeFilters[type]
                    ? type === "Important"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-200 dark:border-emerald-700 dark:hover:bg-emerald-900"
                      : type === "Other"
                      ? "bg-blue-100 text-blue-800 border border-blue-300 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-200 dark:border-blue-700 dark:hover:bg-blue-900"
                      : type === "Bookmarked"
                      ? "bg-purple-100 text-purple-800 border border-purple-300 hover:bg-purple-200 dark:bg-purple-900/50 dark:text-purple-200 dark:border-purple-700 dark:hover:bg-purple-900"
                      : type === "Remind"
                      ? "bg-cyan-100 text-cyan-800 border border-cyan-300 hover:bg-cyan-200 dark:bg-cyan-900/50 dark:text-cyan-200 dark:border-cyan-700 dark:hover:bg-cyan-900"
                      : "bg-indigo-100 text-indigo-800 border border-indigo-300 hover:bg-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-200 dark:border-indigo-700 dark:hover:bg-indigo-900"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                }`}
              >
                {type === "Bookmarked" && (
                  <FaBookmark className={activeFilters[type] ? "text-purple-600 dark:text-purple-400" : "text-gray-500 dark:text-gray-400"} />
                )}
                {type === "Remind" && (
                  <FaBell className={activeFilters[type] ? "text-cyan-600 dark:text-cyan-400" : "text-gray-500 dark:text-gray-400"} />
                )}
                {type}
              </button>
            ))}
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-gray-400 transition-colors ${darkInput}`}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" />
          </div>
        </div>
      </div>

      {/* All Topics List */}
      <div className={`bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 ${darkCardBg} ${darkBorder}`}>
        <div className={`grid grid-cols-[100px_6fr_1fr_1fr_1fr_1.5fr_1fr_200px] font-bold text-gray-700 bg-gray-100 p-4 border-b border-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600`}>
          <div className="text-center text-base uppercase tracking-wider">Status</div>
          <div className="pl-5 text-base uppercase tracking-wider">Topic</div>
          <div className="text-center text-base uppercase tracking-wider">GFG</div>
          <div className="text-center text-base uppercase tracking-wider">YT</div>
          <div className="text-center text-base uppercase tracking-wider">Quiz</div>
          <div className="text-center text-base uppercase tracking-wider">Bookmark</div>
          <div className="text-center text-base uppercase tracking-wider">Reminder</div>
          <div className="text-center text-base uppercase tracking-wider">Notes</div>
        </div>

        {filteredTopics.map((topic, index) => {
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

          return (
            <div
              key={topic._id}
              className={`grid grid-cols-[100px_6fr_1fr_1fr_1fr_1.5fr_1fr_200px] items-center p-4 rounded-xl transition-all border-gray-200 ${
                isCompleted 
                  ? "bg-green-50 border-2 border-green-400 hover:border-green-500 dark:bg-green-900/20 dark:border-green-700 dark:hover:border-green-600" 
                  : isCurrentTopic 
                  ? "bg-indigo-50 border-2 border-indigo-400 dark:bg-indigo-900/20 dark:border-indigo-700"
                  : !isEnabled
                  ? "bg-gray-100 border border-gray-300 opacity-60 dark:bg-gray-700/50 dark:border-gray-600"
                  : "bg-white border border-gray-200 hover:border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600"
              }`}
            >
              <div className="flex justify-center">
                {isCompleted ? (
                  <span className="text-green-600 text-xl dark:text-green-400">✓</span>
                ) : (
                  <span className="text-gray-400 text-xl dark:text-gray-500">○</span>
                )}
              </div>

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
                  <div className={`text-sb text-gray-700 mt-1 ${darkText} dark:text-gray-300`}>{topic.notes}</div>
                )}
              </div>

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
              
              <div className="flex justify-center">
                <button 
                  onClick={() => handleSingleTopicQuiz(topic.title)} 
                  disabled={!canAttemptQuiz}
                  className={`px-2 py-1 text-xs rounded border transition-all ${
                    canAttemptQuiz
                      ? "bg-gradient-to-br from-purple-100 to-purple-50 hover:from-purple-200 hover:to-purple-100 text-purple-800 border-purple-200 dark:from-purple-900/50 dark:to-purple-800/50 dark:hover:from-purple-900 dark:hover:to-purple-800 dark:text-purple-200 dark:border-purple-700"
                      : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600"
                  }`}
                >
                  <MdQuiz className="text-xl" />
                </button>
              </div>
              
              <div className="flex justify-center">
                <button 
                  onClick={() => updateProgress(topic._id, "isBookmarked")}
                  disabled={!isEnabled}
                  className={`text-xl hover:scale-125 transition-transform duration-200 ${!isEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                >
                  {isBookmarked ? (
                    <FaBookmark className="text-amber-500 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300" />
                  ) : (
                    <FaRegBookmark className="text-gray-400 hover:text-amber-400 dark:text-gray-500 dark:hover:text-amber-400" />
                  )}
                </button>
              </div>
              
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

                {openNoteId === topic._id && (
                  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
                    <div className={`bg-white rounded-lg shadow-xl p-5 w-96 max-w-[90vw] ${darkCardBg}`}>
                      <h3 className={`font-semibold text-lg mb-3 text-gray-800 ${darkText}`}>Notes for: {topic.title}</h3>
                      <textarea
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        rows={5}
                        placeholder="Type your notes here..."
                        className={`w-full p-3 border border-gray-300 rounded-lg text-sm mb-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${darkInput}`}
                        autoFocus
                      />
                      <div className="flex justify-between items-center">
                        {note && (
                          <button
                            onClick={() => {
                              updateProgress(topic._id, "note", "");
                              setOpenNoteId(null);
                            }}
                            className={`text-sm px-3 py-1 text-red-600 hover:bg-red-50 rounded transition-colors dark:text-red-400 dark:hover:bg-red-900/30`}
                          >
                            Clear Note
                          </button>
                        )}
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setOpenNoteId(null)} 
                            className={`text-sm px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 transition-colors dark:border-gray-600 dark:hover:bg-gray-700`}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              updateProgress(topic._id, "note", noteText);
                              setOpenNoteId(null);
                            }}
                            className="text-sm px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors dark:bg-indigo-700 dark:hover:bg-indigo-800"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TheoryPage;