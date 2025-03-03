import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { postShayari } from "../services/shayariService";

const categories = ["Sad", "Romantic", "Motivational", "Friendship", "Life", "Inspirational", "Other"];

const PostShayari = () => {
  const { user } = useAuth();
  const [shayari, setShayari] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("Other"); // Default to Other
  const [error, setError] = useState("");

  if (!user || user.isAnonymous) {
    return (
      <div className="bg-[#1B1A55] border border-[#535C91] p-3 rounded-xl text-center text-[#9290C3] max-w-2xl mx-auto mb-4">
        Sign up to share your Shayari with the world. We’d love to hear from you! 😊
      </div>
    );
  }

  const handlePost = async () => {
    if (!user || !user.uid) {
      setError("You must be logged in to post a Shayari.");
      return;
    }

    if (!shayari.trim()) {
      setError("Shayari cannot be empty.");
      return;
    }

    try {
      setShayari("");
      setAuthor("");
      setCategory("Other"); // Reset category after posting
      setError("");
      await postShayari(shayari, author, category, user.uid);
    } catch (error) {
      setError("Failed to post Shayari. Please try again.");
      console.error("Error posting Shayari:", error);
    }
  };

  return (
    <div className="bg-[#1B1A55] border border-[#535C91] p-3 sm:p-4 rounded-xl text-sm max-w-2xl mx-auto mb-4 shadow-md">
      <h2 className="text-center text-[#9290C3] text-lg font-bold mb-2">Post your Shayari</h2>

      <textarea
        value={shayari}
        onChange={(e) => setShayari(e.target.value)}
        placeholder="Write your Shayari here..."
        className="w-full h-24 sm:h-28 p-3 bg-[#070F2B] text-white border border-[#535C91] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FACC15] font-serif text-lg leading-relaxed resize-none"
      ></textarea>

      {/* ✅ Mobile Responsive Fix - Stacked Layout on Mobile */}
      <div className="flex flex-col sm:flex-row items-center mt-3 gap-2">
      <input
  id="authorName"
  name="author"
  className="w-full sm:flex-1 bg-[#535C91] text-white placeholder:text-[#9290C3] border border-[#535C91] outline-none rounded-lg px-3 py-2 duration-300 focus:border-[#FACC15]"
  placeholder="Author's name"
  value={author}
  onChange={(e) => setAuthor(e.target.value)}
/>


        {/* Category Dropdown */}
        <select
          className="w-full sm:w-auto bg-[#535C91] text-white border border-[#535C91] outline-none rounded-lg px-3 py-2"
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
          className="w-full sm:w-auto cursor-pointer transition-all bg-[#535C91] text-white px-6 py-2 rounded-lg border-[#FACC15] border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:shadow-[0_4px_0_0_rgba(250,204,21,1)] active:shadow-[0_2px_0_0_rgba(250,204,21,1)] active:brightness-90 active:translate-y-[2px] shadow-[#FACC15]"
        >
          Post
        </button>
      </div>

      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  );
};

export default PostShayari;
