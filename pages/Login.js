import React, { useState, useEffect } from 'react';
import PageBanner from "../src/components/PageBanner";
import Layout from "../src/layout/Layout";
import { createUserProfile } from '../services/loginServices';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from "../firebase"; // Make sure this points to the correct file

const allMethods = ['phone', 'email'];

const methodLabels = {
  phone: 'Phone',
  email: 'Email',
};

const methodIcons = {
  phone: '📱',
  email: '✉️',
};

function LoginUI() {
  const [selectedMethod, setSelectedMethod] = useState('phone');
  const [contact, setContact] = useState('');
  const [step, setStep] = useState('inputContact');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // const auth = app;
  
  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: (response) => {
          console.log('reCAPTCHA solved');
        },
        'expired-callback': () => {
          console.warn('reCAPTCHA expired.');
        }
      });
    }
  }, []);
  

  // useEffect(() => {
  //   if (
  //     typeof window !== 'undefined' &&
  //     !window.recaptchaVerifier &&
  //     process.env.NODE_ENV === 'production' // ✅ only in prod
  //   ) {
  //     try {
  //       window.recaptchaVerifier = new RecaptchaVerifier(
  //         'recaptcha-container',
  //         {
  //           size: 'invisible',
  //           callback: (response) => {
  //             console.log('✅ reCAPTCHA solved', response);
  //           },
  //           'expired-callback': () => {
  //             console.warn('⚠️ reCAPTCHA expired');
  //           },
  //         },
  //         auth
  //       );
  
  //       window.recaptchaVerifier.render().then((widgetId) => {
  //         window.recaptchaWidgetId = widgetId;
  //       });
  //     } catch (e) {
  //       console.error('❌ reCAPTCHA setup error:', e);
  //     }
  //   }
  // }, []);

  const handleRequestOtp = async () => {
    setError('');
    if (!contact || contact.length < 10) {
      setError(`Please enter a valid phone number`);
      return;
    }
  
    try {
      const fullPhone = contact.startsWith('+') ? contact : '+91' + contact;
  
      // Only pass appVerifier if reCAPTCHA is initialized
      const confirmation = await signInWithPhoneNumber(
        auth,
        fullPhone,
        window.recaptchaVerifier || undefined
      );
  
      window.confirmationResult = confirmation;
      setStep('inputOtp');
      setSuccessMsg(`OTP sent to ${fullPhone}`);
    } catch (err) {
      console.error(err);
      setError('Failed to send OTP. Please try again.');
    }
  };
  

  // const handleRequestOtp = async () => {
  //   setError('');
  //   if (!contact || contact.length < 10) {
  //     setError(`Please enter a valid phone number`);
  //     return;
  //   }
  
  //   try {
  //     const appVerifier = window.recaptchaVerifier;
  //     const fullPhone = contact.startsWith('+') ? contact : '+91' + contact;
  //     const confirmation = await signInWithPhoneNumber(auth, fullPhone, appVerifier);
  //     window.confirmationResult = confirmation;
  //     setStep('inputOtp');
  //     setSuccessMsg(`OTP sent to ${fullPhone}`);
  //   } catch (err) {
  //     console.error(err);
  //     setError('Failed to send OTP. Please try again.');
  //   }
  // };

  const handleVerifyOtp = async () => {
    setError('');
    if (!otp) {
      setError('Please enter OTP');
      return;
    }

    try {
      const result = await window.confirmationResult.confirm(otp);
      const user = result.user;
      const phoneNumber = user.phoneNumber;
      const uid = user.uid;

      await createUserProfile({ contact: phoneNumber, otp, method: selectedMethod, uid:uid });
      localStorage.setItem('uid', uid);
      
      alert('Login successful!');
      setStep('inputContact');
      setContact('');
      setOtp('');
      setSuccessMsg('');
      window.location.href = '/profile';

    } catch (err) {
      console.error(err);
      setError('Invalid OTP. Please try again.');
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
              type="tel"
              placeholder="Enter Your Phone number"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="input-field"
            />
            <button className="request-otp-btn" onClick={handleRequestOtp}>
              Request OTP <span className="arrow">→</span>
            </button>
            <div id="recaptcha-container"></div>
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
              }}
            >
              <span className="icon">{methodIcons[method]}</span> {methodLabels[method]}
            </button>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default LoginUI;
