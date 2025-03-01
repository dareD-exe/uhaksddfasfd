import { createContext, useContext, useEffect, useState } from "react";
import { 
  auth, 
  googleProvider,
  db
} from "../firebase";
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInAnonymously,
  updateProfile
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore"; // Firestore functions

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("Guest"); 
  const [firstName, setFirstName] = useState("Guest");
  const [email, setEmail] = useState("No Email");  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUser({ uid: firebaseUser.uid, ...userData });
          setFullName(`${userData.firstName} ${userData.lastName}`);
          setFirstName(userData.firstName);
          setEmail(userData.email || "No Email");
        } else {
          setUser(firebaseUser);
          setFullName(firebaseUser.isAnonymous ? "Guest" : "User");
          setFirstName(firebaseUser.isAnonymous ? "Guest" : "User");
          setEmail(firebaseUser.email || "No Email");
        }
      } else {
        setUser(null);
        setFullName("Guest");
        setFirstName("Guest");
        setEmail("No Email");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signupWithEmail = async (firstName, lastName, age, email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;
  
      await updateProfile(newUser, {
        displayName: `${firstName} ${lastName}`,
      });
  
      await setDoc(doc(db, "users", newUser.uid), {
        firstName,
        lastName,
        age,
        email,
      });
  
      setFullName(`${firstName} ${lastName}`);
      setFirstName(firstName);
      setEmail(email);
  
      return newUser;
    } catch (error) {
      // ✅ Suppress console error but handle it correctly
      if (error.code === "auth/email-already-in-use") {
        return Promise.reject({ message: "This email is already in use. Please log in instead." });
      } else if (error.code === "auth/invalid-email") {
        return Promise.reject({ message: "Invalid email format. Please check and try again." });
      } else if (error.code === "auth/weak-password") {
        return Promise.reject({ message: "Password is too weak. Use a stronger one." });
      } else {
        return Promise.reject({ message: "Signup failed. Please try again." });
      }
    }
  };
  
  

  const loginWithEmail = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setFullName(`${userData.firstName} ${userData.lastName}`);
        setFirstName(userData.firstName);
        setEmail(userData.email || "No Email");
      } else {
        setFullName(firebaseUser.displayName || "User");
        setFirstName(firebaseUser.displayName?.split(" ")[0] || "User");
        setEmail(firebaseUser.email || "No Email");
      }

      return firebaseUser;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const loginWithGoogle = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const firebaseUser = userCredential.user;
  
      const userDocRef = doc(db, "users", firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);
  
      if (!userDoc.exists()) {
        const nameParts = firebaseUser.displayName ? firebaseUser.displayName.split(" ") : ["User"];
        const firstName = nameParts[0];
        const lastName = nameParts.length > 1 ? nameParts[1] : "";
  
        await setDoc(userDocRef, {
          firstName,
          lastName,
          email: firebaseUser.email || "No Email",
        });
      }
  
      setUser(firebaseUser);
      setFullName(firebaseUser.displayName || "User");
      setFirstName(firebaseUser.displayName?.split(" ")[0] || "User");
      setEmail(firebaseUser.email || "No Email");
  
      return firebaseUser;
    } catch (error) {
      if (error.code === "auth/popup-closed-by-user") {
        return Promise.reject({ message: "Google login was cancelled. Try again." });
      } else if (error.code === "auth/cancelled-popup-request") {
        return Promise.reject({ message: "Google login request was cancelled." });
      }
      return Promise.reject(error);
    }
  };

  const loginAsGuest = async () => {
    try {
      const guestUser = await signInAnonymously(auth);
      setFullName("Guest");
      setFirstName("Guest");
      setEmail("No Email");
      return guestUser;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const logout = async () => {
    setFullName("Guest");
    setFirstName("Guest");
    setEmail("No Email");
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      fullName, 
      firstName,
      email, 
      loginWithEmail, 
      signupWithEmail, 
      loginWithGoogle, 
      loginAsGuest, 
      logout 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
