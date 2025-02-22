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
          setAuthorName(userSnap.data().firstName || "Unknown");
        } else {
          setAuthorName("Unknown");
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
    let updatedLikes = [...likes];

    if (isLiked) {
      updatedLikes = updatedLikes.filter((uid) => uid !== user.uid);
      await updateDoc(shayariRef, {
        likes: arrayRemove(user.uid),
      });
    } else {
      updatedLikes.push(user.uid);
      await updateDoc(shayariRef, {
        likes: arrayUnion(user.uid),
      });
    }

    setLikes(updatedLikes);
    setIsLiked(!isLiked);
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md my-2 transition transform hover:scale-[1.02] hover:shadow-lg">
      <p className="text-lg text-white font-medium text-center">"{shayari.text}"</p>
      <p className="text-sm text-gray-400 text-center">— {authorName}</p>

      <div className="flex justify-end mt-2">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-1 px-3 py-1 rounded-md transition-all duration-200 ${
            isLiked ? "bg-red-600 text-white scale-110" : "bg-gray-700 text-gray-300 hover:bg-red-500 hover:text-white"
          }`}
        >
          <span className="text-sm">{likes.length}</span>
          <FaHeart />
        </button>
      </div>
    </div>
  );
};

export default ShayariCard;
