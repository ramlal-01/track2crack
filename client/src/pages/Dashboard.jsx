// src/pages/Deskboard.jsx
import React from "react";
import TopRightAvatar from "../components/TopRightAvatar";
import { useTheme } from "../context/ThemeContext"; // global dark/light theme
import { FaFire } from "react-icons/fa";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import SubjectCard from "../components/SubjectCard";
import { useNavigate, useLocation } from "react-router-dom";
import SubjectProgressChart from "../components/SubjectProgressChart";
import { useEffect, useState } from "react";
import API from "../api/api"; // your API utility
import { Navigate } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";

const Dashboard = () => {
  const { theme } = useTheme(); // dark / light 
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isSidebarOpen, closeSidebar } = useSidebar();

    if (!user) return <Navigate to="/login" />;

 const [progress, setProgress] = useState({
    Java: 0,
    OOPS: 0,
    DSA: 0,
    OS: 0,
    DBMS: 0,
    CN: 0,
    DSASheet: 0,
  });

const [quizProgress, setQuizProgress] = useState({
  Java: 0,
  OOPS: 0,
  DSA: 0,
  OS: 0,
  DBMS: 0,
  CN: 0
});


useEffect(() => {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  
  if (!userId || !token) {
    console.error("Missing credentials");
    setError("Please login again");
    return;
  }

  const fetchProgress = async () => {
    setIsLoading(true);
    try {
      // 1. First fetch all topics to create ID-subject mapping
      const [
        { data: javaTopics = {} },
        { data: oopsTopics = {} },
        { data: dsaTheoryTopics = {} },
        { data: osTopics = {} },
        { data: dbmsTopics = {} },
        { data: cnTopics = {} }
      ] = await Promise.all([
        API.get('/theory/topics?subject=Java'),
        API.get('/theory/topics?subject=OOPS'),
        API.get('/theory/topics?subject=DSA'),
        API.get('/core/topics?subject=OS'),
        API.get('/core/topics?subject=DBMS'),
        API.get('/core/topics?subject=CN')
      ]);

      // Create ID to subject mapping
      const topicSubjectMap = {};
      
      // Add theory topics
      [javaTopics, oopsTopics, dsaTheoryTopics].forEach(topicGroup => {
        topicGroup.topics?.forEach(topic => {
          topicSubjectMap[topic._id] = topic.subject;
        });
      });

      // Add core topics
      [osTopics, dbmsTopics, cnTopics].forEach(topicGroup => {
        topicGroup.topics?.forEach(topic => {
          topicSubjectMap[topic._id] = topic.subject;
        });
      });

      // 2. Now fetch progress data
      const [
        { data: theoryProgress = {} },
        { data: coreProgress = {} },
        { data: dsaProgress = {} },
        { data: dsaQuestions = {} }
      ] = await Promise.all([
        API.get(`/theory/progress/${userId}`),
        API.get(`/core/progress/${userId}`),
        API.get(`/dsa/progress/${userId}`),
        API.get('/dsa/questions')
      ]);

      // Add subject to progress items
      const theoryWithSubjects = theoryProgress.progress?.map(item => ({
        ...item,
        subject: topicSubjectMap[item.topicId]
      })) || [];

      const coreWithSubjects = coreProgress.progress?.map(item => ({
        ...item,
        subject: topicSubjectMap[item.coreTopicId]
      })) || [];

      const calculateProgress = (items, total) => {
        if (!Array.isArray(items)) return 0;
        const completed = items.filter(i => i?.isCompleted).length;
        return total > 0 ? Math.round((completed / total) * 100) : 0;
      };

      const newProgress = {
        Java: calculateProgress(
          theoryWithSubjects.filter(p => p?.subject === 'Java'),
          javaTopics.count || 0
        ),
        OOPS: calculateProgress(
          theoryWithSubjects.filter(p => p?.subject === 'OOPS'),
          oopsTopics.count || 0
        ),
        DSA: calculateProgress(
          theoryWithSubjects.filter(p => p?.subject === 'DSA'),
          dsaTheoryTopics.count || 0
        ),
        OS: calculateProgress(
          coreWithSubjects.filter(p => p?.subject === 'OS'),
          osTopics.count || 0
        ),
        DBMS: calculateProgress(
          coreWithSubjects.filter(p => p?.subject === 'DBMS'),
          dbmsTopics.count || 0
        ),
        CN: calculateProgress(
          coreWithSubjects.filter(p => p?.subject === 'CN'),
          cnTopics.count || 0
        ),
        DSASheet: calculateProgress(
          dsaProgress.progress || [],
          dsaQuestions.count || 0
        )
      };


      setProgress(newProgress);

    } catch (err) {
      console.error("Error:", err);
      setError("Failed to load progress");
    } finally {
      setIsLoading(false);
    }
  };

  fetchProgress();
}, []);





