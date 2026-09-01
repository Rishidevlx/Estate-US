import React, { useEffect, useState } from 'react';
import LottiePackage from 'lottie-react';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { useLoginController } from '../../controllers/useLoginController';

// Fix for Vite CJS/ESM interop issue with lottie-react
const Lottie = LottiePackage.default || LottiePackage;

const LoginView = () => {
  const { email, setEmail, password, setPassword, handleLogin, error, isLoading } = useLoginController();
  const [animationData, setAnimationData] = useState(null);
  
  // Forgot Password State
  const [viewState, setViewState] = useState('login'); // 'login', 'email', 'otp', 'reset'
  const [resetEmail, setResetEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [isForgotLoading, setIsForgotLoading] = useState(false);

  useEffect(() => {
    fetch('/Home.json')
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(error => console.error('Error loading Lottie animation:', error));
      
    // Check if redirect from profile page
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('forgot') === 'true') {
      setViewState('email');
    }
  }, []);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setIsForgotLoading(true);
    setForgotError('');
    setForgotSuccess('');
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail })
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setForgotSuccess('OTP sent to your email.');
        setTimeout(() => {
          setViewState('otp');
          setForgotSuccess('');
        }, 1500);
      } else {
        setForgotError(data.message || 'Failed to send OTP.');
      }
    } catch (err) {
      setForgotError('Server error.');
    } finally {
      setIsForgotLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsForgotLoading(true);
    setForgotError('');
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, otp })
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setForgotSuccess('OTP verified.');
        setTimeout(() => {
          setViewState('reset');
          setForgotSuccess('');
        }, 1000);
      } else {
        setForgotError(data.message || 'Invalid OTP.');
      }
    } catch (err) {
      setForgotError('Server error.');
    } finally {
      setIsForgotLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setForgotError('Passwords do not match.');
      return;
    }
    
    setIsForgotLoading(true);
    setForgotError('');
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, otp, newPassword })
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setForgotSuccess('Password reset successfully! You can now login.');
        setTimeout(() => {
          setViewState('login');
          setForgotSuccess('');
          setResetEmail('');
          setOtp('');
          setNewPassword('');
          setConfirmPassword('');
        }, 2000);
      } else {
        setForgotError(data.message || 'Failed to reset password.');
      }
    } catch (err) {
      setForgotError('Server error.');
    } finally {
      setIsForgotLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col md:flex-row bg-[#f5f7f6]">
      {/* Left Side - Animation */}
      <div className="hidden md:flex flex-1 bg-[#113C2B] items-center justify-center relative overflow-hidden">
        {animationData ? (
          <div className="w-4/5 max-w-[600px]">
            <Lottie animationData={animationData} loop={true} />
          </div>
        ) : (
          <p className="text-white">Loading animation...</p>
        )}
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center bg-white p-8 md:p-16">
        <div className="w-full max-w-[450px] flex flex-col">
          
          {/* LOGIN VIEW */}
          {viewState === 'login' && (
            <>
              <div className="mb-10">
                <h2 className="text-[#113C2B] text-4xl font-bold mb-4">Welcome Back!</h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Sign in to the <span className="font-semibold text-[#113C2B]">Sampras Realty</span> admin panel to manage properties, blog posts, and user inquiries securely.
                </p>
              </div>
              
              {(error || forgotSuccess) && (
                <div className={`mb-6 p-3 text-sm rounded-md border ${forgotSuccess ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                  {forgotSuccess || error}
                </div>
              )}
              
              <form onSubmit={handleLogin} className="flex flex-col gap-6">
                <InputField
                  label="Email Address"
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your Email"
                  required
                />
                
                <InputField
                  label="Password"
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                
                <div className="flex flex-col gap-4 mt-2">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Authenticating...' : 'Secure Login'}
                  </Button>
                  
                  <div className="flex items-center justify-center">
                    <button type="button" onClick={() => setViewState('email')} className="text-sm font-medium text-gray-500 hover:text-[#113C2B] transition-colors">
                      Forgot your password?
                    </button>
                  </div>
                </div>
              </form>
            </>
          )}

          {/* FORGOT PASSWORD: EMAIL VIEW */}
          {viewState === 'email' && (
            <>
              <div className="mb-10">
                <h2 className="text-[#113C2B] text-3xl font-bold mb-4">Reset Password</h2>
                <p className="text-gray-600 text-[15px] leading-relaxed">
                  Enter your email address and we'll send you an OTP to reset your password.
                </p>
              </div>
              
              {(forgotError || forgotSuccess) && (
                <div className={`mb-6 p-3 text-sm rounded-md border ${forgotSuccess ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                  {forgotSuccess || forgotError}
                </div>
              )}
              
              <form onSubmit={handleSendOTP} className="flex flex-col gap-6">
                <InputField
                  label="Email Address"
                  id="resetEmail"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  required
                />
                <div className="flex flex-col gap-4 mt-2">
                  <Button type="submit" disabled={isForgotLoading}>
                    {isForgotLoading ? 'Sending OTP...' : 'Send OTP'}
                  </Button>
                  <button type="button" onClick={() => setViewState('login')} className="text-sm font-medium text-gray-500 hover:text-[#113C2B]">Back to Login</button>
                </div>
              </form>
            </>
          )}

          {/* FORGOT PASSWORD: OTP VIEW */}
          {viewState === 'otp' && (
            <>
              <div className="mb-10">
                <h2 className="text-[#113C2B] text-3xl font-bold mb-4">Verify OTP</h2>
                <p className="text-gray-600 text-[15px] leading-relaxed">
                  Please enter the 6-digit OTP sent to <span className="font-semibold text-gray-800">{resetEmail}</span>
                </p>
              </div>
              
              {(forgotError || forgotSuccess) && (
                <div className={`mb-6 p-3 text-sm rounded-md border ${forgotSuccess ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                  {forgotSuccess || forgotError}
                </div>
              )}
              
              <form onSubmit={handleVerifyOTP} className="flex flex-col gap-6">
                <InputField
                  label="Enter OTP"
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="e.g. 123456"
                  maxLength="6"
                  required
                />
                <div className="flex flex-col gap-4 mt-2">
                  <Button type="submit" disabled={isForgotLoading}>
                    {isForgotLoading ? 'Verifying...' : 'Verify OTP'}
                  </Button>
                  <button type="button" onClick={() => setViewState('login')} className="text-sm font-medium text-gray-500 hover:text-[#113C2B]">Cancel</button>
                </div>
              </form>
            </>
          )}

          {/* FORGOT PASSWORD: RESET VIEW */}
          {viewState === 'reset' && (
            <>
              <div className="mb-10">
                <h2 className="text-[#113C2B] text-3xl font-bold mb-4">Create New Password</h2>
                <p className="text-gray-600 text-[15px] leading-relaxed">
                  Your new password must be different from previous used passwords.
                </p>
              </div>
              
              {(forgotError || forgotSuccess) && (
                <div className={`mb-6 p-3 text-sm rounded-md border ${forgotSuccess ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                  {forgotSuccess || forgotError}
                </div>
              )}
              
              <form onSubmit={handleResetPassword} className="flex flex-col gap-6">
                <InputField
                  label="New Password"
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                />
                <InputField
                  label="Confirm Password"
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                />
                <div className="flex flex-col gap-4 mt-2">
                  <Button type="submit" disabled={isForgotLoading}>
                    {isForgotLoading ? 'Resetting...' : 'Reset Password'}
                  </Button>
                </div>
              </form>
            </>
          )}

          <div className="mt-16 pt-6 border-t border-gray-100 flex items-center justify-center">
             <a href="/" className="text-sm font-medium text-gray-400 hover:text-[#113C2B] transition-colors">
               &larr; Back to Main Website
             </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
