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
    <div className="bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-2xl shadow-2xl my-4 transition-transform hover:scale-105 hover:shadow-yellow-500/50">

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
    className={`transition-transform duration-300 ${
      isLiked ? "scale-150 text-red-500 animate-ping" : "scale-100"
    }`}
  />
</button>


      </div>
    </div>
  );
};

export default ShayariCard;
