import { 
  ChevronDownIcon, 
  ChevronRightIcon,
  ChartBarIcon,
  CodeBracketIcon,
  ServerIcon,
  BookOpenIcon,
  LifebuoyIcon,
  XMarkIcon,
  TvIcon,
  CircleStackIcon,
  CpuChipIcon,
  BoltIcon,
  CubeIcon,
  ClockIcon,
  DocumentTextIcon,
  PuzzlePieceIcon,
  LightBulbIcon,
  Cog6ToothIcon
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
  const { isSidebarOpen, closeSidebar } = useSidebar();

  // Debug log
  console.log('Sidebar render - isSidebarOpen:', isSidebarOpen);

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
    
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024) {
      closeSidebar();
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
    
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024) {
      closeSidebar();
    }
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

  return (
    <>
      {/* Debug info */}
      <div className="fixed top-0 right-0 z-50 bg-yellow-300 p-2 text-black text-sm">
        Sidebar Open: {isSidebarOpen ? 'YES' : 'NO'}
      </div>

      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`} 
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <aside 
        className="fixed left-0 z-40 w-72 flex flex-col shadow-xl border-r-4 border-green-500"
        style={{ 
          top: '72px',
          height: 'calc(100vh - 72px)',
          backgroundColor: '#10b981', // Green background for visibility
          transform: 'translateX(0)' // Always visible for debugging
        }}
      >
        <div className="p-4 text-white">
          <h2 className="text-xl font-bold">SIDEBAR</h2>
          <p>State: {isSidebarOpen ? 'OPEN' : 'CLOSED'}</p>
          <button 
            onClick={closeSidebar}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
          >
            Close
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;