import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Profile = () => {
  const { user, fullName, email, logout } = useAuth();
  const [shayaris, setShayaris] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newText, setNewText] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

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
        const userShayaris = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setShayaris(userShayaris);
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
    navigate("/"); // Redirect to home page after logout
  };

  return (
    <div className="text-center">
      <h2 className="text-yellow-400 text-2xl font-bold">Profile</h2>
      <div className="bg-gray-800 p-4 rounded-lg max-w-md mx-auto mt-4">
        <p>
          <strong>Name:</strong> {fullName}
        </p>
        <p>
          <strong>Email:</strong> {email || "No Email"}
        </p>
        <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded mt-3">
          Logout
        </button>
      </div>

      <h3 className="text-lg font-semibold mt-6">Your Shayaris</h3>
      {shayaris.length === 0 ? (
        <p>You haven't posted any Shayari yet.</p>
      ) : (
        <ul className="mt-3">
          {shayaris.map((shayari) => (
            <li key={shayari.id} className="bg-gray-700 p-3 rounded my-2 flex justify-between items-center">
              {editingId === shayari.id ? (
                <>
                  <input
                    type="text"
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    className="bg-gray-900 text-white px-2 py-1 rounded"
                  />
                  <button onClick={saveEdit} className="bg-green-500 px-2 py-1 rounded ml-2">Save</button>
                </>
              ) : (
                <>
                  <span>{shayari.text}</span>
                  <div>
                    <button onClick={() => startEditing(shayari)} className="bg-blue-500 px-2 py-1 rounded mx-1">Edit</button>
                    <button onClick={() => deleteShayari(shayari.id)} className="bg-red-500 px-2 py-1 rounded">Delete</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Profile;
