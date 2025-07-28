import React, { useEffect, useState } from "react";
import API from "../api/api"; // Axios instance with baseURL and token

const StreakBadge = () => {
  const [streak, setStreak] = useState(null);

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const res = await API.post("/streak/update"); // No need to add token manually
        setStreak(res.data.streak);
      } catch (error) {
        console.error("❌ Failed to fetch streak:", error);
        setStreak(0); // fallback
      }
    };

    fetchStreak();
  }, []);

  return (
    <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300 px-3 py-1 rounded-full font-semibold text-sm shadow-sm flex items-center gap-1">
      🔥 
      <span className="block">
        {streak !== null ? `${streak}` : "..."}
      </span>
      <span className="hidden sm:inline">
        {streak !== null ? ` Day${streak > 1 ? "s" : ""}` : ""}
      </span>
    </div>
  );
};

export default StreakBadge;