import { Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Shayari from "./components/Shayari";
import Profile from "./components/Profile";
import Explore from "./pages/Explore";
import CreateShayari from "./pages/CreateShayari";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar"; // ✅ Desktop Navbar
import MobileNav from "./components/MobileNav"; // ✅ Mobile Bottom Navbar
import { LogOut } from "lucide-react";

const App = () => {
  const { firstName, logout } = useAuth();
  const [greeting, setGreeting] = useState("");
  const location = useLocation();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  // ✅ Handle screen resize for dynamic navbar switching
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting(`Good morning, ${firstName}!`);
    else if (hours < 18) setGreeting(`Good afternoon, ${firstName}!`);
    else setGreeting(`Good evening, ${firstName}!`);
  }, [firstName]);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {/* ✅ Show Desktop Navbar for 1024px+ | Show MobileNav for Below 1024px */}
      {isDesktop ? <Navbar /> : (
        <>
          {/* ✅ Mobile Logo Bar (Now Appears on ALL Pages) */}
          <div className="fixed top-0 left-0 w-full bg-[#070F2B]/70 backdrop-blur-lg text-white px-6 h-[4rem] flex justify-between items-center z-50 shadow-md lg:hidden">
            <h1 className="text-xl font-bold tracking-wide">ZikrVerse</h1>

            {/* ✅ Show Logout Button only if user is logged in */}
            {firstName !== "Guest" && (
              <button 
                onClick={handleLogout} 
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg flex items-center gap-2 shadow"
              >
                <LogOut size={20} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
          </div>
        </>
      )}

      <div className="pt-20 pb-20 min-h-screen bg-gray-900 text-white p-4 text-center">
        {/* ✅ Conditional greeting based on current route */}
        {location.pathname !== "/profile" && (
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">{greeting}</h2>
        )}
        <Routes>
          <Route path="/" element={<Shayari />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/create" element={<CreateShayari />} />
        </Routes>
      </div>

      {/* ✅ Mobile Bottom Navbar (Now Appears on ALL Pages) */}
      <div className="lg:hidden">
        <MobileNav />
      </div>
    </>
  );
};

export default App;
