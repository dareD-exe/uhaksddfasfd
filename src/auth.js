import { auth } from "./firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";

const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User signed up:", userCredential.user);
  } catch (error) {
    console.error("Error signing up:", error.message);
  }
};

export { signUp };
