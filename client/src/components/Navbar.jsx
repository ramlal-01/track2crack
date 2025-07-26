import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, Sparkles } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for navbar background
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-gradient-to-r from-[#000C40]/95 to-[#F0F2F0]/95 backdrop-blur-md shadow-lg border-b border-white/10' 
        : 'bg-gradient-to-r from-[#000C40] to-[#F0F2F0] shadow-md'
    }`}>
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-2 left-10 w-1 h-1 bg-white/20 rounded-full animate-pulse"></div>
        <div className="absolute top-6 right-20 w-1 h-1 bg-white/30 rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-2 left-1/3 w-1 h-1 bg-white/25 rounded-full animate-pulse delay-700"></div>
      </div>

      <div className="px-4 sm:px-6 py-4 relative">
        <div className="flex items-center justify-between">
          {/* Enhanced Logo */}
          <Link 
            to="/" 
            className="group text-xl sm:text-2xl font-extrabold text-white tracking-wide z-50 relative flex items-center gap-2"
            onClick={closeMenu}
          >
            <div className="relative">
              <Sparkles className="w-6 h-6 text-blue-300 group-hover:text-yellow-300 transition-colors duration-300 group-hover:rotate-12" />
              <div className="absolute inset-0 w-6 h-6 bg-blue-300/20 rounded-full group-hover:scale-150 transition-transform duration-300 opacity-0 group-hover:opacity-100"></div>
            </div>
            <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
              Track2Crack
            </span>
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></div>
          </Link>

          {/* Enhanced Desktop Navigation Links */}
          <ul className="hidden lg:flex space-x-8 font-medium text-white">
            {[
              { name: 'Home', href: '/', isLink: true },
              { name: 'Features', href: '#features', isLink: false },
              { name: 'About', href: '#about', isLink: false },
              { name: 'Contact', href: '#contact', isLink: false }
            ].map((item, index) => (
              <li key={item.name} className="relative group">
                {item.isLink ? (
                  <Link 
                    to={item.href} 
                    className="relative py-2 px-3 rounded-lg transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:text-blue-200 group"
                  >
                    {item.name}
                    <div className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full group-hover:left-0 transition-all duration-300"></div>
                  </Link>
                ) : (
                  <a 
                    href={item.href} 
                    className="relative py-2 px-3 rounded-lg transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:text-blue-200 group"
                  >
                    {item.name}
                    <div className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full group-hover:left-0 transition-all duration-300"></div>
                  </a>
                )}
              </li>
            ))}
          </ul>

          {/* Enhanced Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            <Link
              to="/login"
              className="group relative inline-block rounded-lg border-2 border-white/30 px-4 lg:px-6 py-2 lg:py-2.5 text-sm lg:text-base font-bold bg-white/10 backdrop-blur-sm text-white transition-all duration-300 hover:bg-white hover:text-indigo-900 hover:border-white hover:shadow-xl hover:shadow-white/20 hover:-translate-y-0.5 focus:ring-2 focus:ring-white/50 focus:outline-none overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <span className="relative z-10">Login</span>
            </Link>
            <Link
              to="/register"
              className="group relative inline-block rounded-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 px-4 lg:px-6 py-2 lg:py-2.5 text-sm lg:text-base font-bold text-white transition-all duration-300 hover:from-indigo-500 hover:via-purple-500 hover:to-indigo-600 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 focus:ring-2 focus:ring-indigo-400 focus:outline-none overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <span className="relative z-10">Sign Up</span>
            </Link>
          </div>

          {/* Enhanced Mobile Hamburger Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden relative text-white p-2.5 rounded-xl hover:bg-white/15 active:bg-white/25 transition-all duration-200 z-50 group border border-white/20 hover:border-white/40 backdrop-blur-sm"
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-6">
              <Menu className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${isMenuOpen ? 'opacity-0 rotate-180' : 'opacity-100 rotate-0'}`} />
              <X className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${isMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-180'}`} />
            </div>
          </button>
        </div>

        {/* Enhanced Mobile Menu */}
        <div className={`md:hidden transition-all duration-500 ease-out ${
          isMenuOpen ? 'max-h-96 opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-4'
        } overflow-hidden`}>
          <div className="pt-6 pb-4 space-y-4 bg-white/5 backdrop-blur-sm rounded-xl mt-4 border border-white/10">
            {/* Enhanced Mobile Navigation Links */}
            <div className="space-y-2 px-4">
              {[
                { name: 'Home', href: '/', isLink: true },
                { name: 'Features', href: '#features', isLink: false },
                { name: 'About', href: '#about', isLink: false },
                { name: 'Contact', href: '#contact', isLink: false }
              ].map((item, index) => (
                <div key={item.name} className="relative group">
                  {item.isLink ? (
                    <Link 
                      to={item.href}
                      className="block text-white font-medium py-3 px-4 rounded-lg hover:bg-white/15 active:bg-white/25 transition-all duration-300 transform hover:translate-x-2 hover:shadow-lg group"
                      onClick={closeMenu}
                    >
                      <div className="flex items-center justify-between">
                        <span>{item.name}</span>
                        <div className="w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-8 transition-all duration-300"></div>
                      </div>
                    </Link>
                  ) : (
                    <a 
                      href={item.href}
                      className="block text-white font-medium py-3 px-4 rounded-lg hover:bg-white/15 active:bg-white/25 transition-all duration-300 transform hover:translate-x-2 hover:shadow-lg group"
                      onClick={closeMenu}
                    >
                      <div className="flex items-center justify-between">
                        <span>{item.name}</span>
                        <div className="w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-8 transition-all duration-300"></div>
                      </div>
                    </a>
                  )}
                </div>
              ))}
            </div>

            {/* Enhanced Mobile Auth Buttons */}
            <div className="space-y-3 pt-4 px-4 border-t border-white/20">
              <Link
                to="/login"
                className="group block text-center rounded-lg border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white px-4 py-3 font-bold transition-all duration-300 hover:bg-white hover:text-indigo-900 hover:border-white hover:shadow-lg transform hover:scale-105 active:scale-95"
                onClick={closeMenu}
              >
                <span className="relative z-10">Login</span>
              </Link>
              <Link
                to="/register"
                className="group block text-center rounded-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white px-4 py-3 font-bold transition-all duration-300 hover:from-indigo-500 hover:via-purple-500 hover:to-indigo-600 hover:shadow-lg transform hover:scale-105 active:scale-95"
                onClick={closeMenu}
              >
                <span className="relative z-10">Sign Up</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom glow effect */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
    </nav>
  );
};

export default Navbar;


 