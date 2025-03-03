import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import MobileNav from "../components/MobileNav";

const categories = ["Sad", "Romantic", "Motivational", "Friendship", "Life", "Inspirational", "Other"];

const CreateShayari = () => {
  const { user, fullName } = useAuth();
  const [shayari, setShayari] = useState("");
  const [author, setAuthor] = useState(fullName || ""); // Default to user's name
  const [category, setCategory] = useState("Other"); // Default to "Other"
  const navigate = useNavigate();

  // ✅ Use useEffect to navigate if user is not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handlePost = async () => {
    if (!shayari.trim() || !author.trim()) return;

    await addDoc(collection(db, "shayaris"), {
      text: shayari,
      author: author,
      category: category, // ✅ Save category in Firestore
      userId: user.uid,
      createdAt: serverTimestamp(),
    });

    setShayari("");
    setAuthor(fullName || ""); // Reset author field
    setCategory("Other"); // Reset category
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Desktop Navbar */}
      <div className="hidden lg:block">
        <Navbar />
      </div>

      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-center text-yellow-400">Create a Shayari</h2>

        {/* Author Input */}
        <input
          type="text"
          className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-yellow-400 mt-4"
          placeholder="Author Name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />

        {/* Shayari Input */}
        <textarea
          className="w-full bg-gray-800 text-white p-4 rounded-lg focus:ring-2 focus:ring-yellow-400 mt-4 resize-none"
          placeholder="Write your Shayari..."
          rows="3"
          value={shayari}
          onChange={(e) => setShayari(e.target.value)}
          style={{ minHeight: "4rem", maxHeight: "10rem", overflow: "hidden" }}
        />

        {/* ✅ Category Dropdown */}
        <select
          className="w-full bg-gray-800 text-white px-4 py-2 mt-4 rounded-lg focus:ring-2 focus:ring-yellow-400"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <button
          onClick={handlePost}
          className="w-full bg-yellow-500 text-black font-bold py-2 mt-4 rounded-lg hover:bg-yellow-600 transition"
          disabled={!shayari.trim() || !author.trim()}
        >
          Post
        </button>
      </div>

      {/* Mobile Navbar */}
      <div className="lg:hidden">
        <MobileNav />
      </div>
    </div>
  );
};

export default CreateShayari;
