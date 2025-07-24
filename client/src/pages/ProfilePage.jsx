import React, { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import {
  FaGithub,
  FaLinkedin,
  FaPhone,
  FaEnvelope,
  FaGenderless,
  FaBirthdayCake,
  FaEdit,
  FaTrash,
  FaKey,
  FaUserEdit,
  FaMoon,
  FaSun,
  FaBars,
  FaTimes,
  FaCalendarAlt,
  FaUser,
  FaIdCard,
  FaMobile,
  FaAt,
  FaUniversity,
  FaExternalLinkAlt
} from "react-icons/fa";
import ChangePasswordModal from "../components/ChangePasswordModal";

const ProfilePage = () => {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [completion, setCompletion] = useState(0);
  const [showPassModal, setShowPassModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get(`/users/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        calculateCompletion(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    const calculateCompletion = (data) => {
      const fields = ["phone", "gender", "dob", "linkedin", "github", "college"];
      const filled = fields.filter((f) => data[f] && data[f].trim() !== "").length;
      setCompletion(Math.round((filled / fields.length) * 100));
    };

    fetchProfile();
    
    const savedMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedMode);
  }, [userId]);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode.toString());
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This is permanent.")) return;

    try {
      const token = localStorage.getItem("token");
      await API.delete(`/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.clear();
      navigate("/login");
      alert("Account deleted");
    } catch (err) {
      alert("Failed to delete account");
      console.error(err);
    }
  };

  if (!user) return <div className={`text-center mt-10 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>Loading...</div>;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-800"}`}>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`p-2 rounded-full ${darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-800"} shadow-md`}
        >
          {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Mobile Sidebar Menu */}
      {mobileMenuOpen && (
        <div className={`fixed inset-0 z-40 md:hidden ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            <button
              onClick={() => navigate("/")}
              className={`text-xl ${darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"}`}
            >
              Home
            </button>
            <button
              onClick={() => navigate("/features")}
              className={`text-xl ${darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"}`}
            >
              Features
            </button>
            <button
              onClick={() => navigate("/about")}
              className={`text-xl ${darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"}`}
            >
              About
            </button>
            <button
              onClick={() => navigate("/contact")}
              className={`text-xl ${darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"}`}
            >
              Contact
            </button>
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${darkMode ? "bg-gray-700 text-yellow-300 hover:bg-gray-600" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
            >
              {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
            </button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className={`hidden md:flex fixed left-0 top-0 h-full w-16 flex-col items-center py-4 space-y-8 ${darkMode ? "bg-gray-800" : "bg-gray-200"}`}>
        <button
          onClick={() => navigate("/")}
          className={`p-2 rounded-full ${darkMode ? "text-blue-400 hover:bg-gray-700" : "text-blue-600 hover:bg-gray-300"}`}
          title="Home"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </button>
        <button
          onClick={() => navigate("/features")}
          className={`p-2 rounded-full ${darkMode ? "text-blue-400 hover:bg-gray-700" : "text-blue-600 hover:bg-gray-300"}`}
          title="Features"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </button>
        <button
          onClick={() => navigate("/about")}
          className={`p-2 rounded-full ${darkMode ? "text-blue-400 hover:bg-gray-700" : "text-blue-600 hover:bg-gray-300"}`}
          title="About"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        <button
          onClick={() => navigate("/contact")}
          className={`p-2 rounded-full ${darkMode ? "text-blue-400 hover:bg-gray-700" : "text-blue-600 hover:bg-gray-300"}`}
          title="Contact"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </button>
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-full ${darkMode ? "text-yellow-300 hover:bg-gray-700" : "text-gray-800 hover:bg-gray-300"}`}
          title={darkMode ? "Light Mode" : "Dark Mode"}
        >
          {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
        </button>
      </div>

      {/* Main Content */}
      <main className={`min-h-screen transition-all duration-300 ${mobileMenuOpen ? "opacity-50" : "opacity-100"}`}>
        <div className={`h-full w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md overflow-hidden`}>
          {/* Profile Header */}
          <div className={`p-6 md:p-8 ${darkMode ? "bg-gray-700" : "bg-gradient-to-r from-[#000C40] to-[#F0F2F0]"} text-white`}>
            <div className="flex flex-col md:flex-row items-center pl-3">
              <img
                src={user.avatarUrl || "/avatar.svg"}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/avatar.svg";
                }}
                alt="avatar"
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white mb-4 md:mb-0 md:mr-8"
              />
              <div className="text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold">{user.name}</h2>
                <p className={`mt-2 text-base md:text-lg ${darkMode ? "text-gray-300" : "text-blue-100"}`}>
                  <FaUniversity className="inline mr-2" />
                  {user.college || "No college information"}
                </p>
                <div className="mt-4">
                  <span className={`text-xs md:text-sm px-3 py-1.5 rounded-full ${darkMode ? "bg-gray-600 text-gray-200" : "bg-blue-900 text-white"}`}>
                    <FaIdCard className="inline mr-2" />
                    {user.username ? `${user.username} | ` : ""}
                    {completion}% Profile Completed
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-4 sm:p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className={`p-4 sm:p-6 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"} shadow-sm`}>
                <h3 className={`text-lg md:text-xl font-semibold mb-4 md:mb-6 border-b pb-2 md:pb-3 ${darkMode ? "text-gray-200 border-gray-600" : "text-gray-800 border-gray-200"}`}>
                  <FaUser className="inline mr-2" />
                  Personal Information
                </h3>
                <div className="space-y-3 md:space-y-4 text-base md:text-lg">
                  <div className="flex justify-between">
                    <span className={`flex items-center ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                      <FaUser className="mr-2" /> First Name
                    </span>
                    <span className={darkMode ? "text-gray-200 font-medium" : "font-semibold"}>{user.name.split(' ')[0] || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`flex items-center ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                      <FaUser className="mr-2" /> Last Name
                    </span>
                    <span className={darkMode ? "text-gray-200 font-medium" : "font-semibold"}>{user.name.split(' ').slice(1).join(' ') || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`flex items-center ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                      <FaBirthdayCake className="mr-2" /> Happy Birthday
                    </span>
                    <span className={darkMode ? "text-gray-200 font-medium" : "font-semibold"}>
                      {user.dob ? new Date(user.dob).toLocaleDateString("en-GB") : "Not Available"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`flex items-center ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                      <FaCalendarAlt className="mr-2" /> Joined On
                    </span>
                    <span className={darkMode ? "text-gray-200 font-medium" : "font-semibold"}>
                      {new Date(user.createdAt).toLocaleDateString("en-GB")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className={`p-4 sm:p-6 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"} shadow-sm`}>
                <h3 className={`text-lg md:text-xl font-semibold mb-4 md:mb-6 border-b pb-2 md:pb-3 ${darkMode ? "text-gray-200 border-gray-600" : "text-gray-800 border-gray-200"}`}>
                  <FaEnvelope className="inline mr-2" />
                  Contact Information
                </h3>
                <div className="space-y-3 md:space-y-4 text-base md:text-lg">
                  <div className="flex justify-between">
                    <span className={`flex items-center ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                      <FaAt className="mr-2" /> Email
                    </span>
                    <span className={darkMode ? "text-gray-200 font-medium" : "font-semibold"}>{user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`flex items-center ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                      <FaMobile className="mr-2" /> Phone
                    </span>
                    <span className={darkMode ? "text-gray-200 font-medium" : "font-semibold"}>{user.phone || "Not Available"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`flex items-center ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                      <FaGithub className="mr-2" /> GitHub
                    </span>
                    <span className={`${darkMode ? "text-blue-400 font-medium" : "text-blue-600 font-semibold"} break-all`}>
                      {user.github ? (
                        <a 
                          href={user.github.startsWith('http') ? user.github : `https://${user.github}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="hover:underline flex items-center"
                        >
                          {user.github.replace(/(^\w+:|^)\/\//, '')}
                          <FaExternalLinkAlt className="ml-2 text-sm" />
                        </a>
                      ) : "Not Available"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`flex items-center ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                      <FaLinkedin className="mr-2" /> LinkedIn
                    </span>
                    <span className={`${darkMode ? "text-blue-400 font-medium" : "text-blue-600 font-semibold"} break-all`}>
                      {user.linkedin ? (
                        <a 
                          href={user.linkedin.startsWith('http') ? user.linkedin : `https://${user.linkedin}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="hover:underline flex items-center"
                        >
                          {user.linkedin.replace(/(^\w+:|^)\/\//, '')}
                          <FaExternalLinkAlt className="ml-2 text-sm" />
                        </a>
                      ) : "Not Available"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 md:mt-12 flex flex-wrap gap-4 md:gap-6 justify-center">
              <button
                onClick={() => navigate("/edit-profile")}
                className={`flex items-center px-4 py-2 md:px-6 md:py-3 rounded-lg transition text-base md:text-lg ${darkMode ? "bg-indigo-700 text-white hover:bg-indigo-600" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}
              >
                <FaUserEdit className="mr-2 md:mr-3" size={16} /> Edit Profile
              </button>
              <button
                onClick={() => setShowPassModal(true)}
                className={`flex items-center px-4 py-2 md:px-6 md:py-3 rounded-lg transition text-base md:text-lg ${darkMode ? "bg-amber-600 text-white hover:bg-amber-500" : "bg-amber-500 text-white hover:bg-amber-600"}`}
              >
                <FaKey className="mr-2 md:mr-3" size={16} /> Change Password
              </button>
              <button
                onClick={handleDeleteAccount}
                className={`flex items-center px-4 py-2 md:px-6 md:py-3 rounded-lg transition text-base md:text-lg ${darkMode ? "bg-red-700 text-white hover:bg-red-600" : "bg-red-600 text-white hover:bg-red-700"}`}
              >
                <FaTrash className="mr-2 md:mr-3" size={16} /> Delete Account
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Modal */}
      {showPassModal && <ChangePasswordModal onClose={() => setShowPassModal(false)} darkMode={darkMode} />}
    </div>
  );
};

export default ProfilePage;