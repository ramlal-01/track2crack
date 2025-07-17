import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DSASheet from './pages/DSASheet';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DSA from './pages/theory/DSA';
import Java from './pages/theory/Java';
import OOPS from './pages/theory/OOPS';
import Quiz from "./pages/quiz/Quiz";
import QuizHistory from "./pages/quiz/QuizHistory";
import MainHistory from './pages/MainHistory';
import RevisionPlanner from './pages/RevisionPlanner';
import ProfilePage from './pages/ProfilePage';
import EditProfile from './pages/EditProfile';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import { useEffect, useState } from 'react';
import CN from './pages/CoreCN';
import DBMS from './pages/CoreDBMS';
import OS from './pages/CoreOS'; 

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

const AppContent = () => {
  const location = useLocation();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Initialize theme on load
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Show navbar only on specific routes
  const showNavbar = ['/', '/login', '/register', '/forgot-password', '/reset-password', '/verify-email'].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {showNavbar && <Navbar theme={theme} toggleTheme={toggleTheme} />}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/dsa" element={<DSASheet />} />
          {/* Theory Routes */}
          <Route path="/dashboard/theory/dsa" element={<DSA />} />
          <Route path="/dashboard/theory/java" element={<Java />} />
          <Route path="/dashboard/theory/oops" element={<OOPS />} />
          {/* Quiz Route */}
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/quiz/history" element={<QuizHistory />} />

          {/* Core Routes and Core Quiz Routes  */}
          <Route path="/dashboard/core/cn" element={<CN />} />
          <Route path="/dashboard/core/dbms" element={<DBMS />} />
          <Route path="/dashboard/core/os" element={<OS />} />
          

          <Route path="/dashboard/quizhistory" element={<MainHistory />} />
          <Route path="/dashboard/revision-Planner" element={<RevisionPlanner />} />
          <Route path="/profile/" element={<ProfilePage />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
      <Footer />

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </div>
  );
};

export default App;