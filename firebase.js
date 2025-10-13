import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth,RecaptchaVerifier  } from "firebase/auth";
// import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';

const firebaseConfig = {
  apiKey: "AIzaSyDRc3S9IzS8sTcI21PM7IBQdFis2_30y9c",
  authDomain: "sriayini-611f1.firebaseapp.com",
  projectId: "sriayini-611f1",
  storageBucket: "sriayini-611f1.firebasestorage.app",
  messagingSenderId: "1055325842909",
  appId: "1:1055325842909:web:ac3b24d58b4b5b036c1a34",
  measurementId: "G-4ZP81506RJ"
};

// ✅ Only initialize if no app exists
// const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
// Your reCAPTCHA Enterprise SITE KEY
// const RECAPTCHA_ENTERPRISE_SITE_KEY = '6Le-vt0rAAAAAHLk_x0tOYUzctSpKbxSx3uvu4Hb';

// Initialize App Check BEFORE getAuth
// initializeAppCheck(app, {
//   provider: new ReCaptchaEnterpriseProvider(RECAPTCHA_ENTERPRISE_SITE_KEY),
//   isTokenAutoRefreshEnabled: true,
// });

// Prevent re-initialization (important in Next.js hot reload)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth, RecaptchaVerifier };
