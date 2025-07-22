import { 
  ChevronDownIcon, 
  ChevronRightIcon,
  ChartBarIcon,
  CodeBracketIcon,
  ServerIcon,
  BookOpenIcon,
  Cog6ToothIcon,
  LifebuoyIcon,
  Bars3Icon,
  XMarkIcon,
  TvIcon,
  CircleStackIcon,
  CpuChipIcon,
  BoltIcon,
  CubeIcon,
  ClockIcon,
  DocumentTextIcon
} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

const Sidebar = () => {
  const [showCoreMenu, setShowCoreMenu] = useState(false);
  const [showTheoryMenu, setShowTheoryMenu] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const { theme } = useTheme();

  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (id) {
      setUserId(id);
    }
  }, []);

  const handleCoreClick = async (subject) => {
    if (!userId) return;
    
    const [topicRes, progressRes] = await Promise.all([
      API.get(`/core/topics?subject=${subject}`),
      API.get(`/core/progress/${userId}`),
    ]);
    
    switch(subject) {
      case "CN": navigate("/dashboard/core/cn"); break;
      case "DBMS": navigate("/dashboard/core/dbms"); break;
      case "OS": navigate("/dashboard/core/os"); break;
    }
  };

  const handleTheoryClick = async (subject) => {
    if (!userId) return;
    
    const [topicRes, progressRes] = await Promise.all([
      API.get(`/theory/topics?subject=${subject}`),
      API.get(`/theory/progress/${userId}`),
    ]);
    
    switch(subject) {
      case "DSA": navigate("/dashboard/theory/dsa"); break;
      case "Java": navigate("/dashboard/theory/java"); break;
      case "OOPS": navigate("/dashboard/theory/oops"); break;
    }
  };

  const coreIcons = {
    "CN": <TvIcon className="w-5 h-5 mr-3 text-blue-500 group-hover:text-blue-600 dark:group-hover:text-blue-300" />,
    "DBMS": <CircleStackIcon className="w-5 h-5 mr-3 text-emerald-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-300" />,
    "OS": <CpuChipIcon className="w-5 h-5 mr-3 text-violet-500 group-hover:text-violet-600 dark:group-hover:text-violet-300" />
  };

  const theoryIcons = {
    "DSA": <CodeBracketIcon className="w-5 h-5 mr-3 text-rose-500 group-hover:text-rose-600 dark:group-hover:text-rose-300" />,
    "Java": <BoltIcon className="w-5 h-5 mr-3 text-amber-500 group-hover:text-amber-600 dark:group-hover:text-amber-300" />,
    "OOPS": <CubeIcon className="w-5 h-5 mr-3 text-indigo-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-300" />
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
      >
        {isSidebarOpen ? (
          <XMarkIcon className="w-6 h-6" />
        ) : (
          <Bars3Icon className="w-6 h-6" />
        )}
      </button>

      {/* Sidebar Overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-md lg:hidden transition-all duration-300 ${
          isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`} 
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside 
        className={`fixed lg:sticky top-0 z-40 w-72 h-screen flex flex-col transition-all duration-300 ease-in-out bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-2xl dark:shadow-gray-900/70 border-r border-gray-200/80 dark:border-gray-700 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex-1 flex flex-col p-5 overflow-y-auto">
          {/* Logo Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between p-4 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-white text-2xl font-bold tracking-wider">
                <span className="text-indigo-200">Track</span>
                <span className="text-white">2</span>
                <span className="text-amber-300 animate-pulse">Crack</span>
              </div>
              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_2px_rgba(74,222,128,0.5)]"></div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 flex flex-col gap-2">
            {/* Dashboard */}
            <button 
              onClick={() => {
                navigate("/dashboard");
                setIsSidebarOpen(false);
              }}
              className="flex items-center px-4 py-3 rounded-xl text-gray-800 dark:text-gray-200 hover:bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-gray-700/80 dark:to-gray-800/80 transition-all group hover:shadow-sm border border-gray-200/60 dark:border-gray-700/50 hover:border-blue-200/80 dark:hover:border-gray-600"
            >
              <div className="p-1.5 mr-3 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 shadow-md group-hover:shadow-lg transition-shadow">
                <ChartBarIcon className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium">Dashboard</span>
              <ChevronRightIcon className="w-5 h-5 ml-auto text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-transform group-hover:translate-x-1" />
            </button>

            {/* Theory Subjects */}
            <div className="rounded-xl overflow-hidden border border-gray-200/60 dark:border-gray-700/50 hover:border-blue-200/80 dark:hover:border-gray-600">
              <button 
                onClick={() => setShowTheoryMenu(!showTheoryMenu)} 
                className="flex justify-between items-center w-full px-4 py-3 rounded-xl text-gray-800 dark:text-gray-200 hover:bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-gray-700/80 dark:to-gray-800/80 transition-all group hover:shadow-sm"
              >
                <div className="flex items-center">
                  <div className="p-1.5 mr-3 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 shadow-md group-hover:shadow-lg transition-shadow">
                    <BookOpenIcon className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium">Theory Subjects</span>
                </div>
                {showTheoryMenu ? (
                  <ChevronDownIcon className="w-5 h-5 text-blue-500 dark:text-blue-400 transition-transform duration-300" />
                ) : (
                  <ChevronRightIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-transform duration-300 group-hover:translate-x-1" />
                )}
              </button>
              {showTheoryMenu && (
                <div className="ml-2 mt-1 mb-2 space-y-1 pl-2">
                  {["DSA", "Java", "OOPS"].map(subject => (
                    <button 
                      key={subject} 
                      onClick={() => {
                        handleTheoryClick(subject);
                        setIsSidebarOpen(false);
                      }} 
                      className="flex items-center w-full px-4 py-2.5 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r from-blue-50/70 to-indigo-50/70 dark:from-gray-700/70 dark:to-gray-800/70 text-sm transition-all hover:translate-x-2 group border-l-2 border-transparent hover:border-blue-300 dark:hover:border-blue-500"
                    >
                      {theoryIcons[subject]}
                      <span className="font-medium">{subject}</span>
                      <ChevronRightIcon className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 text-blue-500 dark:text-blue-400 transition-all" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Core Subjects */}
            <div className="rounded-xl overflow-hidden border border-gray-200/60 dark:border-gray-700/50 hover:border-blue-200/80 dark:hover:border-gray-600">
              <button 
                onClick={() => setShowCoreMenu(!showCoreMenu)} 
                className="flex justify-between items-center w-full px-4 py-3 rounded-xl text-gray-800 dark:text-gray-200 hover:bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-gray-700/80 dark:to-gray-800/80 transition-all group hover:shadow-sm"
              >
                <div className="flex items-center">
                  <div className="p-1.5 mr-3 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 shadow-md group-hover:shadow-lg transition-shadow">
                    <ServerIcon className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium">Core Subjects</span>
                </div>
                {showCoreMenu ? (
                  <ChevronDownIcon className="w-5 h-5 text-blue-500 dark:text-blue-400 transition-transform duration-300" />
                ) : (
                  <ChevronRightIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-transform duration-300 group-hover:translate-x-1" />
                )}
              </button>
              {showCoreMenu && (
                <div className="ml-2 mt-1 mb-2 space-y-1 pl-2">
                  {["CN", "DBMS", "OS"].map(subject => (
                    <button 
                      key={subject} 
                      onClick={() => {
                        handleCoreClick(subject);
                        setIsSidebarOpen(false);
                      }} 
                      className="flex items-center w-full px-4 py-2.5 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r from-blue-50/70 to-indigo-50/70 dark:from-gray-700/70 dark:to-gray-800/70 text-sm transition-all hover:translate-x-2 group border-l-2 border-transparent hover:border-blue-300 dark:hover:border-blue-500"
                    >
                      {coreIcons[subject]}
                      <span className="font-medium">{subject}</span>
                      <ChevronRightIcon className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 text-blue-500 dark:text-blue-400 transition-all" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quiz History */}
            <button 
              onClick={() => {
                navigate("/dashboard/quizhistory");
                setIsSidebarOpen(false);
              }}
              className="flex items-center px-4 py-3 rounded-xl text-gray-800 dark:text-gray-200 hover:bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-gray-700/80 dark:to-gray-800/80 transition-all group hover:shadow-sm border border-gray-200/60 dark:border-gray-700/50 hover:border-blue-200/80 dark:hover:border-gray-600"
            >
              <div className="p-1.5 mr-3 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 shadow-md group-hover:shadow-lg transition-shadow">
                <DocumentTextIcon className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium">Quiz History</span>
              <ChevronRightIcon className="w-5 h-5 ml-auto text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-transform group-hover:translate-x-1" />
            </button>

            {/* Revision Planner */}
            <button 
              onClick={() => {
                navigate("/dashboard/revision-planner");
                setIsSidebarOpen(false);
              }}
              className="flex items-center px-4 py-3 rounded-xl text-gray-800 dark:text-gray-200 hover:bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-gray-700/80 dark:to-gray-800/80 transition-all group hover:shadow-sm border border-gray-200/60 dark:border-gray-700/50 hover:border-blue-200/80 dark:hover:border-gray-600"
            >
              <div className="p-1.5 mr-3 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 shadow-md group-hover:shadow-lg transition-shadow">
                <ClockIcon className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium">Revision Planner</span>
              <ChevronRightIcon className="w-5 h-5 ml-auto text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-transform group-hover:translate-x-1" />
            </button>

            {/* Feedback */}
            <button 
              onClick={() => {
                navigate("/dashboard/feedback");
                setIsSidebarOpen(false);
              }}
              className="flex items-center px-4 py-3 rounded-xl text-gray-800 dark:text-gray-200 hover:bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-gray-700/80 dark:to-gray-800/80 transition-all group hover:shadow-sm border border-gray-200/60 dark:border-gray-700/50 hover:border-blue-200/80 dark:hover:border-gray-600"
            >
              <div className="p-1.5 mr-3 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 shadow-md group-hover:shadow-lg transition-shadow">
                <LifebuoyIcon className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium">Feedback</span>
              <ChevronRightIcon className="w-5 h-5 ml-auto text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-transform group-hover:translate-x-1" />
            </button>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;