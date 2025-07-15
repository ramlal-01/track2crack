import React, { useEffect, useState, useRef } from "react";
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const TheoryPage = ({ subject, title }) => {
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
  const [showDatePicker, setShowDatePicker] = useState({});
  const [openNoteId, setOpenNoteId] = useState(null);
  const [noteText, setNoteText] = useState("");
  const noteRefs = useRef({});
  const [quizAvailableMap, setQuizAvailableMap] = useState({});


  const token = localStorage.getItem("token");
  const userId = JSON.parse(atob(token.split(".")[1]))?.userId;

  useEffect(() => {
   const fetchData = async () => {
  const [topicsRes, progressRes] = await Promise.all([
    fetch(`http://localhost:5000/api/theory/topics?subject=${subject}`),
    fetch(`http://localhost:5000/api/theory/progress/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  ]);

  const topicsData = await topicsRes.json();
  const progressData = await progressRes.json();
  const subjectTopicIds = topicsData?.topics?.map((t) => t._id); // 🔍 only current subject topics
  const progressMap = {};

  (progressData?.progress || []).forEach((p) => {
    if (subjectTopicIds.includes(p.topicId)) {
      progressMap[p.topicId] = {
        isCompleted: p.isCompleted,
        isBookmarked: p.isBookmarked,
        remindOn: p.remindOn,
        note: p.note || "",
      };
    }
  });

  setTopics(topicsData.topics || []);
  setProgress(progressMap);
};


    if (token && userId) fetchData();
  }, [token, userId]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (openNoteId && noteRefs.current[openNoteId] && !noteRefs.current[openNoteId].contains(e.target)) {
        setOpenNoteId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openNoteId]);

  const completed = Object.values(progress).filter((p) => p?.isCompleted).length;
  const bookmarked = Object.values(progress).filter((p) => p?.isBookmarked).length;
  const total = topics.length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  const toggleFilter = (filterName) => {
    if (["All", "Important", "Other"].includes(filterName)) {
      const newFilters = {
        All: false,
        Important: false,
        Other: false,
        Bookmarked: activeFilters.Bookmarked,
        Remind: activeFilters.Remind,
      };
      newFilters[filterName] = true;
      setActiveFilters(newFilters);
    } else {
      setActiveFilters((prev) => ({
        ...prev,
        [filterName]: !prev[filterName],
        All: prev.All && !["Important", "Other"].some((f) => prev[f]),
        Important: prev.Important && filterName !== "All",
        Other: prev.Other && filterName !== "All",
      }));
    }
  };

  const updateProgress = async (topicId, field, value = null) => {
    const prev = progress[topicId] || {};
    const updated = {
      ...prev,
      [field]: field === "remindOn" ? value : field === "note" ? value : !prev?.[field],
    };
    setProgress((prev) => ({ ...prev, [topicId]: updated }));

    // Show toast notifications based on action
    if (field === "isCompleted") {
      toast(updated.isCompleted ? "Marked as done!" : "Marked as not done!", {
        type: updated.isCompleted ? "success" : "error",
        position: "top-center",
        autoClose: 2000,
      });
    } else if (field === "isBookmarked") {
        if (!prev?.isBookmarked && value !== false) {
          await fetch("http://localhost:5000/api/bookmarks/access", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              itemType: "theory",
              itemId: topicId,
            }),
          });
        }

        toast(updated.isBookmarked ? "Bookmarked!" : "Removed bookmark!", {
          type: updated.isBookmarked ? "success" : "error",
          position: "top-center",
          autoClose: 2000,
        });
      } else if (field === "remindOn") {
      if (value) {
        toast("Reminder set!", { type: "success", position: "top-center", autoClose: 2000 });
      } else if (prev.remindOn && !value) {
        toast("Reminder removed!", { type: "error", position: "top-center", autoClose: 2000 });
      }
    }

    await fetch("http://localhost:5000/api/theory/progress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        topicId,
        isCompleted: updated.isCompleted,
        isBookmarked: updated.isBookmarked,
        remindOn: updated.remindOn ?? null,
        note: updated.note ?? "",
      }),
    });
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
          subject: subject,

          topics: [topicTitle],
          source: "Theory",
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

  const getIconUrl = (type, url) => {
    if (type === "video") return "https://img.icons8.com/color/32/youtube-play.png";
    if (url.includes("geeksforgeeks")) return "https://upload.wikimedia.org/wikipedia/commons/4/43/GeeksforGeeks.svg";
    return "https://img.icons8.com/ios-filled/32/000000/read.png";
  };

  const filteredTopics = topics.filter((t) => {
    const matchTypeFilter =
      activeFilters.All ||
      (activeFilters.Important && t.type === "Important") ||
      (activeFilters.Other && t.type === "Other");
    const matchBookmarked = !activeFilters.Bookmarked || progress[t._id]?.isBookmarked;
    const matchRemind = !activeFilters.Remind || progress[t._id]?.remindOn;
    const matchSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCompleted = !showOnlyCompleted || progress[t._id]?.isCompleted;

    return matchTypeFilter && matchBookmarked && matchRemind && matchSearch && matchCompleted;
  });

  return (
    <div className="p-6 md:p-10 min-h-screen bg-slate-50 text-xl">
       
      
      {/* 🎯 Dashboard Cards */}
      <h2 className="text-4xl font-bold text-center text-indigo-800 mb-6">{title} Theory Dashboard</h2>
      <div className="grid grid-cols-4 gap-4 mb-8 text-center">
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg border border-indigo-200 shadow-md hover:shadow-lg transition-shadow">
          <div className="text-2xl font-bold text-indigo-700">{total}</div>
          <div className="text-indigo-600 font-medium">Total Topics</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200 shadow-md hover:shadow-lg transition-shadow">
          <div className="text-2xl font-bold text-green-700">{completed}</div>
          <div className="text-green-600 font-medium">Completed</div>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200 shadow-md hover:shadow-lg transition-shadow">
          <div className="text-2xl font-bold text-amber-700">{bookmarked}</div>
          <div className="text-amber-600 font-medium">Bookmarked</div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200 shadow-md hover:shadow-lg transition-shadow flex flex-col justify-center items-center">
          <div style={{ width: 60 }}>
            <CircularProgressbarWithChildren 
              value={percent} 
              styles={buildStyles({ 
                pathColor: "#ea580c",
                trailColor: "#fed7aa"
              })}
            >
              <div className="text-lg font-semibold text-orange-800">{percent}%</div>
            </CircularProgressbarWithChildren>
          </div>
          <div className="text-xs mt-1 font-semibold text-orange-700">Progress</div>
        </div>
      </div>

      {/* 🔍 Filters and Search */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="flex gap-2 flex-wrap">
          {["All", "Important", "Other", "Bookmarked", "Remind"].map((type) => (
            <button
              key={type}
              onClick={() => toggleFilter(type)}
              className={`px-4 py-1.5 rounded-lg border transition-all shadow-md hover:shadow-lg ${
                activeFilters[type]
                  ? type === "Important"
                    ? "bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700"
                    : type === "Other"
                    ? "bg-amber-500 text-white border-amber-600 hover:bg-amber-600"
                    : type === "Bookmarked"
                    ? "bg-violet-600 text-white border-violet-700 hover:bg-violet-700"
                    : type === "Remind"
                    ? "bg-sky-500 text-white border-sky-600 hover:bg-sky-600"
                    : "bg-indigo-600 text-white border-indigo-700 hover:bg-indigo-700"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
        <div className="flex gap-3 items-center">
          <label className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showOnlyCompleted}
              onChange={() => setShowOnlyCompleted(!showOnlyCompleted)}
              className="w-5 h-5 accent-emerald-500 focus:ring-emerald-500"
            />
            <span className="text-gray-700 font-medium">Completed Only</span>
          </label>
          <input
            type="text"
            placeholder="Search topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 rounded border border-gray-300 shadow-sm w-98 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* 📋 Table Header */}
      <div className="grid grid-cols-[85px_3fr_.85fr_.85fr_.85fr_.85fr_.85fr_1.85fr] font-semibold text-lg text-gray-600 border-b-2 border-gray-200 pb-3 mb-3">
        <div className="text-center">Status</div>
        <div className="pl-2">Topic</div>
        <div className="text-left">GFG</div>
        <div className="text-left">YT</div>
        <div className="text-left pl-4">Quiz</div>
        <div className="text-left pl-1">Bookmark</div>
        <div className="text-left pl-1">Reminder</div>
        <div className="text-left">Notes</div>
      </div>

      {/* 📌 Topics List */}
      {filteredTopics.map((topic) => {
        const { isCompleted, isBookmarked, remindOn, note } = progress[topic._id] || {};
        const gfg = topic.resources?.find((r) => r.url.includes("geeksforgeeks"));
        const yt = topic.resources?.find((r) => r.type === "video");
        const pdf = topic.resources?.find((r) => r.type === "pdf");

        return (
          <div
            key={topic._id}
            className={`grid grid-cols-[85px_3fr_.85fr_.85fr_.85fr_.85fr_.85fr_1.85fr] items-center p-3 mb-3 rounded-xl transition-all ${
              isCompleted 
                ? "bg-green-50 border-2 border-green-400 hover:border-green-500" 
                : "bg-white border border-amber-300 hover:border-amber-400"
            } hover:shadow-md`}
          >
            {/* Status Checkbox */}
            <div className="flex justify-center items-center">
              <input
                type="checkbox"
                checked={!!isCompleted}
                onChange={() => updateProgress(topic._id, "isCompleted")}
                className="w-5 h-5 accent-emerald-500 focus:ring-emerald-500"
              />
            </div>

            {/* Topic Title */}
            <div className="pl-2">
              <div className={`font-semibold text-base ${
                isCompleted ? "text-green-800" : "text-gray-800"
              }`}>
                {topic.title}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">{topic.notes}</div>
            </div>

            {/* GFG Link */}
            <div>
              {gfg ? (
                <a href={gfg.url} target="_blank" rel="noreferrer" className="inline-block hover:scale-110 transition-transform">
                  <img src={getIconUrl("article", gfg.url)} className="w-7 h-7" />
                </a>
              ) : (
                <span className="text-gray-400">-</span>
              )}
            </div>
            
            {/* YouTube Link */}
            <div>
              {yt ? (
                <a href={yt.url} target="_blank" rel="noreferrer" className="inline-block hover:scale-110 transition-transform">
                  <img src={getIconUrl("video", yt.url)} className="w-7 h-7" />
                </a>
              ) : (
                <span className="text-gray-400">-</span>
              )}
            </div>
            
            {/* Quiz Button */}
            <div className="pl-4">
              {topic.type === "Important" ? (
                <button 
                  onClick={() => handleSingleTopicQuiz(topic.title)} 
                  className="px-2 py-1 text-lg bg-gradient-to-br from-purple-100 to-purple-50 hover:from-purple-200 hover:to-purple-100 text-purple-800 rounded border border-purple-200 transition-all"
                >
                  Quiz
                </button>
              ) : (
                <span className="text-gray-400">-</span>
              )}
            </div>
            
            {/* Bookmark Icon */}
            <div className="pl-5">
              <button 
                onClick={() => updateProgress(topic._id, "isBookmarked")}
                className="text-2xl hover:scale-110 transition-transform"
                aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
              >
                {isBookmarked ? (
                  <span className="text-amber-500">🔖</span>
                ) : (
                  <span className="text-gray-400">📑</span>
                )}
              </button>
            </div>
            
            {/* Reminder */}
            <div className="pl-6 relative">
              <button 
                onClick={() => setShowDatePicker((prev) => ({ ...prev, [topic._id]: !prev[topic._id] }))} 
                className={`text-xl hover:scale-110 transition-transform ${
                  remindOn ? "text-sky-500" : "text-gray-400"
                }`}
                aria-label={remindOn ? "Change reminder" : "Set reminder"}
              >
                {remindOn ? "⏰" : "🕒"}
              </button>
              {showDatePicker[topic._id] && (
                <input
                  type="date"
                  value={remindOn ? remindOn.split("T")[0] : ""}
                  onChange={(e) => updateProgress(topic._id, "remindOn", e.target.value)}
                  className="absolute top-8 left-0 px-1.5 py-1 border border-gray-300 rounded text-xs bg-white z-10 shadow-md"
                  onBlur={() => setShowDatePicker((prev) => ({ ...prev, [topic._id]: false }))}
                />
              )}
            </div>

            {/* Notes Column */}
            <div ref={(el) => (noteRefs.current[topic._id] = el)} className="relative">
              {note ? (
                <div className="flex gap-2 items-center text-xs font-semibold">
                  <span className="text-amber-500">📄</span>
                  <span className="truncate max-w-[100px] text-amber-800">{note}</span>
                  <button 
                    onClick={() => { setOpenNoteId(topic._id); setNoteText(note); }}
                    className="text-gray-500 hover:text-gray-700"
                    aria-label="Edit note"
                  >
                    ✏
                  </button>
                </div>
              ) : (
                <button 
                  className="text-sm hover:text-blue-700 transition-colors flex items-center gap-1"
                  onClick={() => { setOpenNoteId(topic._id); setNoteText(""); }}
                >
                  <span className="text-blue-500">📝</span>
                  <span className="text-blue-600">Add</span>
                </button>
              )}

              {openNoteId === topic._id && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                  <div className="bg-white border border-gray-200 shadow-xl rounded-lg p-4 w-96">
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
                          className="text-xs px-3 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                        >
                          Clear Note
                        </button>
                      )}
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setOpenNoteId(null)} 
                          className="text-xs px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            updateProgress(topic._id, "note", noteText);
                            setOpenNoteId(null);
                            toast("Note saved!", { type: "success", position: "top-center", autoClose: 2000 });
                          }}
                          className="text-xs px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
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
  );
};

export default TheoryPage;