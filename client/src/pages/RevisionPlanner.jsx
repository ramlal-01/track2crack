import React, { useEffect, useState } from "react";
import API from "../api/api";
import ReminderToday from "../components/ReminderToday";
import ReminderOverdue from "../components/ReminderOverdue";
import ReminderUpcoming from "../components/ReminderUpcoming";
import RecentBookmarks from "../components/RecentBookmarks";
import MiniCalendar from "../components/MiniCalendar";
import RemindersByDate from "../components/RemindersByDate";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import RevisionHeader from "../components/RevisionHeader";

const RevisionPlanner = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reminderDates, setReminderDates] = useState([]);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchReminderDates = async () => {
      try {
        const res = await API.get(`/revision/reminders/${userId}`);
        const all = [...res.data.dsaReminders, ...res.data.coreReminders, ...res.data.theoryReminders];
        const dates = all
          .filter(
            item =>
              item.remindOn &&
              !item.isCompleted &&
              (item.questionId || item.topicId || item.coreTopicId)
          )
          .map(item => new Date(item.remindOn).toLocaleDateString("en-CA"));

        setReminderDates([...new Set(dates)]);
      } catch (err) {
        console.error("Failed to fetch reminder dates", err);
      }
    };

    fetchReminderDates();
  }, []);

  const handleSnoozeAll = async () => {
    try {
      const res = await API.get(`/revision/overdue/${userId}`);

      const all = [...res.data.dsa, ...res.data.core, ...res.data.theory];
      if (all.length === 0) {
        toast.info("No overdue reminders to snooze.");
        return;
      }

      const twoDaysLater = new Date();
      twoDaysLater.setDate(twoDaysLater.getDate() + 2);

      await Promise.all(
        all.map((item) =>
          API.patch(
            `/revision/reminders/${item._id}`,
            {
              action: "reschedule",
              newDate: twoDaysLater,
            }
          )
        )
      );

      toast.success("⏸ All overdue reminders snoozed by 2 days.");
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      console.error("Snooze failed:", err);
      toast.error("❌ Failed to snooze reminders. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-2 sm:p-4 md:p-6 transition-colors duration-200">
      <div className="w-full px-2 sm:px-4 md:px-6 space-y-2 sm:space-y-4 md:space-y-6">
        <RevisionHeader onSnoozeAll={handleSnoozeAll} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4 md:gap-6">
          <motion.div
            className="space-y-2 sm:space-y-4"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ReminderOverdue />
            <ReminderToday />
            <ReminderUpcoming />
          </motion.div>

          <motion.div
            className="bg-white dark:bg-gray-800 p-2 sm:p-3 md:p-4 rounded-xl shadow border border-gray-200 dark:border-gray-700 transition-colors duration-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h2 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-100 mb-1 sm:mb-2">
              📆 Calendar
            </h2>
            <div className="calendar-container dark:calendar-dark">
              <MiniCalendar
                onDateSelect={(date) => setSelectedDate(date)}
                reminderDates={reminderDates}
              />
            </div>
            <div className="mt-2 sm:mt-3 md:mt-4">
              <h2 className="text-sm sm:text-md font-semibold text-gray-700 dark:text-gray-100 mb-1 sm:mb-2">
                📍 Reminders on {selectedDate.toDateString()}
              </h2>
              <RemindersByDate selectedDate={selectedDate} />
            </div>
          </motion.div>

          <motion.div
            className="space-y-2 sm:space-y-4"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="bg-white dark:bg-gray-800 p-2 sm:p-3 md:p-4 rounded-xl shadow border border-violet-300 dark:border-violet-600 transition-colors duration-200">
              <h2 className="text-lg sm:text-xl font-bold text-violet-700 dark:text-violet-400 mb-1 sm:mb-2">
                🔖 Recent Bookmarks
              </h2>
              <RecentBookmarks />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RevisionPlanner;