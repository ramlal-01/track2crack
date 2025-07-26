import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/api';

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('pending'); // pending | success | error
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const calledRef = useRef(false); // ✅ Reliable call guard

  useEffect(() => {
    const verify = async () => {
      if (calledRef.current) return;
      calledRef.current = true;

      try {
        const res = await API.get(`/auth/verify-email/${token}`);
        setStatus('success');
        setMessage(res.data.message);
        setTimeout(() => navigate('/login'), 3000);
      } catch (err) {
        const msg = err.response?.data?.message;

        if (msg === 'Email already verified') {
          setStatus('success');
          setMessage('Email already verified. Redirecting to login...');
          setTimeout(() => navigate('/login'), 3000);
        } else {
          setStatus('error');
          setMessage(msg || 'Verification failed. Please try again later.');
        }
      }
    };

    if (token) verify();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-sm sm:max-w-md text-center">
        {status === 'pending' && (
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 text-sm sm:text-base">🔄 Verifying your email...</p>
          </div>
        )}
        {status === 'success' && (
          <div className="flex flex-col items-center space-y-4">
            <div className="text-green-500 text-4xl">✅</div>
            <p className="text-green-600 font-semibold text-sm sm:text-base">
              {message}
              <br />
              <span className="text-xs sm:text-sm font-normal">Redirecting to login...</span>
            </p>
          </div>
        )}
        {status === 'error' && (
          <div className="flex flex-col items-center space-y-4">
            <div className="text-red-500 text-4xl">❌</div>
            <p className="text-red-500 font-semibold text-sm sm:text-base">{message}</p>
            <button
              onClick={() => navigate('/login')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm sm:text-base"
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
