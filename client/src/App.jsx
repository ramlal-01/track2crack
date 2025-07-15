import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DSASheet from './pages/DSASheet';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DSA from './pages/theory/DSA';               // ✅ DSA Theory Page
import Java from './pages/theory/Java';             // ✅ Java Theory Page
import OOPS from './pages/theory/OOPS';             // ✅ OOPS Theory Page (NEW)
import Quiz from "./pages/quiz/Quiz";
import QuizHistory from "./pages/quiz/QuizHistory";
import MainHistory from './pages/MainHistory';
import RevisionPlanner from './pages/RevisionPlanner'
const App = () => {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dsa" element={<DSASheet />} />
            {/* ✅ Theory Routes */}
                <Route path="/theory/dsa" element={<DSA />} />
                <Route path="/theory/java" element={<Java />} />
                <Route path="/theory/oops" element={<OOPS />} /> {/* ✅ New OOPS Route */}

                {/* ✅ Quiz Route */}
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/quiz/history" element={<QuizHistory />} />
                {/* <Route path="/profile" element={<Profile />} /> */}
            <Route path="/quizhistory" element={<MainHistory />} />
            <Route path="/dashboard/revision-Plannar" element={<RevisionPlanner />} />

          </Routes>
        </div>
        <Footer />
      </div>

      {/* ✅ Add this to enable toast messages */}
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
    </BrowserRouter>
  );
};

export default App;
