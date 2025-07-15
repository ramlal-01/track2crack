import React, { useEffect, useState } from "react";
import API from "../api/api";
import { FaCheck } from "react-icons/fa";

const ReminderOverdue = () => {
  const [reminders, setReminders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    const fetchReminders = async () => {
      try {
        const userId = JSON.parse(atob(token.split(".")[1]))?.userId;
        const res = await API.get(`/revision/overdue/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const all = [...res.data.dsa, ...res.data.core, ...res.data.theory];
        setReminders(all);
      } catch (err) {
        console.error("Error fetching overdue reminders:", err);
      }
    };

    fetchReminders(); // initial load

    // 🔁 auto-refresh every 5 min
    const interval = setInterval(fetchReminders, 5 * 60 * 1000);

    return () => clearInterval(interval); // cleanup on unmount
  }, [token]);


  useEffect(() => {
    const now = new Date();
    const nextMidnight = new Date();
    nextMidnight.setHours(24, 1, 0, 0); // 12:01 AM next day

    const delay = nextMidnight - now;

    const timeout = setTimeout(() => {
      window.location.reload(); // 💣 hard reload at midnight
    }, delay);

    return () => clearTimeout(timeout);
  }, []);


  const getTitle = (item) =>
    item.questionId?.title || item.coreTopicId?.title || item.topicId?.title || "Untitled";

  const getType = (item) =>
    item.questionId ? "DSA" : item.coreTopicId ? "Core" : item.topicId ? "Theory" : "";

  const handleMarkComplete = async (id) => {
    try {
      await API.patch(
        `/revision/reminders/${id}`,
        { action: "complete" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReminders((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Failed to mark reminder complete:", err);
    }
  }; 

  return (
  <div className="bg-white border border-red-300 p-3 rounded-lg mt-3 space-y-2">
    <div className="flex justify-between items-center">
      <div className="font-bold text-red-600 text-xl">🚨 Overdue</div>
      <div className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-semibold">
        {reminders.length}
      </div>
    </div>

    {reminders.length === 0 ? (
      <div className="text-medium text-gray-400 italic mt-1">No overdue reminders</div>
    ) : (
      reminders.map((item, idx) => (
        <div
          key={idx}
          className="px-3 py-1.5 rounded bg-red-50 border border-red-200 text-sm flex justify-between items-center"
        >
          <span className="truncate max-w-[270px] text-red-800 font-semibold">
            {getTitle(item)}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-red-600 text-xs font-semibold">{getType(item)}</span>
            <FaCheck
              className="text-green-600 hover:text-green-800 cursor-pointer"
              onClick={() => handleMarkComplete(item._id)}
            />
          </div>
        </div>
      ))
    )}
  </div>
);

};

export default ReminderOverdue;
