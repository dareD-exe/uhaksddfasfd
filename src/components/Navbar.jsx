import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import { ChevronDown } from "lucide-react";


const Navbar = () => {
  const { user, logout, firstName } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const timeoutRef = useRef(null); // To handle delayed closing

  // Clear any existing close timeouts
  const clearCloseTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  // Delayed close on mouse leave
  const delayedClose = () => {
    timeoutRef.current = setTimeout(() => {
      setShowDropdown(false);
    }, 100);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-transparent text-white py-4 px-6 flex justify-between items-center z-50 h-16">
      {/* Left: Website Name */}
      <div className="text-xl font-bold tracking-wide">
        <Link to="/" className="hover:text-gray-300 transition duration-300">
          ZikrVerse
        </Link>
      </div>

      {/* Right: Navigation Options */}
      <div className="flex items-center space-x-6 text-lg font-medium">
        <Link to="/" className="hover:text-gray-300 transition duration-300">
          Home
        </Link>

        {user ? (
          <div
            className="relative"
            onMouseEnter={() => {
              clearCloseTimeout();
              setShowDropdown(true);
            }}
            onMouseLeave={delayedClose}
          >
            <button className="bg-gray-800 px-4 py-2 rounded-full hover:bg-gray-700 transition flex items-center space-x-2">
  <span>{firstName}</span>
  <ChevronDown className="w-4 h-4 text-blue-400" />
</button>

{showDropdown && (
  <div className="absolute right-0 mt-2 w-24 rounded-lg bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-10 focus:outline-none">
  <Link
      to="/profile"
      className="block px-4 py-2 hover:bg-gray-700 transition rounded-xl"
      onClick={() => setShowDropdown(false)}
    >
      Profile
    </Link>
    <button
      onClick={() => {
        logout();
        setShowDropdown(false);
      }}
      className="block w-full px-4 py-2 text-left hover:bg-red-600 transition rounded-xl"
    >
      Logout
    </button>
  </div>
)}

          </div>
        ) : (
          <>
            <Link
              to="/login"
              className="hover:text-gray-300 transition duration-300"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-blue-500 px-5 py-2 rounded-full hover:bg-blue-400 transition"
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
