import { Route, Routes, useLocation } from "react-router-dom"; // ✅ Combined imports
import { useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Shayari from "./components/Shayari";
import Profile from "./components/Profile";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";

const App = () => {
  const { firstName } = useAuth();
  const [greeting, setGreeting] = useState("");
  const location = useLocation(); // ✅ Correct placement inside the component

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting(`Good morning, ${firstName}!`);
    else if (hours < 18) setGreeting(`Good afternoon, ${firstName}!`);
    else setGreeting(`Good evening, ${firstName}!`);
  }, [firstName]);

  return (
    <>
      <Navbar />
      <div className="pt-20 min-h-screen bg-gray-900 text-white p-4 text-center">
        {/* ✅ Conditional greeting based on current route */}
        {location.pathname !== "/profile" && (
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">{greeting}</h2>
        )}
        <Routes>
          <Route path="/" element={<Shayari />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
