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


  const userId = localStorage.getItem("userId");

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

      if (openReminderId && reminderRefs.current[openReminderId]) {
        clickedInsideReminder = reminderRefs.current[openReminderId].contains(e.target);
      }

      if (openNoteId && noteRefs.current[openNoteId]) {
        clickedInsideNote = noteRefs.current[openNoteId].contains(e.target);
      }

      if (!clickedInsideReminder) {
        setOpenReminderId(null);
      }

      if (!clickedInsideNote) {
        setOpenNoteId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openReminderId, openNoteId]);

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

  const total = Object.values(groupedQuestions).flat().length;
  const completed = Object.values(progressMap).filter((q) => q.isCompleted).length;
  const progress = Math.round((completed / total) * 100);

  const getPlatformIcon = (platform) => {
    if (platform === "GFG") return <SiGeeksforgeeks className="text-green-600 " title="GFG" />;
    if (platform === "LeetCode") return <SiLeetcode className="text-orange-500" title="LeetCode" />;
    return null;
  };

  const toggleTopic = (topic) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topic]: !prev[topic],
    }));
  };

  return (
    <div className="p-6 md:p-10 min-h-screen bg-gradient-to-r from-blue-100 via-teal-100 to-cyan-100">
      <div className="flex justify-between items-center mb-10 px-10 py-4 bg-white rounded-2xl shadow-md">
        {/* LEFT: Title and Subtitle */}
        <div>
          <h1 className="text-4xl font-extrabold text-purple-800 flex items-center gap-2 tracking-tight">
            📘 <span>DSA Sheet</span>
          </h1>
          <p className="text-sb text-gray-600 tracking-wide mt-1">
            Track your completion and revisit daily
          </p>
        </div>

        {/* RIGHT: Circular Progress Ring */}
        <div className="w-25 h-25 drop-shadow-md">
          <CircularProgressbar
            value={progress}
            text={`${progress}%`}
            styles={buildStyles({
              textSize: "18px",
              // pathColor: "url(#gradient)",
              pathTransition: "stroke-dashoffset 0.5s ease 0s",
              pathColor: "#10b981",   // emerald-500
              textColor: "#047857",   // emerald-700
              trailColor: "#e5e7eb",  // gray-200
            })}
          />
          <svg style={{ height: 0 }}>
            <defs>
              <linearGradient id="gradient" gradientTransform="rotate(90)">
                <stop offset="0%" stopColor="#9333ea" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      

      {/* 🔍 Filter Tabs */}
      <div className="flex justify-start gap-3 mb-6">
        {["All", "Solved" ,"Bookmarked", "Reminders"].map((tab) => {
          const isActive = filter === tab;
          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 text-lg rounded-full border transition-all duration-200
                ${
                  isActive
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md scale-105"
                    : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-purple-50 hover:border-purple-400"
                }`}
            >
              {tab}
            </button>
          );
        })}
      </div>


      {loading ? (
        <p>Loading...</p>
      ) : (
        Object.keys(groupedQuestions).map((topic) => {
          const allQs = groupedQuestions[topic];
          const topicQs = allQs.filter((q) => {
            if (filter === "Solved") return progressMap[q._id]?.isCompleted;
            if (filter === "Bookmarked") return progressMap[q._id]?.isBookmarked;
            if (filter === "Reminders") return progressMap[q._id]?.remindOn;
            return true;
          });
          const topicCompleted = allQs.filter((q) => progressMap[q._id]?.isCompleted).length;
          const isExpanded = expandedTopics[topic] ?? false;
          const hasProgress = allQs.some((q) => {
            const p = progressMap[q._id] || {};
            return p.isCompleted || p.isBookmarked || p.remindOn || p.note;
          });

          return (
              <div key={topic} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md  transition duration-300 mb-3">
              
              <div
                className={`px-4 py-2 bg-white hover:bg-emerald-50 rounded-xl transition-all duration-200 ${
                  filter === "All" ? "flex flex-col gap-2 shadow-sm" : "flex justify-between items-center"
                } cursor-pointer`}
                onClick={() => toggleTopic(topic)}
              >
                {filter === "All" ? (
                  <>
                    {/* Line 1: Topic + Reset */}
                    <div className="flex justify-between items-center">
                      <h2 className="text-base sm:text-xl font-semibold text-gray-800">{topic}</h2>
                      <button
                        title="Reset all progress.."
                        disabled={resettingTopic === topic || !hasProgress}
                        onClick={async (e) => {
                          e.stopPropagation();
                          setResettingTopic(topic);
                          await handleResetTopic(topic);
                          setResettingTopic(null);
                        }}
                        className={`flex items-center gap-1 text-sb font-medium rounded-full px-3 py-1 border transition 
                          ${
                            resettingTopic === topic || !hasProgress
                              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                              : "text-gray-900  border-red-600 hover:bg-red-300 hover:ring hover:ring-red-100 hover:border-red-500 hover:font-bold transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-sm" 
                          }` }
                      >
                        {resettingTopic === topic ? "⟳ Resetting..." : "⟳ Reset"}
                      </button>
                    </div>

                    {/* Line 2: Progress Bar */}
                    <div className="w-full mt-1">
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-700 transition-all duration-700 ease-in-out"
                          style={{ width: animatedWidths[topic] ? `${animatedWidths[topic]}%` : "0%" }}
                        ></div>
                      </div>
                    </div>

                    {/* Line 3: Progress Count + Bookmarks + Reminders */}
                    <div className="flex justify-between items-center mt-3 text-xl text-gray-600">
                      {/* ✅ Progress count (no capsule) */}
                      <div className="text-emerald-700 font-semibold text-sm">
                        ✅ {topicCompleted} / {topicQs.length}
                      </div>

                      {/* 🔖 ⏰ */}
                      <div className="flex gap-4 text-xl  text-gray-600">
                        <div className="flex items-center gap-1" title="Bookmarked">
                          🔖 {topicQs.filter((q) => progressMap[q._id]?.isBookmarked).length}
                        </div>
                        <div className="flex items-center gap-1" title="Reminders">
                          ⏰ {topicQs.filter((q) => progressMap[q._id]?.remindOn).length}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-base sm:text-xl font-semibold text-black">{topic}</h2>
                    <div className="text-lg text-gray-600">
                      🔖 {topicQs.filter((q) => progressMap[q._id]?.isBookmarked).length}
                      &nbsp; • &nbsp;
                      ⏰ {topicQs.filter((q) => progressMap[q._id]?.remindOn).length}
                    </div>
                  </>
                )}
              </div>

              {/* ✅ Table Content */}
              {isExpanded && (
              <div className="w-full">
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
                  {topicQs.map((q, idx) => {
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
                            onChange={() => handleToggle(q._id, "isCompleted")}
                          />
                        </div>

                        {/* Problem */}
                        <div className="  text-black-600  cursor-pointer text-sb font-medium"
                          onClick={() => handleToggle(q._id, "isCompleted")}
                          title={q.title}
                        >
                          {q.title}
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
        )}
    </div>
  );
};

export default DSASheet;
