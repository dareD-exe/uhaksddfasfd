import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { postShayari } from "../services/shayariService";

const PostShayari = () => {
  const { user } = useAuth();
  const [shayari, setShayari] = useState("");
  const [author, setAuthor] = useState("");
  const [error, setError] = useState("");

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
      await postShayari(shayari, author, user.uid);
      setShayari("");
      setAuthor("");
      setError("");
    } catch (error) {
      setError("Failed to post Shayari. Please try again.");
      console.error("Error posting Shayari:", error);
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl text-sm max-w-2xl mx-auto mb-6">
      <h2 className="text-center text-slate-400 text-lg font-bold mb-2">Post your Shayari</h2>
      
      <textarea
        value={shayari}
        onChange={(e) => setShayari(e.target.value)}
        placeholder="Write your Shayari here..."
        className="w-full h-32 p-4 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 font-serif text-lg leading-relaxed resize-none"
      ></textarea>

      <input
        className="bg-slate-700 text-slate-300 w-full mt-2 placeholder:text-slate-400 border border-slate-600 outline-none rounded-lg p-2 duration-300 focus:border-slate-300"
        placeholder="Author's name"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

      <div className="flex justify-end items-center mt-3">
        <button
          onClick={handlePost}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition duration-300"
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default PostShayari;
