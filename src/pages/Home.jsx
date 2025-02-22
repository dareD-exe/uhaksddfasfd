import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import ShayariCard from "../components/ShayariCard";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const [shayaris, setShayaris] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const q = query(collection(db, "shayaris"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setShayaris(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-4">
      <h1 className="text-center text-2xl font-bold text-yellow-400">
        Good evening, {user?.firstName || "Guest"}!
      </h1>

      <h2 className="text-center text-xl font-bold text-yellow-400 mt-2">
        ✨ Explore Beautiful Shayaris ✨
      </h2>

      {/* Guest Banner */}
      {!user && (
        <div className="bg-yellow-500 text-black px-6 py-3 rounded-lg shadow-md text-center font-semibold flex flex-col items-center gap-2 mt-4">
          <span className="text-lg">😃 Welcome, dear guest!</span>
          <span className="text-sm font-normal">
            Sign up to share your Shayari with the world. We'd love to hear from you! 😍
          </span>
        </div>
      )}

      {/* Shayari List */}
      <div className="mt-6 space-y-4">
        {shayaris.map((shayari) => (
          <ShayariCard key={shayari.id} shayari={shayari} />
        ))}
      </div>
    </div>
  );
};

export default Home;
