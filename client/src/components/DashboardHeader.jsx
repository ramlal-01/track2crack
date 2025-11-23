import React from "react";
import TopRightAvatar from "./TopRightAvatar";
import { Bars3Icon } from "@heroicons/react/24/solid";
//import { FaFire } from "react-icons/fa"; 
import StreakBadge from "../components/StreakBadge";
import { useSidebar } from "../context/SidebarContext";
//dashboard header
const DashboardHeader = () => {
  const { toggleSidebar, isDashboardPage } = useSidebar();

  return (
    <header className="sticky top-0 z-50 w-full h-[72px] bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white shadow-md flex items-center px-6 md:px-10 justify-between">

      
      {/* Left: Hamburger Menu + App Name */}
      <div className="flex items-center">
        {/* Hamburger Menu - Show on all dashboard pages and all screen sizes */}
        {isDashboardPage && (
          <button 
          className="p-2 mr-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
          onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <Bars3Icon className="w-6 h-6 text-white" />
          </button>
        )}
        
        <div className="relative group">
          <div className="absolute-inset-1 bg-white rounded-lg blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          <div className="flex items-center p-1">
            <span className="text-lg sm:text-xl md:text-2xl font-extrabold tracking-wide select-none bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200">
              Track2Crack
            </span>
          </div>
        </div>
      </div>

      {/* Right: Streak + Theme + Avatar */}
      <div className="flex items-center gap-4 ">
        {/* 🔥 Streak - Only fire icon and number on mobile, hidden on mobile for dropdown */}
        <div className="hidden md:block">
          <StreakBadge />
        </div>
      {/* 👤 Avatar + dropdown */}
        <div className="flex items-center">
          <TopRightAvatar/>
        </div>

      </div>
    </header>
  );
};

export default DashboardHeader;