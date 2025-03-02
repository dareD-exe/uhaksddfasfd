import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { PencilLine, Trash2, CheckCircle, XCircle, LogOut } from "lucide-react";
import Navbar from "../components/Navbar";
import MobileNav from "../components/MobileNav";

const Profile = () => {
  const { user, fullName, email, logout } = useAuth();
  const [shayaris, setShayaris] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newText, setNewText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchShayaris = async () => {
      if (user) {
        const q = query(collection(db, "shayaris"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const sortedShayaris = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
        setShayaris(sortedShayaris);
      }
    };
    fetchShayaris();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const startEditing = (shayari) => {
    setEditingId(shayari.id);
    setNewText(shayari.text);
  };

  const saveEdit = async () => {
    if (!editingId || newText.trim() === "") return;
    await updateDoc(doc(db, "shayaris", editingId), { text: newText });

    setShayaris((prev) =>
      prev.map((shayari) =>
        shayari.id === editingId ? { ...shayari, text: newText } : shayari
      )
    );

    setEditingId(null);
    setNewText("");
  };

  const deleteShayari = async (shayariId) => {
    await deleteDoc(doc(db, "shayaris", shayariId));
    setShayaris(shayaris.filter((shayari) => shayari.id !== shayariId));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* ✅ Show Desktop Navbar */}
      <div className="hidden lg:block">
        <Navbar />
      </div>

      {/* ✅ Show Mobile Top Bar */}
      <div className="fixed top-0 left-0 w-full bg-[#070F2B]/70 backdrop-blur-lg text-white px-6 h-[4rem] flex justify-between items-center z-50 shadow-md lg:hidden">
        <h1 className="text-xl font-bold tracking-wide">ZikrVerse</h1>
        <button 
          onClick={handleLogout} 
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg flex items-center gap-2 shadow"
        >
          <LogOut size={20} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>

      {/* ✅ Profile Content */}
      <div className="max-w-2xl mx-auto bg-gray-800 p-6 rounded-2xl shadow-2xl">
        <h2 className="text-2xl font-bold text-white text-center bg-gradient-to-r from-yellow-500 to-red-500 px-4 py-2 rounded-lg shadow-lg">
          Profile
        </h2>

        {/* ✅ User Info */}
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

        {/* ✅ Shayari List */}
        <h3 className="text-lg font-semibold mt-6 text-yellow-400">Your Shayaris</h3>
        {shayaris.length === 0 ? (
          <p className="text-gray-400 mt-2">You haven't posted any Shayaris yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {shayaris.map((shayari) => (
              <li
                key={shayari.id}
                className="bg-gray-700 p-4 rounded-xl shadow-md hover:bg-gray-600 transition duration-200 flex flex-col"
              >
                {editingId === shayari.id ? (
                  <>
                    {/* ✅ Auto-resizing Textarea */}
                    <textarea
                      value={newText}
                      onChange={(e) => setNewText(e.target.value)}
                      rows={1} // Start with 1 row
                      className="bg-gray-900 text-white px-2 py-1 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-400 transition w-full resize-none overflow-hidden"
                      style={{
                        minHeight: "1.5rem",
                        height: "auto",
                        maxHeight: "10rem",
                        lineHeight: "1.5rem",
                      }}
                      ref={(el) => {
                        if (el) {
                          el.style.height = "auto";
                          el.style.height = `${el.scrollHeight}px`;
                        }
                      }}
                      onInput={(e) => {
                        e.target.style.height = "auto";
                        e.target.style.height = `${e.target.scrollHeight}px`;
                      }}
                    />

                    {/* ✅ Buttons Positioned Below in All Screens */}
                    <div className="flex justify-end space-x-2 w-full mt-2">
                      <button
                        onClick={saveEdit}
                        className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded-lg shadow"
                      >
                        <CheckCircle size={20} />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-500 hover:bg-gray-600 px-3 py-1 rounded-lg shadow"
                      >
                        <XCircle size={20} />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* ✅ Shayari Text */}
                    <p className="text-sm sm:text-base">{shayari.text}</p>

                    {/* ✅ Buttons Below Text on All Screens */}
                    <div className="flex justify-end space-x-2 w-full mt-2">
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

      {/* ✅ Mobile Navbar */}
      <div className="lg:hidden">
        <MobileNav />
      </div>
    </div>
  );
};

export default Profile;
