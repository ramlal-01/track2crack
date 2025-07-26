import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/api';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setMsg('');

    if (newPassword !== confirmPassword) {
      setErr('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setErr('Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      const res = await API.post(`/auth/reset-password/${token}`, { newPassword });
      setMsg(res.data.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setErr(error.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-sm sm:max-w-md">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-purple-600 mb-6">Reset Password</h2>

        {msg ? (
          <p className="text-green-600 text-center text-sm sm:text-base">{msg}</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none text-sm sm:text-base focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">Confirm Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none text-sm sm:text-base focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Confirm new password"
              />
            </div>

            {err && <p className="text-red-500 text-xs sm:text-sm">{err}</p>}

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-purple-600 text-white py-2 sm:py-3 rounded-md font-semibold text-sm sm:text-base
                ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'} transition`}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
