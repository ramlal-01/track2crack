import API from "../../api/api";
import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

// Import new components
import ProgressCards from "../../components/Theory/ProgressCards";
import CurrentTopicSection from "../../components/Theory/CurrentTopicSection";
import FilterControls from "../../components/Theory/FilterControls";
import TopicsTable from "../../components/Theory/TopicsTable";

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

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  // Click outside handler for closing modals and calendars
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close list topic reminder calendars
      if (openReminderId && reminderRefs.current[openReminderId] && 
          !reminderRefs.current[openReminderId].contains(event.target)) {
        setOpenReminderId(null);
      }

      // Close note modals (they have their own backdrop, but this handles edge cases)
      if (openNoteId && noteRefs.current[openNoteId] && 
          !noteRefs.current[openNoteId].contains(event.target)) {
        // Note: Note modals are handled by their backdrop click, so this is just a fallback
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openReminderId, openNoteId]);

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
  }, [activeTopic, progress, topics, token, userId, subject]);

  // Calculate subject-specific topic IDs
  const subjectTopicIds = topics.map(t => t._id);
  const completed = subjectTopicIds.filter(id => progress[id]?.isCompleted).length;
  const bookmarked = subjectTopicIds.filter(id => progress[id]?.isBookmarked).length;
  const total = subjectTopicIds.length;

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
    <div className={`px-4 lg:px-10 py-3 max-w-8xl mx-auto min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 ${darkBg}`}>
      {/* Dashboard */}
      <div 
        className={`text-center mb-8 p-6 rounded-2xl shadow-lg max-w-xl mx-auto ${darkCardBg}`}
        style={{ background: theme === 'dark' ? '#1e3a8a' : '#043E86' }}
      >
        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3 font-serif tracking-wide">{title} Learning Path</h2>
      </div>

      {/* Progress Cards */}
      <ProgressCards 
        total={total}
        completed={completed}
        bookmarked={bookmarked}
        progressPercent={progressPercent}
        quizCount={quizCount}
        darkMode={darkMode}
      />
      
      {/* Current Active Topic Section */}
      <CurrentTopicSection 
        currentTopic={currentTopic}
        topicProgress={topicProgress}
        topicScores={topicScores}
        userKnowsTopic={userKnowsTopic}
        showResources={showResources}
        showQuiz={showQuiz}
        theme={theme}
        handleUserResponse={handleUserResponse}
        handleSingleTopicQuiz={handleSingleTopicQuiz}
        setUserKnowsTopic={setUserKnowsTopic}
        setShowResources={setShowResources}
        setShowQuiz={setShowQuiz}
        getIconUrl={getIconUrl}
      />

      {/* Filter Controls */}
      <FilterControls 
        activeFilters={activeFilters}
        searchTerm={searchTerm}
        toggleFilter={toggleFilter}
        setSearchTerm={setSearchTerm}
      />

      {/* Topics Table */}
      <TopicsTable 
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


    </div>
  );
};

export default TheoryPage;