useEffect(() => {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  if (!userId || !token) return;

  const fetchQuizProgress = async () => {
    try {
      const quizRequests = [
        API.get('/quiz/progress', {
           
          params: { subject: 'Java', source: 'Theory' }
        }),
        API.get('/quiz/progress', {
           
          params: { subject: 'OOPS', source: 'Theory' }
        }),
        API.get('/quiz/progress', {
           
          params: { subject: 'DSA', source: 'Theory' }
        }),
        API.get('/quiz/progress', {
          
          params: { subject: 'OS', source: 'Core' }
        }),
        API.get('/quiz/progress', {
           
          params: { subject: 'DBMS', source: 'Core' }
        }),
        API.get('/quiz/progress', {
           
          params: { subject: 'CN', source: 'Core' }
        })
      ];

      const quizResponses = await Promise.all(quizRequests);

      setQuizProgress({
        Java: quizResponses[0].data.progressPercent || 0,
        OOPS: quizResponses[1].data.progressPercent || 0,
        DSA: quizResponses[2].data.progressPercent || 0,
        OS: quizResponses[3].data.progressPercent || 0,
        DBMS: quizResponses[4].data.progressPercent || 0,
        CN: quizResponses[5].data.progressPercent || 0
      });

    } catch (err) {
      console.error("❌ Quiz Progress Fetch Failed:", err);
    }
  };

  fetchQuizProgress();
}, []);




  return (
    <div className={`flex min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      {/* Main content */}
      <div className={`flex-1 transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'lg:ml-72' : 'lg:ml-0'
      } p-6 lg:p-10`}>
        {/* Welcome Message */}
        <div className="hidden sm:block mb-10">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            Welcome back, <span className="text-purple-700 dark:text-blue-300">{user?.name || "Coder"}</span>
          </h2>
          <p className="text-sb italic text-indigo-700 dark:text-gray-400">
            "Track your progress. Crack your placements."
          </p>
        </div>

        {/* DSA Sheet */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 mt-6 mb-15"> 
          <SubjectCard
            icon="/assets/icons/dsa-sheet.svg"
            title="DSA Sheet"
            progress={progress.DSASheet}
            onClick={() => navigate("/dashboard/dsa")}
          />    
        </div>
        
        {/* Core Subjects */}
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white tracking-tight mb-2">📘 Core Subjects</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Track progress in foundational subjects</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-6 mb-15">
          <SubjectCard 
            icon="/assets/icons/os.svg" 
            title="Operating Systems" 
            progress={progress.OS}   
            onClick={() => navigate("/dashboard/core/os")}
          />
          <SubjectCard 
            icon="/assets/icons/dbms.svg" 
            title="DBMS" 
            progress={progress.DBMS}  
            onClick={() => navigate("/dashboard/core/dbms")}
          />
          <SubjectCard 
            icon="/assets/icons/cn.svg" 
            title="Computer Networks" 
            progress={progress.CN}     
            onClick={() => navigate("/dashboard/core/cn")}
          />
        </div>

        {/* Theory Subjects */}
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white tracking-tight mb-2">
          🧠 Conceptual Mastery
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Strengthen your foundational understanding in core CS concepts like OOPS, Java, and DSA Theory.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 mt-6 mb-15">
          <SubjectCard
            icon="/assets/icons/java.svg"
            title="Java"
            progress={progress.Java}  
            onClick={() => navigate("/dashboard/theory/java")}
          />
          <SubjectCard
            icon="/assets/icons/dsa.svg"
            title="DSA Theory"
            progress={progress.DSA}  
            onClick={() => navigate("/dashboard/theory/dsa")}
          />
          <SubjectCard
            icon="/assets/icons/oops.svg"
            title="OOPS"
            progress={progress.OOPS}  
            onClick={() => navigate("/dashboard/theory/oops")}
          />
        </div>

        {/* Progress Chart */}
        <SubjectProgressChart data={{
          Java: quizProgress.Java,
          OOPS: quizProgress.OOPS,
          DSA: quizProgress.DSA,
          OS: quizProgress.OS,
          DBMS: quizProgress.DBMS,
          CN: quizProgress.CN,
        }} />
      </div>
    </div>
  );
};

export default Dashboard;