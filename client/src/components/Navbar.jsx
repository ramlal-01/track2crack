import { Link } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on navigation
  const handleNavClick = () => setMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-[#000C40] to-[#F0F2F0] shadow-md px-4 sm:px-6 py-4 flex items-center justify-between">
      {/* Left: Logo + Nav Links */}
      <div className="flex items-center space-x-4 sm:space-x-12">
        <Link to="/" className="text-2xl font-extrabold text-white tracking-wide hover:scale-105 transition duration-200">
          Track2Crack
        </Link>
        {/* Desktop Nav Links */}
        <ul className="hidden md:flex space-x-8 font-medium text-white">
          <li>
            <Link to="/" className="hover:underline hover:underline-offset-4">
              Home
            </Link>
          </li>
          <li>
            <a href="#features" className="hover:underline hover:underline-offset-4">
              Features
            </a>
          </li>
          <li>
            <a href="#about" className="hover:underline hover:underline-offset-4">
              About
            </a>
          </li>
          <li>
            <a href="#contact" className="hover:underline hover:underline-offset-4">
              Contact
            </a>
          </li>
        </ul>
      </div>

      {/* Desktop Auth Buttons */}
      <div className="hidden md:flex items-center space-x-4">
        <Link
          to="/login"
          className="inline-block rounded-sm border border-current px-8 py-3 text-sb font-bold bg-white text-indigo-900 transition hover:scale-110 hover:shadow-xl focus:ring-3 focus:outline-hidden"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="inline-block rounded-sm bg-indigo-600 px-8 py-3 text-sb font-bold text-white transition hover:scale-110 hover:shadow-xl focus:ring-3 focus:outline-hidden"
        >
          Sign Up
        </Link>
      </div>

      {/* Hamburger Icon for Mobile */}
      <button
        className="md:hidden flex flex-col justify-center items-center w-10 h-10 focus:outline-none"
        aria-label="Open menu"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span className={`block w-6 h-0.5 bg-white mb-1.5 transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
        <span className={`block w-6 h-0.5 bg-white mb-1.5 transition-all ${menuOpen ? 'opacity-0' : ''}`}></span>
        <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
      </button>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-40 md:hidden" onClick={handleNavClick}></div>
      )}
      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 w-4/5 max-w-xs h-full bg-gradient-to-b from-[#000C40] to-[#F0F2F0] shadow-lg transform transition-transform duration-300 md:hidden flex flex-col ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ minWidth: '220px' }}
      >
        <button
          className="self-end m-4 w-8 h-8 flex items-center justify-center focus:outline-none"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        >
          <span className="block w-6 h-0.5 bg-white rotate-45 absolute"></span>
          <span className="block w-6 h-0.5 bg-white -rotate-45"></span>
        </button>
        <ul className="flex flex-col space-y-6 font-medium text-white text-lg mt-12 px-8">
          <li>
            <Link to="/" onClick={handleNavClick} className="hover:text-xl hover:underline-offset-4">
              Home
            </Link>
          </li>
          <li>
            <a href="#features" onClick={handleNavClick} className="hover:underline hover:underline-offset-4">
              Features
            </a>
          </li>
          <li>
            <a href="#about" onClick={handleNavClick} className="hover:underline hover:underline-offset-4">
              About
            </a>
          </li>
          <li>
            <a href="#contact" onClick={handleNavClick} className="hover:underline hover:underline-offset-4">
              Contact
            </a>
          </li>
        </ul>
        <div className="flex flex-col space-y-4 mt-10 px-8">
          <Link
            to="/login"
            onClick={handleNavClick}
            className="inline-block rounded-sm border border-current px-8 py-3 text-sb font-bold bg-white text-indigo-900 transition hover:scale-105 hover:shadow-xl focus:ring-3 focus:outline-hidden"
          >
            Login
          </Link>
          <Link
            to="/register"
            onClick={handleNavClick}
            className="inline-block rounded-sm bg-indigo-600 px-8 py-3 text-sb font-bold text-white transition hover:scale-105 hover:shadow-xl focus:ring-3 focus:outline-hidden"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


 