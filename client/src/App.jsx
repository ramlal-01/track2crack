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
import CN from './pages/core/CoreCN';
import DBMS from './pages/core/CoreDBMS';
import OS from './pages/core/CoreOS'; 
import { messaging, getToken, onMessage } from "./firebase";  
import API from './api/api';
import { toast } from 'react-toastify'; 
import Feedback from './pages/FeedbackPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import DashboardHeader from './components/DashboardHeader';


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
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: registration,
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



  useEffect(() => {
  const interval = setInterval(() => {
    const refresh = async () => {
      try {
        const res = await API.get("/auth/refresh", { withCredentials: true });
        localStorage.setItem("token", res.data.token);
        console.log("🔄 Access token refreshed");
      } catch (err) {
        console.warn("⚠️ Failed to refresh token:", err.response?.data || err.message);
        // Optional: force logout on refresh failure
        // logout(); 
      }
    };

    refresh();
  }, 10 * 60 * 1000); // every 10 minutes

  return () => clearInterval(interval);
}, []);


  // Show navbar only on specific routes
  const showNavbar = ['/', '/login', '/register', '/forgot-password', '/reset-password', '/verify-email'].includes(location.pathname);

  const dashboardRoutes = [
  "/dashboard",
  "/dashboard/dsa",
  "/dashboard/theory/dsa",
  "/dashboard/theory/java",
  "/dashboard/theory/oops",
  "/dashboard/core/os",
  "/dashboard/core/dbms",
  "/dashboard/core/cn",
  "/dashboard/quizhistory",
  "/dashboard/revision-planner",
  "/dashboard/feedback",
  "/profile",
  "/edit-profile" ,
  "/quiz/history"
];


  return (
    <div className="flex flex-col min-h-screen">
      {showNavbar && <Navbar  />}

      {dashboardRoutes.includes(location.pathname) && <DashboardHeader />}

      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard/dsa" element={<ProtectedRoute><DSASheet /> </ProtectedRoute>} />
          {/* Theory Routes */}
          <Route path="/dashboard/theory/dsa" element={ <ProtectedRoute><DSA /> </ProtectedRoute>} />
          <Route path="/dashboard/theory/java" element={ <ProtectedRoute><Java /> </ProtectedRoute>} />
          <Route path="/dashboard/theory/oops" element={  <OOPS />  } />
          {/* Quiz Route */}
          <Route path="/quiz" element={   <Quiz />  } />
          <Route path="/quiz/history" element={<ProtectedRoute><QuizHistory /> </ProtectedRoute>} />

          {/* Core Routes and Core Quiz Routes  */}
          <Route path="/dashboard/core/cn" element={<ProtectedRoute><CN /> </ProtectedRoute>} />
          <Route path="/dashboard/core/dbms" element={<ProtectedRoute><DBMS /> </ProtectedRoute>} />
          <Route path="/dashboard/core/os" element={<ProtectedRoute><OS /> </ProtectedRoute>} />
          

          <Route path="/dashboard/quizhistory" element={<ProtectedRoute><MainHistory /> </ProtectedRoute>} />
          <Route path="/dashboard/revision-Planner" element={<ProtectedRoute><RevisionPlanner /> </ProtectedRoute>} />
          <Route path="/profile/" element={<ProtectedRoute><ProfilePage /> </ProtectedRoute>} />
          <Route path="/edit-profile" element={ <ProtectedRoute><EditProfile /> </ProtectedRoute>} />
          
          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />  
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
        theme="light"
      />
    </div>
  );
};

export default App;