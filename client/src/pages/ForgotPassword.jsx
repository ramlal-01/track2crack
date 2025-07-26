import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await API.post('/auth/forgot-password', { email: email.trim() });
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-sm sm:max-w-md">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-purple-600 mb-6">Forgot Password</h2>

        {submitted ? (
          <div className="text-center">
            <p className="text-green-600 mb-4 text-sm sm:text-base">
              If the email is registered, a password reset link has been sent to your inbox.
            </p>
            <Link to="/login" className="text-blue-600 hover:underline font-medium text-sm sm:text-base">
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none text-sm sm:text-base focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>

            {error && <p className="text-red-500 text-xs sm:text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-purple-600 text-white py-2 sm:py-3 rounded-md font-semibold transition text-sm sm:text-base
                ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
