import React, { useState, useCallback, useEffect } from 'react';
import imageCompression from 'browser-image-compression';
import { useAuth } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Compression targets as percentage of original size
const compressionTargets = {
  low: 0.75,      // Keep 75% (reduce ~25%)
  medium: 0.50,   // Keep 50% (reduce ~50%)
  high: 0.10,     // Keep 10% (reduce ~90%)
};

// Reusable Header Component
const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="border-b border-gray-200 bg-white" style={{ paddingLeft: '40px', paddingRight: '48px', paddingTop: '20px', paddingBottom: '20px' }}>
      <div className="flex items-center justify-between w-full">
        <a href="/" className="flex items-center gap-3 cursor-pointer">
          <img src={require('./assets/image/pen.png')} alt="Logo" className="w-9 h-9 object-contain" />
          <span className="text-xl font-bold text-gray-800">ImageCompress</span>
        </a>
        <div className="flex items-center gap-5">
          {user ? (
            <>
              <div className="flex items-center gap-3">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" className="w-9 h-9 rounded-full border-2 border-gray-200" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#3D85C6] flex items-center justify-center text-white font-bold text-sm">
                    {(user.displayName || user.email || '?')[0].toUpperCase()}
                  </div>
                )}
                <span className="text-gray-700 font-medium hidden sm:block">
                  {user.displayName || user.email}
                </span>
              </div>
              <button
                onClick={logout}
                className="px-5 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2.5 text-[#3D85C6] font-semibold rounded-full hover:bg-blue-50 transition-all duration-300 flex items-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                  <polyline points="10 17 15 12 10 7"/>
                  <line x1="15" y1="12" x2="3" y2="12"/>
                </svg>
                Login
              </button>
              <button
                onClick={() => navigate('/login')}
                className="bg-[#3D85C6] text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:bg-[#2E6BA6] hover:scale-105 transition-all duration-300 flex items-center gap-2"
                style={{ padding: '10px 48px' }}
              >
                Sign up
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

// Reusable Footer Component
const Footer = () => (
  <footer className="border-t border-gray-200 bg-white py-4 px-6">
    <p className="text-center text-gray-400 text-base font-medium">Made with <span className="text-red-500">❤️</span></p>
  </footer>
);

