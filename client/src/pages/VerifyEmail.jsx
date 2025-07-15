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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-center">
        {status === 'pending' && (
          <p className="text-gray-600 animate-pulse">🔄 Verifying your email...</p>
        )}
        {status === 'success' && (
          <p className="text-green-600 font-semibold">
            ✅ {message}
            <br />
            Redirecting to login...
          </p>
        )}
        {status === 'error' && (
          <p className="text-red-500 font-semibold">❌ {message}</p>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
