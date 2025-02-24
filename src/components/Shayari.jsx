import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { listenToShayaris, toggleLike } from "../services/shayariService";
import PostShayari from "../components/PostShayari";
import styled from "styled-components";

const Shayari = () => {
  const { user } = useAuth();
  const [shayaris, setShayaris] = useState([]);
  const [copyStatus, setCopyStatus] = useState({});

  useEffect(() => {
    const unsubscribe = listenToShayaris(setShayaris);
    return () => unsubscribe();
  }, []);

  const handleLike = async (shayariId) => {
    if (!user) return;
    await toggleLike(shayariId, user.uid);
  };

  const handleCopy = async (shayariId, text) => {
  try {
    await navigator.clipboard.writeText(text.toUpperCase()); // Copy text in uppercase
    setCopyStatus((prev) => ({ ...prev, [shayariId]: true }));
    setTimeout(() => {
      setCopyStatus((prev) => ({ ...prev, [shayariId]: false }));
    }, 2000);
  } catch (error) {
    console.error("Error copying text:", error);
  }
};

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-900 text-white rounded-lg">
      <h2 className="text-3xl font-bold text-center mb-6 text-yellow-400">
        ✨ Explore Beautiful Shayaris
      </h2>

      <PostShayari />

      <div className="space-y-4">
        {shayaris.length === 0 ? (
          <p className="text-center text-gray-400">No Shayaris yet. Be the first to share! ✨</p>
        ) : (
          shayaris.map((shayari) => (
            <div key={shayari.id} className="p-4 bg-gray-800 rounded-lg border border-gray-700 relative">
              <p className="text-lg font-serif text-gray-300 text-center">"{shayari.text}"</p>
              <p className="text-sm text-gray-400 mt-1 text-right">— {shayari.author || "Anonymous"}</p>

              <div className="flex justify-end items-center gap-3 mt-3">
  {/* Copy Button */}
  <CopyButton onClick={() => handleCopy(shayari.id, shayari.text)}>
    <span className="text">
      {copyStatus[shayari.id] ? "Copied" : "Copy"}
    </span>
    <span className="svgIcon">
      <svg fill="white" viewBox="0 0 384 512" height="1em">
        <path d="M280 64h40c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128C0 92.7 28.7 64 64 64h40 9.6C121 27.5 153.3 0 192 0s71 27.5 78.4 64H280zM64 112c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H320c8.8 0 16-7.2 16-16V128c0-8.8-7.2-16-16-16H304v24c0 13.3-10.7 24-24 24H192 104c-13.3 0-24-10.7-24-24V112H64zm128-8a24 24 0 1 0 0-48 24 24 0 1 0 0 48z" />
      </svg>
    </span>
  </CopyButton>

  {/* Like Button */}
  <LikeButton onClick={() => handleLike(shayari.id)} $liked={shayari.likes?.includes(user?.uid)}>
    <input type="checkbox" style={{ display: "none" }} />
    <span className="like">
      <svg
        className="like-icon"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill={shayari.likes?.includes(user?.uid) ? "#fc4e4e" : "#505050"}
      >
        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
      </svg>
      <span className="like-text">Likes</span>
    </span>
    <div className="divider"></div>
    <span className="like-count">{shayari.likes?.length || 0}</span>
  </LikeButton>
</div>

            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Styled Components
const CopyButton = styled.button`
  width: auto;
  height: 40px; /* Same height as LikeButton */
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 12px; /* Matching rounded corners */
  cursor: pointer;
  background-color: #1d1d1d; /* Matching dark background */
  padding: 8px 12px; /* Same padding as LikeButton */
  margin-top: 10px;
  gap: 8px; /* Consistent spacing */

  .text {
    color: white;
  }

  .svgIcon {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &:hover {
    background-color: #3a0d0d; /* Hover effect similar to LikeButton */
  }
`;



const LikeButton = styled.button`
  width: auto;
  height: 40px;
  border: none;
  border-radius: 12px;
  background-color: ${({ $liked }) => ($liked ? "#3a0d0d" : "#1d1d1d")};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 8px 12px; /* Equal padding on all sides */
  margin-top: 10px;
  gap: 8px; /* Reduced gap between elements */

  .like {
    display: flex;
    align-items: center;
    gap: 4px; /* Minimal gap between heart icon and text */
  }

  .like-text {
    color: white;
  }

  .divider {
    width: 1px;
    height: 20px;
    background-color: rgba(255, 255, 255, 0.5); /* Clean white divider */
  }

  .like-count {
    color: #fc4e4e;
  }

  &:hover .like-icon {
    fill: #fc4e4e;
  }
`;



export default Shayari;
