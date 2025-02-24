import { db } from "../firebase";
import { 
  collection, addDoc, getDocs, doc, updateDoc, 
  arrayUnion, arrayRemove, serverTimestamp, onSnapshot 
} from "firebase/firestore";

const shayariCollection = collection(db, "shayaris");

// ✅ Post Shayari with user ID and custom author name
export const postShayari = async (text, author, userId) => {
  if (!userId) {
    console.error("User ID is undefined. Cannot post Shayari.");
    return;
  }

  try {
    await addDoc(shayariCollection, {
      text,
      author: author || "Anonymous", // If the author field is empty, default to "Anonymous"
      userId,
      likes: [],
      createdAt: serverTimestamp(),
    });
    console.log("Shayari posted successfully!");
  } catch (error) {
    console.error("Error posting shayari:", error);
  }
};

// ✅ Fetch all Shayaris
export const getShayaris = async () => {
  const querySnapshot = await getDocs(shayariCollection);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// ✅ Listen to Shayaris (Real-time updates)
export const listenToShayaris = (setShayaris) => {
  return onSnapshot(shayariCollection, (snapshot) => {
    const shayaris = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setShayaris(shayaris);
  });
};

// ✅ Optimized Like/Unlike Function
export const toggleLike = async (shayariId, userId) => {
  const shayariRef = doc(db, "shayaris", shayariId);

  try {
    // Fetch the specific Shayari document
    const querySnapshot = await getDocs(shayariCollection);
    let shayariData = null;

    querySnapshot.forEach((doc) => {
      if (doc.id === shayariId) {
        shayariData = doc.data();
      }
    });

    if (!shayariData) return;

    if (shayariData.likes.includes(userId)) {
      // Unlike
      await updateDoc(shayariRef, {
        likes: arrayRemove(userId),
      });
    } else {
      // Like
      await updateDoc(shayariRef, {
        likes: arrayUnion(userId),
      });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
  }
};
