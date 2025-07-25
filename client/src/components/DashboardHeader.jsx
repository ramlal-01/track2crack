import React from "react";
import TopRightAvatar from "./TopRightAvatar";
import { FaFire } from "react-icons/fa"; 
import { IoRocketSharp } from "react-icons/io5";
import StreakBadge from "../components/StreakBadge";
const DashboardHeader = () => {
  return (
    <header className="sticky top-0 z-50 w-full h-[72px] bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white shadow-md flex items-center px-6 md:px-10 justify-between">

      
      {/* Left: App Name with animated rocket */}
      <div className="flex items-center">
        <div className="relative group">
          <div className="absolute -inset-1 bg-white rounded-lg blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          <div className="flex items-center p-1">
            <IoRocketSharp className="text-white mr-2 text-xl transition-transform duration-300 group-hover:rotate-45 group-hover:scale-110" />
            <span className="text-xl md:text-2xl font-extrabold tracking-wide select-none bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200">
              Track2Crack
            </span>
          </div>
        </div>
      </div>

      {/* Right: Streak + Theme + Avatar */}
      <div className="flex items-center gap-4 ">
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
