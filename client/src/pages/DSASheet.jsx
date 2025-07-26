import React, { useEffect, useState, useRef } from "react";
import API from "../api/api";
import { toast } from 'react-toastify';   
import { useTheme } from "../context/ThemeContext";

// Import custom components
import ProgressCircles from "../components/DSA/ProgressCircles";
import FilterTabs from "../components/DSA/FilterTabs";
import SearchBar from "../components/DSA/SearchBar";
import TopicSection from "../components/DSA/TopicSection";

const DSASheet = () => {
  // State management
  const [groupedQuestions, setGroupedQuestions] = useState({});
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [openReminderId, setOpenReminderId] = useState(null);
  const [expandedTopics, setExpandedTopics] = useState({});
  const [animatedWidths, setAnimatedWidths] = useState({});
  const [filter, setFilter] = useState("All");
  const [openNoteId, setOpenNoteId] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [resettingTopic, setResettingTopic] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  
  // Refs
  const reminderRefs = useRef({});
  const noteRefs = useRef({});
  const topicRefs = useRef({});
  
  // User and theme
  const userId = localStorage.getItem("userId");
  const { theme } = useTheme();
  const darkMode = theme === "dark";

  // Dark mode classes
  const darkBg = "dark:bg-gray-900 dark:text-white";
  const darkCardBg = "dark:bg-gray-800";
  const darkBorder = "dark:border-gray-700";
  const darkText = "dark:text-gray-200";
  const darkInput = "dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white";
  const darkTableHeader = "dark:bg-gray-700 dark:text-gray-200";
  const darkTableRow = "dark:bg-gray-800 dark:hover:bg-gray-700";

  // Fetch data
  const fetchAll = async () => {
    try {
      const qRes = await API.get("/dsa/questions");
      const pRes = await API.get(`/dsa/progress/${userId}`);

      const grouped = {};
      qRes.data.questions.forEach((q) => {
        if (!grouped[q.topic]) grouped[q.topic] = [];
        grouped[q.topic].push(q);
      });

      Object.keys(grouped).forEach((topic) => {
        grouped[topic].sort((a, b) => {
          const order = { Easy: 1, Medium: 2, Hard: 3 };
          return order[a.difficulty] - order[b.difficulty];
        });
      });

      const map = {};
      pRes.data.progress.forEach((p) => {
        map[p.questionId] = p;
      });

      setGroupedQuestions(grouped);
      setProgressMap(map);
 
      // Trigger actual widths after short delay
      setTimeout(() => {
        const calculatedWidths = {};
        Object.keys(grouped).forEach((topic) => {
          const qs = grouped[topic];
          const done = qs.filter((q) => map[q._id]?.isCompleted).length;
          const percent = Math.round((done / qs.length) * 100);
          calculatedWidths[topic] = percent;
        });
        setAnimatedWidths(calculatedWidths);
      }, 50);
    } catch (err) {
      console.error("Failed to load DSA sheet", err);
      toast.error("Failed to load DSA sheet");
    } finally {
      setLoading(false);
    }
  };

  // Filter questions based on current filters
  const getFilteredQuestions = () => {
    const result = {};
    Object.keys(groupedQuestions).forEach((topic) => {
      // First filter by difficulty
      let topicQuestions = groupedQuestions[topic].filter(q => 
        difficultyFilter === "All" || q.difficulty === difficultyFilter
      );

      // Then apply other filters
      topicQuestions = topicQuestions.filter((q) => {
        const matchesSearch = searchQuery 
          ? q.title.toLowerCase().includes(searchQuery.toLowerCase())
          : true;
        
        if (filter === "Solved") return matchesSearch && progressMap[q._id]?.isCompleted;
        if (filter === "Bookmarked") return matchesSearch && progressMap[q._id]?.isBookmarked;
        if (filter === "Reminders") return matchesSearch && progressMap[q._id]?.remindOn;
        
        return matchesSearch;
      });

      if (topicQuestions.length > 0) {
        result[topic] = topicQuestions;
      }
    });
    return result;
  };

  // Update progress
  const updateProgress = async (questionId, updates) => {
    try {
      const token = localStorage.getItem('token');
      await API.post(`/dsa/progress`, { questionId, ...updates });
      setProgressMap((prev) => ({
        ...prev,
        [questionId]: {
          ...prev[questionId],
          ...updates
        }
      }));
    } catch (error) {
      console.error("Failed to update progress", error);
      toast.error("Failed to save update.");
    }
  };

  // Handle toggle (completion/bookmark)
  const handleToggle = async (qid, field) => {
    const current = progressMap[qid] || {};
    const updated = {
      ...current,
      questionId: qid,
      isCompleted: field === "isCompleted" ? !current.isCompleted : current.isCompleted || false,
      isBookmarked: field === "isBookmarked" ? !current.isBookmarked : current.isBookmarked || false,
      remindOn: current.remindOn || null,
    };
    
    try {
      await API.post("/dsa/progress", updated);
      setProgressMap((prev) => ({ ...prev, [qid]: updated }));
      
      if (field === "isCompleted") {
        toast.success(updated.isCompleted ? "Marked as complete!" : "Marked as incomplete!");
      } else if (field === "isBookmarked") {
        toast.success(updated.isBookmarked ? "Bookmarked!" : "Bookmark removed!");
      }
    } catch (err) {
      toast.error("Error updating progress");
    }
  };

  // Handle reminder change
  const handleReminderChange = async (qid, date) => {
    const current = progressMap[qid] || {};
    const updated = {
      ...current,
      questionId: qid,
      isCompleted: current.isCompleted || false,
      isBookmarked: current.isBookmarked || false,
      remindOn: date,
    };
    
    try {
      await API.post("/dsa/progress", updated);
      setProgressMap((prev) => ({ ...prev, [qid]: updated }));
      
      if (date === null) {
        toast.success("Reminder cleared!");
      } else {
        toast.success("Reminder set!");
      }
      setOpenReminderId(null);
    } catch (err) {
      toast.error("Failed to set reminder");
    }
  };

  // Handle topic reset
  const handleResetTopic = async (topic) => {
    const confirmReset = window.confirm(
      `Are you sure you want to reset all progress for "${topic}"?\nThis will clear all checkmarks, bookmarks, reminders and notes.`
    );
    if (!confirmReset) return;

    const questions = groupedQuestions[topic];
    const updates = questions.map((q) => ({
      questionId: q._id,
      isCompleted: false,
      isBookmarked: false,
      remindOn: null,
      note: '',
    }));

    setResettingTopic(topic);
    try {
      await Promise.all(updates.map((u) => API.post("/dsa/progress", u)));
      toast.success(`Progress reset for "${topic}"`);

      const newMap = { ...progressMap };
      updates.forEach((u) => {
        newMap[u.questionId] = {
          ...newMap[u.questionId],
          ...u,
        };
      });
      setProgressMap(newMap);
    } catch (err) {
      toast.error("Failed to reset progress for topic");
    } finally {
      setResettingTopic(null);
    }
  };

  // Calculate progress statistics
  const allQuestions = Object.values(groupedQuestions).flat();
  const total = allQuestions.length;
  const completed = Object.values(progressMap).filter((q) => q.isCompleted).length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Calculate difficulty-specific progress
  const easyQuestions = allQuestions.filter(q => q.difficulty === "Easy");
  const mediumQuestions = allQuestions.filter(q => q.difficulty === "Medium");
  const hardQuestions = allQuestions.filter(q => q.difficulty === "Hard");

  const easyCompleted = easyQuestions.filter(q => progressMap[q._id]?.isCompleted).length;
  const mediumCompleted = mediumQuestions.filter(q => progressMap[q._id]?.isCompleted).length;
  const hardCompleted = hardQuestions.filter(q => progressMap[q._id]?.isCompleted).length;

  const easyProgress = easyQuestions.length > 0 ? Math.round((easyCompleted / easyQuestions.length) * 100) : 0;
  const mediumProgress = mediumQuestions.length > 0 ? Math.round((mediumCompleted / mediumQuestions.length) * 100) : 0;
  const hardProgress = hardQuestions.length > 0 ? Math.round((hardCompleted / hardQuestions.length) * 100) : 0;

  const filteredQuestions = getFilteredQuestions();

  // Effects
  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setOpenNoteId(null);
        setOpenReminderId(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const newWidths = {};
    Object.keys(groupedQuestions).forEach((topic) => {
      const qs = groupedQuestions[topic];
      const done = qs.filter((q) => progressMap[q._id]?.isCompleted).length;
      const percent = Math.round((done / qs.length) * 100);
      newWidths[topic] = percent;
    });
    setAnimatedWidths(newWidths);
  }, [groupedQuestions, progressMap]);

  // Improved click outside handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Check if click is inside any modal or dropdown
      const clickedInsideReminder = reminderRefs.current[openReminderId]?.contains(e.target);
      const clickedInsideNote = noteRefs.current[openNoteId]?.contains(e.target);
      
      // Check if click is inside any topic section
      const clickedInsideAnyTopic = Object.values(topicRefs.current).some(ref => ref?.contains(e.target));
      
      // Check if click is inside filter controls
      const filterButtons = document.querySelectorAll('[data-filter-button]');
      const difficultySelect = document.querySelector('select');
      const searchInput = document.querySelector('input[type="text"]');
      const clickedInsideControls = 
        Array.from(filterButtons).some(btn => btn.contains(e.target)) ||
        difficultySelect?.contains(e.target) ||
        searchInput?.contains(e.target);

      // Only close topics if clicked completely outside and no modals are open
      if (!clickedInsideAnyTopic && !clickedInsideControls && !clickedInsideReminder && !clickedInsideNote && !openReminderId && !openNoteId) {
        setTimeout(() => {
          setExpandedTopics({});
        }, 100);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openReminderId, openNoteId]);

  // Loading state
  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkBg}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className={`text-lg ${darkText}`}>Loading DSA Sheet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-slate-50 ${darkBg}`}>
      <div className="container mx-auto px-4 py-6 md:px-6 md:py-8 lg:px-8 lg:py-10">
        {/* Header */}
        <div className={`mb-8 p-4 md:p-6 lg:p-8 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-md ${darkCardBg} ${darkBorder}`}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Title */}
            <div className="text-center lg:text-left">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-indigo-700 dark:text-indigo-400 flex items-center justify-center lg:justify-start gap-2 tracking-tight">
                📘 <span>DSA Sheet</span>
              </h1>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 tracking-wide mt-1">
                Track your completion and revisit daily
              </p>
            </div>

            {/* Progress Circles */}
            <div className="flex justify-center">
              <ProgressCircles
                easyProgress={easyProgress}
                mediumProgress={mediumProgress}
                hardProgress={hardProgress}
                progress={progress}
                easyCompleted={easyCompleted}
                easyQuestions={easyQuestions}
                mediumCompleted={mediumCompleted}
                mediumQuestions={mediumQuestions}
                hardCompleted={hardCompleted}
                hardQuestions={hardQuestions}
                completed={completed}
                total={total}
                darkMode={darkMode}
                darkText={darkText}
              />
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <FilterTabs
          filter={filter}
          setFilter={setFilter}
          difficultyFilter={difficultyFilter}
          setDifficultyFilter={setDifficultyFilter}
          setSearchQuery={setSearchQuery}
          darkMode={darkMode}
        />

        {/* Search Bar */}
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          darkMode={darkMode}
          darkInput={darkInput}
        />

        {/* Topics */}
        <div className="space-y-4">
          {Object.keys(filteredQuestions).length > 0 ? (
            Object.keys(filteredQuestions).map((topic) => (
              <TopicSection
                key={topic}
                topic={topic}
                questions={filteredQuestions[topic]}
                expandedTopics={expandedTopics}
                setExpandedTopics={setExpandedTopics}
                animatedWidths={animatedWidths}
                progressMap={progressMap}
                handleToggle={handleToggle}
                setOpenReminderId={setOpenReminderId}
                setOpenNoteId={setOpenNoteId}
                openReminderId={openReminderId}
                openNoteId={openNoteId}
                noteText={noteText}
                setNoteText={setNoteText}
                updateProgress={updateProgress}
                setProgressMap={setProgressMap}
                handleReminderChange={handleReminderChange}
                handleResetTopic={handleResetTopic}
                resettingTopic={resettingTopic}
                topicRefs={topicRefs}
                darkMode={darkMode}
                darkCardBg={darkCardBg}
                darkBorder={darkBorder}
                darkText={darkText}
                darkTableHeader={darkTableHeader}
                darkTableRow={darkTableRow}
                darkInput={darkInput}
              />
            ))
          ) : (
            <div className={`text-center py-10 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold mb-2">No questions found</h3>
              <p>
                {searchQuery 
                  ? `No questions found matching "${searchQuery}"`
                  : `No questions match the current filter`}
              </p>
              {(searchQuery || filter !== "All" || difficultyFilter !== "All") && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilter('All');
                    setDifficultyFilter('All');
                  }}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DSASheet;