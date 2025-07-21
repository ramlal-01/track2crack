import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Feedback submitted:', { rating, feedback });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-md w-full p-8 rounded-xl bg-white shadow-lg border border-gray-200">
          <div className="text-center">
            <div className="text-5xl mb-4 text-blue-600">🎉</div>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Thank You!</h2>
            <p className="mb-6 text-gray-600">Your feedback helps us improve Track2Crack.</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full font-medium hover:from-blue-600 hover:to-indigo-700 transition-all"
              >
                Submit Another Feedback
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2 bg-gray-100 text-gray-800 rounded-full font-medium hover:bg-gray-200 transition-all"
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-md w-full p-8 rounded-xl bg-white shadow-lg border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Track2Crack</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back
          </button>
        </div>

        <h2 className="text-xl font-semibold mb-2 text-gray-800">We value your opinion</h2>
        <p className="mb-6 text-gray-600">How would you rate your overall experience?</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {emojis.map((emoji, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setRating(index + 1)}
                  className={`text-4xl p-2 rounded-full transition-all ${rating === index + 1 ? 'transform scale-110 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-gray-500">
              {rating > 0 ? feedbackTypes[rating - 1] : 'Select your rating'}
            </p>
          </div>

          <div className="mb-6">
            <label htmlFor="feedback" className="block text-sm font-medium mb-2 text-gray-700">
              Kindly take a moment to tell us what you think
            </label>
            <textarea
              id="feedback"
              rows="4"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your feedback helps us improve..."
            ></textarea>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-gray-100 text-gray-800 rounded-full font-medium hover:bg-gray-200 transition-all flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={rating === 0}
              className={`px-6 py-2 rounded-full font-medium flex-1 flex items-center justify-center space-x-2 ${
                rating === 0 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white'
              } transition-all`}
            >
              <span>🌟</span>
              <span>Share Feedback</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackPage;