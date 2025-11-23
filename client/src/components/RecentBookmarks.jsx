import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import API from "../api/api";
const RecentBookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await API.get("/bookmarks/recent");
        setBookmarks(res.data.bookmarks.slice(0, 10));
      } catch (err) {
        console.error("Failed to fetch recent bookmarks", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchRecent();
  }, [token]);

  const getTitle = (item) =>
    item.questionId?.title || item.coreTopicId?.title || item.topicId?.title || "Untitled";

  const getTypeAndSubject = (item) => {
    if (item.questionId) return { type: "DSA", subject: "DSA Sheet" };
    if (item.coreTopicId) return { type: "Core", subject: item.coreTopicId.subject || "Core" };
    if (item.topicId) return { type: "Theory", subject: item.topicId.subject || "Theory" };
    return { type: "Unknown", subject: "-" };
  };

  return (
    <div className="space-y-2">
      {loading ? (
        <div className="text-sm text-gray-500 dark:text-gray-400">Loading...</div>
      ) : bookmarks.length === 0 ? (
        <div className="text-sm text-gray-500 dark:text-gray-400">No recent bookmarks.</div>
      ) : (
        <>
          {bookmarks.map((item, index) => {
            const { type, subject } = getTypeAndSubject(item);
            return (
              <div
                key={index}
                className="flex flex-col px-3 py-2 
                          bg-gray-50 dark:bg-gray-800 
                          border border-gray-200 dark:border-gray-700 
                          rounded-md text-sm 
                          hover:shadow-sm dark:hover:shadow-md
                          hover:bg-gray-100 dark:hover:bg-gray-700
                          transition-colors duration-150"
              >
                <span className="text-gray-800 dark:text-gray-200 truncate font-bold">
                  {getTitle(item)}
                </span>
                <div className="flex gap-2 text-xs text-blue-600 dark:text-blue-400 font-semibold">
                  {type === "DSA" ? "DSA Sheet" : `${type} • ${subject}`}
                </div>
              </div>
            );
          })}
          <button
            onClick={() => navigate("/bookmarks")}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium mt-2"
          >
            View All →
          </button>
        </>
      )}
    </div>
  );
};

export default RecentBookmarks;