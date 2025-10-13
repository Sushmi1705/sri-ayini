import React, { useEffect, useState } from 'react';
import PageBanner from "../src/components/PageBanner";
import Layout from "../src/layout/Layout";
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from 'firebase/auth';
import { auth } from "../firebase";
import { 
  createUserProfile, 
  sendPhoneOtp, 
  verifyPhoneOtp, 
  sendEmailOtp, 
  verifyEmailOtp 
} from '../services/loginServices';

const allMethods = ['phone', 'email'];
const methodLabels = { phone: 'Phone', email: 'Email' };
const methodIcons = { phone: '📱', email: '✉️' };

export default function LoginUI() {
  const [selectedMethod, setSelectedMethod] = useState('phone');
  const [contact, setContact] = useState('');
  const [step, setStep] = useState('inputContact'); // 'inputContact' | 'inputOtp'
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isBusy, setIsBusy] = useState(false);

  // Debug info
  useEffect(() => {
    try {
      console.log('ORIGIN =>', window.location.origin);
      console.log('projectId =>', auth?.app?.options?.projectId);
      console.log('apiKey =>', auth?.app?.options?.apiKey);
      console.log('storageBucket =>', auth?.app?.options?.storageBucket);
    } catch (e) {}
  }, []);

  // Handle redirect result for social login
  useEffect(() => {
    getRedirectResult(auth)
      .then(async (result) => {
        if (!result) return;
        const user = result.user;
        await createUserProfile({
          contact: user.email || user.phoneNumber || user.uid,
          method: (result.providerId || '').includes('facebook') ? 'facebook' : 'google',
          uid: user.uid,
        });
        localStorage.setItem('uid', user.uid);
        window.location.href = '/profile';
      })
      .catch((err) => {
        console.error('Redirect sign-in error:', err);
        setError(err?.message || 'Sign-in failed after redirect.');
      });
  }, []);

  // Validate phone/email input
  const validateInput = () => {
    if (selectedMethod === 'phone') {
      const digits = (contact || '').replace(/\D/g, '');
      return digits.length >= 10;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(contact);
    }
  };

  // Handle OTP request
  const handleRequestOtp = async () => {
    setError('');
    setSuccessMsg('');

    if (!validateInput()) {
      setError(`Please enter a valid ${selectedMethod === 'phone' ? 'phone number' : 'email address'}`);
      return;
    }

    try {
      let result;
      if (selectedMethod === 'phone') {
        const phoneNumber = `+91${contact.replace(/\D/g, '')}`;
        result = await sendPhoneOtp(phoneNumber);
      } else {
        result = await sendEmailOtp(contact);
      }

      if (result.success) {
        setStep('inputOtp');
        setSuccessMsg(result.message || `OTP sent to ${contact}`);
      } else {
        setError(result.message || 'Failed to send OTP');
      }
    } catch (err) {
      console.error('OTP request error:', err);
      setError('Failed to send OTP. Please try again.');
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = async () => {
    setError('');
    if (!otp) {
      setError('Please enter OTP');
      return;
    }

    try {
      let result;
      if (selectedMethod === 'phone') {
        const phoneNumber = `+91${contact.replace(/\D/g, '')}`;
        result = await verifyPhoneOtp(phoneNumber, otp);
      } else {
        result = await verifyEmailOtp(contact, otp);
      }

      if (result.success) {
        await createUserProfile({
          contact,
          otp,
          method: selectedMethod,
          uid: result.uid || contact,
        });
        localStorage.setItem('uid', result.uid || contact);

        alert('Login successful!');
        setStep('inputContact');
        setContact('');
        setOtp('');
        setSuccessMsg('');
        window.location.href = '/profile';
      } else {
        setError(result.message || 'Invalid OTP');
      }
    } catch (err) {
      console.error('OTP verify error:', err);
      setError('Failed to verify OTP. Please try again.');
    }
  };

  // Handle Google/Facebook login
  const handleSocialLogin = async (providerName) => {
    setError('');
    setSuccessMsg('');
    setIsBusy(true);

    try {
      let provider;
      if (providerName === 'google') {
        provider = new GoogleAuthProvider();
      } else if (providerName === 'facebook') {
        provider = new FacebookAuthProvider();
      } else {
        throw new Error('Unsupported provider');
      }

      try {
        // Prefer popup
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        await createUserProfile({
          contact: user.email || user.phoneNumber || user.uid,
          method: providerName,
          uid: user.uid,
        });

        localStorage.setItem('uid', user.uid);
        window.location.href = '/profile';
      } catch (popupErr) {
        // Fallback to redirect if popup blocked
        console.warn('Popup failed, falling back to redirect:', popupErr?.message || popupErr);
        await signInWithRedirect(auth, provider);
        // After redirect back, getRedirectResult effect will finalize
      }
    } catch (err) {
      console.error('Social login error:', err);
      const code = err?.code || '';
      if (code === 'auth/operation-not-allowed') {
        setError('Provider not enabled in Firebase Console.');
      } else if (code === 'auth/popup-closed-by-user') {
        setError('Popup closed before completing sign in.');
      } else if (code === 'auth/account-exists-with-different-credential') {
        setError('An account exists with the same email using a different sign-in method.');
      } else if (code === 'auth/invalid-app-credential') {
        setError('App Check or domain not accepted. Verify App Check and Authorized domains.');
      } else {
        setError(err?.message || 'Unable to sign in with provider.');
      }
    } finally {
      setIsBusy(false);
    }
  };

  const otherMethods = allMethods.filter((m) => m !== selectedMethod);

  return (
    <Layout>
      <PageBanner pageName={"Login Page"} />
      <div className="login-container">
        <h2 className="title">Login with OTP</h2>
        <p className="subtitle">Enter your log in details</p>

        {successMsg && <p className="success-text">{successMsg}</p>}
        {error && <p className="error-text">{error}</p>}

        {step === 'inputContact' && (
          <>
            <input
              type={selectedMethod === 'email' ? 'email' : 'tel'}
              placeholder={`Enter Your ${selectedMethod === 'phone' ? 'Phone number' : 'Email address'}`}
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="input-field"
            />
            <button className="request-otp-btn" onClick={handleRequestOtp}>
              Send OTP <span className="arrow">→</span>
            </button>
          </>
        )}

        {step === 'inputOtp' && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="input-field"
            />
            <button className="request-otp-btn" onClick={handleVerifyOtp}>
              Verify OTP
            </button>
            <button
              className="back-btn"
              onClick={() => {
                setStep('inputContact');
                setOtp('');
                setError('');
                setSuccessMsg('');
              }}
            >
              Back
            </button>
          </>
        )}

        <div className="divider">
          <span>Or Login Using</span>
        </div>

        <div className="social-buttons">
          <button
            disabled={isBusy}
            className="btn-social btn-google"
            onClick={() => handleSocialLogin('google')}
            aria-label="Continue with Google"
            title="Continue with Google"
          >
            {/* Google SVG */}
            <svg viewBox="0 0 533.5 544.3" width="22" height="22" aria-hidden="true">
              <path fill="#4285F4" d="M533.5 278.4c0-17.4-1.6-34.1-4.6-50.3H272v95.1h146.9c-6.3 34.2-25 63.1-53.3 82.5v68h86.1c50.5-46.5 81.8-115.1 81.8-195.3z"/>
              <path fill="#34A853" d="M272 544.3c72.9 0 134.1-24.1 178.8-65.6l-86.1-68c-23.9 16.1-54.5 25.7-92.7 25.7-71 0-131.3-47.9-152.8-112.3H31.5v70.6C75.8 487.5 168.6 544.3 272 544.3z"/>
              <path fill="#FBBC05" d="M119.2 324.1c-10.9-32.5-10.9-67.5 0-100l.1-70.6H31.5c-41.9 83.8-41.9 157.5 0 241.3l87.6-70.7z"/>
              <path fill="#EA4335" d="M272 106.2c39.6-.6 77.5 14 106.4 40.8l79.4-79.4C405.9 22.6 343.9-1 272 0 168.6 0 75.8 56.8 31.5 173.5l87.7 70.6C140.7 154.6 201 106.7 272 106.2z"/>
            </svg>
          </button>

          <button
            disabled={isBusy}
            className="btn-social btn-facebook"
            onClick={() => handleSocialLogin('facebook')}
            aria-label="Continue with Facebook"
            title="Continue with Facebook"
          >
            {/* Facebook SVG */}
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <path fill="#1877F2" d="M24 12.073C24 5.406 18.627 0 12 0S0 5.406 0 12.073C0 18.1 4.388 23.093 10.125 24v-8.42H7.078v-3.507h3.047V9.413c0-3.017 1.792-4.687 4.533-4.687 1.312 0 2.686.235 2.686.235v2.98h-1.513c-1.49 0-1.953.929-1.953 1.883v2.258h3.328l-.532 3.507h-2.796V24C19.612 23.093 24 18.1 24 12.073z"/>
            </svg>
          </button>
        </div>

        <div className="login-methods">
          {otherMethods.map((method) => (
            <button
              key={method}
              className={`login-btn ${method}`}
              onClick={() => {
                setSelectedMethod(method);
                setContact('');
                setOtp('');
                setStep('inputContact');
                setError('');
                setSuccessMsg('');
              }}
            >
              <span className="icon">{methodIcons[method]}</span> {methodLabels[method]}
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        .social-buttons {
          display: flex;
          gap: 12px;
          align-items: center;
          justify-content: center;
          margin: 12px 0 8px;
        }
        .btn-social {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #e5e7eb;
          background: #fff;
          cursor: pointer;
          transition: transform 0.08s ease, box-shadow 0.2s ease;
        }
        .btn-social:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        .btn-social:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
        .btn-google svg, .btn-facebook svg { display: block; }
      `}</style>
    </Layout>
  );
}
