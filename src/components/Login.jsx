import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";

const Login = () => {
  const { loginWithEmail, loginWithGoogle, loginAsGuest } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginWithEmail(email, password);
      toast.success("Login successful! Welcome back.");
      navigate("/");
    } catch (error) {
      toast.error(`Login failed: ${error.message}`);
    }
  };

  const handleGuestLogin = async () => {
    try {
      await loginAsGuest();
      toast.success("Logged in as Guest! Enjoy browsing.");
      navigate("/");
    } catch (error) {
      toast.error(`Guest login failed: ${error.message}`);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-[#1E293B] text-white rounded-lg shadow-lg border border-white/20">
      <Toaster position="top-center" reverseOrder={false} />

      <h2 className="text-2xl font-bold text-center text-[#FACC15] mb-4">
        Login
      </h2>

      <form onSubmit={handleLogin} className="space-y-4 w-full p-3 bg-[#1F2937] border border-white/20 rounded-lg shadow-md">
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="outline-none w-full p-3 bg-[#334155] border border-[#334155] text-white placeholder-[#C3C7E1] outline-none rounded focus:ring-2 focus:ring-[#FACC15] transition duration-200"
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="outline-none w-full p-3 bg-[#334155] border border-[#334155] text-white placeholder-[#C3C7E1] outline-none rounded focus:ring-2 focus:ring-[#FACC15] transition duration-200"
        />
        <button 
          type="submit" 
          className="w-full bg-[#6e809e] text-white p-3 rounded font-semibold hover:bg-[#FACC15] hover:text-black transition">
          Login
        </button>
      </form>

      <button 
        onClick={loginWithGoogle} 
        className="w-full bg-[#FACC15] text-black p-3 rounded font-semibold hover:bg-[#9290C3] transition mt-3">
        Login with Google
      </button>

      <button 
        onClick={handleGuestLogin} 
        className="w-full bg-[#535C91] text-white p-3 rounded font-semibold hover:bg-[#9290C3] transition mt-2">
        Continue as Guest
      </button>
    </div>
  );
};

export default Login;
