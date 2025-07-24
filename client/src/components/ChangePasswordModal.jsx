import { useState, useEffect } from "react";
import API from "../api/api";

const ChangePasswordModal = ({ onClose }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [matchText, setMatchText] = useState("");
  const [loading, setLoading] = useState(false);

  // Live match check
  useEffect(() => {
    if (!newPassword || !confirmPassword) {
      setMatchText("");
    } else if (newPassword !== confirmPassword) {
      setMatchText("Passwords do not match ❌");
    } else {
      setMatchText("Passwords match ✅");
    }
  }, [newPassword, confirmPassword]);

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      return alert("All fields are required");
    }

    if (newPassword !== confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await API.post(
        "/users/change-password",
        { oldPassword, newPassword } 
      );

      alert("Password changed successfully");
      onClose();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-gray-900 text-white rounded-lg p-6 w-[90%] max-w-md shadow-lg border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-center">Change Password</h2>

        <div className="space-y-4">
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <p className={`text-sm ${matchText.includes("match") ? "text-green-400" : "text-red-400"}`}>
            {matchText}
          </p>
        </div>

        <div className="flex justify-end mt-6 space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleChangePassword}
            disabled={loading}
            className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-60"
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
