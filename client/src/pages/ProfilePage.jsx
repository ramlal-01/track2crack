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
} from "react-icons/fa";
import ChangePasswordModal from "../components/ChangePasswordModal";

const ProfilePage = () => {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [completion, setCompletion] = useState(0);
  const [showPassModal, setShowPassModal] = useState(false);

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
  }, [userId]);

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

  if (!user) return <div className="text-center mt-10 text-white">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto py-10 px-6 text-white">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT CARD */}
        <div className="bg-gray-900 rounded-xl p-6 shadow-md flex flex-col items-center text-center">
          <img
            src={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${user.avatarUrl}`}
            alt="avatar"
            className="w-32 h-32 rounded-full object-cover border-4 border-emerald-500 mb-4"
          />

          <h2 className="text-xl font-semibold">{user.name}</h2>
          <p className="text-sm text-gray-400">{user.college || "No college info"}</p>
          <p className="text-sm mt-1 text-emerald-400">
            {user.username ? `${user.username} | ` : ""}
            {completion}% Profile Completed
          </p>

          {/* Buttons */}
          <div className="mt-6 space-y-3 w-full">
            <button
              className="w-full border border-blue-400 text-blue-400 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white transition"
              onClick={() => navigate("/edit-profile")}
            >
              Edit Profile Photo
            </button>
            <button
              className="w-full border border-yellow-400 text-yellow-400 py-1.5 rounded-lg hover:bg-yellow-600 hover:text-white transition"
              onClick={() => setShowPassModal(true)}
            >
              Change Password
            </button>
            <button
              className="w-full border border-red-500 text-red-500 py-1.5 rounded-lg hover:bg-red-600 hover:text-white transition"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </button>
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="md:col-span-2 bg-gray-900 rounded-xl p-6 shadow-md">
          <h3 className="text-xl font-semibold mb-4">Profile Details</h3>
          <div className="space-y-3 text-sm text-gray-200">
            <p><strong>Name:</strong> {user.name}</p>
            <p><FaEnvelope className="inline mr-2 text-gray-400" /> {user.email}</p>
            <p><FaPhone className="inline mr-2 text-gray-400" /> {user.phone || "Not Available"}</p>
            <p><FaLinkedin className="inline mr-2 text-blue-400" /> {user.linkedin || "Not Available"}</p>
            <p><FaGithub className="inline mr-2 text-gray-400" /> {user.github || "Not Available"}</p>
            <p><FaGenderless className="inline mr-2 text-gray-400" /> {user.gender || "Not Available"}</p>
            <p>
              <FaBirthdayCake className="inline mr-2 text-pink-400" />
              {user.dob ? new Date(user.dob).toLocaleDateString("en-GB") : "Not Available"}
            </p>
            <p>
              <strong>Joined:</strong>{" "}
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-GB") : "N/A"}
            </p>
          </div>

          {/* Edit Profile button */}
          <div className="mt-6">
            <button
              onClick={() => navigate("/edit-profile")}
              className="w-full border border-amber-500 text-amber-500 py-2 rounded-md hover:bg-amber-600 hover:text-white transition"
            >
              Edit Personal Info
            </button>
          </div>
        </div>
      </div>

      {/* Modal outside layout */}
      {showPassModal && <ChangePasswordModal onClose={() => setShowPassModal(false)} />}
    </div>
  );
};

export default ProfilePage;