const ImageCompressor = () => {
  const [originalImage, setOriginalImage] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [compressionLevel, setCompressionLevel] = useState('medium');
  const [isCompressing, setIsCompressing] = useState(false);
  const [fileName, setFileName] = useState('');
  const [customTargetKB, setCustomTargetKB] = useState('');
  const [showSignInPopup, setShowSignInPopup] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  // Check if user is a verified/genuine user
  // Google users are always verified; email users must verify email
  const isVerifiedUser = user && (
    user.providerData[0]?.providerId === 'google.com' || user.emailVerified
  );

  // Get how many free compressions have been used
  const getFreeUsageCount = () => {
    return parseInt(localStorage.getItem('freeCompressions') || '0', 10);
  };

  const incrementFreeUsage = () => {
    const current = getFreeUsageCount();
    localStorage.setItem('freeCompressions', String(current + 1));
  };

  const handleImageUpload = (event) => {
    const imageFile = event.target.files[0];
    if (imageFile) {
      // If not a verified user and already used free compression, show popup
      if (!isVerifiedUser && getFreeUsageCount() >= 1) {
        setShowSignInPopup(true);
        event.target.value = ''; // Reset file input
        return;
      }

      setOriginalImage(imageFile);
      setFileName(imageFile.name);
      setOriginalSize((imageFile.size / 1024 / 1024).toFixed(2));
      setCompressedImage(null);
      setCompressedSize(0);
    }
  };

  const compressImage = useCallback(async () => {
    if (!originalImage) return;

    setIsCompressing(true);
    try {
      let targetSizeMB;
      const originalSizeMB = originalImage.size / 1024 / 1024;
      
      if (compressionLevel === 'custom') {
        // User specified exact KB target
        const targetKB = parseInt(customTargetKB) || 100;
        targetSizeMB = targetKB / 1024;
      } else {
        // Calculate target based on percentage of original
        const targetPercentage = compressionTargets[compressionLevel];
        targetSizeMB = originalSizeMB * targetPercentage;
      }

      // Ensure minimum quality threshold
      const minSizeMB = compressionLevel === 'high' ? 0.05 : 0.01; // 50KB min for high
      targetSizeMB = Math.max(targetSizeMB, minSizeMB);

      const options = {
        maxSizeMB: targetSizeMB,
        maxWidthOrHeight: compressionLevel === 'high' ? 1920 : 2560,
        useWebWorker: true,
        preserveExif: true,
      };

      const compressedFile = await imageCompression(originalImage, options);
      setCompressedImage(compressedFile);
      setCompressedSize((compressedFile.size / 1024 / 1024).toFixed(2));

      // Track free usage for non-verified users
      if (!isVerifiedUser) {
        incrementFreeUsage();
      }
    } catch (error) {
      console.error('Error compressing image:', error);
      alert('Failed to compress image. Please try again.');
    } finally {
      setIsCompressing(false);
    }
  }, [originalImage, compressionLevel, customTargetKB, isVerifiedUser]);

  // Sign In Popup Modal
  const SignInPopup = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white shadow-2xl max-w-md w-full mx-4 overflow-hidden" style={{ borderRadius: '24px' }}>
        {/* Top accent */}
        <div className="bg-[#3D85C6]" style={{ height: '6px', borderRadius: '24px 24px 0 0' }}></div>
        <div style={{ padding: '40px 32px 32px' }} className="text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto" style={{ marginBottom: '20px' }}>
            <svg className="w-8 h-8 text-[#3D85C6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-900" style={{ marginBottom: '8px' }}>You've used your free try!</h2>
          <p className="text-gray-500" style={{ marginBottom: '28px' }}>Sign in or create an account to compress unlimited images for free.</p>

          {/* Buttons */}
          <button
            onClick={() => { setShowSignInPopup(false); navigate('/login'); }}
            className="w-full bg-[#3D85C6] text-white font-semibold rounded-full hover:bg-[#2E6BA6] transition-all duration-200 flex items-center justify-center gap-2"
            style={{ padding: '14px 0', marginBottom: '12px' }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
              <polyline points="10 17 15 12 10 7"/>
              <line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
            Sign in
          </button>
          <button
            onClick={() => { setShowSignInPopup(false); navigate('/login'); }}
            className="w-full border-2 border-gray-200 text-gray-700 font-semibold rounded-full hover:border-[#3D85C6] hover:text-[#3D85C6] hover:bg-blue-50 transition-all duration-200"
            style={{ padding: '14px 0', marginBottom: '16px' }}
          >
            Create an account
          </button>
          <button
            onClick={() => setShowSignInPopup(false)}
            className="text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );

  const downloadCompressedImage = () => {
    if (!compressedImage) return;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(compressedImage);
    link.download = `compressed_${compressionLevel}_${fileName}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const resetAll = () => {
    setOriginalImage(null);
    setCompressedImage(null);
    setOriginalSize(0);
    setCompressedSize(0);
    setFileName('');
  };

  const savedPercentage = originalSize > 0 ? ((1 - compressedSize / originalSize) * 100).toFixed(0) : 0;

  const originalSizeKB = Math.round(originalSize * 1024);
  
  const levelOptions = [
    { name: 'Low', value: 'low', desc: `Reduce ~25% → ~${Math.round(originalSizeKB * 0.75)}KB`, color: 'emerald' },
    { name: 'Medium', value: 'medium', desc: `Reduce ~50% → ~${Math.round(originalSizeKB * 0.50)}KB`, color: 'blue' },
    { name: 'High', value: 'high', desc: `Reduce ~90% → ~${Math.round(originalSizeKB * 0.10)}KB`, color: 'amber' },
    { name: 'Custom', value: 'custom', desc: 'Choose your target size', color: 'purple' },
  ];

  // Initial state - no image uploaded
  if (!originalImage) {
    return (
      <div className="min-h-screen w-full bg-white flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center px-6 -mt-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Compress IMAGE</h1>
          <p className="text-gray-600 text-lg text-center mb-2 max-w-2xl">
            Compress <span className="text-blue-500 font-medium cursor-pointer hover:underline">JPG</span>, 
            <span className="text-blue-500 font-medium cursor-pointer hover:underline"> PNG</span>, 
            <span className="text-blue-500 font-medium cursor-pointer hover:underline"> SVG</span> or 
            <span className="text-blue-500 font-medium cursor-pointer hover:underline"> GIF</span> with the best quality and compression.
          </p>
          <p className="text-gray-600 text-lg text-center mb-3">
            Reduce the filesize of your images at once.
          </p>
          <p className="text-[#3D85C6] font-semibold text-lg text-center mb-10">
            ✨ Compress without reducing image quality!
          </p>

          <div 
            className="rounded-2xl px-16 py-10 transition-colors"
            style={{ 
              border: '2px dashed #c4c4c4',
              backgroundColor: '#f5f5f5'
            }}
          >
            <label
              htmlFor="file-upload"
              className="block text-center cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl text-white font-semibold text-xl"
              style={{
                padding: '20px 120px',
                backgroundColor: '#5B8DD9',
                borderRadius: '12px',
              }}
            >
              Select images
              <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
            <p className="text-gray-400 mt-6 text-sm text-center">or drop images here</p>
          </div>
        </main>
        <Footer />
        {showSignInPopup && <SignInPopup />}
      </div>
    );
  }

  // Compressed state - show results
  if (compressedImage) {
    return (
      <div className="min-h-screen w-full bg-white flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center px-6 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Your IMAGE has been compressed!</h1>

          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={resetAll}
              className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            
            <div className="bg-green-50 rounded-2xl" style={{ border: '2px solid #bbf7d0', padding: '20px' }}>
              <button
                onClick={downloadCompressedImage}
                className="bg-green-500 hover:bg-green-600 text-white font-bold text-2xl rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-4"
                style={{ padding: '24px 64px' }}
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download compressed IMAGE
              </button>
            </div>
          </div>

          {/* Stats Circle */}
          <div className="flex items-center gap-8 mb-10">
            <div className="relative w-28 h-28">
              <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8"/>
                <circle 
                  cx="50" cy="50" r="45" fill="none" stroke="#3b82f6" strokeWidth="8"
                  strokeDasharray={`${savedPercentage * 2.83} 283`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">{savedPercentage}%</span>
                <span className="text-xs text-gray-500 uppercase">Saved</span>
              </div>
            </div>
            
            <div className="text-left">
              <p className="text-gray-600 text-lg">Your Image is now <span className="font-bold text-gray-900">{savedPercentage}%</span> smaller!</p>
              <p className="text-gray-500">{originalSize} MB → {compressedSize} MB</p>
            </div>
          </div>

          {/* Image Preview */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 max-w-md shadow-sm">
            <img
              src={URL.createObjectURL(compressedImage)}
              alt="Compressed"
              className="max-w-full max-h-64 object-contain rounded-lg mx-auto"
            />
            <p className="text-center text-gray-500 text-sm mt-2 truncate">{fileName}</p>
          </div>
        </main>
        <Footer />
        {showSignInPopup && <SignInPopup />}
      </div>
    );
  }

  // Image uploaded - show image with compression options in sidebar
  return (
    <div className="min-h-screen w-full bg-white flex flex-col">
      <Header />

      <main className="flex-1 flex px-6 py-8">
        {/* Image Preview Area */}
        <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-xl mr-6 border border-gray-200">
          <div className="relative">
            <div className="p-6">
              <img
                src={URL.createObjectURL(originalImage)}
                alt="Original"
                className="max-w-sm max-h-80 object-contain rounded-lg"
              />
              <p className="text-center text-gray-500 text-sm mt-3 truncate max-w-sm">{fileName}</p>
              <p className="text-center text-gray-400 text-xs mt-1">Original: {originalSize} MB</p>
            </div>
            {/* Image count badge */}
            <div className="absolute top-2 left-2 px-3 py-1 bg-[#3D85C6] rounded-full">
              <span className="text-white text-sm font-semibold">1 image</span>
            </div>
          </div>
        </div>

        {/* Right Sidebar with Compression Options */}
        <div className="w-96 bg-white rounded-xl border border-gray-200 p-6 flex flex-col">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Compress images</h2>
          <p className="text-gray-500 text-sm mb-6">Select compression level</p>
          
          {/* Compression Level Options */}
          <div className="space-y-3 mb-6">
            {levelOptions.map((item) => (
              <button 
                key={item.value}
                onClick={() => setCompressionLevel(item.value)}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                  compressionLevel === item.value 
                    ? item.color === 'emerald' ? 'border-emerald-500 bg-emerald-50' :
                      item.color === 'blue' ? 'border-blue-500 bg-blue-50' :
                      item.color === 'amber' ? 'border-amber-500 bg-amber-50' :
                      'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-semibold ${
                      compressionLevel === item.value
                        ? item.color === 'emerald' ? 'text-emerald-700' :
                          item.color === 'blue' ? 'text-blue-700' :
                          item.color === 'amber' ? 'text-amber-700' : 'text-purple-700'
                        : 'text-gray-800'
                    }`}>{item.name}</p>
                    <p className="text-gray-500 text-sm">{item.desc}</p>
                  </div>
                  {compressionLevel === item.value && (
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      item.color === 'emerald' ? 'bg-emerald-500' :
                      item.color === 'blue' ? 'bg-blue-500' :
                      item.color === 'amber' ? 'bg-amber-500' : 'bg-purple-500'
                    }`}>
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Custom KB Input */}
          {compressionLevel === 'custom' && (
            <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-xl">
              <label className="block text-purple-800 font-semibold mb-2">Target size (KB)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={customTargetKB}
                  onChange={(e) => setCustomTargetKB(e.target.value)}
                  placeholder={`e.g., ${Math.round(originalSizeKB * 0.1)}`}
                  className="flex-1 px-4 py-3 border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:outline-none text-lg font-medium"
                />
                <span className="text-purple-600 font-semibold">KB</span>
              </div>
              <p className="text-purple-600 text-sm mt-2">Original: {originalSizeKB} KB</p>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-sm">
              Your image will be compressed with the selected quality level.
            </p>
          </div>

          {/* Spacer */}
          <div className="flex-1"></div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={compressImage}
              disabled={isCompressing}
              className="w-full py-4 bg-[#3D85C6] hover:bg-[#2E6BA6] text-white font-semibold text-lg rounded-lg transition-all duration-200 shadow-md flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isCompressing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Compressing...
                </>
              ) : (
                <>
                  Compress IMAGE
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
            
            <button
              onClick={resetAll}
              className="w-full py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </main>

      <Footer />
      {showSignInPopup && <SignInPopup />}
    </div>
  );
};

export default ImageCompressor;