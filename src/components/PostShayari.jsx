import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { postShayari } from "../services/shayariService";

const PostShayari = () => {
  const { user } = useAuth();
  const [shayari, setShayari] = useState("");
  const [author, setAuthor] = useState("");
  const [error, setError] = useState("");

  // Show signup prompt for guest users
  if (!user || user.isAnonymous) {
    return (
      <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl text-center text-slate-400 max-w-2xl mx-auto mb-6">
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
setError("");
await postShayari(shayari, author, user.uid);

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

      <div className="flex items-center mt-2 space-x-2">
        <input
          className="flex-1 bg-slate-700 text-slate-300 placeholder:text-slate-400 border border-slate-600 outline-none rounded-lg p-2 duration-300 focus:border-slate-300"
          placeholder="Author's name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <button
          onClick={handlePost}
          className="cursor-pointer transition-all bg-gray-700 text-white px-6 py-2 rounded-lg border-green-400 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:shadow-[0_4px_0_0_rgba(34,197,94,1)] active:shadow-[0_2px_0_0_rgba(34,197,94,1)] active:brightness-90 active:translate-y-[2px] shadow-green-300">
          Post
        </button>
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default PostShayari;
