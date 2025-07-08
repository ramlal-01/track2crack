import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-[#000C40] to-[#F0F2F0] shadow-md px-6 py-4 flex items-center justify-between">
      {/* Left: Logo + Nav Links */}
      <div className="flex items-center space-x-12">
        <Link to="/" className="text-2xl font-extrabold text-white tracking-wide hover:scale-105 transition duration-200">
          Track2Crack
        </Link>
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

      {/* Right: Auth Buttons */}
      <div className="flex items-center space-x-4">
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
    </nav>
  );
};

export default Navbar;


 