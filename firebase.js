
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBhnAjFB0INsg1rzmIxbGbrokOqfbJ45wM",
  authDomain: "shopping-65b5a.firebaseapp.com",
  projectId: "shopping-65b5a",
  storageBucket: "shopping-65b5a.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdefg"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // ⬅️ This is important
auth.settings.appVerificationDisabledForTesting = true;

export { auth };



