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
  const [email, setEmail] = useState("No Email");  // ✅ New: Store email separately

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
          setEmail(userData.email || "No Email");  // ✅ Fix: Ensure email is fetched
        } else {
          setUser(firebaseUser);
          setFullName(firebaseUser.isAnonymous ? "Guest" : "User");
          setFirstName(firebaseUser.isAnonymous ? "Guest" : "User");
          setEmail(firebaseUser.email || "No Email"); // ✅ Fix: Get email from Firebase
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
      setEmail(email);  // ✅ Store email

      return newUser;
    } catch (error) {
      console.error("Signup Error:", error.message);
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
        setEmail(userData.email || "No Email"); // ✅ Fetch email
      } else {
        setFullName(firebaseUser.displayName || "User");
        setFirstName(firebaseUser.displayName?.split(" ")[0] || "User");
        setEmail(firebaseUser.email || "No Email"); // ✅ Fetch email
      }

      return firebaseUser;
    } catch (error) {
      console.error("Login Error:", error.message);
    }
  };

  const loginWithGoogle = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const firebaseUser = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

      if (!userDoc.exists()) {
        const [firstName, lastName] = firebaseUser.displayName.split(" ");
        await setDoc(doc(db, "users", firebaseUser.uid), {
          firstName,
          lastName,
          email: firebaseUser.email,
        });
      }

      setFullName(firebaseUser.displayName);
      setFirstName(firebaseUser.displayName?.split(" ")[0]);
      setEmail(firebaseUser.email || "No Email");  // ✅ Fix: Store email

      return firebaseUser;
    } catch (error) {
      console.error("Google login failed:", error.message);
    }
  };

  const loginAsGuest = async () => {
    try {
      const guestUser = await signInAnonymously(auth);
      setFullName("Guest");
      setFirstName("Guest");
      setEmail("No Email"); // ✅ Reset email
      return guestUser;
    } catch (error) {
      console.error("Guest login failed:", error.message);
    }
  };

  const logout = async () => {
    setFullName("Guest");
    setFirstName("Guest");
    setEmail("No Email"); // ✅ Reset email
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      fullName, 
      firstName,
      email, // ✅ Provide email separately
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
