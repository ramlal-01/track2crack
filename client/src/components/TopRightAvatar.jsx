import React, { useEffect, useState, useRef } from "react";
import { Menu, Transition } from "@headlessui/react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import {
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
   
  UserIcon,
  CogIcon,
  AcademicCapIcon,
  UserCircleIcon,
  BellIcon,
  ChevronRightIcon
} from "@heroicons/react/24/solid";

const TopRightAvatar = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationPage, setNotificationPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showMobileNotificationOverlay, setShowMobileNotificationOverlay] = useState(false);
  const [streak, setStreak] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [avatarURL, setAvatarURL] = useState(null);
  const [user, setUser] = useState(null);
  const notificationRef = useRef(null);
  const overlayRef = useRef(null);


  // Generate a stable avatar URL based on user email
  const generateAvatarUrl = (email) => {
    const styles = [
      "lorelei",
      "adventurer",
      "avataaars",
      "personas",
      "micah"
    ];
    const styleIndex = Math.abs(email.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)) % styles.length;
    const randomStyle = styles[styleIndex];
    return `https://api.dicebear.com/7.x/${randomStyle}/svg?seed=${encodeURIComponent(
      email
    )}&backgroundColor=6366f1,a5b4fc`;
  };

useEffect(() => {
    const fetchAvatar = async () => {
      if (!userId) return;

      try {
        const res = await API.get(`/users/profile/${userId}`);
        const user = res.data;
        setAvatarURL(user.avatarUrl);
      } catch (err) {
        console.error("Failed to load avatar:", err);
      }
    };

    fetchAvatar();
  }, [userId]);

  const avatarFallback = `https://api.dicebear.com/7.x/initials/svg?seed=${userId}`;

  // Fetch notifications from API
