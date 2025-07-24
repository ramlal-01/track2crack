import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { FaTimes } from "react-icons/fa";

const ReminderOverdue = () => {
  const [reminders, setReminders] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    const fetchReminders = async () => {
      try {
        const userId = JSON.parse(atob(token.split(".")[1]))?.userId;
        const res = await API.get(`/revision/overdue/${userId}`);
        const all = [...res.data.dsa, ...res.data.core, ...res.data.theory];
        setReminders(all);
      } catch (err) {
        console.error("Error fetching overdue reminders:", err);
      }
    };

    fetchReminders();
    const interval = setInterval(fetchReminders, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    const now = new Date();
    const nextMidnight = new Date();
    nextMidnight.setHours(24, 1, 0, 0);
    const delay = nextMidnight - now;
    const timeout = setTimeout(() => window.location.reload(), delay);
    return () => clearTimeout(timeout);
  }, []);

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
    <div className="bg-white dark:bg-gray-800 border border-red-300 dark:border-red-700 p-3 rounded-lg mt-3 space-y-2 shadow-sm dark:shadow-none">
      <div className="flex justify-between items-center">
        <div className="font-bold text-red-600 dark:text-red-400 text-xl">
          🚨 Overdue
        </div>
        <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 text-sm px-2 py-0.5 rounded-full font-semibold">
          {reminders.length}
        </div>
      </div>

      {reminders.length === 0 ? (
        <div className="text-medium text-gray-400 dark:text-gray-500 italic mt-1">
          No overdue reminders
        </div>
      ) : (
        reminders.map((item, idx) => (
          <div
            key={idx}
            className="px-3 py-1.5 rounded bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-sm flex justify-between items-center cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors duration-150"
            onClick={() => handleRedirect(item)}
          >
            <span className="truncate max-w-[270px] text-red-800 dark:text-red-200 font-semibold">
              {getTitle(item)}
            </span>
            <div
              className="flex items-center gap-5"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-red-600 dark:text-red-400 text-xs font-semibold">
                {getType(item)}
              </span>
              <FaTimes
                className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 cursor-pointer transition-colors duration-150"
                onClick={() => handleClearReminder(item._id)}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ReminderOverdue;