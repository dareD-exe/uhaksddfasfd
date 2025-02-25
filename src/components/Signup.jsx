import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";

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
    setFormData({ ...formData, [e.target.name]: e.target.value.trimStart() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    // Strong password validation
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      toast.error("Password must be at least 8 characters, include a number & a special character.");
      return;
    }

    try {
      const trimmedData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        age: formData.age.trim(),
        email: formData.email.trim(),
        password: formData.password.trim(),
      };

      await signupWithEmail(
        trimmedData.firstName,
        trimmedData.lastName,
        trimmedData.age,
        trimmedData.email,
        trimmedData.password
      );

      toast.success("Signup successful!");
      navigate("/"); // Redirect after success
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        toast.error("This email is already in use. Please try logging in.");
      } else {
        toast.error("Signup failed. Please try again.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <Toaster position="top-center" reverseOrder={false} />

      <h2 className="text-2xl font-bold text-center text-yellow-400 mb-4">
        Create an Account
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {["firstName", "lastName", "age", "email", "password", "confirmPassword"].map(
          (field, idx) => (
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
              className="outline-none w-full p-3 bg-gray-800 border border-gray-700 rounded"
              required
            />
          )
        )}
        <button type="submit" className="w-full bg-blue-500 p-3 rounded font-semibold">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
