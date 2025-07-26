import { Link } from "react-router-dom";
import Logo from "./Logo";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-[#000C40] via-[#1E40AF] to-[#F0F2F0] shadow-lg shadow-indigo-500/20 backdrop-blur-sm px-6 py-4 flex items-center justify-between border-b border-indigo-500/20">
      {/* Left: Logo + Nav Links */}
      <div className="flex items-center space-x-12">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="relative">
            <Logo 
              width={40} 
              height={40} 
              className="transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 drop-shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <span className="text-2xl font-extrabold text-white tracking-wide group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
            Track2Crack
          </span>
        </Link>
        <ul className="hidden md:flex space-x-8 font-medium text-white">
          <li>
            <Link to="/" className="relative group px-3 py-2 rounded-lg transition-all duration-300 hover:bg-white/10 hover:backdrop-blur-sm">
              <span className="relative z-10">Home</span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </li>
          <li>
            <a href="#features" className="relative group px-3 py-2 rounded-lg transition-all duration-300 hover:bg-white/10 hover:backdrop-blur-sm">
              <span className="relative z-10">Features</span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
          </li>
          <li>
            <a href="#about" className="relative group px-3 py-2 rounded-lg transition-all duration-300 hover:bg-white/10 hover:backdrop-blur-sm">
              <span className="relative z-10">About</span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
          </li>
          <li>
            <a href="#contact" className="relative group px-3 py-2 rounded-lg transition-all duration-300 hover:bg-white/10 hover:backdrop-blur-sm">
              <span className="relative z-10">Contact</span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
          </li>
        </ul>
      </div>

      {/* Right: Auth Buttons */}
      <div className="flex items-center space-x-4">
        <Link
          to="/login"
          className="relative group inline-block rounded-lg border-2 border-white/30 px-8 py-3 text-sm font-bold bg-white/10 text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white hover:text-indigo-900 hover:shadow-xl hover:shadow-white/25 focus:ring-2 focus:ring-white/50 focus:outline-none overflow-hidden"
        >
          <span className="relative z-10">Login</span>
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Link>
        <Link
          to="/register"
          className="relative group inline-block rounded-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 px-8 py-3 text-sm font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/50 focus:ring-2 focus:ring-indigo-400/50 focus:outline-none overflow-hidden"
        >
          <span className="relative z-10">Sign Up</span>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;


 