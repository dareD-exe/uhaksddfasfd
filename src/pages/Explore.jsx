import { useEffect, useState, useRef } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, getDocs, doc, updateDoc } from "firebase/firestore";
import Navbar from "../components/Navbar";
import MobileNav from "../components/MobileNav";
import { Search, Heart, Copy } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast, Toaster } from "react-hot-toast";  // ✅ Import Toaster

const categories = ["All", "Sad", "Romantic", "Motivational", "Friendship", "Life", "Inspirational", "Other"];

const Explore = () => {
  const { user } = useAuth();
  const [shayaris, setShayaris] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categoryContainer = useRef(null);
  const [copyStatus, setCopyStatus] = useState({});

  useEffect(() => {
    const fetchShayaris = async () => {
      const q = query(collection(db, "shayaris"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      setShayaris(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchShayaris();
  }, []);

  // ✅ Like Button Logic
  const toggleLike = async (shayariId) => {
    if (!user) {
      toast.error("You must log in to like a Shayari!", { position: "top-center", duration: 3000 });
      return;
    }

    const shayariRef = doc(db, "shayaris", shayariId);
    const shayariData = shayaris.find((shayari) => shayari.id === shayariId);
    let updatedLikes = shayariData.likes || [];

    if (updatedLikes.includes(user.uid)) {
      updatedLikes = updatedLikes.filter((id) => id !== user.uid);
    } else {
      updatedLikes.push(user.uid);
    }

    await updateDoc(shayariRef, { likes: updatedLikes });

    setShayaris((prevShayaris) =>
      prevShayaris.map((shayari) =>
        shayari.id === shayariId ? { ...shayari, likes: updatedLikes } : shayari
      )
    );
  };

  // ✅ Copy Shayari Logic
  const handleCopy = (shayariId, text) => {
    navigator.clipboard.writeText(text);
    setCopyStatus((prev) => ({ ...prev, [shayariId]: "Copied!" }));

    setTimeout(() => {
      setCopyStatus((prev) => ({ ...prev, [shayariId]: "Copy" }));
    }, 1500);
  };

  const filteredShayaris = shayaris.filter((shayari) => {
    const category = shayari.category ? shayari.category.trim() : "Other";
    return (
      (selectedCategory === "All" || category === selectedCategory) &&
      (shayari.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (shayari.author && shayari.author.toLowerCase().includes(searchTerm.toLowerCase())))
    );
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Toaster /> {/* ✅ Ensure Toaster is included for displaying notifications */}

      {/* Desktop Navbar */}
      <div className="hidden lg:block">
        <Navbar />
      </div>

      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-center text-yellow-400">Explore Shayaris</h2>

        {/* ✅ Search Bar */}
        <div className="relative mt-4">
          <input
            type="text"
            placeholder="Search Shayari or Author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 outline-none transition"
          />
          <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
        </div>

        {/* ✅ Category Filter */}
        <div ref={categoryContainer} className="flex space-x-2 mt-4 overflow-x-auto whitespace-nowrap px-1 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                selectedCategory === cat ? "bg-yellow-500 text-black" : "bg-gray-800 text-white hover:bg-gray-700"
              } transition`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ✅ Shayari List */}
        {filteredShayaris.length === 0 ? (
          <p className="text-gray-400 text-center mt-4">No Shayaris found.</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {filteredShayaris.map((shayari) => (
              <li key={shayari.id} className="bg-gray-800 p-4 rounded-xl shadow-md hover:bg-gray-700 transition relative">
                {/* ✅ Category Badge */}
                <span className="bg-yellow-500 text-black px-2 py-1 text-xs rounded-md font-semibold">
                  {shayari.category || "Other"}
                </span>

                {/* ✅ Shayari Text */}
                <p className="mt-2 text-white">{shayari.text}</p>

                {/* ✅ Author Name (Bottom-Right) */}
                <p className="text-right text-sm text-yellow-400 font-semibold mt-2">
                  — {shayari.author ? shayari.author : "Unknown"}
                </p>

                {/* ✅ Like & Copy Buttons (Fixed Position Below Author) */}
                <div className="flex justify-end space-x-3 mt-2">
                  <button
                    onClick={() => handleCopy(shayari.id, shayari.text)}
                    className="bg-gray-700 text-white px-3 py-1 rounded-lg flex items-center space-x-1 text-sm hover:bg-gray-600 transition"
                  >
                    <Copy size={16} />
                    <span>{copyStatus[shayari.id] || "Copy"}</span>
                  </button>

                  <button
                    onClick={() => toggleLike(shayari.id)}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm ${
                      shayari.likes?.includes(user?.uid) ? "bg-red-600" : "bg-gray-700"
                    } text-white hover:bg-red-500 transition`}
                  >
                    <Heart size={16} />
                    <span>{shayari.likes?.length || 0}</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Mobile Navbar */}
      <div className="lg:hidden">
        <MobileNav />
      </div>
    </div>
  );
};

export default Explore;
