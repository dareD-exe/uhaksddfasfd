import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import Navbar from "../components/Navbar";
import MobileNav from "../components/MobileNav";
import { Search } from "lucide-react";

const categories = ["All", "Sad", "Romantic", "Motivational", "Friendship", "Other"];

const Explore = () => {
  const [shayaris, setShayaris] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchShayaris = async () => {
      const q = query(collection(db, "shayaris"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      setShayaris(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchShayaris();
  }, []);

  // ✅ Fix: Ensure "Other" category shows Shayaris with missing category
  const filteredShayaris = shayaris.filter((shayari) => {
    const category = shayari.category || "Other"; // ✅ Default to "Other"
  
    return (
      (selectedCategory === "All" || category === selectedCategory) &&
      (shayari.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (shayari.author && shayari.author.toLowerCase().includes(searchTerm.toLowerCase())))
    );
  });
  
  

  return (
    <div className="min-h-screen bg-gray-900 text-white">
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
        <div className="flex space-x-2 mt-4 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                selectedCategory === cat
                  ? "bg-yellow-500 text-black"
                  : "bg-gray-800 text-white hover:bg-gray-700"
              } transition`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Shayari List */}
        {filteredShayaris.length === 0 ? (
          <p className="text-gray-400 text-center mt-4">No Shayaris found.</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {filteredShayaris.map((shayari) => (
              <li
                key={shayari.id}
                className="bg-gray-800 p-4 rounded-xl shadow-md hover:bg-gray-700 transition"
              >
                {/* ✅ Category Badge */}
                <span className="bg-yellow-500 text-black px-2 py-1 text-xs rounded-md font-semibold">
                  {shayari.category || "Other"}
                </span>

                {/* Author Name */}
                <p className="text-sm text-yellow-400 font-semibold mt-1">
                  {shayari.author ? shayari.author : "Unknown"}
                </p>

                {/* Shayari Text */}
                <p className="mt-1 text-white">{shayari.text}</p>
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
