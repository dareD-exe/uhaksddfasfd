import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { PencilLine, Trash2, CheckCircle, XCircle } from "lucide-react";

const Profile = () => {
  const { user, fullName, email, logout } = useAuth();
  const [shayaris, setShayaris] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newText, setNewText] = useState("");
  const navigate = useNavigate();

  // Redirect if user not logged in
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Fetch user shayaris
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "shayaris"), where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const sortedShayaris = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt || { seconds: 0 }, // Handle missing timestamps
        }))
        .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);

      setShayaris(sortedShayaris);
    });

    return () => unsubscribe();
  }, [user]);

  const deleteShayari = async (shayariId) => {
    try {
      await deleteDoc(doc(db, "shayaris", shayariId));
      setShayaris(shayaris.filter((shayari) => shayari.id !== shayariId));
    } catch (error) {
      console.error("Error deleting Shayari:", error);
    }
  };

  const startEditing = (shayari) => {
    setEditingId(shayari.id);
    setNewText(shayari.text);
  };

  const saveEdit = async () => {
    if (newText.trim() === "") return;

    try {
      await updateDoc(doc(db, "shayaris", editingId), { text: newText });

      setShayaris((prev) =>
        prev.map((s) => (s.id === editingId ? { ...s, text: newText } : s))
      );
    } catch (error) {
      console.error("Error updating Shayari:", error);
    }

    setEditingId(null);
    setNewText("");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-6">
      <div className="max-w-2xl mx-auto bg-gray-800 p-6 rounded-2xl shadow-2xl">
        <h2 className="text-2xl font-bold text-white text-center bg-gradient-to-r from-yellow-500 to-red-500 px-4 py-2 rounded-lg shadow-lg">
          Profile
        </h2>

        <div className="bg-gray-700 p-5 rounded-xl mt-4 text-center shadow-lg">
          <div className="flex flex-col items-center mb-4">
            <div className="w-24 h-24 rounded-full bg-gray-600 flex items-center justify-center text-3xl text-white shadow-lg">
              {fullName ? fullName.charAt(0) : "U"}
            </div>
            <p className="mt-3">
              <strong>Name:</strong> {fullName}
            </p>
            <p>
              <strong>Email:</strong> {email || "No Email"}
            </p>
          </div>
        </div>

        <h3 className="text-lg font-semibold mt-6 text-yellow-400">Your Shayaris</h3>
        {shayaris.length === 0 ? (
          <p className="text-gray-400 mt-2">You haven't posted any Shayaris yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
  {shayaris.map((shayari) => (
    <li
      key={shayari.id}
      className="bg-gray-700 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-md hover:bg-gray-600 transition duration-200"
    >
      {editingId === shayari.id ? (
        <>
          <textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            ref={(el) => {
              if (el) {
                el.style.height = "auto"; // Reset height
                el.style.height = `${el.scrollHeight}px`; // Adjust height
              }
            }}
            rows="1"
            className="bg-gray-900 text-white px-3 py-2 rounded-lg w-full shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-400 transition resize-none overflow-hidden text-sm sm:text-base"
          />

          <div className="flex space-x-2 mt-2 sm:mt-0">
            <button
              onClick={saveEdit}
              className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded-lg shadow"
            >
              <CheckCircle size={20} />
            </button>
            <button
              onClick={() => {
                setEditingId(null);
                setNewText(""); // Reset newText when cancelling
              }}
              className="bg-gray-500 hover:bg-gray-600 px-3 py-1 rounded-lg shadow"
            >
              <XCircle size={20} />
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="flex-1 whitespace-pre-wrap text-sm sm:text-base break-words">
            {shayari.text}
          </p>
          <div className="flex space-x-2 mt-2 sm:mt-0">
            <button
              onClick={() => startEditing(shayari)}
              className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-lg shadow"
            >
              <PencilLine size={20} />
            </button>
            <button
              onClick={() => deleteShayari(shayari.id)}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg shadow"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </>
      )}
    </li>
  ))}
</ul>

        )}
      </div>
    </div>
  );
};

export default Profile;
