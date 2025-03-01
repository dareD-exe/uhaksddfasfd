import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";

const Signup = () => {
  const { user, signupWithEmail } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user?.email) {
      navigate("/"); // Redirect only if the user is logged in
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
  
    // Password validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      toast.error("Password must be at least 8 characters, include a number & special character.");
      return;
    }
  
    try {
      const newUser = await signupWithEmail(
        formData.firstName,
        formData.lastName,
        formData.age,
        formData.email,
        formData.password
      );
  
      if (newUser) {
        toast.success("Signup successful!");
        navigate("/");
      }
    } catch (error) {
      if (error.message) {
        toast.error(error.message); // ✅ Show only toast message, no console error
      }
    }
  };
  
  

  return (
    <div className="max-w-md mx-auto p-6 bg-[#1E293B] text-white rounded-lg shadow-lg border border-white/20">
      <Toaster position="top-center" reverseOrder={false} />

      <h2 className="text-2xl font-bold text-center text-[#FACC15] mb-4">Create an Account</h2>

      <form onSubmit={handleSubmit} className="space-y-4 w-full p-3 bg-[#1F2937] border border-white/20 rounded-lg shadow-md">
        {["firstName", "lastName", "age", "email", "password", "confirmPassword"].map((field, idx) => (
          <input
            key={idx}
            type={
              field === "age"
                ? "number"
                : field.toLowerCase().includes("password")
                ? "password"
                : "text"
            }
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={formData[field]}
            onChange={handleChange}
            className="outline-none w-full p-3 bg-[#334155] border border-[#334155] text-white placeholder-[#C3C7E1] rounded focus:ring-2 focus:ring-[#FACC15] transition duration-200"
            required
          />
        ))}
        <button type="submit" className="w-full bg-[#6E809E] text-white p-3 rounded font-semibold hover:bg-[#FACC15] hover:text-black transition">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
