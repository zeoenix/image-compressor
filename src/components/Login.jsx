import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');

  const { loginWithGoogle, loginWithEmail, signupWithEmail, resendVerificationEmail, refreshUser } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      setError('');
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isSignup) {
        if (!name.trim()) {
          setError('Please enter your name');
          setLoading(false);
          return;
        }
        await signupWithEmail(email, password, name);
        setShowVerification(true);
        setLoading(false);
        return;
      } else {
        const result = await loginWithEmail(email, password);
        // Check if email is verified for email/password users
        if (result.user.providerData[0]?.providerId === 'password' && !result.user.emailVerified) {
          setShowVerification(true);
          setLoading(false);
          return;
        }
      }
      navigate('/');
    } catch (err) {
      if (err.code === 'auth/user-not-found') setError('No account found with this email');
      else if (err.code === 'auth/wrong-password') setError('Incorrect password');
      else if (err.code === 'auth/email-already-in-use') setError('Email already registered');
      else if (err.code === 'auth/weak-password') setError('Password should be at least 6 characters');
      else if (err.code === 'auth/invalid-email') setError('Invalid email address');
      else setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      await resendVerificationEmail();
      setVerificationMessage('Verification email sent! Check your inbox.');
      setTimeout(() => setVerificationMessage(''), 5000);
    } catch (err) {
      setError('Failed to send verification email. Try again later.');
    }
  };

  const handleCheckVerification = async () => {
    try {
      await refreshUser();
      const { currentUser } = await import('../firebase').then(m => m.auth);
      if (currentUser) {
        await currentUser.reload();
        if (currentUser.emailVerified) {
          navigate('/');
        } else {
          setError('Email not yet verified. Please check your inbox and click the verification link.');
          setTimeout(() => setError(''), 5000);
        }
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  // Email Verification Screen
  if (showVerification) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="bg-white max-w-md w-full mx-4 text-center" style={{ borderRadius: '24px', padding: '48px 36px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
          {/* Email icon */}
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto" style={{ marginBottom: '24px' }}>
            <svg className="w-10 h-10 text-[#3D85C6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-900" style={{ marginBottom: '8px' }}>Verify your email</h2>
          <p className="text-gray-500" style={{ marginBottom: '8px' }}>
            We've sent a verification link to
          </p>
          <p className="text-[#3D85C6] font-semibold text-lg" style={{ marginBottom: '28px' }}>{email}</p>

          <p className="text-gray-400 text-sm" style={{ marginBottom: '28px' }}>
            Click the link in your email to verify your account, then come back and press the button below.
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm font-medium rounded-xl" style={{ padding: '12px', marginBottom: '16px' }}>
              {error}
            </div>
          )}

          {verificationMessage && (
            <div className="bg-green-50 text-green-600 text-sm font-medium rounded-xl" style={{ padding: '12px', marginBottom: '16px' }}>
              {verificationMessage}
            </div>
          )}

          <button
            onClick={handleCheckVerification}
            className="w-full bg-[#3D85C6] text-white font-semibold rounded-full hover:bg-[#2E6BA6] transition-all duration-200 flex items-center justify-center gap-2"
            style={{ padding: '14px 0', marginBottom: '12px' }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            I've verified my email
          </button>

          <button
            onClick={handleResendVerification}
            className="w-full text-[#3D85C6] font-semibold rounded-full hover:bg-blue-50 transition-all duration-200"
            style={{ padding: '14px 0', marginBottom: '16px', border: '2px solid #e5e7eb' }}
          >
            Resend verification email
          </button>

          <button
            onClick={() => { setShowVerification(false); setError(''); }}
            className="text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors"
          >
            ← Back to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white">

      {/* ===== Left Panel — Illustration (hidden on mobile) ===== */}
      <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden bg-[#3D85C6] rounded-[2.5rem]" style={{ margin: '16px', height: 'calc(100vh - 32px)' }}>

        {/* Decorative white scribble lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.08]" viewBox="0 0 600 800" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
          <path d="M50 700 Q100 650 80 600 Q60 550 120 500 Q180 450 140 400"/>
          <path d="M500 100 Q520 180 480 250 Q440 320 500 380"/>
          <path d="M100 150 L130 120 L160 150 L190 120"/>
          <path d="M450 600 L480 570 L510 600"/>
          <rect x="80" y="580" width="40" height="50" rx="4" strokeWidth="1.5"/>
          <line x1="200" y1="200" x2="200" y2="200" strokeWidth="6"/>
          <line x1="220" y1="210" x2="220" y2="210" strokeWidth="6"/>
          <line x1="240" y1="195" x2="240" y2="195" strokeWidth="6"/>
        </svg>

        <div className="relative z-10 flex flex-col justify-between w-full h-full" style={{ padding: '2.5rem' }}>

          {/* Logo */}
          <a href="/" className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-[#3D85C6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h10v16H4z" />
                <path d="M8 4V2" />
                <path d="M7 8h4M7 12h4" />
                <path d="M18 8l-4 4 4 4" />
                <path d="M14 12h6" />
                <path d="M20 6v12" />
              </svg>
            </div>
            <span className="text-xl xl:text-2xl font-bold text-white">ImageCompress</span>
          </a>

          {/* Center — Illustration */}
          <div className="flex-1 flex items-center justify-center py-8">
            <svg className="w-[40%] max-w-[200px]" viewBox="0 0 320 360" fill="none">
              {/* Character body */}
              {/* Head */}
              <circle cx="160" cy="72" r="36" fill="#FFD8B4" stroke="#2D3748" strokeWidth="2"/>
              {/* Hair / cap */}
              <path d="M124 60 Q130 30 160 28 Q190 30 196 60" fill="#2D3748" stroke="#2D3748" strokeWidth="1"/>
              <rect x="122" y="55" width="76" height="8" rx="4" fill="#48BB78"/>
              {/* Sunglasses */}
              <rect x="140" y="62" width="16" height="12" rx="3" fill="#2D3748"/>
              <rect x="162" y="62" width="16" height="12" rx="3" fill="#2D3748"/>
              <line x1="156" y1="68" x2="162" y2="68" stroke="#2D3748" strokeWidth="2"/>
              {/* Smile */}
              <path d="M150 84 Q160 92 170 84" stroke="#2D3748" strokeWidth="2" fill="none"/>

              {/* Body / T-shirt */}
              <path d="M120 108 Q115 130 118 180 L202 180 Q205 130 200 108 Q180 100 160 100 Q140 100 120 108Z" fill="#E85D3A"/>
              {/* Logo on shirt */}
              <circle cx="160" cy="140" r="12" fill="none" stroke="white" strokeWidth="1.5" opacity="0.6"/>
              <path d="M155 140 L160 135 L165 140 L160 145Z" fill="white" opacity="0.4"/>

              {/* Arms */}
              <path d="M118 115 Q95 135 100 165" stroke="#FFD8B4" strokeWidth="12" strokeLinecap="round" fill="none"/>
              <path d="M202 115 Q225 135 220 165" stroke="#FFD8B4" strokeWidth="12" strokeLinecap="round" fill="none"/>

              {/* Phone in hand */}
              <rect x="210" y="145" width="22" height="38" rx="4" fill="#2D3748"/>
              <rect x="213" y="149" width="16" height="28" rx="2" fill="#63B3ED"/>

              {/* Legs */}
              <rect x="132" y="180" width="22" height="70" rx="4" fill="#2D3748"/>
              <rect x="166" y="180" width="22" height="70" rx="4" fill="#2D3748"/>

              {/* Feet / shoes */}
              <rect x="126" y="246" width="32" height="14" rx="7" fill="#2D3748"/>
              <rect x="162" y="246" width="32" height="14" rx="7" fill="#2D3748"/>

              {/* Hoverboard / platform */}
              <rect x="70" y="272" width="180" height="18" rx="9" fill="#48BB78"/>
              <circle cx="95" cy="300" r="22" fill="#48BB78" stroke="white" strokeWidth="3"/>
              <circle cx="95" cy="300" r="8" fill="#3D85C6"/>
              <circle cx="225" cy="300" r="22" fill="#48BB78" stroke="white" strokeWidth="3"/>
              <circle cx="225" cy="300" r="8" fill="#3D85C6"/>
              {/* Board details */}
              <circle cx="140" cy="281" r="2" fill="white" opacity="0.6"/>
              <circle cx="150" cy="281" r="2" fill="white" opacity="0.6"/>
              <circle cx="160" cy="281" r="2" fill="white" opacity="0.6"/>
              <circle cx="180" cy="281" r="2" fill="white" opacity="0.6"/>
              <circle cx="190" cy="281" r="2" fill="white" opacity="0.6"/>
              <circle cx="200" cy="281" r="2" fill="white" opacity="0.6"/>

              {/* Sparkle lines around head */}
              <line x1="200" y1="35" x2="215" y2="25" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="210" y1="50" x2="228" y2="48" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="205" y1="65" x2="222" y2="70" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <line x1="115" y1="40" x2="100" y2="32" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>

          {/* Bottom text */}
          <div className="text-white" style={{ paddingBottom: '0.5rem' }}>
            <h2 className="text-xl xl:text-2xl font-extrabold leading-tight mb-2">
              Compress your images,<br/>keep the quality
            </h2>
            <p className="text-white/60 text-xs xl:text-sm max-w-xs">
              Reduce file sizes up to 90% in just a few clicks
            </p>
          </div>
        </div>
      </div>

      {/* ===== Right Panel — Form ===== */}
      <div className="flex-1 flex flex-col min-h-screen lg:min-h-0">

        {/* Top nav bar */}
        <nav className="flex items-center justify-between px-6 sm:px-8 lg:justify-end lg:px-10" style={{ paddingTop: '24px', paddingBottom: '16px' }}>
          {/* Logo — only on mobile, hidden on desktop where left panel has it */}
          <a href="/" className="flex items-center gap-2 lg:hidden">
            <div className="w-10 h-10 bg-[#3D85C6] rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h10v16H4z" />
                <path d="M8 4V2" />
                <path d="M7 8h4M7 12h4" />
              </svg>
            </div>
            <span className="text-lg sm:text-xl font-bold text-gray-800">ImageCompress</span>
          </a>

          <button
            onClick={() => navigate('/')}
            className="bg-[#48BB78] hover:bg-[#38A169] text-white font-semibold rounded-full transition-colors"
            style={{ padding: '10px 32px', fontSize: '15px' }}
          >
            Try it Free
          </button>
        </nav>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 lg:px-16 xl:px-24 py-6 overflow-y-auto">
          <div className="w-full max-w-lg">

            {/* Heading */}
            <div className="text-center" style={{ marginBottom: '40px' }}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                {isSignup ? 'Hey,' : 'Welcome,'}
              </h1>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#48BB78] italic mt-2">
                {isSignup ? "let's get you started" : 'good to see you again'}
              </p>
            </div>

            {/* Email / Password Form */}
            <form onSubmit={handleEmailSubmit}>
              {isSignup && (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  style={{ marginBottom: '24px' }}
                  className="w-full px-6 py-5 sm:py-6 bg-gray-100 rounded-full text-center text-lg sm:text-xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3D85C6]/30 transition-all"
                />
              )}

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                style={{ marginBottom: '24px' }}
                className="w-full px-6 py-5 sm:py-6 bg-gray-100 rounded-full text-center text-lg sm:text-xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3D85C6]/30 transition-all"
              />

              <div className="relative" style={{ marginBottom: '40px' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  minLength={6}
                  className="w-full px-6 py-5 sm:py-6 bg-gray-100 rounded-full text-center text-lg sm:text-xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3D85C6]/30 transition-all pr-16"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>

              {error && (
                <p className="text-red-500 text-sm sm:text-base bg-red-50 px-5 py-3 rounded-full text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{ padding: '6px 0' }}
                className="w-full bg-[#1a202c] hover:bg-[#2d3748] text-white font-bold text-base sm:text-lg rounded-full transition-all duration-200 disabled:opacity-50"
              >
                {loading ? 'Please wait...' : isSignup ? 'Create account' : 'Login'}
              </button>
            </form>

            {/* Toggle */}
            <button
              onClick={() => { setIsSignup(!isSignup); setError(''); }}
              style={{ marginTop: '28px' }}
              className="block mx-auto text-gray-500 text-base sm:text-lg hover:text-gray-700 underline underline-offset-4 transition-colors"
            >
              {isSignup ? 'I already have an account, sign in' : "I don't have an account, sign up"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4" style={{ margin: '32px 0' }}>
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-gray-400 text-sm sm:text-base font-medium">Instant Login</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Google Login */}
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 px-8 py-4 border border-gray-300 rounded-full hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="font-semibold text-base sm:text-lg text-gray-700">Continue with Google</span>
            </button>
          </div>
        </div>

        {/* Footer — bottom of right panel */}
        <div className="flex items-center justify-center" style={{ padding: '24px 0' }}>
          <p className="text-gray-500 text-lg sm:text-xl font-bold">Made with <span className="text-red-500">❤️</span></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