const fetchNotifications = async (userId, page = 1) => {
    try {
      const token = localStorage.getItem("token");
      const response = await API.get(`/notifications/${userId}?limit=10&page=${page}` );
      if (response.status === 200) {
        const data = response.data;
        const formatted = data.map(notif => ({
          id: notif._id,
          title: notif.title,
          type: notif.type,
          date: notif.triggeredAt,
          link: notif.link || "/",
          isSeen: notif.isSeen
        }));
        setNotifications(prev => (page === 1 ? formatted : [...prev, ...formatted]));
        setHasMore(data.length === 10);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  // Fetch streak data
  const fetchStreak = async () => {
    try {
      const res = await API.post("/streak/update");
      setStreak(res.data.streak);
    } catch (error) {
      console.error("❌ Failed to fetch streak:", error);
      setStreak(0);
    }
  };

  useEffect(() => {
    const checkUser = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          if (parsedUser._id) {
            fetchNotifications(parsedUser._id);
            fetchStreak();
          }
        } else {
          setUser(null);
          localStorage.removeItem('avatarUrl');
          setNotifications([]);
        }
      } catch (e) {
        console.error('Error parsing user data:', e);
        setUser(null);
      }
    };
    checkUser();
    const handleStorageChange = (e) => {
      if (e.key === 'user' || e.key === 'avatarUrl') checkUser();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (userId) {
        fetchNotifications(userId);
        fetchStreak();
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [userId]);

  // Click outside to close notifications
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (overlayRef.current && !overlayRef.current.contains(event.target)) {
        setShowMobileNotificationOverlay(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('avatarUrl');
    localStorage.removeItem('quizCompleted');
    localStorage.removeItem('fcmToken');

    window.location.href = '/login';
  };

  const handleMarkAllRead = async () => {
    try {
      const token = localStorage.getItem("token");
      await API.patch(`/notifications/mark-all-seen/${userId}`, {} );
      setNotifications((prev) => prev.map(n => ({ ...n, isSeen: true })));
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };


const handleProfileClick = () => {
  navigate("/profile");
};

const handleSettingsClick = () => {
  navigate("/edit-profile");
};

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="flex items-center justify-end gap-3 h-full">
      {/* Dark/Light Toggle */}
       
      <ThemeToggle />
      
      {/* Mobile Notification Overlay */}
      {showMobileNotificationOverlay && (
        <div className="fixed inset-0 z-[100] bg-white/10 dark:bg-black/10 backdrop-blur-md flex items-start justify-center pt-4 px-4 animate-in fade-in duration-300">
          <div ref={overlayRef} className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/50 w-full max-w-md max-h-[85vh] overflow-hidden animate-in slide-in-from-top-4 duration-300">
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              <div className="relative flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <BellIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Notifications</h3>
                    <p className="text-xs text-white/80">Stay updated with your progress</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowMobileNotificationOverlay(false)}
                  className="text-white hover:bg-white/20 rounded-xl p-2 transition-all duration-200 hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Notifications Content */}
            {notifications.length > 0 ? (
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification, index) => (
                  <div
                    key={notification.id}
                    onClick={() => {
                      setShowMobileNotificationOverlay(false);
                      if (notification.link) navigate(notification.link);
                    }}
                    className={`px-6 py-4 border-b border-gray-100 dark:border-gray-700/50 transition-all duration-300 cursor-pointer hover:scale-[1.02] transform
                      ${notification.isSeen 
                        ? "bg-white/50 dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-700/50" 
                        : "bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-900/50 dark:hover:to-purple-900/50"
                      }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 pt-1">
                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg ${
                          notification.isSeen 
                            ? "bg-gray-100 dark:bg-gray-700" 
                            : "bg-gradient-to-br from-indigo-400 to-purple-500"
                        }`}>
                          <BellIcon className={`h-6 w-6 ${
                            notification.isSeen 
                              ? "text-gray-600 dark:text-gray-300" 
                              : "text-white"
                          }`} />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 leading-tight">
                            {notification.title}
                          </h4>
                          {!notification.isSeen && (
                            <div className="flex-shrink-0">
                              <div className="h-2 w-2 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full animate-pulse"></div>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Due: {formatDate(notification.date)}
                        </p>
                        {!notification.isSeen && (
                          <span className="inline-block mt-2 px-3 py-1 text-xs font-medium bg-gradient-to-r from-indigo-400 to-purple-500 text-white rounded-full shadow-sm">
                            New
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {hasMore && (
                  <div className="text-center py-4 border-b border-gray-200 dark:border-gray-700">
                    <button onClick={() => {
                      const nextPage = notificationPage + 1;
                      setNotificationPage(nextPage);
                      fetchNotifications(userId, nextPage);
                    }}
                      className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/50">
                      Load more notifications
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="px-6 py-12 text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl flex items-center justify-center">
                  <div className="text-3xl">🔔</div>
                </div>
                <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">All caught up!</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">You have no new notifications</p>
              </div>
            )}

            {/* Footer Actions */}
            <div className="px-6 py-4 bg-gray-50/80 dark:bg-gray-700/30 backdrop-blur-sm border-t border-gray-200/50 dark:border-gray-700/50 flex justify-between gap-3">
              <button 
                onClick={() => {
                  handleMarkAllRead();
                  setShowMobileNotificationOverlay(false);
                }}
                className="flex-1 px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-xl transition-all duration-200 hover:scale-105"
              >
                Mark all read
              </button>
              <button 
                onClick={() => {
                  setShowMobileNotificationOverlay(false);
                  navigate('/dashboard/revision-planner');
                }}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
              >
                View planner
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Notification Bell - Hide on mobile, will be moved to dropdown */}
      <div className="relative hidden md:block" ref={notificationRef}>
        <button onClick={() => setShowNotifications(!showNotifications)} className="p-3 rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 hover:shadow-xl hover:scale-105 transition-all duration-200 relative group" title="Notifications">
          <BellIcon className="h-5 w-5 text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
          {notifications.some(n => !n.isSeen) && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gradient-to-r from-red-400 to-pink-500 border-2 border-white dark:border-gray-800 flex items-center justify-center">
              <span className="text-xs font-bold text-white">{notifications.filter(n => !n.isSeen).length}</span>
            </span>
          )}
        </button>

        {showNotifications && (
          <div className="absolute right-0 mt-3 w-96 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-2xl ring-1 ring-black/5 dark:ring-white/10 z-50 border border-white/20 dark:border-gray-700/50 overflow-hidden animate-in slide-in-from-top-2 duration-300">
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              <div className="relative flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <BellIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Notifications</h3>
                    <p className="text-xs text-white/80">Stay updated with your progress</p>
                  </div>
                </div>
                <button 
                  className="text-sm font-medium text-white/80 hover:text-white hover:bg-white/20 px-3 py-1 rounded-lg transition-all duration-200" 
                  onClick={handleMarkAllRead}
                >
                  Mark all read
                </button>
              </div>
            </div>

            {notifications.length > 0 ? (
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification, index) => (
                  <div
                    key={notification.id}
                    onClick={() => {
                      setShowNotifications(false);
                      if (notification.link) navigate(notification.link);
                    }}
                    className={`px-6 py-4 border-b border-gray-100/50 dark:border-gray-700/50 transition-all duration-300 cursor-pointer hover:scale-[1.02] transform group
                      ${notification.isSeen 
                        ? "bg-white/50 dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-700/50" 
                        : "bg-gradient-to-r from-indigo-50/80 to-purple-50/80 dark:from-indigo-900/20 dark:to-purple-900/20 hover:from-indigo-100/80 hover:to-purple-100/80 dark:hover:from-indigo-900/40 dark:hover:to-purple-900/40"
                      }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 pt-1">
                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 ${
                          notification.isSeen 
                            ? "bg-gray-100 dark:bg-gray-700" 
                            : "bg-gradient-to-br from-indigo-400 to-purple-500"
                        }`}>
                          <BellIcon className={`h-6 w-6 ${
                            notification.isSeen 
                              ? "text-gray-600 dark:text-gray-300" 
                              : "text-white"
                          }`} />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {notification.title}
                          </h4>
                          {!notification.isSeen && (
                            <div className="flex-shrink-0">
                              <div className="h-2 w-2 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full animate-pulse"></div>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Due: {formatDate(notification.date)}
                        </p>
                        {!notification.isSeen && (
                          <span className="inline-block mt-2 px-3 py-1 text-xs font-medium bg-gradient-to-r from-indigo-400 to-purple-500 text-white rounded-full shadow-sm">
                            New
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {hasMore && (
                  <div className="text-center py-4 border-b border-gray-200/50 dark:border-gray-700/50">
                    <button onClick={() => {
                      const nextPage = notificationPage + 1;
                      setNotificationPage(nextPage);
                      fetchNotifications(userId, nextPage);
                    }}
                      className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/50 hover:scale-105 transition-all duration-200">
                      Load more
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="px-6 py-12 text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl flex items-center justify-center">
                  <div className="text-3xl">🔔</div>
                </div>
                <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">All caught up!</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">You have no new notifications</p>
              </div>
            )}

            <div className="px-6 py-4 bg-gray-50/80 dark:bg-gray-700/30 backdrop-blur-sm text-center border-t border-gray-200/50 dark:border-gray-700/50">
              <button onClick={() => { 
                setShowNotifications(false); 
                navigate('/dashboard/revision-planner'); 
              }}
                className="text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 px-6 py-2 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg">
                View all reminders
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Avatar Dropdown */}
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow hover:shadow-md border border-gray-200 dark:border-gray-600 focus:outline-none transition-all duration-200">
          {avatarURL ? (
            <img
      src={avatarURL || "/avatar.svg"}
      alt="avatar"
      className="w-8 h-8 rounded-full object-cover"
    />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-300 to-indigo-500 flex items-center justify-center">
              <UserCircleIcon className="w-6 h-6 text-white" />
            </div>
          )}
          {/* Show notification indicator on mobile */}
          {notifications.some(n => !n.isSeen) && (
            <span className="md:hidden absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 border-2 border-white dark:border-gray-800"></span>
          )}
          <ChevronDownIcon className="w-4 h-4 text-gray-500 dark:text-gray-300" />
        </Menu.Button>


        <Transition
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-80 md:w-72 origin-top-right bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 border border-gray-200 dark:border-gray-600 overflow-hidden max-h-[90vh] transform -translate-x-4 md:translate-x-0">
            {/* Profile Header */}
            {user ? (
              <div className="px-3 md:px-4 py-2 md:py-3 bg-gradient-to-r from-indigo-400 to-indigo-600 text-white">
                <div className="flex items-center gap-2 md:gap-3">
                  <img 
                    src={avatarURL} 
                    className="w-10 md:w-12 h-10 md:h-12 rounded-full border-2 border-white" 
                    alt="avatar" 
                  />
                  <div>
                    <p className="text-xs md:text-sm font-bold truncate">{user?.name}</p>
                    <p className="text-xs opacity-90 truncate">{user?.email}</p>
                    <p className="text-xs mt-1 flex items-center gap-1">
                      <AcademicCapIcon className="w-3 h-3" />
                      Student Account
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="px-3 md:px-4 py-2 md:py-3 bg-gradient-to-r from-indigo-400 to-indigo-600 text-white">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-10 md:w-12 h-10 md:h-12 rounded-full bg-gradient-to-br from-indigo-300 to-indigo-500 flex items-center justify-center border-2 border-white">
                    <UserCircleIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm font-bold">Guest User</p>
                    <p className="text-xs opacity-90">Not logged in</p>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile-only sections */}
            <div className="md:hidden">
              {/* Streak Section for Mobile */}
              <div className="px-3 py-3 bg-orange-50 dark:bg-orange-900/20 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🔥</span>
                  <div>
                    <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">Current Streak</h4>
                    <p className="text-sm font-semibold text-orange-700 dark:text-orange-300">
                      {streak !== null ? `${streak} Day${streak !== 1 ? "s" : ""}` : "Loading..."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Notifications Section for Mobile */}
              <div>
                <button 
                  onClick={() => setShowMobileNotificationOverlay(true)}
                  className="w-full px-3 py-3 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <BellIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">Notifications</h4>
                    {notifications.some(n => !n.isSeen) && (
                      <span className="h-2 w-2 rounded-full bg-red-500"></span>
                    )}
                  </div>
                  <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Menu Items - Only show when logged in */}
            {user ? (
              <>
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleProfileClick}
                        className={`${
                          active ? "bg-indigo-50 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400" : "text-gray-700 dark:text-gray-200"
                        } group flex items-center w-full px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm transition-colors duration-150`}
                      >
                        <UserIcon className="w-4 md:w-5 h-4 md:h-5 mr-2 md:mr-3 text-indigo-500 dark:text-indigo-400" />
                        My Profile
                      </button>
                    )}
                  </Menu.Item>
                  
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleSettingsClick}
                        className={`${
                          active ? "bg-indigo-50 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400" : "text-gray-700 dark:text-gray-200"
                        } group flex items-center w-full px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm transition-colors duration-150`}
                      >
                        <CogIcon className="w-4 md:w-5 h-4 md:h-5 mr-2 md:mr-3 text-indigo-500 dark:text-indigo-400" />
                        Edit Profile
                      </button>
                    )}
                  </Menu.Item>
                </div>

                <div className="py-1 bg-gray-50 dark:bg-gray-700/30">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`${
                          active ? "bg-red-50 dark:bg-gray-700 text-red-600 dark:text-red-400" : "text-red-500 dark:text-red-400"
                        } group flex items-center w-full px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm font-medium transition-colors duration-150`}
                      >
                        <ArrowRightOnRectangleIcon className="w-4 md:w-5 h-4 md:h-5 mr-2 md:mr-3" />
                        Logout
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </>
            ) : (
              <div className="py-1 bg-gray-50 dark:bg-gray-700/30">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => window.location.href = '/login'}
                      className={`${
                        active ? "bg-indigo-50 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400" : "text-indigo-500 dark:text-indigo-400"
                      } group flex items-center w-full px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm font-medium transition-colors duration-150`}
                    >
                      <ArrowRightOnRectangleIcon className="w-4 md:w-5 h-4 md:h-5 mr-2 md:mr-3 rotate-180" />
                      Login
                    </button>
                  )}
                </Menu.Item>
              </div>
            )}
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default TopRightAvatar;