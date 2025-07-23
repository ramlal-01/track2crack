import React, { useEffect, useState, useRef} from "react";
import API from "../api/api";
import {
  FaBookmark,
  FaRegBookmark,
  FaBell,
} from "react-icons/fa";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { SiLeetcode, SiGeeksforgeeks } from "react-icons/si";
import { toast } from 'react-toastify';   
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
 
const DSASheet = () => {
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
  const reminderRefs = useRef({});
  const noteRefs = useRef({});
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const topicRef = useRef(null);
  const userId = localStorage.getItem("userId");
  const topicRefs = useRef({});
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
    } finally {
      setLoading(false);
    }
  };
  const highlightMatch = (text, query) => {
      if (!query) return text;
      const parts = text.split(new RegExp(`(${query})`, 'gi'));
      return parts.map((part, i) => 
        part.toLowerCase() === query.toLowerCase() 
          ? <mark key={i} className="bg-yellow-200">{part}</mark> 
          : part
      );
    };

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

  const filteredQuestions = getFilteredQuestions();

  


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
  }, [progressMap, groupedQuestions]);

useEffect(() => {
  const handleClickOutside = (e) => {
    let clickedInsideReminder = false;
    let clickedInsideNote = false;
    let clickedInsideAnyTopic = false;

    // Check reminders
    if (openReminderId && reminderRefs.current[openReminderId]) {
      clickedInsideReminder = reminderRefs.current[openReminderId].contains(e.target);
    }

    // Check notes
    if (openNoteId && noteRefs.current[openNoteId]) {
      clickedInsideNote = noteRefs.current[openNoteId].contains(e.target);
    }

    // Check if click was inside ANY expanded topic (header or content)
    Object.keys(expandedTopics).forEach(topic => {
      if (expandedTopics[topic]) {
        const topicHeaderRef = topicRefs.current[topic];
        const topicContentRef = topicRefs.current[`${topic}-content`];
        
        if ((topicHeaderRef && topicHeaderRef.contains(e.target)) || 
            (topicContentRef && topicContentRef.contains(e.target))) {
          clickedInsideAnyTopic = true;
        }
      }
    });

    // Close reminders/notes if needed
    if (!clickedInsideReminder) setOpenReminderId(null);
    if (!clickedInsideNote) setOpenNoteId(null);

    // Only collapse topics if click was outside ALL topic containers
    // AND outside search/filter controls
    const searchInput = document.querySelector('input[type="text"]');
    const filterButtons = document.querySelectorAll('[data-filter-button]');
    const difficultySelect = document.querySelector('select');
    
    const clickedInsideControls = 
      searchInput?.contains(e.target) ||
      Array.from(filterButtons).some(btn => btn.contains(e.target)) ||
      difficultySelect?.contains(e.target);

    if (!clickedInsideAnyTopic && !clickedInsideControls) {
      // Add the timeout here
      setTimeout(() => {
        setExpandedTopics({});
      }, 100);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, [openReminderId, openNoteId, expandedTopics]);

  const updateProgress = async (questionId, updates) => {
    try {
      const token = localStorage.getItem('token');
      await API.post(
        `/dsa/progress`,
        { questionId, ...updates },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Optional: update local state
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

  const handleToggle = async (qid, field) => {
    const current = progressMap[qid] || {};
    const updated = {
      ...current,
      questionId: qid,
      isCompleted:
        field === "isCompleted" ? !current.isCompleted : current.isCompleted || false,
      isBookmarked:
        field === "isBookmarked" ? !current.isBookmarked : current.isBookmarked || false,
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

    try {
      await Promise.all(
        updates.map((u) => API.post("/dsa/progress", u))
      );
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
    }
  };


  const getBadgeColor = (level) => {
    if (level === "Easy") return "bg-green-100 text-green-800";
    if (level === "Medium") return "bg-yellow-100 text-yellow-800";
    if (level === "Hard") return "bg-red-100 text-red-800";
    return "bg-gray-200 text-gray-800";
  };

  // Calculate progress statistics
  const allQuestions = Object.values(groupedQuestions).flat();
  const total = allQuestions.length;
  const completed = Object.values(progressMap).filter((q) => q.isCompleted).length;
  const progress = Math.round((completed / total) * 100);

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

  const getPlatformIcon = (platform) => {
    if (platform === "GFG") return <SiGeeksforgeeks className="text-green-600 " title="GFG" />;
    if (platform === "LeetCode") return <SiLeetcode className="text-orange-500" title="LeetCode" />;
    return null;
  };

  // Modified toggle function to auto-expand during search
  const toggleTopic = (topic) => {
    if (searchQuery) {
      // During search, close other topics and toggle current one
      setExpandedTopics({
        [topic]: !expandedTopics[topic]
      });
    } else {
      // Normal behavior when not searching
      setExpandedTopics(prev => ({
        ...prev,
        [topic]: !prev[topic]
      }));
    }
  };

  return (
    <div className="p-6 md:p-10 min-h-screen bg-slate-50">
      
      <div className="flex justify-between items-center mb-10 px-10 py-4 bg-gradient-to-r from-blue-50 to-white rounded-2xl shadow-md">
        {/* LEFT: Title and Subtitle */}
        <div>
          <h1 className="text-4xl font-extrabold text-indigo-700 flex items-center gap-2 tracking-tight">
            📘 <span>DSA Sheet</span>
          </h1>
          <p className="text-sb text-gray-600 tracking-wide mt-1">
            Track your completion and revisit daily
          </p>
        </div>

        {/* RIGHT: Progress Rings - Now showing counts */}
        <div className="flex items-center gap-9">
          {/* Easy Progress */}
          <div className="flex flex-col items-center">
            <div className="w-29 h-29 drop-shadow-md relative">
              <CircularProgressbar
                value={easyProgress}
                styles={buildStyles({
                  pathTransition: "stroke-dashoffset 0.5s ease 0s",
                  pathColor: "#22c55e",
                  trailColor: "#e5e7eb",
                })}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-gray-800">
                  {easyCompleted}/{easyQuestions.length}
                </span>
              </div>
            </div>
            <div className="text-lg font-semibold text-green-700 mt-1">Easy</div>
          </div>

          {/* Medium Progress */}
          <div className="flex flex-col items-center">
            <div className="w-29 h-29 drop-shadow-md relative">
              <CircularProgressbar
                value={mediumProgress}
                styles={buildStyles({
                  pathTransition: "stroke-dashoffset 0.5s ease 0s",
                  pathColor: "#eab308",
                  trailColor: "#e5e7eb",
                })}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-gray-800">
                  {mediumCompleted}/{mediumQuestions.length}
                </span>
              </div>
            </div>
            <div className="text-lg font-semibold text-yellow-700 mt-1">Medium</div>
          </div>

          {/* Hard Progress */}
          <div className="flex flex-col items-center">
            <div className="w-29 h-29 drop-shadow-md relative">
              <CircularProgressbar
                value={hardProgress}
                styles={buildStyles({
                  pathTransition: "stroke-dashoffset 0.5s ease 0s",
                  pathColor: "#ef4444",
                  trailColor: "#e5e7eb",
                })}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-gray-800">
                  {hardCompleted}/{hardQuestions.length}
                </span>
              </div>
            </div>
            <div className="text-lg font-semibold text-red-700 mt-1">Hard</div>
          </div>

          {/* Overall Progress */}
          <div className="flex flex-col items-center ml-4">
            <div className="w-29 h-29 drop-shadow-md relative">
              <CircularProgressbar
                value={progress}
                styles={buildStyles({
                  pathTransition: "stroke-dashoffset 0.5s ease 0s",
                  pathColor: "#10b981",
                  trailColor: "#e5e7eb",
                })}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-gray-800">
                  {completed}/{total}
                </span>
              </div>
            </div>
            <div className="text-lg font-semibold text-emerald-700 mt-1">Overall</div>
          </div>

        </div>
        
      </div>
      

      {/* 🔍 Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"> 

        <div className="flex flex-wrap items-center gap-3">
          {["All", "Solved", "Bookmarked", "Reminders"].map((tab) => (
            <button
              key={tab}
              data-filter-button
              onClick={() => {
                setFilter(tab);
                setSearchQuery(''); // Clear search when changing tabs
              }}
              className={`px-4 py-1.5 text-lg rounded-full border transition-all duration-200 ${
                tab === filter
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md scale-105"
                  : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-purple-50 hover:border-purple-400"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

          {/* Difficulty dropdown - styled like tabs */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value) }
              className="appearance-none px-4 py-1.5 pr-8 text-lg text-gray-900 rounded-full border border-gray-400 bg-white hover:bg-purple-50 hover:border-purple-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
            >
              <option value="All">All</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        
          {/* Search Bar - now properly integrated */}

          <div className="relative flex-1 min-w-[350px] max-w-md mt-3 md:mt-0">
            
            <input
              type="text"
              placeholder="🔍 Search questions..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setDifficultyFilter("All");
                if (e.target.value) {
                  // Auto-expand all matching topics during search
                  const expanded = {};
                  Object.keys(filteredQuestions).forEach(topic => {
                    expanded[topic] = true;
                  });
                  setExpandedTopics(expanded);
                } else {
                  // Collapse all when search is cleared
                  setExpandedTopics({});
                }
              }}
              className="w-full px-4 py-2 border border-gray-400 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg bg-white hover:border-gray-600 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setExpandedTopics({}); // Collapse all when search is cleared
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-indigo-50 rounded-2xl p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-100 rounded w-full"></div>
                <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                <div className="h-4 bg-gray-100 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>

      ) : Object.keys(filteredQuestions).length > 0 ? (

        Object.keys(filteredQuestions).map((topic) => {
          const topicQs = filteredQuestions[topic];

          const filteredByDifficulty = topicQs.filter(q => 
            difficultyFilter === "All" || q.difficulty === difficultyFilter
          );

          const bookmarkedCount = topicQs.filter(q => progressMap[q._id]?.isBookmarked).length;
          const reminderCount = topicQs.filter(q => progressMap[q._id]?.remindOn).length;

          const topicCompleted = filteredByDifficulty.filter(q => progressMap[q._id]?.isCompleted).length;
          const totalInDifficulty = filteredByDifficulty.length;

          const isExpanded = expandedTopics[topic] ?? false;

          const hasProgress = topicQs.some((q) => {
            const p = progressMap[q._id] || {};
            return p.isCompleted || p.isBookmarked || p.remindOn || p.note;
          });

          return (
              <div key={topic} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition duration-300 mb-3">
            
                <div 
                ref={(el) => (topicRefs.current[topic] = el)}
                className={`px-4 py-2 bg-gray-50 hover:bg-indigo-50 rounded-xl transition-all duration-200 border border-indigo-300 ${
                  filter === "All" ? "flex flex-col gap-2 shadow-sm" : ""
                } cursor-pointer`}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent event from bubbling up
                  toggleTopic(topic);
                }}
              >
                <div className="flex justify-between items-center w-full">
                  {/* Left side - Topic name */}
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {expandedTopics[topic] ? (
                      <FaChevronDown className="text-gray-500 text-sm" />
                    ) : (
                      <FaChevronRight className="text-gray-500 text-sm" />
                    )}
                    <h2 className="text-base sm:text-xl font-semibold text-gray-800 truncate">{topic}</h2>
                  </div>

                  {/* Right side - Progress bar and count+icon */}
                  <div className="flex items-center gap-10">
                    {filter !== "All" && (
                      <>
                        {/* Progress bar - now first in the right section */}
                        <div className="w-120 h-2 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-700 transition-all duration-700 ease-in-out"
                            style={{ 
                              width: (() => {
                                if (filter === "Solved") {
                                  const solved = topicQs.filter(q => progressMap[q._id]?.isCompleted).length;
                                  return topicQs.length > 0 ? `${Math.round((solved / topicQs.length) * 100)}%` : "0%";
                                } else if (filter === "Bookmarked") {
                                  const bookmarked = topicQs.filter(q => progressMap[q._id]?.isBookmarked);
                                  const solved = bookmarked.filter(q => progressMap[q._id]?.isCompleted).length;
                                  return bookmarked.length > 0 ? `${Math.round((solved / bookmarked.length) * 100)}%` : "0%";
                                } else if (filter === "Reminders") {
                                  const reminders = topicQs.filter(q => progressMap[q._id]?.remindOn);
                                  const solved = reminders.filter(q => progressMap[q._id]?.isCompleted).length;
                                  return reminders.length > 0 ? `${Math.round((solved / reminders.length) * 100)}%` : "0%";
                                }
                                return "0%";
                              })()
                            }}
                          ></div>
                        </div>

                        {/* Count + icon - now after progress bar */}
                        <div className="flex items-center w-20 flex-shrink-0"> {/* Fixed width container */}
                          <span className="mr-1">{/* Icon */}
                            {filter === "Solved" && "✅"}
                            {filter === "Bookmarked" && "🔖"}
                            {filter === "Reminders" && "⏰"}
                          </span>
                          <span className="font-mono tabular-nums tracking-tight text-2xl"> {/* Monospace numbers */}
                            {filter === "Solved" && topicQs.filter(q => progressMap[q._id]?.isCompleted).length}
                            {filter === "Bookmarked" && bookmarkedCount}
                            {filter === "Reminders" && reminderCount}
                          </span>
                        </div>
                      </>
                    )}

                    {/* Reset button - only for "All" filter */}
                    {filter === "All" && !searchQuery && difficultyFilter === "All" && (
                      <button
                        title="Reset all progress.."
                        disabled={resettingTopic === topic || !hasProgress}
                        onClick={async (e) => {
                          e.stopPropagation();
                          setResettingTopic(topic);
                          await handleResetTopic(topic);
                          setResettingTopic(null);
                        }}
                        className={`flex items-center gap-1 text-sb font-medium rounded-full px-3 py-1 border transition ${
                          resettingTopic === topic || !hasProgress
                            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                            : "text-gray-900 border-red-600 hover:bg-red-300 hover:ring hover:ring-red-100 hover:border-red-500 hover:font-bold transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-sm" 
                        }`}
                      >
                        {resettingTopic === topic ? "⟳ Resetting..." : "⟳ Reset"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress bar and details - only for "All" filter */}
                {filter === "All" && (
                  <>
                    <div className="w-full mt-1">
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-indigo-700 transition-all duration-700 ease-in-out"
                          style={{ 
                            width: difficultyFilter === "All"
                              ? (animatedWidths[topic] ? `${animatedWidths[topic]}%` : "0%")
                              : (totalInDifficulty > 0 
                                  ? `${Math.round((topicCompleted / totalInDifficulty) * 100)}%` : "0%")
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-3 text-xl text-gray-600">
                      <div className="text-emerald-700 font-semibold text-sm">
                        ✅ {topicQs.filter(q => progressMap[q._id]?.isCompleted).length}/{topicQs.length}
                      </div>
                      <div className="flex gap-4 text-xl text-gray-600">
                        <div className="flex items-center gap-1" title="Bookmarked">
                          🔖 {topicQs.filter((q) => progressMap[q._id]?.isBookmarked).length}
                        </div>
                        <div className="flex items-center gap-1" title="Reminders">
                          ⏰ {topicQs.filter((q) => progressMap[q._id]?.remindOn).length}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* ✅ Table Content */}
              {isExpanded && (
              <div
                   ref={(el) => (topicRefs.current[`${topic}-content`] = el)} 
                   onClick={(e) => e.stopPropagation()}
                  className="w-full">
                {/* Headers */}
                <div className="grid grid-cols-[70px_2.5fr_.85fr_.85fr_.85fr_1fr_1.5fr] px-4 py-2 text-lg font-bold text-gray-800 border-b bg-blue-50">
                  <div>Status</div>
                  <div>Problem</div>
                  <div>Practice</div>
                  <div>Difficulty</div>
                  <div>Bookmark</div>
                  <div>Reminder</div>
                  <div>Note</div>
                </div>

                {/* Questions */}
                <div className="flex flex-col gap-3 mt-2">
                  {topicQs.map((q) => {
                    const p = progressMap[q._id] || {};
                    return (
                      <div
                        key={q._id}
                        className="grid grid-cols-[70px_2.5fr_.85fr_.85fr_.85fr_1fr_1.5fr] items-center bg-white rounded-xl px-4 py-2 hover:shadow-md transition duration-300"
                      >
                        {/* Status */}
                        <div>
                          <input
                            type="checkbox"
                            className="accent-green-600 w-6 h-6"
                            checked={p.isCompleted || false}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleToggle(q._id, "isCompleted");
                            }}
                          />
                        </div>

                        {/* Problem */}
                        <div className="  text-black-600  cursor-pointer text-sb font-medium"
                          onClick={() => handleToggle(q._id, "isCompleted")}
                          title={q.title}
                        >
                          {highlightMatch(q.title, searchQuery)}
                        </div>

                        {/* Practice */}
                        <div className="px-4 py-2 text-2xl">
                          <a
                            href={q.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={q.platform}
                          >
                            {getPlatformIcon(q.platform)}
                          </a>
                        </div>

                        {/* Difficulty */}
                        <div>
                          <span className={`text-lg px-2 py-1 rounded ${getBadgeColor(q.difficulty)}`}>
                            {q.difficulty}
                          </span>
                        </div>

                        {/* Bookmark */}
                        <div>
                          <button onClick={() => handleToggle(q._id, "isBookmarked")}>
                            {p.isBookmarked ? (
                              <FaBookmark className="text-amber-500 text-xl" />
                            ) : (
                              <FaRegBookmark className="text-gray-400 text-xl" />
                            )}
                          </button>
                        </div>

                        {/* Reminder */}
                        <div ref={(el) => (reminderRefs.current[q._id] = el)} className="relative text-sm text-indigo-600 font-bold">
                          <button
                            onClick={() => {
                              setOpenNoteId(null); // close note when reminder is opened
                              setOpenReminderId(openReminderId === q._id ? null : q._id)
                            }}
                            className="flex items-center gap-1 transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-sm"
                          >
                            <FaBell />
                            {p.remindOn
                              ? new Date(p.remindOn).toLocaleDateString()
                              : "Set Reminder"}
                          </button>

                          {openReminderId === q._id && (
                            <div className="absolute z-50 mt-2 bg-white border shadow-lg rounded p-2">
                              <DatePicker
                                selected={p.remindOn ? new Date(p.remindOn) : null}
                                onChange={(date) => handleReminderChange(q._id, date)}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Pick a date"
                                minDate={new Date()}
                                inline
                              />
                              {p.remindOn && (
                                <button
                                  onClick={() => handleReminderChange(q._id, null)}
                                  className="text-xs text-red-500 mt-2  font-semibold transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-sm"
                                >
                                  Clear Reminder
                                </button>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Note */}
                        <div ref={(el) => (noteRefs.current[q._id] = el)} className="relative text-sb text-blue-600 font-bold">
                          
                          {/* 📝 Show note if exists */}
                          {progressMap[q._id]?.note ? (
                          <div className="flex justify-between items-start gap-2 max-w-[220px]">
                          {/* Note text */}
                          <div className="flex items-start gap-1 break-words">
                            <span className="text-sm ">📄</span>
                            <span className="truncate max-w-[250px] text-sm font-semibold text-yellow-600">{progressMap[q._id].note}</span>
                          </div>

                          {/* ✏️ Pencil icon */}
                          <button
                            onClick={() => {
                              setOpenReminderId(null);
                              setOpenNoteId(openNoteId === q._id ? null : q._id);
                              setNoteText(progressMap[q._id]?.note || '');
                            }}
                            className="absolute top-0 right-0 text-blue-600 hover:text-blue-800"
                            title="Edit Note"
                          >
                            ✏️
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setOpenReminderId(null);
                            setOpenNoteId(openNoteId === q._id ? null : q._id);
                            setNoteText('');
                          }}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-sm"
                        >
                          📝 Add
                        </button>
                      )}

                          {openNoteId === q._id && (
                            <div className="absolute z-50 mt-2 bg-white border shadow-lg rounded p-3 w-64">
                              <textarea
                                ref={(el) => el && el.focus()}
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                rows={3}
                                placeholder="Type your quick note here..."
                                className="w-full p-2 border rounded text-sm"
                              />

                              {noteText && (
                                <button
                                  onClick={async () => {
                                    setNoteText('');
                                    await updateProgress(q._id, { note: '' });
                                    setProgressMap((prev) => ({
                                      ...prev,
                                      [q._id]: {
                                        ...prev[q._id],
                                        note: ''
                                      }
                                    }));
                                    toast.success("Note cleared!");
                                    setOpenNoteId(null);
                                  }}
                                  className="text-xs text-red-500 mt-2 hover:underline"
                                >
                                  Clear Note
                                </button>
                              )}

                              <div className="flex justify-end gap-2 mt-2">
                                <button
                                  onClick={() => setOpenNoteId(null)}
                                  className="text-xs text-gray-500 hover:underline"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={async () => {
                                    await updateProgress(q._id, { note: noteText });
                                    setProgressMap((prev) => ({
                                      ...prev,
                                      [q._id]: {
                                        ...prev[q._id],
                                        note: noteText
                                      }
                                    }));
                                    toast.success("Note saved!");
                                    setOpenNoteId(null);
                                  }}
                                  className={`text-xs px-2 py-1 rounded ${
                                    noteText === (progressMap[q._id]?.note || '')
                                      ? 'text-gray-400 border border-gray-300 cursor-not-allowed'
                                      : 'text-green-600 border border-green-500 hover:bg-green-50'
                                  }`}
                                  disabled={noteText === (progressMap[q._id]?.note || '')}
                                >
                                  Save
                                </button>

                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          );
        })
        ) : (
        <div className="text-center py-10 text-gray-500">
          {searchQuery 
            ? `No questions found matching "${searchQuery}"`
            : `No questions match the current filter`}
        </div>
        )}
    </div>
  );
};

export default DSASheet;