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
import { messaging, getToken, onMessage } from "./firebase";  
import API from './api/api';
import { toast } from 'react-toastify'; 
import Feedback from './pages/FeedbackPage';
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

 


  useEffect(() => {
    const setupFCM = async () => {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        console.warn("Notification permission not granted");
        return;
      }

      try {
        const token = await getToken(messaging, {
          vapidKey: "BFC2XaAuXY6Xco3qHbXHH-iA2dsZUWM1cccmnD9jm2w8lH1rx1QgmgYfOndUoZyfVLAOgIS-FMBFWAjjT8rhfoE",
        });

        if (token) {
          console.log("🔥 FCM Token:", token);

          // ✅ Send token to backend
          const storedToken = localStorage.getItem("token");
          if (storedToken) {
            await API.post(
              "/users/fcm-token",
              { fcmToken: token },
              {
                headers: {
                  Authorization: `Bearer ${storedToken}`,
                },
              }
            );
            console.log("✅ Token saved to backend");
          }
        } else {
          console.warn("No token received");
        }
      } catch (err) {
        console.error("Error fetching FCM token:", err);
      }
    };

    setupFCM();

    // 👂 Foreground notifications handler
    onMessage(messaging, (payload) => { 
    toast.info(`${payload?.notification?.title}: ${payload?.notification?.body}`);
  });

  }, []);


  // Show navbar only on specific routes
  const showNavbar = ['/', '/login', '/register', '/forgot-password', '/reset-password', '/verify-email'].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {showNavbar && <Navbar  />}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard  />} />
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
          {/* <Route path='/deskboard' element={<Deskboard />} /> */}
          <Route path="/dashboard/feedback" element = {<Feedback />} />

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