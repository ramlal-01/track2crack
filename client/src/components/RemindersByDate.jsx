import React, { useEffect, useState } from 'react';
import API from '../api/api';

const RemindersByDate = ({ selectedDate }) => {
  const [reminders, setReminders] = useState([]);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const res = await API.get(
          `/revision/reminders/${userId}/by-date?date=${selectedDate.toISOString()}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const { dsa, core, theory } = res.data;

        const all = [
          ...(dsa || []).map(item => ({ ...item, type: "dsa" })),
          ...(core || []).map(item => ({ ...item, type: "core" })),
          ...(theory || []).map(item => ({ ...item, type: "theory" })),
        ];

        setReminders(all);
      } catch (err) {
        console.error("Failed to fetch reminders by date", err);
      }
    };

    fetchReminders();
  }, [selectedDate]);

  const getTitle = (item) =>
    item.questionId?.title || item.coreTopicId?.title || item.topicId?.title || "Untitled";

  const getSubject = (item) => {
    if (item.type === "dsa") return "DSA Sheet";
    if (item.type === "core") return item.coreTopicId?.subject || "Core";
    if (item.type === "theory") return item.topicId?.subject || "Theory";
    return "Unknown";
  };

  return (
    <div className="space-y-2">
      {reminders.length === 0 ? (
        <div className="text-sm text-gray-500">No reminders.</div>
      ) : (
        reminders.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center text-sm text-gray-700 border p-2 rounded"
          >
            <span className="truncate font-semibold max-w-[300px]">{getTitle(item)}</span>
            <span className="text-xs font-semibold text-blue-600">
              {getSubject(item)}
            </span>
          </div>
        ))
      )}
    </div>
  );
};

export default RemindersByDate;
