import { 
  ChevronDownIcon, 
  ChevronRightIcon,
  ChartBarIcon,
  CodeBracketIcon,
  ServerIcon,
  BookOpenIcon,
  LifebuoyIcon,
  Bars3Icon,
  XMarkIcon,
  TvIcon,
  CircleStackIcon,
  CpuChipIcon,
  BoltIcon,
  CubeIcon,
  ClockIcon,//
  DocumentTextIcon,
  PuzzlePieceIcon,
  LightBulbIcon,
  // 
  Cog6ToothIcon // Added the missing import
} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { useSidebar } from "../context/SidebarContext";

const Sidebar = () => {
  const [showCoreMenu, setShowCoreMenu] = useState(false);
  const [showTheoryMenu, setShowTheoryMenu] = useState(false);
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const { theme } = useTheme();
  const { isSidebarOpen, closeSidebar, isDashboardPage } = useSidebar();

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
    closeSidebar(); // Close sidebar on mobile after navigation
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
    closeSidebar(); // Close sidebar on mobile after navigation
  };

  const coreIcons = {
    "CN": <TvIcon className="w-5 h-5 mr-3 text-blue-500 group-hover:text-blue-600 dark:group-hover:text-blue-300" />,
    "DBMS": <CircleStackIcon className="w-5 h-5 mr-3 text-emerald-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-300" />,
    "OS": <CpuChipIcon className="w-5 h-5 mr-3 text-violet-500 group-hover:text-violet-600 dark:group-hover:text-violet-300" />
  };

  const theoryIcons = {
    "DSA": <PuzzlePieceIcon className="w-5 h-5 mr-3 text-rose-500 group-hover:text-rose-600 dark:group-hover:text-rose-300" />,
    "Java": <BoltIcon className="w-5 h-5 mr-3 text-amber-500 group-hover:text-amber-600 dark:group-hover:text-amber-300" />,
    "OOPS": <CubeIcon className="w-5 h-5 mr-3 text-indigo-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-300" />
  };

  // Don't render sidebar if not on dashboard pages
  if (!isDashboardPage) return null;

  return (
    <>
      {/* Sidebar Overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`} 
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <aside 
        className={`fixed lg:sticky top-[72px] left-0 z-40 flex-shrink-0 h-[calc(100vh-72px)] flex flex-col transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] transform-gpu will-change-[width,transform] bg-white dark:bg-gray-900 shadow-xl dark:shadow-gray-900/70 border-r border-gray-200 dark:border-gray-700 ${
          isSidebarOpen ? 'w-72 translate-x-0' : 'w-0 -translate-x-full overflow-hidden'
        }`}
      >
        {/* Sidebar Content - Fixed width wrapper */}
        <div className="w-72 h-full flex flex-col transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]">
          <div className="flex-1 flex flex-col p-5 overflow-y-auto">
            {/* Cross Icon - Positioned slightly above Dashboard button */}
            <div className="flex justify-end mb-2">
              <button 
                onClick={closeSidebar}
                className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
                aria-label="Close sidebar"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

          {/* Navigation */}
          <nav className="flex-1 flex flex-col gap-4">
            {/* Dashboard */}
            <button 
              onClick={() => {
                navigate("/dashboard");
                closeSidebar();
              }}
              className="flex items-center px-4 py-3 rounded-xl text-gray-800 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-gray-800 transition-all group hover:shadow-sm border border-transparent hover:border-indigo-100 dark:hover:border-gray-700"
            >
              <div className="p-1.5 mr-3 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 shadow-md group-hover:shadow-lg transition-all">
                <ChartBarIcon className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium">Dashboard</span>
              <ChevronRightIcon className="w-5 h-5 ml-auto text-gray-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-transform group-hover:translate-x-1" />
            </button>

            <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
            {/* Divider */}

            {/* Theory Subjects */}
            <div className="rounded-xl overflow-hidden">
              <button 
                onClick={() => setShowTheoryMenu(!showTheoryMenu)} 
                className="flex justify-between items-center w-full px-4 py-3 rounded-xl text-gray-800 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-gray-800 transition-all group"
              >
                <div className="flex items-center">
                  <div className="p-1.5 mr-3 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 shadow-md group-hover:shadow-lg transition-all">
                    <BookOpenIcon className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium">Theory Subjects</span>
                </div>
                {showTheoryMenu ? (
                  <ChevronDownIcon className="w-5 h-5 text-blue-500 dark:text-blue-400 transition-transform duration-300" />
                ) : (
                  <ChevronRightIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-transform duration-300" />
                )}
              </button>
              {showTheoryMenu && (
                <div className="ml-4 mt-1 mb-2 space-y-1 pl-2 border-l-2 border-gray-200 dark:border-gray-700">
                  {["DSA", "Java", "OOPS"].map(subject => (
                    <button 
                      key={subject} 
                      onClick={() => {
                        handleTheoryClick(subject);
                      }} 
                      className="flex items-center w-full px-4 py-2.5 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50 text-sm transition-all hover:translate-x-1 group"
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
            <div className="rounded-xl overflow-hidden">
              <button 
                onClick={() => setShowCoreMenu(!showCoreMenu)} 
                className="flex justify-between items-center w-full px-4 py-3 rounded-xl text-gray-800 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-gray-800 transition-all group"
              >
                <div className="flex items-center">
                  <div className="p-1.5 mr-3 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 shadow-md group-hover:shadow-lg transition-all">
                    <ServerIcon className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium">Core Subjects</span>
                </div>
                {showCoreMenu ? (
                  <ChevronDownIcon className="w-5 h-5 text-purple-500 dark:text-purple-400 transition-transform duration-300" />
                ) : (
                  <ChevronRightIcon className="w-5 h-5 text-gray-400 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-transform duration-300" />
                )}
              </button>
              {showCoreMenu && (
                <div className="ml-4 mt-1 mb-2 space-y-1 pl-2 border-l-2 border-gray-200 dark:border-gray-700">
                  {["CN", "DBMS", "OS"].map(subject => (
                    <button 
                      key={subject} 
                      onClick={() => {
                        handleCoreClick(subject);
                      }} 
                      className="flex items-center w-full px-4 py-2.5 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50 text-sm transition-all hover:translate-x-1 group"
                    >
                      {coreIcons[subject]}
                      <span className="font-medium">{subject}</span>
                      <ChevronRightIcon className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 text-purple-500 dark:text-purple-400 transition-all" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

            {/* Quiz History */}
            <button 
              onClick={() => {
                navigate("/dashboard/quizhistory");
                closeSidebar();
              }}
              className="flex items-center px-4 py-3 rounded-xl text-gray-800 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-gray-800 transition-all group hover:shadow-sm border border-transparent hover:border-indigo-100 dark:hover:border-gray-700"
            >
              <div className="p-1.5 mr-3 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 shadow-md group-hover:shadow-lg transition-all">
                <DocumentTextIcon className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium">Quiz History</span>
              <ChevronRightIcon className="w-5 h-5 ml-auto text-gray-400 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-transform group-hover:translate-x-1" />
            </button>

            {/* Revision Planner */}
            <button 
              onClick={() => {
                navigate("/dashboard/revision-planner");
                closeSidebar();
              }}
              className="flex items-center px-4 py-3 rounded-xl text-gray-800 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-gray-800 transition-all group hover:shadow-sm border border-transparent hover:border-indigo-100 dark:hover:border-gray-700"
            >
              <div className="p-1.5 mr-3 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 shadow-md group-hover:shadow-lg transition-all">
                <ClockIcon className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium">Revision Planner</span>
              <ChevronRightIcon className="w-5 h-5 ml-auto text-gray-400 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-transform group-hover:translate-x-1" />
            </button>

            {/* Feedback */}
            <button 
              onClick={() => {
                navigate("/dashboard/feedback");
                closeSidebar();
              }}
              className="flex items-center px-4 py-3 rounded-xl text-gray-800 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-gray-800 transition-all group hover:shadow-sm border border-transparent hover:border-indigo-100 dark:hover:border-gray-700"
            >
              <div className="p-1.5 mr-3 rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 shadow-md group-hover:shadow-lg transition-all">
                <LifebuoyIcon className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium">Feedback</span>
              <ChevronRightIcon className="w-5 h-5 ml-auto text-gray-400 group-hover:text-rose-500 dark:group-hover:text-rose-400 transition-transform group-hover:translate-x-1" />
            </button>
          </nav>

          {/* Bottom spacer */}
          <div className="flex-1"></div>

          {/* Settings
          <button 
            onClick={() => {
              navigate("/dashboard/settings");
              setIsSidebarOpen(false);
            }}
            className="flex items-center px-4 py-3 mt-4 rounded-xl text-gray-800 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-gray-800 transition-all group border border-gray-200 dark:border-gray-700"
          >
            <div className="p-1.5 mr-3 rounded-lg bg-gradient-to-br from-gray-500 to-gray-600 shadow-md group-hover:shadow-lg transition-all">
              <Cog6ToothIcon className="w-5 h-5 text-white" />
            </div>
            <span className="font-medium">Settings</span>
            <ChevronRightIcon className="w-5 h-5 ml-auto text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-transform group-hover:translate-x-1" />
          </button> */}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;