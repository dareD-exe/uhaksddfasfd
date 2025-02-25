import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { toast, Toaster } from "react-hot-toast";


const Login = () => {
  const { loginWithEmail, loginWithGoogle, loginAsGuest } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginWithEmail(email, password);
      toast.success("Login successful! Welcome back.");
      navigate("/"); // Redirect after login

    } catch (error) {
      toast.error(`Login failed: ${error.message}`);
    }
  };

  const handleGuestLogin = async () => {
    try {
      await loginAsGuest();
      toast.success("Logged in as Guest! Enjoy browsing.");
      navigate("/"); // Redirect to home after guest login

    } catch (error) {
      toast.error(`Guest login failed: ${error.message}`);

    }
  };

  return (
    <div className="space-y-4 max-w-md mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center text-yellow-400 mb-4">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4 w-full p-3 bg-gray-800 border border-gray-700 rounded">
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="outline-none w-full p-3 bg-gray-800 border border-gray-700 rounded" />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="outline-none w-full p-3 bg-gray-800 border border-gray-700 rounded"/>
         <button type="submit" className="w-full bg-blue-500 p-3 rounded font-semibold">Login</button>
      </form>
      <button onClick={loginWithGoogle} className="w-full bg-red-500 p-3 rounded font-semibold">Login with Google</button>
      <button onClick={handleGuestLogin} className="w-full bg-gray-500 p-3 rounded font-semibold">Continue as Guest</button>
    </div>
  );
};

export default Login;
