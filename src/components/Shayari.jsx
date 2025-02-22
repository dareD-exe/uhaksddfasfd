import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { addShayari, listenToShayaris, toggleLike } from "../services/shayariService";
import { getAuth } from "firebase/auth";

const Shayari = () => {
  const { user, fullName } = useAuth();
  const [shayaris, setShayaris] = useState([]);
  const [newShayari, setNewShayari] = useState("");
  const isGuest = user && getAuth().currentUser?.isAnonymous;

  useEffect(() => {
    console.log("🔥 Full Name from AuthContext:", fullName); // ✅ Debugging
    const unsubscribe = listenToShayaris(setShayaris);
    return () => unsubscribe();
  }, [fullName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newShayari.trim() || !user || isGuest) return;

    console.log("✅ Posting Shayari with Full Name:", fullName); // ✅ Debugging
    await addShayari(newShayari, user.uid, fullName); // ✅ Send full name
    setNewShayari("");
  };

  const handleLike = async (shayariId) => {
    if (!user) return;
    await toggleLike(shayariId, user.uid);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-6 text-yellow-400">
        ✨ Explore Beautiful Shayaris
      </h2>

      {isGuest && (
        <div className="bg-yellow-500 text-gray-900 px-4 py-3 rounded-lg mb-4 text-center font-semibold">
          🌞 <strong>Welcome, dear guest!</strong>
          <p className="text-sm">Sign up to share your Shayari with the world. We’d love to hear from you! 😊</p>
        </div>
      )}

      {user && !isGuest ? (
        <form onSubmit={handleSubmit} className="mb-6 flex">
          <input
            type="text"
            value={newShayari}
            onChange={(e) => setNewShayari(e.target.value)}
            placeholder="Write your Shayari here..."
            className="outline-none flex-1 p-3 bg-gray-800 border border-gray-700 rounded-l"
          />
          <button type="submit" className="bg-blue-500 px-5 py-3 rounded-r flex items-center">
            Post 📜
          </button>
        </form>
      ) : null}

      <div className="space-y-4">
        {shayaris.length === 0 ? (
          <p className="text-center text-gray-400">No Shayaris yet. Be the first to share! ✨</p>
        ) : (
          shayaris.map((shayari) => (
            <div key={shayari.id} className="p-4 bg-gray-800 rounded-lg border border-gray-700 relative">
              <p className="text-lg font-semibold text-gray-300">"{shayari.text}"</p>
              <p className="text-sm text-gray-400 mt-1">— {shayari.author || "Anonymous"}</p> {/* ✅ Show Full Name */}

              {/* Like Button on Right Side */}
              <button
                onClick={() => handleLike(shayari.id)}
                className={`absolute top-2 right-2 px-4 py-2 rounded-md flex items-center space-x-2 ${
                  user && shayari.likes.includes(user.uid) ? "bg-red-500 text-white" : "bg-gray-700 text-gray-300"
                }`}
              >
                <span>{shayari.likes.length}</span>
                <span>❤️</span>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Shayari;
