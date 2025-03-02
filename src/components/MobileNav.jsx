import { NavLink } from "react-router-dom";
import { HomeIcon, CompassIcon, UserIcon, PlusCircleIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext"; // ✅ Import authentication

const MobileNav = () => {
  const { user } = useAuth(); // ✅ Get user state

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-[#070F2B]/60 backdrop-blur-xl text-white shadow-lg flex justify-around py-2 z-50 lg:hidden">
      {/* ✅ Apply isActive & hover effect to all buttons */}
      <NavLink 
        to="/" 
        className={({ isActive }) => `flex flex-col items-center gap-1 transition-all duration-200 transform ${
          isActive ? "text-blue-400 scale-105" : "text-white hover:text-gray-300 hover:scale-110"
        }`}
      >
        <HomeIcon size={24} />
        <span className="text-xs">Home</span>
      </NavLink>

      <NavLink 
        to="/explore" 
        className={({ isActive }) => `flex flex-col items-center gap-1 transition-all duration-200 transform ${
          isActive ? "text-blue-400 scale-105" : "text-white hover:text-gray-300 hover:scale-110"
        }`}
      >
        <CompassIcon size={24} />
        <span className="text-xs">Explore</span>
      </NavLink>

      <NavLink 
        to="/create" 
        className={({ isActive }) => `flex flex-col items-center gap-1 transition-all duration-200 transform ${
          isActive ? "text-blue-400 scale-105" : "text-white hover:text-gray-300 hover:scale-110"
        }`}
      >
        <PlusCircleIcon size={24} />
        <span className="text-xs">Post</span>
      </NavLink>

      <NavLink 
        to={user ? "/profile" : "/login"} 
        className={({ isActive }) => `flex flex-col items-center gap-1 transition-all duration-200 transform ${
          isActive ? "text-blue-400 scale-105" : "text-white hover:text-gray-300 hover:scale-110"
        }`}
      >
        <UserIcon size={24} />
        <span className="text-xs">{user ? "Profile" : "Login"}</span>
      </NavLink>
    </nav>
  );
};

export default MobileNav;
