import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const { signupWithEmail } = useAuth();
  const navigate = useNavigate();

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
      alert("Passwords do not match!");
      return;
    }

    await signupWithEmail(formData.firstName, formData.lastName, formData.age, formData.email, formData.password);
    alert("Signup successful!");
    navigate("/");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center text-yellow-400 mb-4">Create an Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {["firstName", "lastName", "age", "email", "password", "confirmPassword"].map((field, idx) => (
          <input
            key={idx}
            type={field === "age" ? "number" : field.includes("password") ? "password" : "text"}
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={formData[field]}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded"
            required
          />
        ))}
        <button type="submit" className="w-full bg-blue-500 p-3 rounded font-semibold">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
