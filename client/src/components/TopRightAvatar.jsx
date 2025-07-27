import React, { useEffect, useState } from "react";
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
  BellIcon
} from "@heroicons/react/24/solid";

const TopRightAvatar = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationPage, setNotificationPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showMobileNotifications, setShowMobileNotifications] = useState(false);
  const [streak, setStreak] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [avatarURL, setAvatarURL] = useState(null);
  const [user, setUser] = useState(null);


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
      
      {/* Notification Bell - Hide on mobile, will be moved to dropdown */}
      <div className="relative hidden md:block">
        <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:shadow transition-all duration-200 relative" title="Notifications">
          <BellIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          {notifications.some(n => !n.isSeen) && <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-red-500 border-2 border-white dark:border-gray-800"></span>}
        </button>

        {showNotifications && (
          <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 z-50 border border-gray-200 dark:border-gray-600 overflow-hidden">
            <div className="px-4 py-3 bg-gradient-to-r from-indigo-400 to-indigo-600 text-white flex justify-between items-center">
              <h3 className="font-bold">Notifications</h3>
              <button className="text-xs underline" onClick={handleMarkAllRead}>Mark all as read</button>
            </div>

            {notifications.length > 0 ? (
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => {
                      setShowNotifications(false);
                      if (notification.link) navigate(notification.link);
                    }}
                    className={`px-4 py-3 border-b transition-colors duration-150 cursor-pointer
                      ${notification.isSeen ? "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700" : "bg-indigo-50 dark:bg-indigo-900"}`}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 pt-0.5">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center">
                          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-300">
                            {notification.type?.toUpperCase() || "NOTE"}
                          </span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{notification.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Due: {formatDate(notification.date)}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {hasMore && (
                  <div className="text-center py-2">
                    <button onClick={() => {
                      const nextPage = notificationPage + 1;
                      setNotificationPage(nextPage);
                      fetchNotifications(userId, nextPage);
                    }}
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                      Load more
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="px-4 py-6 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">No notifications available</p>
              </div>
            )}

            <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700/30 text-center border-t border-gray-100 dark:border-gray-700">
              <button onClick={() => { setShowNotifications(false); window.location.href = '/dashboard/revision-planner'; }}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
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
                  onClick={() => setShowMobileNotifications(!showMobileNotifications)}
                  className="w-full px-3 py-3 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <BellIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">Notifications</h4>
                    {notifications.some(n => !n.isSeen) && (
                      <span className="h-2 w-2 rounded-full bg-red-500"></span>
                    )}
                  </div>
                  <ChevronDownIcon className={`h-4 w-4 text-gray-400 transform transition-transform ${showMobileNotifications ? 'rotate-180' : ''}`} />
                </button>

                {showMobileNotifications && (
                  <div className="bg-white dark:bg-gray-800">
                    {notifications.length > 0 ? (
                      <div className="max-h-40 overflow-y-auto">
                        {notifications.slice(0, 4).map((notification) => (
                          <div
                            key={notification.id}
                            onClick={() => {
                              setShowMobileNotifications(false);
                              if (notification.link) navigate(notification.link);
                            }}
                            className={`px-3 py-2 border-b border-gray-100 dark:border-gray-700 transition-colors duration-150 cursor-pointer
                              ${notification.isSeen ? "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700" : "bg-indigo-50 dark:bg-indigo-900/50"}`}
                          >
                            <div className="flex items-start gap-2">
                              <div className="flex-shrink-0 pt-0.5">
                                <div className="h-5 w-5 rounded-full bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center">
                                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-300">
                                    {notification.type?.charAt(0).toUpperCase() || "N"}
                                  </span>
                                </div>
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{notification.title}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(notification.date)}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="px-3 py-4 text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400">No notifications</p>
                      </div>
                    )}
                    <div className="px-3 py-2 text-center border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                      <button 
                        onClick={() => {
                          setShowMobileNotifications(false);
                          handleMarkAllRead();
                        }}
                        className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline mr-3"
                      >
                        Mark all read
                      </button>
                      <button 
                        onClick={() => {
                          setShowMobileNotifications(false);
                          window.location.href = '/dashboard/revision-planner';
                        }}
                        className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        View all
                      </button>
                    </div>
                  </div>
                )}
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