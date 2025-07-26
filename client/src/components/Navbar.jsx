import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-[#000C40] to-[#F0F2F0] shadow-md">
      <div className="px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Logo */}
          <Link 
            to="/" 
            className="text-xl sm:text-2xl font-extrabold text-white tracking-wide hover:scale-105 transition duration-200 z-50 relative"
            onClick={closeMenu}
          >
            Track2Crack
          </Link>

          {/* Desktop Navigation Links */}
          <ul className="hidden lg:flex space-x-8 font-medium text-white">
            <li>
              <Link to="/" className="hover:underline hover:underline-offset-4 transition-all duration-200">
                Home
              </Link>
            </li>
            <li>
              <a href="#features" className="hover:underline hover:underline-offset-4 transition-all duration-200">
                Features
              </a>
            </li>
            <li>
              <a href="#about" className="hover:underline hover:underline-offset-4 transition-all duration-200">
                About
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:underline hover:underline-offset-4 transition-all duration-200">
                Contact
              </a>
            </li>
          </ul>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            <Link
              to="/login"
              className="inline-block rounded-sm border border-current px-4 lg:px-8 py-2 lg:py-3 text-sm lg:text-base font-bold bg-white text-indigo-900 transition hover:scale-110 hover:shadow-xl focus:ring-3 focus:outline-hidden"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="inline-block rounded-sm bg-indigo-600 px-4 lg:px-8 py-2 lg:py-3 text-sm lg:text-base font-bold text-white transition hover:scale-110 hover:shadow-xl focus:ring-3 focus:outline-hidden"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors duration-200 z-50 relative"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}>
          <div className="pt-4 pb-2 space-y-4">
            {/* Mobile Navigation Links */}
            <div className="space-y-3">
              <Link 
                to="/" 
                className="block text-white font-medium py-2 px-4 rounded-lg hover:bg-white/10 transition-colors duration-200"
                onClick={closeMenu}
              >
                Home
              </Link>
              <a 
                href="#features" 
                className="block text-white font-medium py-2 px-4 rounded-lg hover:bg-white/10 transition-colors duration-200"
                onClick={closeMenu}
              >
                Features
              </a>
              <a 
                href="#about" 
                className="block text-white font-medium py-2 px-4 rounded-lg hover:bg-white/10 transition-colors duration-200"
                onClick={closeMenu}
              >
                About
              </a>
              <a 
                href="#contact" 
                className="block text-white font-medium py-2 px-4 rounded-lg hover:bg-white/10 transition-colors duration-200"
                onClick={closeMenu}
              >
                Contact
              </a>
            </div>

            {/* Mobile Auth Buttons */}
            <div className="space-y-3 pt-4 border-t border-white/20">
              <Link
                to="/login"
                className="block text-center rounded-lg border border-white bg-white text-indigo-900 px-4 py-3 font-bold transition hover:bg-gray-100"
                onClick={closeMenu}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block text-center rounded-lg bg-indigo-600 text-white px-4 py-3 font-bold transition hover:bg-indigo-700"
                onClick={closeMenu}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


 