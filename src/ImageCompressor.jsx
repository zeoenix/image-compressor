import React, { useState, useCallback } from 'react';
import imageCompression from 'browser-image-compression';

// Compression targets as percentage of original size
const compressionTargets = {
  low: 0.75,      // Keep 75% (reduce ~25%)
  medium: 0.50,   // Keep 50% (reduce ~50%)
  high: 0.10,     // Keep 10% (reduce ~90%)
};

// Reusable Header Component
const Header = () => (
  <header className="border-b border-gray-200 bg-white py-4 px-8">
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-3">
        <svg className="w-9 h-9 text-[#3D85C6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h10v16H4z" />
          <path d="M8 4V2" />
          <path d="M7 8h4M7 12h4" />
          <path d="M18 8l-4 4 4 4" />
          <path d="M14 12h6" />
          <path d="M20 6v12" />
        </svg>
        <span className="text-xl font-bold text-gray-800">ImageCompress</span>
      </div>
      <div className="flex items-center gap-5">
        <button className="text-gray-700 font-medium hover:text-blue-600 transition-colors">
          Login
        </button>
        <button className="px-6 py-2.5 bg-[#3D85C6] text-white font-semibold rounded-lg hover:bg-[#2E6BA6] transition-colors">
          Sign up
        </button>
      </div>
    </div>
  </header>
);

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

  const handleImageUpload = (event) => {
    const imageFile = event.target.files[0];
    if (imageFile) {
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
    } catch (error) {
      console.error('Error compressing image:', error);
      alert('Failed to compress image. Please try again.');
    } finally {
      setIsCompressing(false);
    }
  }, [originalImage, compressionLevel, customTargetKB]);

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
            
            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4">
              <button
                onClick={downloadCompressedImage}
                className="px-16 py-5 bg-green-500 hover:bg-green-600 text-white font-bold text-xl rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-3"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    </div>
  );
};

export default ImageCompressor;