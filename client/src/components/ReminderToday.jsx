import { useEffect, useState } from "react";
import API from "../api/api";
import { FaCheck } from "react-icons/fa";

const ReminderToday = () => {
  const [todayReminders, setTodayReminders] = useState([]);
  const token = localStorage.getItem("token");
  const userId = JSON.parse(atob(token.split(".")[1]))?.userId;

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const res = await API.get(`/revision/today/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data;

        const mapItems = (items, type) =>
          items.map((item) => ({
            id: item._id,
            title:
              item?.questionId?.title ||
              item?.coreTopicId?.title ||
              item?.topicId?.title ||
              "Untitled",
            type,
          }));

        const finalList = [
          ...mapItems(data.dsa || [], "DSA"),
          ...mapItems(data.core || [], "Core"),
          ...mapItems(data.theory || [], "Theory"),
        ];

        setTodayReminders(finalList);
      } catch (err) {
        console.error("Error fetching today's reminders:", err);
      }
    };

    if (token && userId) fetchReminders();
  }, [token, userId]);

  const handleMarkComplete = async (id) => {
    try {
      await API.patch(
        `/revision/reminders/${id}`,
        { action: "complete" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTodayReminders((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Failed to mark reminder complete:", err);
    }
  };

  return (
    <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 shadow-md">
      <h3 className="text-lg font-bold text-yellow-800 flex items-center gap-1 mb-3">
        📅 Today
        <span className="ml-auto text-sm bg-yellow-100 border border-yellow-300 px-2 py-0.5 rounded-full text-yellow-600">
          {todayReminders.length}
        </span>
      </h3>

      {todayReminders.length === 0 ? (
        <p className="text-medium text-gray-500">No reminders today.</p>
      ) : (
        <ul className="max-h-48 overflow-y-auto pr-1 space-y-2 text-sm">
          {todayReminders.map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-center bg-white border border-yellow-200 rounded-md px-3 py-2 hover:shadow-sm transition-shadow"
            >
              <span className="font-semibold text-gray-800 truncate">
                {item.title}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-yellow-600">
                  {item.type}
                </span>
                <FaCheck
                  className="text-green-600 hover:text-green-800 cursor-pointer"
                  onClick={() => handleMarkComplete(item.id)}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReminderToday;
