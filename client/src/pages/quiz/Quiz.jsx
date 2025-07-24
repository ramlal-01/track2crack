import React, { useEffect, useState, useRef } from "react";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { FiBookmark, FiClock, FiAward, FiHelpCircle } from "react-icons/fi";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, } from "react-icons/fi";
import API from '../../api/api';
const Quiz = () => {
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState(null);
  const questionLockedRef = useRef(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [bookmarked, setBookmarked] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(200); // 3 min 20 sec
  const [timerActive, setTimerActive] = useState(true);
  const [showExplanation, setShowExplanation] = useState({});
  const [darkMode, setDarkMode] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(15);
  const [optionsDisabled, setOptionsDisabled] = useState(false);
  const [questionLocked, setQuestionLocked] = useState(false);
  const timerRef = useRef(null);

  const token = localStorage.getItem("token");

  // Load quiz data
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("activeQuiz"));
    if (!saved) {
      toast.error("No quiz found. Redirecting...");
      const fallbackSubject = localStorage.getItem("viewHistoryFor") || "java";
      const fallbackSource = localStorage.getItem("viewHistorySource") || "theory";
      setTimeout(() => {
        navigate(`/dashboard/${fallbackSource.toLowerCase()}/${fallbackSubject.toLowerCase()}`);
      }, 200);
      return;
    }
    setQuizData(saved);
  }, []);

  // Timer logic for per-question
  useEffect(() => {
    if (!quizData || submitted) return;
  
    setQuestionTimeLeft(15);
    setOptionsDisabled(false);
    setQuestionLocked(false);
    questionLockedRef.current = false; // 🔄 keep ref in sync
  
    if (timerRef.current) clearInterval(timerRef.current);
  
    timerRef.current = setInterval(() => {
      setQuestionTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          if (!questionLockedRef.current) {
            setOptionsDisabled(true);
            setQuestionLocked(true);
            questionLockedRef.current = true;
  
            setTimeout(() => {
              setQuestionLocked(false);
              questionLockedRef.current = false;
              goToNextQuestion();
            }, 1000);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentQuestionIndex, quizData, submitted]);
  
  // Global timer for the whole quiz
  useEffect(() => {
    if (submitted) return;
    if (timeLeft <= 0) {
      submitQuiz();
      return;
    }
    const globalTimer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(globalTimer);
  }, [timeLeft, submitted]);

  const handleAnswer = (selectedIdx) => {
    if (optionsDisabled || submitted || questionLockedRef.current) return;
  
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: selectedIdx,
    }));
  
    setQuestionLocked(true);
    questionLockedRef.current = true;
  
    if (timerRef.current) clearInterval(timerRef.current);
  
    setTimeout(() => {
      setQuestionLocked(false);
      questionLockedRef.current = false;
      goToNextQuestion();
    }, 200);
  };
  

  const goToNextQuestion = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      submitQuiz();
    }
  };

  const toggleBookmark = (index) => {
    setBookmarked((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleExplanation = (index) => {
    setShowExplanation((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const submitQuiz = async () => {

    if (!token) {
    toast.error("Session expired. Please login again");
    navigate('/login');
    return;
  }

  if (!quizData || submitted) return;
  setTimerActive(false);

  const questions = quizData.questions.map((q, index) => ({
    questionText: q.questionText,
    options: q.options,
    correctAnswerIndex: q.correctAnswerIndex,
    selectedAnswerIndex: selectedAnswers[index] ?? null,
    topicTag: q.topicTag,
  }));

  const bookmarkedQuestions = Object.entries(bookmarked)
    .filter(([_, val]) => val)
    .map(([index]) => ({
      questionText: quizData.questions[index].questionText,
      topicTag: quizData.questions[index].topicTag,
    }));

  const correctCount = questions.filter(
    (q) => q.selectedAnswerIndex === q.correctAnswerIndex
  ).length;

  setScore(correctCount);
  setSubmitted(true);

  try {
    const res = await API.post("/quiz/submit", {
      subject: quizData.subject,
      source: quizData.source,
      topics: quizData.topicsCovered,
      questions,
      bookmarkedQuestions,
    });

    if (!res.data) {
  throw new Error("Empty response from server");
}
    // Store quiz completion data for TheoryPage progress calculation
    const quizCompletionData = {
      topicId: quizData.topicId,
      score: correctCount,
      totalQuestions: questions.length,
      percentage: Math.round((correctCount / questions.length) * 100),
      completedAt: new Date().toISOString()
    };
    
    // Store in localStorage
    const existingQuizData = JSON.parse(localStorage.getItem("quizProgressData") || "{}");
    existingQuizData[quizData.topicId] = quizCompletionData;
    localStorage.setItem("quizProgressData", JSON.stringify(existingQuizData));
    
    // Also store in the format that TheoryPage expects
    localStorage.setItem("quizCompleted", JSON.stringify({
      topicId: quizData.topicId,
      score: Math.round((correctCount / questions.length) * 100)
    }));
    
    toast.success(`Quiz submitted! Score: ${correctCount}/${questions.length}`);
    localStorage.setItem("viewHistoryFor", quizData.subject);
    localStorage.setItem("viewHistorySource", quizData.source); 
    localStorage.removeItem("activeQuiz");
  } catch (err) {
    toast.error(err.response?.data?.message || "Error submitting quiz");
  }
};

  if (!quizData) {
    return (
      <div className={`h-screen flex justify-center items-center ${darkMode ? "bg-gray-900" : "bg-gradient-to-br from-blue-50 to-pink-50"}`}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400 mb-4"></div>
          <p className={`text-lg ${darkMode ? "text-white" : "text-blue-600"} font-medium`}>Loading quiz...</p>
        </div>
      </div>
    );
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timePercentage = Math.round((timeLeft / 1200) * 100);
  const answeredCount = Object.keys(selectedAnswers).length;
  
  // Calculate progress based on correct answers, not just answered questions
  const correctAnswers = Object.entries(selectedAnswers).filter(([index, selectedIdx]) => {
    return selectedIdx === quizData.questions[index].correctAnswerIndex;
  }).length;
  
  const completionPercentage = Math.round((correctAnswers / quizData.questions.length) * 100);

  return (
    <div className={`min-h-screen p-4 md:p-6 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gradient-to-br from-blue-50 to-pink-50"}`}>
      <ToastContainer position="top-center" theme={darkMode ? "dark" : "light"} />
      
      {/* Enhanced Header with back button and dark mode toggle */}
      <div className="sticky top-0 z-20 bg-white dark:bg-gray-900 flex justify-between items-center mb-6 px-6 py-3 shadow-sm dark:shadow-gray-800/30 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              const fallbackSubject = localStorage.getItem("viewHistoryFor") || "java";
              const fallbackSource = localStorage.getItem("viewHistorySource") || "theory";
              navigate(`/dashboard/${fallbackSource.toLowerCase()}/${fallbackSubject.toLowerCase()}`);
            }}
            className={`px-4 py-2.5 rounded-xl text-lg font-semibold transition-all flex items-center gap-2
              ${darkMode 
                ? "bg-gray-800 text-gray-100 hover:bg-gray-700 active:bg-gray-600" 
                : "bg-white text-blue-600 hover:bg-blue-50 active:bg-blue-100 shadow-sm border border-gray-200"
              }`}
          >
            <FiArrowLeft className="inline" />
            <span>Back</span>
          </button>
          
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2.5 rounded-xl transition-all ${darkMode 
              ? "bg-gray-800 text-amber-300 hover:bg-gray-700 active:bg-gray-600" 
              : "bg-white text-blue-600 hover:bg-blue-50 active:bg-blue-100 shadow-sm border border-gray-200"
            }`}
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg">
            <FiClock className={`${darkMode ? "text-blue-400" : "text-blue-500"}`} />
            <span className={`font-extrabold text-lg ${timeLeft < 30 ? "text-red-600 animate-pulse" : darkMode ? "text-gray-100" : "text-gray-800"}`}>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </span>
          </div>
          
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg">
            <FiAward className={`${darkMode ? "text-amber-300" : "text-pink-500"}`} />
            <span className={darkMode ? "text-gray-100" : "text-gray-800"}>
              {submitted ? `${score}/${quizData.questions.length}` : "--"}
            </span>
          </div>
        </div>
      </div>

      {/* Main quiz header */}
      <div className={`rounded-2xl p-6 mb-8 ${darkMode ? "bg-gray-800" : "bg-gradient-to-r from-indigo-600 to-blue-400"} text-white shadow-xl`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              {quizData.subject} Quiz ({quizData.source})
            </h2>
            <p className={`${darkMode ? "text-blue-200" : "text-blue-50"}`}>
              Topics: {quizData.topicsCovered.join(", ")}
            </p>
          </div>
          <div className="w-24 h-24 mt-4 md:mt-0">
            <CircularProgressbar
              value={completionPercentage}
              text={`${completionPercentage}%`}
              styles={buildStyles({
                textColor: "#ffffff",
                pathColor: timeLeft > 300 
                  ? (darkMode ? "#93c5fd" : "#93c5fd")
                  : "#6366F1",
                trailColor: darkMode 
                  ? "rgba(255,255,255,0.1)" 
                  : "rgba(255,255,255,0.2)",
                textSize: "32px",
              })}
            />
          </div>
        </div>
      </div>

      {/* Progress indicators */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className={`text-sm font-medium ${darkMode ? "text-blue-300" : "text-blue-500"}`}>
            Correct answers: {correctAnswers}/{quizData.questions.length}
          </span>
          <span className={`text-sm font-medium ${darkMode ? "text-blue-300" : "text-pink-500"}`}>
            {completionPercentage}% complete
          </span>
        </div>
        <div className={`w-full rounded-full h-2.5 ${darkMode ? "bg-gray-700" : "bg-blue-100"}`}>
          <div 
            className={`h-2.5 rounded-full ${darkMode ? "bg-gradient-to-r from-blue-400 to-indigo-500" : "bg-gradient-to-r from-blue-400 to-pink-400"}`} 
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Questions list */}
      <div className="space-y-6">
        {!submitted ? (
          // Show only current question if not submitted
          (() => {
            const q = quizData.questions[currentQuestionIndex];
            const selected = selectedAnswers[currentQuestionIndex];
            const isCorrect = selected === q.correctAnswerIndex;
            const isBookmarked = bookmarked[currentQuestionIndex];
            const explanationVisible = showExplanation[currentQuestionIndex];
            return (
              <div
                key={currentQuestionIndex}
                className={`p-6 rounded-xl border-2 transition-all ${
                  submitted
                    ? isCorrect
                      ? darkMode 
                        ? "border-emerald-500 bg-gray-800 hover:shadow-[0_5px_15px_rgba(16,185,129,0.3)]" 
                        : "border-blue-300 bg-gradient-to-br from-blue-50 to-pink-50 hover:shadow-[0_5px_15px_rgba(147,197,253,0.3)]"
                      : darkMode
                        ? "border-rose-500 bg-gray-800 hover:shadow-[0_5px_15px_rgba(244,63,94,0.3)]"
                        : "border-pink-300 bg-gradient-to-br from-pink-50 to-blue-50 hover:shadow-[0_5px_15px_rgba(244,114,182,0.3)]"
                  : darkMode
                    ? "border-gray-700 bg-gray-800 hover:border-gray-600 hover:shadow-[0_5px_15px_rgba(0,0,0,0.3)]"
                    : "border-blue-100 bg-white hover:border-pink-200 hover:shadow-[0_5px_15px_rgba(219,234,254,0.3)]"
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full mr-3 ${
                      submitted
                        ? isCorrect
                          ? darkMode
                            ? "bg-emerald-600 text-white"
                            : "bg-blue-400 text-white"
                          : darkMode
                            ? "bg-rose-600 text-white"
                            : "bg-pink-400 text-white"
                        : darkMode
                          ? "bg-gray-700 text-white"
                          : "bg-blue-100 text-blue-600"
                    } font-bold`}>
                      {currentQuestionIndex + 1}
                    </span>
                    <h3 className={`font-medium text-lg ${darkMode ? "text-white" : "text-blue-800"}`}>
                      {q.questionText}
                    </h3>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => toggleBookmark(currentQuestionIndex)}
                      className={`text-xl transition-colors ${isBookmarked ? "text-pink-400" : darkMode ? "text-gray-400 hover:text-pink-400" : "text-blue-300 hover:text-pink-400"}`}
                      aria-label={isBookmarked ? "Remove bookmark" : "Bookmark question"}
                    >
                      {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
                    </button>
                    {q.explanation && (
                      <button
                        onClick={() => toggleExplanation(currentQuestionIndex)}
                        className={`text-xl ${darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-500 hover:text-blue-600"}`}
                        aria-label={explanationVisible ? "Hide explanation" : "Show explanation"}
                      >
                        <FiHelpCircle />
                      </button>
                    )}
                  </div>
                </div>

                {q.explanation && explanationVisible && (
                  <div className={`ml-11 mb-4 p-3 rounded-lg ${darkMode ? "bg-gray-700 text-blue-200" : "bg-blue-100 text-blue-800"}`}>
                    <p className="font-medium">Explanation:</p>
                    <p className="mt-1">{q.explanation}</p>
                  </div>
                )}

                <ul className="mt-4 space-y-3 ml-11">
                  {q.options.map((opt, idx) => {
                    const isSelected = selected === idx;
                    const isCorrectAnswer = q.correctAnswerIndex === idx;
                    let optionClasses = "p-3 border rounded-lg flex items-center";

                    if (submitted) {
                      if (isSelected) {
                        optionClasses += isCorrectAnswer
                          ? darkMode
                            ? " bg-emerald-900/50 border-emerald-500 hover:shadow-[0_5px_15px_rgba(16,185,129,0.3)]"
                            : " bg-blue-100 border-blue-300 hover:shadow-[0_5px_15px_rgba(147,197,253,0.3)]"
                          : darkMode
                            ? " bg-rose-900/50 border-rose-500 hover:shadow-[0_5px_15px_rgba(244,63,94,0.3)]"
                            : " bg-pink-100 border-pink-300 hover:shadow-[0_5px_15px_rgba(249,168,212,0.3)]";
                      } else if (isCorrectAnswer) {
                        optionClasses += darkMode
                          ? " bg-emerald-900/30 border-emerald-400 hover:shadow-[0_5px_15px_rgba(16,185,129,0.3)]"
                          : " bg-blue-50 border-blue-200 hover:shadow-[0_5px_15px_rgba(147,197,253,0.3)]";
                      } else {
                        optionClasses += darkMode
                          ? " bg-gray-700 border-gray-600 hover:shadow-[0_5px_15px_rgba(0,0,0,0.3)]"
                          : " bg-white border-blue-100 hover:shadow-[0_5px_15px_rgba(219,234,254,0.1)]";
                      }
                    } else if (isSelected) {
                      optionClasses += darkMode
                        ? " bg-blue-900/30 border-blue-500 hover:shadow-[0_5px_15px_rgba(59,130,246,0.3)]"
                        : " bg-blue-100 border-blue-300 hover:shadow-[0_5px_15px_rgba(147,197,253,0.3)]";
                    } else {
                      optionClasses += darkMode
                        ? " bg-gray-700 border-gray-600 hover:border-gray-500 hover:shadow-[0_5px_15px_rgba(0,0,0,0.3)]"
                        : " bg-white border-blue-100 hover:border-pink-200 hover:shadow-[0_5px_15px_rgba(219,234,254,0.1)]";
                    }

                    return (
                      <li
                        key={idx}
                        onClick={() => handleAnswer(idx)}
                        className={`${optionClasses} cursor-pointer transition-all`}
                      >
                        <button
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-full mr-3 font-medium text-sm ${
                            submitted
                              ? isCorrectAnswer
                                ? darkMode
                                  ? "bg-emerald-500 text-white"
                                  : "bg-blue-400 text-white"
                                : isSelected
                                  ? darkMode
                                    ? "bg-rose-500 text-white"
                                    : "bg-pink-400 text-white"
                                  : darkMode
                                    ? "bg-gray-600 text-gray-300"
                                    : "bg-blue-100 text-blue-600"
                              : isSelected
                                ? darkMode
                                  ? "bg-blue-500 text-white"
                                  : "bg-blue-400 text-white"
                                : darkMode
                                  ? "bg-gray-600 text-gray-300"
                                  : "bg-blue-100 text-blue-600"
                          }`}
                          disabled={optionsDisabled || submitted}
                          style={{ pointerEvents: optionsDisabled || submitted ? 'none' : 'auto' }}
                        >
                          {String.fromCharCode(65 + idx)}
                        </button>
                        <span className={darkMode ? "text-gray-100" : "text-blue-800"}>{opt}</span>
                      </li>
                    );
                  })}
                </ul>

                {!submitted && (
                  <div className="mt-4 ml-11">
                    <span className={`font-semibold ${optionsDisabled ? 'text-red-500' : 'text-blue-500'}`}>Time left: {questionTimeLeft}s</span>
                    {optionsDisabled && <span className="ml-4 text-gray-400">Time's up! Option disabled.</span>}
                  </div>
                )}

                {submitted && selected !== q.correctAnswerIndex && (
                  <div className={`mt-4 ml-11 p-3 rounded-lg ${darkMode ? "bg-rose-900/30 border-rose-700" : "bg-pink-50 border-pink-200"}`}>
                    <p className={`font-medium ${darkMode ? "text-rose-300" : "text-pink-700"}`}>
                      ❌ Your answer was incorrect.
                    </p>
                    <p className={`mt-1 ${darkMode ? "text-rose-200" : "text-pink-800"}`}>
                      <span className="font-semibold">Correct answer:</span> {q.options[q.correctAnswerIndex]}
                    </p>
                  </div>
                )}
              </div>
            );
          })()
        ) : (
          // Show all questions with result after submission
          quizData.questions.map((q, index) => {
            const selected = selectedAnswers[index];
            const isCorrect = selected === q.correctAnswerIndex;
            return (
              <div key={index} className={`p-6 rounded-xl border-2 mb-4 ${isCorrect ? "border-emerald-500" : "border-pink-400"}`}>
                <div className="mb-2 font-bold">
                  Q{index + 1}: {q.questionText}
                </div>
                <ul>
                  {q.options.map((opt, idx) => (
                    <li
                      key={idx}
                      className={
                        `p-2 rounded ` +
                        (idx === q.correctAnswerIndex ? "bg-green-100" : "") +
                        (selected === idx && selected !== q.correctAnswerIndex ? " bg-pink-100" : "") +
                        (selected === idx ? " font-bold" : "")
                      }
                    >
                      {String.fromCharCode(65 + idx)}. {opt}
                      {idx === q.correctAnswerIndex && <span className="ml-2 text-green-400 font-semibold">(Correct)</span>}
                      {selected === idx && selected !== q.correctAnswerIndex && <span className="ml-2 text-red-400 font-semibold">(Your Answer)</span>}
                    </li>
                  ))}
                </ul>
                <div className="mt-2">
                  {selected === undefined
                    ? <span className="text-gray-500">Not attempted</span>
                    : isCorrect
                      ? <span className="border-emerald-400 font-semibold">Correct</span>
                      : <span className="text-pink-400 font-semibold">Incorrect</span>
                  }
                </div>
                {q.explanation && (
                  <div className="mt-2 text-blue-700 bg-blue-50 p-2 rounded">
                    <b>Explanation:</b> {q.explanation}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Submit section */}
      <div className="mt-10 text-center">
        {!submitted ? (
          <button
            onClick={submitQuiz}
            disabled={Object.keys(selectedAnswers).length === 0}
            className={`px-8 py-3 rounded-xl font-bold text-lg shadow-lg transition-all ${
              Object.keys(selectedAnswers).length === 0
                ? darkMode
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-blue-100 text-blue-400 cursor-not-allowed"
                : darkMode
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-[0_5px_15px_rgba(79,70,229,0.3)]"
                  : "bg-gradient-to-r from-blue-400 to-pink-400 text-white hover:from-blue-500 hover:to-pink-500 hover:shadow-[0_5px_15px_rgba(147,197,253,0.3)]"
            } transform hover:-translate-y-0.5`}
          >
            Submit Quiz
          </button>
        ) : (
          <div className="space-y-6">
            <div
              className={`p-6 rounded-2xl shadow-xl max-w-md mx-auto ${
                darkMode
                  ? "bg-gradient-to-r from-emerald-700 to-teal-800 hover:shadow-[0_5px_15px_rgba(16,185,129,0.3)]"
                  : "bg-gradient-to-r from-blue-300 to-pink-300 hover:shadow-[0_5px_15px_rgba(147,197,253,0.3)]"
              } text-white`}
            >
              <h3 className="text-2xl font-bold mb-2">Quiz Completed! 🎉</h3>
              <div className="text-4xl font-extrabold mb-3">
                {score}/{quizData.questions.length}
              </div>
              <div className="text-lg mb-4">
                {score === quizData.questions.length
                  ? "Perfect score! You're amazing!"
                  : score >= quizData.questions.length * 0.8
                  ? "Excellent work!"
                  : score >= quizData.questions.length * 0.6
                  ? "Good job!"
                  : "Keep practicing!"}
              </div>
              <div className="w-full bg-white/20 rounded-full h-2 mb-4">
                <div
                  className="bg-white h-2 rounded-full"
                  style={{
                    width: `${(score / quizData.questions.length) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
            
            {/* Sticky View Quiz History button */}
            <div className="sticky bottom-4 left-0 right-0 z-50">
              <Link
                to="/quiz/history"
                onClick={() => {
                  localStorage.setItem("viewHistoryFor", quizData.subject);
                  localStorage.setItem("viewHistorySource", quizData.source); 
                }}
                className={`block w-full max-w-md mx-auto px-6 py-3 rounded-lg font-medium text-lg text-center ${
                  darkMode 
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg" 
                    : "bg-blue-500 hover:bg-blue-600 text-white shadow-lg"
                } transition-all transform hover:-translate-y-0.5`}
              >
                View All Quiz History
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;