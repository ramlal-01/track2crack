import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/api';
import { FaEnvelope, FaLock, FaGoogle, FaGithub, FaLinkedin } from 'react-icons/fa';
import { auth, googleProvider, githubProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { useAuth } from '../context/AuthContext'; 

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false); // ✅ Missing loading state
  const navigate = useNavigate();
  const [showResend, setShowResend] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const [resending, setResending] = useState(false);
  const { login } = useAuth(); 

  useEffect(() => {
    const timer = setTimeout(() => {
      const emailInput = document.getElementById('email');
      const passInput = document.getElementById('password');
      if (emailInput) emailInput.value = '';
      if (passInput) passInput.value = '';
      setFormData({ email: '', password: '' });
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setShowResend(false);

  try {
    const response = await API.post('/auth/login', formData);
    const { accessToken, user } = response.data;
    localStorage.setItem('token', accessToken);
    localStorage.setItem('userId', user._id);
    localStorage.setItem('user', JSON.stringify({
      _id: user._id,
      name: user.name || user.email.split('@')[0],
      email: user.email
    }));

    // ✅ FIXED: Inform global auth context
    login({
      _id: user._id,
      name: user.name || user.email.split('@')[0],
      email: user.email
    },accessToken);

    navigate('/dashboard');
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    console.error('Login error:', msg);

    if (err.response?.status === 403 && msg === 'Please verify your email before logging in.') {
      alert('❗ Please verify your email before logging in.');
      setShowResend(true);
      setUnverifiedEmail(formData.email);
    } else if (err.response?.status === 401) {
      alert('❌ Invalid credentials. Please try again.');
    } else {
      alert('🚨 Server error. Please try again later.');
    }
  } finally {
    setLoading(false);
  }
};




  const handleResend = async () => {
    if (!unverifiedEmail) return;

    try {
      if (resending) return;

      setResending(true);
      await API.post('/auth/resend-verification', { email: unverifiedEmail });
      alert('Verification email resent. Check your inbox.');
    } catch (err) {
      alert('Failed to resend verification email');
      console.error(err);
    } finally {
      setResending(false);
    }
  };


const handleOAuthLogin = async (providerName) => {
  try {
    const provider = providerName === 'google' ? googleProvider : githubProvider;
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const payload = {
      email: user.email,
      uid: user.uid,
      name: user.displayName,
      avatarUrl: user.photoURL,
      provider: user.providerData[0]?.providerId || providerName,
      emailVerified: user.emailVerified,
    };
 
    const response = await API.post('/auth/social-login', payload); 

    const { accessToken, user: backendUser } = response.data;

    if (!accessToken || !backendUser) {
      console.error("❌ Invalid OAuth response structure");
      alert('OAuth login failed. Invalid response from server.');
      return;
    }

    localStorage.setItem('token', accessToken);
    localStorage.setItem('userId', backendUser._id);
    localStorage.setItem('user', JSON.stringify({
      _id: backendUser._id,
      name: backendUser.name || backendUser.email.split('@')[0],
      email: backendUser.email
    }));

    login({
      _id: backendUser._id,
      name: backendUser.name || backendUser.email.split('@')[0],
      email: backendUser.email
    },accessToken);

    navigate('/dashboard');
  } catch (error) {
    console.error('❌ OAuth login error:', error.response?.data || error.message);
    alert('OAuth login failed. Please try again.');
  }
};



  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-sm sm:max-w-md">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-purple-600 mb-6">LogIn</h2>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" autoComplete="off">
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">Email</label>
            <div className="flex items-center border border-gray-300 rounded-md px-3">
              <FaEnvelope className="text-gray-400 text-sm sm:text-base" />
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="off"
                required
                className="w-full px-2 py-2 outline-none text-sm sm:text-base"
                placeholder="bhaskar@gmail.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">Password</label>
            <div className="flex items-center border border-gray-300 rounded-md px-3">
              <FaLock className="text-gray-400 text-sm sm:text-base" />
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
                className="w-full px-2 py-2 outline-none text-sm sm:text-base"
                placeholder="Enter password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center gap-2 py-2 sm:py-3 rounded-md font-semibold transition text-sm sm:text-base
              ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-purple-500'} 
              text-white hover:opacity-90`}
          >
            {loading ? (
              <>
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Logging in...
              </>
            ) : (
              'Log In'
            )}
          </button>
        </form>

        <div className="text-center mt-4">
          <Link to="/forgot-password" className="text-xs sm:text-sm text-gray-600 hover:underline">
            Forgot password?
          </Link>
        </div>

        <div className="text-center mt-2">
          <p className="text-xs sm:text-sm text-gray-700">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>

       <div className="mt-6">
        <p className="text-center text-xs sm:text-sm text-gray-500 mb-4">Or log in with:</p>
        <div className="space-y-3">
          <button
            onClick={() => handleOAuthLogin('google')}
            className="flex items-center justify-center w-full border border-gray-300 rounded-full py-2 sm:py-3 text-xs sm:text-sm font-semibold text-gray-800 shadow-sm hover:shadow-md transition hover:bg-red-50"
          >
            <FaGoogle className="mr-2 text-lg sm:text-xl text-[#DB4437]" />
            Sign in with Google
          </button>
          <button
            onClick={() => handleOAuthLogin('github')}
            className="flex items-center justify-center w-full border border-gray-300 rounded-full py-2 sm:py-3 text-xs sm:text-sm font-semibold text-gray-800 shadow-sm hover:shadow-md transition hover:bg-gray-100"
          >
            <FaGithub className="mr-2 text-lg sm:text-xl text-gray-800" />
            Sign in with GitHub
          </button>
        </div>
      </div>


        {showResend && (
          <div className="text-center mt-4">
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-blue-600 hover:underline font-medium text-xs sm:text-sm"
            >
              {resending ? 'Resending...' : 'Resend Verification Email'}
            </button>
          </div>
        )}


      </div>
    </div>
  );
};

export default Login;
