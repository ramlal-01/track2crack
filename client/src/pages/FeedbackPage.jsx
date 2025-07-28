import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';

const FeedbackPage = () => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  
  const emojis = ['😞', '😕', '😐', '😊', '😍'];
  const feedbackTypes = [
    'Very Dissatisfied',
    'Dissatisfied',
    'Neutral',
    'Satisfied',
    'Very Satisfied'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/feedback/submit', {
        rating,
        feedback,
      });

      if (response.data && response.data.success) {
        setSubmitted(true);
      } else {
        alert('Failed to submit feedback.');
      }
    } catch (err) {
      console.error('Feedback error:', err);
      alert('Server error!');
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-md w-full p-6 sm:p-8 rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 mx-4">
          <div className="text-center">
            <div className="text-5xl mb-4 text-blue-600 dark:text-blue-400">🎉</div>
            <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">Thank You!</h2>
            <p className="mb-6 text-gray-600 dark:text-gray-300">Your feedback helps us improve Track2Crack.</p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button
                onClick={() => setSubmitted(false)}
                className="px-4 sm:px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full font-medium hover:from-blue-600 hover:to-indigo-700 transition-all"
              >
                Submit Another Feedback
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 sm:px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-md w-full p-6 sm:p-8 rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 mx-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">Track2Crack</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm sm:text-base"
          >
            ← Back
          </button>
        </div>

        <h2 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800 dark:text-white">We value your opinion</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-300 text-sm sm:text-base">How would you rate your overall experience?</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6 sm:mb-8">
            <div className="flex justify-between mb-2 px-2 sm:px-0">
              {emojis.map((emoji, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setRating(index + 1)}
                  className={`text-3xl sm:text-4xl p-1 sm:p-2 rounded-full transition-all ${
                    rating === index + 1 
                      ? 'transform scale-110 text-blue-600 dark:text-blue-400' 
                      : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              {rating > 0 ? feedbackTypes[rating - 1] : 'Select your rating'}
            </p>
          </div>

          <div className="mb-6">
            <label htmlFor="feedback" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Kindly take a moment to tell us what you think
            </label>
            <textarea
              id="feedback"
              rows="4"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full p-3 text-sm sm:text-base rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
              placeholder="Your feedback helps us improve..."
            ></textarea>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 sm:px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={rating === 0}
              className={`px-4 sm:px-6 py-2 rounded-full font-medium flex items-center justify-center space-x-2 ${
                rating === 0 
                  ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed text-gray-500 dark:text-gray-300' 
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white'
              } transition-all`}
            >
              <span className="text-sm sm:text-base">🌟</span>
              <span className="text-sm sm:text-base">Share Feedback</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackPage;