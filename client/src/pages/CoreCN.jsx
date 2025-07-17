import React, { useEffect, useState, useRef } from "react";
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaBookmark, FaRegBookmark, FaBell, FaSearch } from "react-icons/fa";
import { SiYoutube, SiGeeksforgeeks } from "react-icons/si";
import { MdQuiz } from "react-icons/md";
import API from "../api/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

const CoreCN = () => {
  const [topics, setTopics] = useState([]);
  const [progress, setProgress] = useState({});
  const [activeFilters, setActiveFilters] = useState({
    All: true,
    Important: false,
    Other: false,
    Bookmarked: false,
    Remind: false,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlyCompleted, setShowOnlyCompleted] = useState(false);
  const [openReminderId, setOpenReminderId] = useState(null);
  const [openNoteId, setOpenNoteId] = useState(null);
  const [noteText, setNoteText] = useState("");
  const reminderRefs = useRef({});
  const noteRefs = useRef({});
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [topicsRes, progressRes] = await Promise.all([
          API.get("/core/topics?subject=CN"),
          API.get(`/core/progress/${userId}?subject=CN`),
        ]);
        
        const progressMap = {};
        (topicsRes.data.topics || []).forEach(topic => {
          const progressData = (progressRes.data.progress || []).find(p => p.coreTopicId === topic._id);
          progressMap[topic._id] = {
            isCompleted: Boolean(progressData?.isCompleted),
            isBookmarked: Boolean(progressData?.isBookmarked),
            remindOn: progressData?.remindOn || null,
            note: progressData?.note || "",
          };
        });

        setTopics(topicsRes.data.topics || []);
        setProgress(progressMap);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load CN topics data");
      }
    };
    fetchData();
  }, [userId]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (openReminderId && reminderRefs.current[openReminderId] && !reminderRefs.current[openReminderId].contains(e.target)) {
        setOpenReminderId(null);
      }
      if (openNoteId && noteRefs.current[openNoteId] && !noteRefs.current[openNoteId].contains(e.target)) {
        setOpenNoteId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openReminderId, openNoteId]);

  // Updated stats calculation
  const completed = Object.keys(progress).filter(
    id => progress[id]?.isCompleted && topics.some(t => t._id === id)
  ).length;

  const bookmarked = Object.keys(progress).filter(
    id => progress[id]?.isBookmarked && topics.some(t => t._id === id)
  ).length;

  const total = topics.length;
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
      [field]: field === "remindOn" ? value : field === "note" ? value : !prev?.[field],
    };
    
    try {
      await API.post("/core/progress", { 
        coreTopicId: topicId, 
        subject: "CN",
        ...updated 
      });
      setProgress((prev) => ({ ...prev, [topicId]: updated }));
      
      if (field === "isCompleted") {
        toast.success(updated.isCompleted ? "Marked as completed!" : "Marked as incomplete!");
      } else if (field === "isBookmarked") {
        toast.success(updated.isBookmarked ? "Bookmarked!" : "Removed bookmark!");
      } else if (field === "remindOn") {
        toast.success(value ? "Reminder set!" : "Reminder removed!");
      } else if (field === "note") {
        toast.success("Note saved!");
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
      const response = await fetch("http://localhost:5000/api/quiz/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subject: "CN",
          topics: [topicTitle],
          source: "Core",
        }),
      });

      const data = await response.json();
      if (!response.ok) return alert(data.message || "Failed to generate quiz");

      localStorage.setItem("activeQuiz", JSON.stringify(data));
      window.location.href = "/quiz";
    } catch (err) {
      console.error("Error generating quiz:", err);
      alert("Something went wrong while generating the quiz");
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
    const matchCompleted = !showOnlyCompleted || progress[t._id]?.isCompleted;

    return matchType && matchBookmark && matchRemind && matchSearch && matchCompleted;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div 
        className="text-center mb-8 p-6 rounded-2xl shadow-lg"
        style={{ background: '#043E86' }}
      >
        <h2 className="text-4xl font-bold text-white mb-3 font-serif tracking-wide">Computer Networking</h2>
        <p className="text-blue-100 font-medium">Master the fundamentals with this interactive learning tracker</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-blue-500 transition-all duration-300 hover:shadow-lg hover:scale-[1.03] hover:border-blue-600">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-xl font-bold text-blue-800">{total}</div>
              <div className="text-gray-600 text-xs">Total Topics</div>
            </div>
            <div className="bg-blue-100 p-2 rounded-full transition-all duration-300 group-hover:bg-blue-200">
              <div className="w-5 h-5 bg-blue-500 rounded-full"></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-green-500 transition-all duration-300 hover:shadow-lg hover:scale-[1.03] hover:border-green-600">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-xl font-bold text-green-800">{completed}</div>
              <div className="text-gray-600 text-xs">Completed</div>
            </div>
            <div className="bg-green-100 p-2 rounded-full transition-all duration-300 group-hover:bg-green-200">
              <div className="w-5 h-5 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-amber-500 transition-all duration-300 hover:shadow-lg hover:scale-[1.03] hover:border-amber-600">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-xl font-bold text-amber-700">{bookmarked}</div>
              <div className="text-gray-600 text-xs">Bookmarked</div>
            </div>
            <div className="bg-amber-100 p-2 rounded-full transition-all duration-300 group-hover:bg-amber-200">
              <div className="w-5 h-5 bg-amber-500 rounded-full"></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-purple-500 transition-all duration-300 hover:shadow-lg hover:scale-[1.03] hover:border-purple-600">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-xl font-bold text-purple-800">{percent}%</div>
              <div className="text-gray-600 text-xs">Progress</div>
            </div>
            <div style={{ width: 50, height: 50 }}>
              <CircularProgressbarWithChildren 
                value={percent} 
                styles={buildStyles({ 
                  pathColor: "#7c3aed",
                  trailColor: "#e9d5ff",
                  pathTransitionDuration: 0.8
                })}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-md mb-8">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex flex-wrap gap-2">
            {["All", "Important", "Other", "Bookmarked", "Remind"].map((type) => (
              <button
                key={type}
                onClick={() => toggleFilter(type)}
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                  activeFilters[type]
                    ? type === "Important"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200"
                      : type === "Other"
                      ? "bg-blue-100 text-blue-800 border border-blue-300 hover:bg-blue-200"
                      : type === "Bookmarked"
                      ? "bg-purple-100 text-purple-800 border border-purple-300 hover:bg-purple-200"
                      : type === "Remind"
                      ? "bg-cyan-100 text-cyan-800 border border-cyan-300 hover:bg-cyan-200"
                      : "bg-indigo-100 text-indigo-800 border border-indigo-300 hover:bg-indigo-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                }`}
              >
                {type === "Bookmarked" && (
                  <FaBookmark className={activeFilters[type] ? "text-purple-600" : "text-gray-500"} />
                )}
                {type === "Remind" && (
                  <FaBell className={activeFilters[type] ? "text-cyan-600" : "text-gray-500"} />
                )}
                {type}
              </button>
            ))}
          </div>
          <div className="flex gap-3 items-center">
            <label className="inline-flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors border border-gray-200">
              <input
                type="checkbox"
                checked={showOnlyCompleted}
                onChange={() => setShowOnlyCompleted(!showOnlyCompleted)}
                className="w-5 h-5 accent-emerald-500"
              />
              <span className="text-gray-700">Completed Only</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-gray-400 transition-colors"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        <div className="grid grid-cols-[80px_2fr_76px_68px_90px_90px_100px_130px] font-medium text-gray-700 bg-gray-100 p-4 border-b border-gray-300">
          <div className="text-center text-sm uppercase tracking-wider">Status</div>
          <div className="pl-3 text-sm uppercase tracking-wider">Topic</div>
          <div className="text-center text-sm uppercase tracking-wider">GFG</div>
          <div className="text-center text-sm uppercase tracking-wider">YT</div>
          <div className="text-center text-sm uppercase tracking-wider">Quiz</div>
          <div className="text-center text-sm uppercase tracking-wider">Bookmark</div>
          <div className="text-center text-sm uppercase tracking-wider">Reminder</div>
          <div className="text-center text-sm uppercase tracking-wider">Notes</div>
        </div>

        {filteredTopics.map((topic) => {
          const { isCompleted, isBookmarked, remindOn, note } = progress[topic._id] || {};
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

          return (
            <div
              key={topic._id}
              className={`grid grid-cols-[60px_2fr_70px_70px_90px_90px_100px_120px] items-center p-4 border-b border-gray-200 ${
                isCompleted ? "bg-green-50 hover:bg-green-100" : "hover:bg-blue-50"
              } transition-colors duration-200`}
            >
              <div className="flex justify-center">
                <input
                  type="checkbox"
                  checked={!!isCompleted}
                  onChange={() => updateProgress(topic._id, "isCompleted")}
                  className="w-5 h-5 accent-emerald-500 rounded border-gray-300 hover:border-emerald-500 transition-colors cursor-pointer hover:scale-110"
                />
              </div>

              <div className="pl-3">
                <div className={`font-medium ${
                  isCompleted ? "text-green-800" : "text-gray-800"
                }`}>
                  {topic.title}
                </div>
                {topic.notes && (
                  <div className="text-sm text-gray-500 mt-1">{topic.notes}</div>
                )}
              </div>

              <div className="flex justify-center">
                {gfg ? (
                  <a 
                    href={gfg.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="hover:scale-125 transition-transform duration-200 text-green-600 hover:text-green-700"
                    title="GeeksforGeeks Resource"
                  >
                    <SiGeeksforgeeks className="text-xl" />
                  </a>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </div>
              
              <div className="flex justify-center">
                {yt ? (
                  <a 
                    href={yt.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="hover:scale-125 transition-transform duration-200 text-red-500 hover:text-red-600"
                    title="YouTube Resource"
                  >
                    <SiYoutube className="text-xl" />
                  </a>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </div>
              
              <div className="flex justify-center">
                {topic.type === "Important" ? (
                   <button 
                  onClick={() => handleSingleTopicQuiz(topic.title)} 
                  className="px-2 py-1 text-xs bg-gradient-to-br from-purple-100 to-purple-50 hover:from-purple-200 hover:to-purple-100 text-purple-800 rounded border border-purple-200 transition-all"
                >
                    <MdQuiz />
                  </button>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </div>
              
              <div className="flex justify-center">
                <button 
                  onClick={() => updateProgress(topic._id, "isBookmarked")}
                  className="text-xl hover:scale-125 transition-transform duration-200"
                  title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                >
                  {isBookmarked ? (
                    <FaBookmark className="text-amber-500 hover:text-amber-600" />
                  ) : (
                    <FaRegBookmark className="text-gray-400 hover:text-amber-400" />
                  )}
                </button>
              </div>
              
              <div ref={(el) => (reminderRefs.current[topic._id] = el)} className="relative flex justify-center">
                {remindOn ? (
                  <div className="flex items-center gap-1">
                    <span 
                      className="text-sm text-blue-600 cursor-pointer hover:underline hover:text-blue-700 transition-colors"
                      onClick={() => setOpenReminderId(topic._id)}
                    >
                      {new Date(remindOn).toLocaleDateString('en-IN')}
                    </span>
                    <button 
                      onClick={() => handleReminderChange(topic._id, null)}
                      className="text-sm text-red-500 hover:text-red-700 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setOpenNoteId(null);
                      setOpenReminderId(openReminderId === topic._id ? null : topic._id);
                    }}
                    className="text-xl hover:scale-125 transition-transform duration-200 text-yellow-500 hover:text-yellow-600"
                    title="Set reminder"
                  >
                    <FaBell />
                  </button>
                )}

                {openReminderId === topic._id && (
                  <div className="absolute z-50 top-8 bg-white border border-gray-200 shadow-lg rounded-lg p-2">
                    <DatePicker
                      selected={remindOn ? new Date(remindOn) : null}
                      onChange={(date) => handleReminderChange(topic._id, date)}
                      dateFormat="dd/MM/yyyy"
                      minDate={new Date()}
                      inline
                    />
                  </div>
                )}
              </div>

              <div ref={(el) => (noteRefs.current[topic._id] = el)} className="relative flex justify-center">
                {note ? (
                  <div className="flex items-center gap-1 group">
                    <span className="text-sm text-yellow-600 max-w-[100px] truncate">
                      {note}
                    </span>
                    <button
                      onClick={() => {
                        setOpenReminderId(null);
                        setOpenNoteId(openNoteId === topic._id ? null : topic._id);
                        setNoteText(note);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-gray-700 transition-opacity"
                    >
                      ✏️
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setOpenReminderId(null);
                      setOpenNoteId(openNoteId === topic._id ? null : topic._id);
                      setNoteText('');
                    }}
                    className="text-blue-500 hover:text-blue-700 text-sm flex items-center gap-1 transition-colors"
                  >
                    <span>📝</span>
                    <span>Add</span>
                  </button>
                )}

                {openNoteId === topic._id && (
                  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
                    <div className="bg-white rounded-lg shadow-xl p-5 w-96 max-w-[90vw]">
                      <h3 className="font-semibold text-lg mb-3 text-gray-800">Notes for: {topic.title}</h3>
                      <textarea
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        rows={5}
                        placeholder="Type your notes here..."
                        className="w-full p-3 border border-gray-300 rounded-lg text-sm mb-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        autoFocus
                      />
                      <div className="flex justify-between items-center">
                        {note && (
                          <button
                            onClick={() => {
                              updateProgress(topic._id, "note", "");
                              setOpenNoteId(null);
                            }}
                            className="text-sm px-3 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            Clear Note
                          </button>
                        )}
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setOpenNoteId(null)} 
                            className="text-sm px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              updateProgress(topic._id, "note", noteText);
                              setOpenNoteId(null);
                            }}
                            className="text-sm px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
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

export default CoreCN;