import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../firebase";
import { FaHeart } from "react-icons/fa";

const ShayariCard = ({ shayari, user }) => {
  const [authorName, setAuthorName] = useState("");
  const [likes, setLikes] = useState(shayari.likes || []);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchAuthorName = async () => {
      if (shayari.author) {
        const userRef = doc(db, "users", shayari.author);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setAuthorName((userSnap.data().firstName || "Unknown").toUpperCase());
        } else {
          setAuthorName("UNKNOWN");
        }
      }
    };
    fetchAuthorName();
  }, [shayari.author]);

  useEffect(() => {
    if (user) {
      setIsLiked(likes.includes(user.uid));
    }
  }, [likes, user]);

  const handleLike = async () => {
    if (!user) return;
  
    const shayariRef = doc(db, "shayaris", shayari.id);
    setIsLiked(!isLiked); // Optimistic update for smoother UI
    setLikes((prev) => (isLiked ? prev.filter((uid) => uid !== user.uid) : [...prev, user.uid]));
  
    if (isLiked) {
      await updateDoc(shayariRef, { likes: arrayRemove(user.uid) });
    } else {
      await updateDoc(shayariRef, { likes: arrayUnion(user.uid) });
    }
  };
  

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700 my-4 transition-transform hover:scale-105 hover:shadow-yellow-500/50">


<p className="text-2xl font-serif text-white font-semibold text-center italic tracking-wide">"{shayari.text}"</p>

      <p className="text-sm text-gray-400 text-center">— {authorName}</p> {/* Author in Uppercase */}

      <div className="flex justify-end mt-2">
      <button
  onClick={handleLike}
  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
    isLiked
      ? "bg-red-500 text-white scale-110 shadow-lg shadow-red-500/50"
      : "bg-gray-700 text-gray-300 hover:bg-red-400 hover:text-white hover:scale-105 hover:shadow-red-500/30"
  }`}
>

  <span className="text-base font-medium">{likes.length}</span>
  <FaHeart
  className={`transition-all duration-300 ${
    isLiked ? "scale-125 text-red-500" : "scale-100 text-gray-300"
  }`}
/>


</button>


      </div>
    </div>
  );
};

export default ShayariCard;
