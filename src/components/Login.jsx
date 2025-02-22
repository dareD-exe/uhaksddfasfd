import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Login = () => {
  const { loginWithEmail, loginWithGoogle, loginAsGuest } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginWithEmail(email, password);
      navigate("/"); // Redirect after login
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  const handleGuestLogin = async () => {
    try {
      await loginAsGuest();
      navigate("/"); // Redirect to home after guest login
    } catch (error) {
      console.error("Guest login failed:", error.message);
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-xl mb-4">Login</h2>
      <form onSubmit={handleLogin} className="flex flex-col">
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="mb-2 p-2 border rounded" />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="mb-2 p-2 border rounded" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
      </form>
      <button onClick={loginWithGoogle} className="bg-red-500 text-white px-4 py-2 rounded mt-2">Login with Google</button>
      <button onClick={handleGuestLogin} className="bg-gray-500 text-white px-4 py-2 rounded mt-2">Continue as Guest</button>
    </div>
  );
};

export default Login;
