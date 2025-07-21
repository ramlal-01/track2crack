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
    "CN": <TvIcon className="w-4 h-4 mr-2 text-blue-400" />,
    "DBMS": <CircleStackIcon className="w-4 h-4 mr-2 text-green-400" />,
    "OS": <CpuChipIcon className="w-4 h-4 mr-2 text-purple-400" />
  };

  const theoryIcons = {
    "DSA": <CodeBracketIcon className="w-4 h-4 mr-2 text-red-400" />,
    "Java": <BoltIcon className="w-4 h-4 mr-2 text-yellow-400" />,
    "OOPS": <CubeIcon className="w-4 h-4 mr-2 text-indigo-400" />
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all duration-200"
      >
        {isSidebarOpen ? (
          <XMarkIcon className="w-6 h-6" />
        ) : (
          <Bars3Icon className="w-6 h-6" />
        )}
      </button>

      {/* Sidebar Overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity duration-300 ${
          isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`} 
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside 
        className={`fixed lg:sticky top-0 z-40 w-70 h-screen flex flex-col transition-transform duration-300 ease-in-out bg-indigo-50 shadow-md shadow-purple-400 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex-1 flex flex-col p-6 overflow-y-auto">
          {/* Logo Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-md">
              <div className="text-white text-2xl font-bold tracking-wider">
                <span className="text-indigo-200">Track</span>
                <span className="text-white">2</span>
                <span className="text-yellow-300">Crack</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 flex flex-col gap-1">
            {/* Dashboard */}
            <button 
              onClick={() => {
                navigate("/dashboard");
                setIsSidebarOpen(false);
              }}
              className="flex items-center px-4 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all group"
            >
              <ChartBarIcon className="w-5 h-5 mr-3 text-blue-500 dark:text-blue-400" />
              <span className="font-medium">Dashboard</span>
              <ChevronRightIcon className="w-4 h-4 ml-auto text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400" />
            </button>

            {/* Theory Subjects */}
            <div>
              <button 
                onClick={() => setShowTheoryMenu(!showTheoryMenu)} 
                className="flex justify-between items-center w-full px-4 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all group"
              >
                <div className="flex items-center">
                  <BookOpenIcon className="w-5 h-5 mr-3 text-blue-500 dark:text-blue-400" />
                  <span className="font-medium">Theory Subjects</span>
                </div>
                {showTheoryMenu ? (
                  <ChevronDownIcon className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                ) : (
                  <ChevronRightIcon className="w-4 h-4 text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400" />
                )}
              </button>
              {showTheoryMenu && (
                <div className="ml-8 mt-2 space-y-1">
                  {["DSA", "Java", "OOPS"].map(subject => (
                    <button 
                      key={subject} 
                      onClick={() => {
                        handleTheoryClick(subject);
                        setIsSidebarOpen(false);
                      }} 
                      className="flex items-center w-full px-3 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 text-sm transition-all hover:translate-x-1"
                    >
                      {theoryIcons[subject]}
                      {subject}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Core Subjects */}
            <div>
              <button 
                onClick={() => setShowCoreMenu(!showCoreMenu)} 
                className="flex justify-between items-center w-full px-4 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all group"
              >
                <div className="flex items-center">
                  <ServerIcon className="w-5 h-5 mr-3 text-blue-500 dark:text-blue-400" />
                  <span className="font-medium">Core Subjects</span>
                </div>
                {showCoreMenu ? (
                  <ChevronDownIcon className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                ) : (
                  <ChevronRightIcon className="w-4 h-4 text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400" />
                )}
              </button>
              {showCoreMenu && (
                <div className="ml-8 mt-2 space-y-1">
                  {["CN", "DBMS", "OS"].map(subject => (
                    <button 
                      key={subject} 
                      onClick={() => {
                        handleCoreClick(subject);
                        setIsSidebarOpen(false);
                      }} 
                      className="flex items-center w-full px-3 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 text-sm transition-all hover:translate-x-1"
                    >
                      {coreIcons[subject]}
                      {subject}
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
              className="flex items-center px-4 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all group"
            >
              <DocumentTextIcon className="w-5 h-5 mr-3 text-blue-500 dark:text-blue-400" />
              <span className="font-medium">Quiz History</span>
              <ChevronRightIcon className="w-4 h-4 ml-auto text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400" />
            </button>

            {/* Revision Planner */}
            <button 
              onClick={() => {
                navigate("/dashboard/revision-planner");
                setIsSidebarOpen(false);
              }}
              className="flex items-center px-4 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all group"
            >
              <ClockIcon className="w-5 h-5 mr-3 text-blue-500 dark:text-blue-400" />
              <span className="font-medium">Revision Planner</span>
              <ChevronRightIcon className="w-4 h-4 ml-auto text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400" />
            </button>
 

            {/* feedback */}
            <button 
              onClick={() => {
                navigate("/dashboard/feedback");
                setIsSidebarOpen(false);
              }}
              className="flex items-center px-4 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all group"
            >
              <LifebuoyIcon className="w-5 h-5 mr-3 text-blue-500 dark:text-blue-400" />
              <span className="font-medium">Feedback</span>
              <ChevronRightIcon className="w-4 h-4 ml-auto text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400" />
            </button>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;