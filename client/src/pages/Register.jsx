import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/api';
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaGoogle,
  FaGithub,
  FaLinkedin
} from 'react-icons/fa';
import { auth, googleProvider, githubProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
 


// Password strength logic
const getPasswordStrength = (password) => {
  let strength = 0;
  if (password.length >= 6) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  return strength;
};

const getStrengthLabel = (score) => {
  switch (score) {
    case 0:
    case 1:
      return 'Weak';
    case 2:
      return 'Medium';
    case 3:
    case 4:
      return 'Strong';
    case 5:
      return 'Very Strong';
    default:
      return '';
  }
};

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await API.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      alert('✅ Registration successful! Please check your email and verify your account before logging in.');
      navigate('/login');
    } catch (err) {
      console.error('FULL ERROR:', err);
      alert('Registration failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength(formData.password);
  const strengthLabel = getStrengthLabel(strength);
  const strengthColor = {
    Weak: 'bg-red-400',
    Medium: 'bg-yellow-400',
    Strong: 'bg-green-500',
    'Very Strong': 'bg-blue-600'
  }[strengthLabel] || 'bg-gray-300';

  const passwordsMatch =
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword;

  const isFormValid =
    formData.name.trim() !== '' &&
    formData.email.trim() !== '' &&
    formData.password.trim() !== '' &&
    formData.confirmPassword.trim() !== '' &&
    passwordsMatch &&
    strength >= 3;


    

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
        const { token: backendToken, user: backendUser } = response.data;

        localStorage.setItem('token', backendToken);
        localStorage.setItem('userId', backendUser._id);
        login({
  _id: backendUser._id,
  name: backendUser.name || backendUser.email.split('@')[0],
  email: backendUser.email
}, backendToken); // ✅ now token will persist

        navigate('/dashboard');
      } catch (error) {
        console.error('OAuth signup failed:', error);
        alert('OAuth signup failed. Please try again.');
      }
    };




  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-sm sm:max-w-md">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-purple-600 mb-6">Sign Up</h2>

        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4 sm:space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">Full Name</label>
            <div className="flex items-center border border-gray-300 rounded-md px-3">
              <FaUser className="text-gray-400 text-sm sm:text-base" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g. Bhaskar Sharma"
                autoComplete="off"
                className="w-full px-2 py-2 outline-none text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">Email</label>
            <div className="flex items-center border border-gray-300 rounded-md px-3">
              <FaEnvelope className="text-gray-400 text-sm sm:text-base" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="bhaskar@gmail.com"
                autoComplete="off"
                className="w-full px-2 py-2 outline-none text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">Password</label>
            <div className="flex items-center border border-gray-300 rounded-md px-3">
              <FaLock className="text-gray-400 mr-2 text-sm sm:text-base" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
                placeholder="Enter password"
                className="w-full py-2 outline-none text-sm sm:text-base"
              />
            </div>

            {formData.password && (
              <>
                <div className="w-full h-2 mt-2 rounded bg-gray-200">
                  <div
                    className={`h-2 rounded ${strengthColor}`}
                    style={{ width: `${(strength / 5) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">Level: {strengthLabel}</div>
              </>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">Confirm Password</label>
            <div className="flex items-center border border-gray-300 rounded-md px-3">
              <FaLock className="text-gray-400 mr-2 text-sm sm:text-base" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
                placeholder="Confirm password"
                className="w-full py-2 outline-none text-sm sm:text-base"
              />
            </div>

            {formData.confirmPassword.length > 0 && (
              <p
                className={`text-xs sm:text-sm mt-1 ${
                  passwordsMatch ? 'text-green-600' : 'text-red-500'
                }`}
              >
                {passwordsMatch ? '✅ Passwords match' : '❌ Passwords do not match'}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!isFormValid || loading}
            className={`w-full py-2 sm:py-3 rounded-md font-semibold transition text-sm sm:text-base ${
              isFormValid && !loading
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Registering...
              </span>
            ) : (
              "Register"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-4">
          <p className="text-xs sm:text-sm text-gray-700">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">
              Login here
            </Link>
          </p>
        </div>

        <div className="mt-6">
          <p className="text-center text-xs sm:text-sm text-gray-500 mb-4">Or Sign up with:</p>
          <div className="space-y-3">
            <button
              onClick={() => handleOAuthLogin('google')}
              className="flex items-center justify-center w-full border border-gray-300 rounded-full py-2 sm:py-3 text-xs sm:text-sm font-semibold text-gray-800 shadow-sm hover:shadow-md transition hover:bg-red-50"
            >
              <FaGoogle className="mr-2 text-lg sm:text-xl text-[#e3580e]" />
              Sign up with Google
            </button>
            <button
              onClick={() => handleOAuthLogin('github')}
              className="flex items-center justify-center w-full border border-gray-300 rounded-full py-2 sm:py-3 text-xs sm:text-sm font-semibold text-gray-800 shadow-sm hover:shadow-md transition hover:bg-gray-100"
            >
              <FaGithub className="mr-2 text-lg sm:text-xl text-gray-800" />
              Sign up with GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
