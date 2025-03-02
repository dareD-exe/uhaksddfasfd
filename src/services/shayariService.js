import { db } from "../firebase";
import { collection, addDoc, getDocs, doc, updateDoc, getDoc, arrayUnion, arrayRemove, serverTimestamp, onSnapshot, query, orderBy } from "firebase/firestore";


const shayariCollection = collection(db, "shayaris");

// ✅ Post Shayari with user ID and custom author name
export const postShayari = async (text, author, category, userId) => {
  if (!userId) {
    console.error("User ID is undefined. Cannot post Shayari.");
    return;
  }

  try {
    const docRef = await addDoc(collection(db, "shayaris"), {
      text,
      author: author || "Anonymous",
      category: category || "Other", // ✅ Ensure category is saved
      userId,
      likes: [],
      createdAt: serverTimestamp(),
    });

    await updateDoc(docRef, { createdAt: serverTimestamp() });

    console.log("✅ Shayari posted successfully with category:", category);
  } catch (error) {
    console.error("❌ Error posting shayari:", error);
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

// ✅ Listen to Shayaris (Real-time updates) with proper ordering
export const listenToShayaris = (setShayaris) => {
  const q = query(shayariCollection, orderBy("createdAt", "desc")); // Sort by newest first

  return onSnapshot(q, (snapshot) => {
    const shayaris = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setShayaris(shayaris);
  });
};



// ✅ Optimized Like/Unlike Function
export const toggleLike = async (shayariId, userId) => {
  if (!userId) return console.error("❌ User is not authenticated.");

  const shayariRef = doc(db, "shayaris", shayariId);
  const shayariSnap = await getDoc(shayariRef);

  if (!shayariSnap.exists()) {
    return console.error("❌ Shayari not found.");
  }

  const shayariData = shayariSnap.data();
  let updatedLikes = shayariData.likes || [];

  if (updatedLikes.includes(userId)) {
    updatedLikes = updatedLikes.filter((id) => id !== userId);
  } else {
    updatedLikes.push(userId);
  }

  try {
    await updateDoc(shayariRef, { likes: updatedLikes });
    console.log("✅ Like toggled successfully");
  } catch (error) {
    console.error("❌ Error toggling like:", error);
  }
};


