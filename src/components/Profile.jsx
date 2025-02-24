import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, fullName, email, logout } = useAuth();
  const [shayaris, setShayaris] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newText, setNewText] = useState("");
  const navigate = useNavigate();

  // Redirect to home if user is not logged in
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchShayaris = async () => {
      if (user) {
        const q = query(collection(db, "shayaris"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        // Sort by most recent first
        const sortedShayaris = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
        setShayaris(sortedShayaris);
      }
    };
  
    fetchShayaris();
  }, [user]);
  

  const deleteShayari = async (shayariId) => {
    await deleteDoc(doc(db, "shayaris", shayariId));
    setShayaris(shayaris.filter(shayari => shayari.id !== shayariId));
  };

  const startEditing = (shayari) => {
    setEditingId(shayari.id);
    setNewText(shayari.text);
  };

  const saveEdit = async () => {
    if (newText.trim() === "") return;
    await updateDoc(doc(db, "shayaris", editingId), { text: newText });
    setShayaris(shayaris.map(s => (s.id === editingId ? { ...s, text: newText } : s)));
    setEditingId(null);
    setNewText("");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-6">
      <div className="max-w-lg mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-yellow-400 text-2xl font-bold text-center">Profile</h2>

        {/* User Info */}
        <div className="bg-gray-700 p-4 rounded-lg mt-4 text-center">
          <p><strong>Name:</strong> {fullName}</p>
          <p><strong>Email:</strong> {email || "No Email"}</p>
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded mt-3">
            Logout
          </button>
        </div>

        {/* Shayari List */}
        <h3 className="text-lg font-semibold mt-6 text-yellow-400">Your Shayaris</h3>
        {shayaris.length === 0 ? (
          <p className="text-gray-400 mt-2">You haven't posted any Shayaris yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {shayaris.map((shayari) => (
              <li key={shayari.id} className="bg-gray-700 p-3 rounded-lg flex justify-between items-center">
                {editingId === shayari.id ? (
                  <>
                    <input
                      type="text"
                      value={newText}
                      onChange={(e) => setNewText(e.target.value)}
                      className="bg-gray-900 text-white px-2 py-1 rounded w-full"
                    />
                    <button onClick={saveEdit} className="bg-green-500 px-3 py-1 rounded ml-2">Save</button>
                  </>
                ) : (
                  <>
                    <span>{shayari.text}</span>
                    <div>
                      <button onClick={() => startEditing(shayari)} className="bg-blue-500 px-3 py-1 rounded mx-1">Edit</button>
                      <button onClick={() => deleteShayari(shayari.id)} className="bg-red-500 px-3 py-1 rounded">Delete</button>
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
