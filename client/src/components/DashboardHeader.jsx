import React from "react";
import TopRightAvatar from "./TopRightAvatar";
import { FaFire } from "react-icons/fa"; 
import { IoRocketSharp } from "react-icons/io5";
import { Bars3Icon } from "@heroicons/react/24/solid";
import StreakBadge from "../components/StreakBadge";
import { useSidebar } from "../context/SidebarContext";

const DashboardHeader = () => {
  const { toggleSidebar } = useSidebar();
  return (
    <header className="sticky top-0 z-50 w-full h-[72px] bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white shadow-md flex items-center px-4 sm:px-6 md:px-10 justify-between">

      {/* Left: Hamburger + App Name */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Hamburger Menu - Always visible */}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/20"
          aria-label="Toggle sidebar"
        >
          <Bars3Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </button>

        {/* App Name with animated rocket */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-white rounded-lg blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          <div className="flex items-center p-1">
            {/* <IoRocketSharp className="text-white mr-1 sm:mr-2 text-lg sm:text-xl transition-transform duration-300 group-hover:rotate-45 group-hover:scale-110" /> */}
            <span className="text-lg sm:text-xl md:text-2xl font-extrabold tracking-wide select-none bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200">
              Track2Crack
            </span>
          </div>
        </div>
      </div>

      {/* Right: Streak + Theme + Avatar */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* 🔥 Streak */}
        <StreakBadge />
      {/* 👤 Avatar + dropdown */}
        <div className="flex items-center">
          <TopRightAvatar />
        </div>

      </div>
    </header>
  );
};

export default DashboardHeader;