import React, { useEffect, useState } from "react";
import API from "../api/api";
import { FaCheck } from "react-icons/fa";

const ReminderUpcoming = () => {
  const [reminders, setReminders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const res = await API.get(
          `/revision/upcoming/${JSON.parse(atob(token.split(".")[1]))?.userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const all = [...res.data.dsa, ...res.data.core, ...res.data.theory];
        setReminders(all);
      } catch (err) {
        console.error("Error fetching upcoming reminders:", err);
      }
    };

    if (token) fetchReminders();
  }, [token]);

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
        // Remove the reminder locally
        setReminders((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
        console.error("Failed to mark reminder complete:", err);
    }
    };


  return (
    <div className="bg-white border border-blue-300 p-3 rounded-lg mt-3 space-y-2">
      <div className="flex justify-between items-center">
        <div className="font-bold text-blue-600">⏳ Next 7 Days</div>
        <div className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-semibold">
          {reminders.length}
        </div>
      </div>

      {reminders.length === 0 ? (
        <div className="text-medium text-gray-500 mt-2">No upcoming reminders.</div>
      ) : (
        reminders.map((item, idx) => (
          <div
            key={idx}
            className="px-3 py-1.5 rounded bg-blue-50 border border-blue-200 text-sm flex justify-between items-center"
          >
            <span className="truncate max-w-[270px] text-blue-800 font-semibold">
              {getTitle(item)}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-blue-600 text-xs font-semibold">{getType(item)}</span>
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

export default ReminderUpcoming;
