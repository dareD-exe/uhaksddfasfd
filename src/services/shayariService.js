import { db } from "../firebase";
import { 
  collection, addDoc, getDocs, doc, updateDoc, 
  arrayUnion, arrayRemove, serverTimestamp, onSnapshot 
} from "firebase/firestore";

const shayariCollection = collection(db, "shayaris");

// ✅ Add Shayari with Full Name
export const addShayari = async (text, userId, fullName) => {
  console.log("Storing Shayari with Name:", fullName); // ✅ Debugging

  await addDoc(shayariCollection, {
    text,
    author: fullName || "Anonymous", // ✅ Ensure full name is stored
    userId,
    likes: [],
    createdAt: serverTimestamp(),
  });
};

// Fetch all Shayaris
export const getShayaris = async () => {
  const querySnapshot = await getDocs(shayariCollection);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Listen to Shayaris (Real-time updates)
export const listenToShayaris = (setShayaris) => {
  return onSnapshot(shayariCollection, (snapshot) => {
    const shayaris = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setShayaris(shayaris);
  });
};

// Toggle Like/Unlike
export const toggleLike = async (shayariId, userId) => {
  const shayariRef = doc(db, "shayaris", shayariId);
  
  try {
    const querySnapshot = await getDocs(shayariCollection);
    
    querySnapshot.forEach(async (shayariDoc) => {
      if (shayariDoc.id === shayariId) {
        const shayariData = shayariDoc.data();
        
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
      }
    });
  } catch (error) {
    console.error("Error toggling like:", error);
  }
};
