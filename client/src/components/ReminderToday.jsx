import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { FaTimes } from "react-icons/fa";

const ReminderToday = () => {
  const [reminders, setReminders] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    const fetchReminders = async () => {
      try {
        const userId = JSON.parse(atob(token.split(".")[1]))?.userId;
        const res = await API.get(`/revision/today/${userId}`);
        const all = [...res.data.dsa, ...res.data.core, ...res.data.theory];
        setReminders(all);
      } catch (err) {
        console.error("Error fetching today's reminders:", err);
      }
    };

    fetchReminders();
    const interval = setInterval(fetchReminders, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [token]);

  const handleClearReminder = async (id) => {
    try {
      await API.patch(`/revision/reminders/${id}`, {
        action: "reschedule",
        newDate: null,
      });
      window.location.reload();
    } catch (err) {
      console.error("Failed to clear reminder:", err);
    }
  };

  const handleRedirect = (item) => {
    if (item.questionId) {
      navigate("/dashboard/dsa", { state: { scrollTo: item.questionId._id } });
    } else if (item.coreTopicId) {
      const subject = item.coreTopicId.subject.toLowerCase();
      navigate(`/dashboard/core/${subject}`, {
        state: { scrollTo: item.coreTopicId._id },
      });
    } else if (item.topicId) {
      const subject = item.topicId.subject.toLowerCase();
      navigate(`/dashboard/theory/${subject}`, {
        state: { scrollTo: item.topicId._id },
      });
    }
  };

  const getTitle = (item) =>
    item.questionId?.title ||
    item.coreTopicId?.title ||
    item.topicId?.title ||
    "Untitled";

  const getType = (item) =>
    item.questionId
      ? "DSA"
      : item.coreTopicId
      ? "Core"
      : item.topicId
      ? "Theory"
      : "";

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 p-3 rounded-lg mt-3 space-y-2 shadow-sm dark:shadow-none">
      <div className="flex justify-between items-center">
        <div className="font-bold text-yellow-700 dark:text-amber-900 text-xl">
          📅 Today
        </div>
        <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-white text-sm px-2 py-0.5 rounded-full font-semibold">
          {reminders.length}
        </div>
      </div>

      {reminders.length === 0 ? (
        <div className="text-medium text-gray-400 dark:text-gray-500 italic mt-1">
          No reminders today
        </div>
      ) : (
        reminders.map((item, idx) => (
          <div
            key={idx}
            className="px-3 py-1.5 rounded bg-white dark:bg-gray-800 border border-yellow-200 dark:border-yellow-800 text-sm flex justify-between items-center cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors duration-150"
            onClick={() => handleRedirect(item)}
          >
            <span className="truncate max-w-[270px] text-yellow-800 dark:text-yellow-200 font-semibold">
              {getTitle(item)}
            </span>
            <div
              className="flex items-center gap-5"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-yellow-600 dark:text-yellow-400 text-xs font-semibold">
                {getType(item)}
              </span>
              <FaTimes
                className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 cursor-pointer transition-colors duration-150"
                onClick={() => handleClearReminder(item._id)}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ReminderToday;