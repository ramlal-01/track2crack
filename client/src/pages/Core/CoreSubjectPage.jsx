import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import API from "../../api/api";

// Import new components
import ProgressCards from "../../components/Core/ProgressCards";
import CurrentTopicSection from "../../components/Core/CurrentTopicSection";
import FilterControls from "../../components/Core/FilterControls";
import TopicsTable from "../../components/Core/TopicsTable";

const CoreSubjectPage = ({ subject, title }) => {
  const [topics, setTopics] = useState([]);
  const [progress, setProgress] = useState({});
  const [activeTopic, setActiveTopic] = useState(null);
  const [userKnowsTopic, setUserKnowsTopic] = useState(null);
  const [showResources, setShowResources] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [userHasAnswered, setUserHasAnswered] = useState(false);
  const [topicScores, setTopicScores] = useState({});
  const { theme, toggleDarkMode } = useTheme();
  const darkMode = theme === "dark";

  const [activeFilters, setActiveFilters] = useState({
    All: true,
    Important: false,
    Other: false,
    Bookmarked: false,
    Remind: false,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [openReminderId, setOpenReminderId] = useState(null);
  const [openNoteId, setOpenNoteId] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [progressPercent, setProgressPercent] = useState(0);
  const [quizCount, setQuizCount] = useState(0);
  const reminderRefs = useRef({});
  const noteRefs = useRef({});
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const handlePageShow = (event) => {
      if (event.persisted) {
        window.location.reload();
      }
    };

    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  useEffect(() => {
    const fetchQuizProgress = async () => {
      try {
        const res = await API.get(`/quiz/progress?subject=${subject}&source=Core`);
        setProgressPercent(res.data.progressPercent || 0);
        setQuizCount(res.data.attemptedTopics || 0);
        if (res.data.highestScoresPerTopic) {
          setTopicScores(res.data.highestScoresPerTopic);
        }
      } catch (err) {
        console.error("❌ Failed to fetch quiz-based progress:", err);
      }
    };

    if (token) fetchQuizProgress();
  }, [token, subject]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [topicsRes, progressRes] = await Promise.all([
          API.get(`/core/topics?subject=${subject}`),
          API.get(`/core/progress/${userId}?subject=${subject}`),
        ]);
        
        const progressMap = {};
        (progressRes.data.progress || []).forEach((p) => {
          progressMap[p.coreTopicId] = {
            isCompleted: p.isCompleted,
            isBookmarked: p.isBookmarked,
            remindOn: p.remindOn,
            note: p.note || "",
            quizTaken: p.quizTaken || false,
            quizScore: p.quizScore || 0
          };
        });

        setTopics(topicsRes.data.topics || []);
        setProgress(progressMap);
        
        // Find the first incomplete topic to set as active
        const firstIncomplete = topicsRes.data.topics?.find(t => !progressMap[t._id]?.isCompleted);
        setActiveTopic(firstIncomplete?._id || null);
      } catch (err) {
        console.error(err);
        toast.error(`Failed to load ${subject} topics data`);
      }
    };
    fetchData();
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
        try {
          await API.post("/core/progress", { 
            coreTopicId: topicId,
            subject: subject,
            isCompleted: updatedProgress[topicId]?.isCompleted || false,
            isBookmarked: updatedProgress[topicId]?.isBookmarked || false,
            remindOn: updatedProgress[topicId]?.remindOn || null,
            note: updatedProgress[topicId]?.note || "",
            quizTaken: true,
            quizScore: score
          });
        } catch (err) {
          console.error("Failed to save quiz progress:", err);
        }

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
          
          try {
            await API.post("/core/progress", { 
              coreTopicId: topicId,
              subject: subject,
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
          } catch (err) {
            console.error("Failed to mark topic as complete:", err);
          }
        }
      }
    };

    if (token && userId) handleQuizCompletion();
  }, [activeTopic, progress, topics, token, userId, subject]);

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
      await API.post("/core/progress", { 
        coreTopicId: topicId,
        subject: subject,
        ...updated 
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
        source: "Core",
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

  const getIconUrl = (type, url) => {
    if (type === "video") return "https://img.icons8.com/color/32/youtube-play.png";
    if (url.includes("geeksforgeeks")) return "https://upload.wikimedia.org/wikipedia/commons/4/43/GeeksforGeeks.svg";
    return "https://img.icons8.com/ios-filled/32/000000/read.png";
  };

  // Dark mode color classes
  const darkBg = "dark:bg-gray-900 dark:text-white";
  const darkCardBg = "dark:bg-gray-800";

  return (
    <div className={`px-4 lg:px-10 py-3 max-w-8xl mx-auto min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 ${darkBg}`}> 
      
      {/* Title Header - Mobile Responsive */}
      <div 
        className={`text-center mb-6 lg:mb-8 p-4 lg:p-6 rounded-2xl shadow-lg max-w-xl mx-auto ${darkCardBg}`}
        style={{ background: theme === 'dark' ? '#1e3a8a' : '#043E86' }}
      >
        <div className="text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3 font-serif tracking-wide">{title}</h2>
        </div>
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
        openReminderId={openReminderId}
        theme={theme}
        handleUserResponse={handleUserResponse}
        handleSingleTopicQuiz={handleSingleTopicQuiz}
        updateProgress={updateProgress}
        setUserKnowsTopic={setUserKnowsTopic}
        setShowResources={setShowResources}
        setShowQuiz={setShowQuiz}
        setOpenReminderId={setOpenReminderId}
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
      />
    </div>
  );
};

export default CoreSubjectPage;