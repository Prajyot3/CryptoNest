"use client"
import { useState, useEffect } from 'react';

// ========================= Icons & SVGs =========================
const ShieldIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const LockIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const UnlockIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
  </svg>
);

const KeyIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
  </svg>
);

const SettingsIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const DocumentIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const UploadIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const DownloadIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const CopyIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
  </svg>
);

const ArrowLeftIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const CheckCircleIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const XCircleIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const EyeIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeSlashIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
  </svg>
);

const MenuIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// Custom logo for CryptoNest (Nest with a Microchip inside)
const NestChipLogo = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 32H8M56 32H48M32 16V8M32 56V48" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <path d="M12 28C12 18 20 12 32 12C44 12 52 18 52 28C52 40 42 50 32 50C22 50 12 40 12 28Z" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none"/>
    <path d="M18 36C22 42 30 44 32 44C38 44 44 40 46 34" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M22 24C28 20 36 20 42 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    <rect x="24" y="24" width="16" height="16" rx="3" fill="currentColor" stroke="currentColor" strokeWidth="2"/>
    <circle cx="29" cy="29" r="1.5" fill="#0f172a" />
    <circle cx="35" cy="29" r="1.5" fill="#0f172a" />
    <circle cx="29" cy="35" r="1.5" fill="#0f172a" />
    <circle cx="35" cy="35" r="1.5" fill="#0f172a" />
  </svg>
);

export default function FileProcessor() {
  const [currentStep, setCurrentStep] = useState('choice'); // 'choice', 'encrypt', 'decrypt', 'keygen', 'manage'
  const [selectedFile, setSelectedFile] = useState(null);
  const [encryptionMethod, setEncryptionMethod] = useState('hybrid'); // 'hybrid', 'password'
  const [key, setKey] = useState(''); // Password
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [keyGenLoading, setKeyGenLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [operationStatus, setOperationStatus] = useState(null); // 'success', 'error'
  const [isDragging, setIsDragging] = useState(false);
  const [flowStep, setFlowStep] = useState(1); // Step tracker (1: File, 2: Keys/Setup, 3: Completed)
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Manage Keys variables
  const [manageKeyInput, setManageKeyInput] = useState('');
  const [manageKeyType, setManageKeyType] = useState(null); // 'public', 'private', 'invalid'

  // Mobile navigation drawer toggle
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  // Helper for password strength validation
  useEffect(() => {
    if (encryptionMethod === 'password') {
      let score = 0;
      if (key.length >= 6) score++;
      if (key.length >= 10) score++;
      if (/[A-Z]/.test(key)) score++;
      if (/[0-9]/.test(key)) score++;
      if (/[^A-Za-z0-9]/.test(key)) score++;
      setPasswordStrength(score);
    }
  }, [key, encryptionMethod]);

  // Key analyzer for "Manage Keys" tab
  useEffect(() => {
    const trimmed = manageKeyInput.trim();
    if (!trimmed) {
      setManageKeyType(null);
      return;
    }
    if (trimmed.includes('BEGIN PUBLIC KEY')) {
      setManageKeyType('public');
    } else if (trimmed.includes('BEGIN PRIVATE KEY') || trimmed.includes('BEGIN RSA PRIVATE KEY')) {
      setManageKeyType('private');
    } else {
      setManageKeyType('invalid');
    }
  }, [manageKeyInput]);

  // Sync theme check on mount
  useEffect(() => {
    try {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkTheme(isDark);
    } catch(e) {}
  }, []);

  const handleThemeToggle = () => {
    // Triggers global theme toggler inside layout.js
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.click();
      setTimeout(() => {
        try {
          const isDark = document.documentElement.classList.contains('dark');
          setIsDarkTheme(isDark);
        } catch(e) {}
      }, 50);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setKey('');
    setPublicKey('');
    setPrivateKey('');
    setShowKey(false);
    setMessage('');
    setOperationStatus(null);
    setFlowStep(1);
    setManageKeyInput('');
    setManageKeyType(null);
  };

  const navigateTo = (step) => {
    setCurrentStep(step);
    resetForm();
    setIsMenuOpen(false); // Auto close menu drawer
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setMessage('');
      setOperationStatus(null);
      setFlowStep(2); // Auto proceed to step 2 after file upload
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setMessage('');
      setOperationStatus(null);
      setFlowStep(2);
    }
  };

  // Generate RSA Key Pair
  const handleGenerateKeys = async () => {
    setKeyGenLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/keygen', {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Key generation failed');
      }
      const data = await response.json();
      setPublicKey(data.publicKey);
      setPrivateKey(data.privateKey);
      setMessage('New 2048-bit RSA key pair generated successfully!');
      setOperationStatus('success');
    } catch (error) {
      console.error(error);
      setMessage('Failed to generate keys. Make sure server is running.');
      setOperationStatus('error');
    } finally {
      setKeyGenLoading(false);
    }
  };

  const downloadKey = (keyContent, filename) => {
    const blob = new Blob([keyContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const copyToClipboard = async (text, successMsg = 'Copied key to clipboard!') => {
    try {
      await navigator.clipboard.writeText(text);
      const originalMessage = message;
      setMessage(successMsg);
      setTimeout(() => setMessage(originalMessage), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const downloadFile = (data, filename) => {
    const blob = new Blob([data], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 100);
  };

  // Main Action: Encrypt/Decrypt
  const handleProcess = async () => {
    if (!selectedFile) {
      setMessage('Please select a file first.');
      setOperationStatus('error');
      return;
    }

    const isEncrypt = currentStep === 'encrypt';

    // Validations
    if (encryptionMethod === 'password') {
      if (!key.trim()) {
        setMessage('Please enter an encryption password.');
        setOperationStatus('error');
        return;
      }
    } else {
      if (isEncrypt && !publicKey.trim()) {
        setMessage('Please provide an RSA Public Key for encryption.');
        setOperationStatus('error');
        return;
      }
      if (!isEncrypt && !privateKey.trim()) {
        setMessage('Please provide an RSA Private Key for decryption.');
        setOperationStatus('error');
        return;
      }
      if (isEncrypt && publicKey.includes('PRIVATE KEY')) {
        setMessage('Error: You pasted a PRIVATE key into the Public Key field. For encryption, you must use the PUBLIC key.');
        setOperationStatus('error');
        return;
      }
      if (!isEncrypt && privateKey.includes('PUBLIC KEY') && !privateKey.includes('PRIVATE KEY')) {
        setMessage('Error: You pasted a PUBLIC key into the Private Key field. For decryption, you must use the PRIVATE key.');
        setOperationStatus('error');
        return;
      }
    }

    setLoading(true);
    setMessage('');
    setOperationStatus(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('method', encryptionMethod);

      if (encryptionMethod === 'password') {
        formData.append('key', key.trim());
      } else {
        if (isEncrypt) {
          formData.append('publicKey', publicKey.trim());
        } else {
          formData.append('privateKey', privateKey.trim());
        }
      }

      const endpoint = isEncrypt ? '/api/encrypt' : '/api/decrypt';
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Crypto process failed.');
      }

      const arrayBuffer = await response.arrayBuffer();
      const fileBytes = new Uint8Array(arrayBuffer);

      let outputName = selectedFile.name;
      if (isEncrypt) {
        outputName += '.enc';
      } else {
        if (outputName.endsWith('.enc')) {
          outputName = outputName.slice(0, -4);
        } else {
          outputName = 'decrypted_' + outputName;
        }
      }

      downloadFile(fileBytes, outputName);
      setMessage(`Success! Your file has been ${isEncrypt ? 'encrypted' : 'decrypted'} and downloaded as "${outputName}".`);
      setOperationStatus('success');
      setFlowStep(3);
    } catch (error) {
      console.error(error);
      setMessage(`Error: ${error.message}`);
      setOperationStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthLabel = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return { label: 'Weak', color: 'bg-red-500' };
      case 2:
      case 3:
        return { label: 'Medium', color: 'bg-amber-500' };
      case 4:
      case 5:
        return { label: 'Strong', color: 'bg-emerald-500' };
      default:
        return { label: '', color: 'bg-gray-300' };
    }
  };

  // Flow Title
  const isEncrypt = currentStep === 'encrypt';
  const flowTitle = isEncrypt ? 'Encrypt Files' : 'Decrypt Files';

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 dark:bg-[#070e1e] text-slate-800 dark:text-slate-100 transition-colors duration-500 relative overflow-x-hidden font-sans selection:bg-cyan-500/30">
      
      {/* Background neon flares */}
      <div className="absolute top-0 right-0 w-[60%] h-[40%] bg-blue-400/5 dark:bg-blue-900/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-indigo-400/5 dark:bg-indigo-950/15 rounded-full blur-[180px] pointer-events-none"></div>

      {/* ========================= HEADER NAVIGATION ========================= */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#0b1326]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/60 transition-all text-slate-800 dark:text-slate-100">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          
          {/* Left: Logo */}
          <div 
            onClick={() => navigateTo('choice')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00bfa5] to-cyan-400 flex items-center justify-center shadow-md shadow-cyan-500/25 group-hover:scale-105 transition-transform duration-300">
              <NestChipLogo className="w-6 h-6 text-slate-900" />
            </div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-50 dark:to-slate-200 bg-clip-text text-transparent">
              CryptoNest
            </span>
          </div>

          {/* Center: Desktop Navigation Links (hidden on mobile/tablet) */}
          <nav className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => navigateTo('encrypt')}
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-all relative ${currentStep === 'encrypt' ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/20' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'}`}
            >
              Encrypt Files
              {currentStep === 'encrypt' && <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-cyan-600 dark:bg-cyan-400 rounded-full"></span>}
            </button>
            <button
              onClick={() => navigateTo('decrypt')}
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-all relative ${currentStep === 'decrypt' ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/20' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'}`}
            >
              Decrypt Files
              {currentStep === 'decrypt' && <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-cyan-600 dark:bg-cyan-400 rounded-full"></span>}
            </button>
            <button
              onClick={() => navigateTo('keygen')}
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-all relative ${currentStep === 'keygen' ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/20' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'}`}
            >
              Generate Keys
              {currentStep === 'keygen' && <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-cyan-600 dark:bg-cyan-400 rounded-full"></span>}
            </button>
            <button
              onClick={() => navigateTo('manage')}
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-all relative ${currentStep === 'manage' ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/20' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'}`}
            >
              Manage Keys
              {currentStep === 'manage' && <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-cyan-600 dark:bg-cyan-400 rounded-full"></span>}
            </button>
          </nav>

          {/* Right: Mobile Hamburger Icon + Theme Toggle */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleThemeToggle}
              className="p-2.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-200 transition"
              title="Toggle theme"
            >
              {isDarkTheme ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.364 17.636l-.707.707M18.364 17.636l-.707-.707M6.364 6.364l-.707-.707M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            <button
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden p-2.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-200 transition"
            >
              <MenuIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* ========================= MOBILE MENU DRAWER OVERLAY ========================= */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm lg:hidden transition-opacity">
          <div className="absolute inset-0" onClick={() => setIsMenuOpen(false)}></div>
          
          <div className="relative w-80 max-w-[85vw] h-full bg-white dark:bg-[#0a1122] border-l border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-2xl z-10 animate-slide-in">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800/80 mb-6">
                <span className="text-sm font-extrabold text-slate-400 uppercase tracking-wider">MENU</span>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-800 dark:hover:text-white transition"
                >
                  <CloseIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => navigateTo('encrypt')}
                  className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl font-semibold text-left transition ${currentStep === 'encrypt' ? 'bg-cyan-50 dark:bg-cyan-950/20 text-cyan-600 dark:text-cyan-400' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/60'}`}
                >
                  <LockIcon className="w-5 h-5 text-cyan-500" />
                  <span>Encrypt Files</span>
                </button>
                <button
                  onClick={() => navigateTo('decrypt')}
                  className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl font-semibold text-left transition ${currentStep === 'decrypt' ? 'bg-cyan-50 dark:bg-cyan-950/20 text-cyan-600 dark:text-cyan-400' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/60'}`}
                >
                  <UnlockIcon className="w-5 h-5 text-cyan-500" />
                  <span>Decrypt Files</span>
                </button>
                <button
                  onClick={() => navigateTo('keygen')}
                  className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl font-semibold text-left transition ${currentStep === 'keygen' ? 'bg-cyan-50 dark:bg-cyan-950/20 text-cyan-600 dark:text-cyan-400' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/60'}`}
                >
                  <KeyIcon className="w-5 h-5 text-cyan-500" />
                  <span>Generate Keys</span>
                </button>
                <button
                  onClick={() => navigateTo('manage')}
                  className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl font-semibold text-left transition ${currentStep === 'manage' ? 'bg-cyan-50 dark:bg-cyan-950/20 text-cyan-600 dark:text-cyan-400' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/60'}`}
                >
                  <SettingsIcon className="w-5 h-5 text-cyan-500" />
                  <span>Manage Keys</span>
                </button>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800/80">
              <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
                <span className="hover:text-slate-800 dark:hover:text-slate-300 cursor-pointer">Privacy Policy</span>
                <span>|</span>
                <span className="hover:text-slate-800 dark:hover:text-slate-300 cursor-pointer">Support</span>
              </div>
              <p className="text-3xs text-slate-500 leading-tight text-center">
                Cryptoside Security, absolute privacy
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================= MAIN CONTENT ========================= */}
      <main className="flex-grow z-10">

        {/* --- VIEW 1: choice (Home Dashboard) --- */}
        {currentStep === 'choice' && (
          <div className="space-y-12 py-8">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-cyan-50 via-indigo-50 to-blue-50 dark:from-blue-950/50 dark:via-[#101b33]/60 dark:to-slate-950 border border-slate-200 dark:border-slate-800/80 p-8 sm:p-12 text-center shadow-2xl">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>
                
                <h1 className="relative text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-4 max-w-2xl mx-auto">
                  Protect Your Files with Hybrid RSA + AES Encryption
                </h1>
                <p className="relative text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
                  Runs entirely locally for absolute privacy.
                </p>

                <div className="relative flex flex-col sm:flex-row items-center justify-center gap-3 max-w-sm mx-auto">
                  <button
                    onClick={() => navigateTo('encrypt')}
                    className="w-full sm:w-auto px-6 py-3 font-bold text-slate-900 bg-gradient-to-r from-[#00bfa5] to-cyan-400 rounded-xl shadow-lg active:scale-[0.98] transition-all text-xs sm:text-sm"
                  >
                    Encrypt Files
                  </button>
                  <button
                    onClick={() => navigateTo('keygen')}
                    className="w-full sm:w-auto px-6 py-3 font-bold text-white bg-gradient-to-r from-[#172545] to-[#253966] border border-slate-200 dark:border-slate-800 rounded-xl active:scale-[0.98] transition-all text-xs sm:text-sm"
                  >
                    Generate Keys
                  </button>
                </div>
              </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div onClick={() => navigateTo('encrypt')} className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850/60 text-slate-800 dark:text-slate-200 rounded-2xl p-5 shadow-md border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 cursor-pointer transform hover:-translate-y-1 transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 text-slate-700 dark:text-cyan-400"><LockIcon className="w-5 h-5" /></div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-1">Encrypt Files</h3>
                  <p className="text-3xs text-slate-500 dark:text-slate-400 leading-normal">Secure documents, photos, archives</p>
                </div>
                <div onClick={() => navigateTo('decrypt')} className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850/60 text-slate-800 dark:text-slate-200 rounded-2xl p-5 shadow-md border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 cursor-pointer transform hover:-translate-y-1 transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 text-slate-700 dark:text-cyan-400"><UnlockIcon className="w-5 h-5" /></div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-1">Decrypt Files</h3>
                  <p className="text-3xs text-slate-500 dark:text-slate-400 leading-normal">Restore .enc files safely</p>
                </div>
                <div onClick={() => navigateTo('keygen')} className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850/60 text-slate-800 dark:text-slate-200 rounded-2xl p-5 shadow-md border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 cursor-pointer transform hover:-translate-y-1 transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 text-slate-700 dark:text-cyan-400"><KeyIcon className="w-5 h-5" /></div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-1">Key Generator</h3>
                  <p className="text-3xs text-slate-500 dark:text-slate-400 leading-normal">One-click RSA key pairs</p>
                </div>
                <div onClick={() => navigateTo('manage')} className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850/60 text-slate-800 dark:text-slate-200 rounded-2xl p-5 shadow-md border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 cursor-pointer transform hover:-translate-y-1 transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 text-slate-700 dark:text-cyan-400"><SettingsIcon className="w-5 h-5" /></div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-1">Manage Keys</h3>
                  <p className="text-3xs text-slate-500 dark:text-slate-400 leading-normal">Handle public/private PEM files</p>
                </div>
              </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6">
              <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-grow h-[1px] bg-slate-200 dark:bg-slate-800"></div>
                  <h2 className="text-xs sm:text-sm font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">How It Works</h2>
                  <div className="flex-grow h-[1px] bg-slate-200 dark:bg-slate-800"></div>
                </div>

                <div className="hidden md:grid md:grid-cols-3 items-center gap-6">
                  <div className="bg-white dark:bg-[#0f1b33]/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm dark:shadow-none">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-900/60 text-cyan-500 dark:text-cyan-400 flex items-center justify-center mb-4 border border-slate-200 dark:border-slate-800"><UploadIcon className="w-6 h-6" /></div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Upload File</h3>
                  </div>
                  <div className="bg-white dark:bg-[#0f1b33]/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm dark:shadow-none">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-900/60 text-cyan-500 dark:text-cyan-400 flex items-center justify-center mb-4 border border-slate-200 dark:border-slate-800"><LockIcon className="w-6 h-6" /></div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Choose Encryption</h3>
                  </div>
                  <div className="bg-white dark:bg-[#0f1b33]/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm dark:shadow-none">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-900/60 text-cyan-500 dark:text-cyan-400 flex items-center justify-center mb-4 border border-slate-200 dark:border-slate-800"><DownloadIcon className="w-6 h-6" /></div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Download Encrypted</h3>
                  </div>
                </div>

                <div className="block md:hidden space-y-4">

                  <div className="h-4 w-[2px] bg-slate-800 mx-auto"></div>

                  {/* Mobile Step 3 */}
                  <div className="flex flex-col items-center text-center bg-[#0a1122]/60 border border-slate-800/60 rounded-2xl p-6 relative">
                    <div className="absolute top-4 left-4 w-7 h-7 bg-cyan-400 text-slate-950 rounded-lg flex items-center justify-center text-xs font-black shadow-sm shadow-cyan-500/20">
                      3
                    </div>
                    <span className="text-sm font-bold text-white mb-1 block mt-2">Download Encrypted</span>
                    <span className="text-xs text-slate-400 mb-3">Get your secure file</span>
                  </div>

                </div>
              </div>
            </div>

          </div>
        )}

        {/* --- VIEW 2: keygen (Key Generator Screen - matches Screen 3 layout) --- */}
        {currentStep === 'keygen' && (
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-md mx-auto bg-white dark:bg-[#0b1326]/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
              
              {/* Back Arrow */}
              <button
                onClick={() => navigateTo('choice')}
                className="absolute top-6 left-6 text-slate-500 hover:text-slate-300 flex items-center gap-1.5 transition text-xs sm:text-sm font-semibold"
              >
                <ArrowLeftIcon className="w-4 h-4" /> Back
              </button>

              <div className="border-b border-slate-800 pb-5 mb-6 pt-8 text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">Generate RSA Key Pair</h1>
                <p className="text-slate-400 text-xs mt-1">
                  Create a 2048-bit RSA key pair for secure encryption
                </p>
              </div>

              {message && (
                <div className={`p-4 mb-6 rounded-2xl border text-xs flex items-center ${operationStatus === 'success' ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-400' : 'bg-red-950/20 border-red-900/40 text-red-400'}`}>
                  {operationStatus === 'success' ? <CheckCircleIcon className="w-4 h-4 mr-2.5 flex-shrink-0" /> : <XCircleIcon className="w-4 h-4 mr-2.5 flex-shrink-0" />}
                  <span className="break-all">{message}</span>
                </div>
              )}

              {/* Action Buttons list layout (Screen 3 design) */}
              <div className="space-y-4">
                
                {/* Generate Keys main button */}
                <button
                  onClick={handleGenerateKeys}
                  disabled={keyGenLoading}
                  className="w-full py-4 px-6 text-slate-900 font-extrabold text-sm sm:text-base bg-gradient-to-r from-[#00bfa5] to-cyan-400 rounded-2xl hover:from-cyan-400 hover:to-[#00bfa5] shadow-lg shadow-cyan-500/10 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {keyGenLoading ? 'Generating Keys...' : 'Generate Keys'}
                </button>

                {/* Public Key Card Button */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                  <div className="min-w-0">
                    <span className="block text-2xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Download Public Key</span>
                    <span className="block text-xs font-mono text-cyan-400 truncate max-w-[200px]">{publicKey ? 'public_key.pem' : 'Not generated'}</span>
                  </div>
                  <div className="flex space-x-1 flex-shrink-0">
                    <button
                      onClick={() => copyToClipboard(publicKey)}
                      disabled={!publicKey}
                      className="p-2 text-slate-500 hover:text-slate-200 disabled:opacity-30 transition"
                      title="Copy Key"
                    >
                      <CopyIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => downloadKey(publicKey, 'public_key.pem')}
                      disabled={!publicKey}
                      className="p-2 text-slate-500 hover:text-slate-200 disabled:opacity-30 transition"
                      title="Download PEM"
                    >
                      <DownloadIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Private Key Card Button */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                  <div className="min-w-0">
                    <span className="block text-2xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Download Private Key</span>
                    <span className="block text-xs font-mono text-amber-500 truncate max-w-[200px]">{privateKey ? 'private_key.pem' : 'Not generated'}</span>
                  </div>
                  <div className="flex space-x-1 flex-shrink-0">
                    <button
                      onClick={() => copyToClipboard(privateKey)}
                      disabled={!privateKey}
                      className="p-2 text-slate-500 hover:text-slate-200 disabled:opacity-30 transition"
                      title="Copy Key"
                    >
                      <CopyIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => downloadKey(privateKey, 'private_key.pem')}
                      disabled={!privateKey}
                      className="p-2 text-slate-500 hover:text-slate-200 disabled:opacity-30 transition"
                      title="Download PEM"
                    >
                      <DownloadIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* --- VIEW 3: manage (Manage Keys Screen) --- */}
        {currentStep === 'manage' && (
          <div className="container mx-auto px-4 sm:px-6 py-8">
            <div className="max-w-3xl mx-auto bg-white dark:bg-[#0b1326]/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl relative">
              
              <button
                onClick={() => navigateTo('choice')}
                className="absolute top-6 left-6 text-slate-500 hover:text-slate-300 flex items-center gap-1.5 transition text-xs sm:text-sm font-semibold"
              >
                <ArrowLeftIcon className="w-4 h-4" /> Back
              </button>

              <div className="border-b border-slate-800 pb-6 mb-8 pt-8">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Key Manager & Validator</h1>
                <p className="text-slate-400 text-xs sm:text-sm mt-1">
                  Paste or load PEM files to analyze their compatibility, validity format, and secure copy.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Paste Key Content (PEM Format)
                  </label>
                  <textarea
                    value={manageKeyInput}
                    onChange={(e) => setManageKeyInput(e.target.value)}
                    placeholder="Paste public or private key PEM content here..."
                    rows={6}
                    className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-slate-100 text-3xs sm:text-xs font-mono focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition outline-none resize-none"
                  />
                </div>

                {manageKeyType && (
                  <div className={`p-5 rounded-2xl border text-sm ${
                    manageKeyType === 'public' 
                      ? 'bg-cyan-900/20 border-cyan-900/40 text-cyan-400' 
                      : manageKeyType === 'private' 
                        ? 'bg-amber-900/20 border-amber-900/40 text-amber-400' 
                        : 'bg-red-900/20 border-red-900/40 text-red-400'
                  }`}>
                    <div className="flex items-start">
                      <ShieldIcon className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">Key Validation Status</p>
                        <p className="text-xs mt-1">
                          {manageKeyType === 'public' && 'Valid public key PEM wrapper detected.'}
                          {manageKeyType === 'private' && 'Valid private key PEM wrapper detected. Handle with care!'}
                          {manageKeyType === 'invalid' && 'Invalid key format. Standard keys must begin with PEM header wrappers.'}
                        </p>
                        {manageKeyType !== 'invalid' && (
                          <div className="flex gap-3 mt-4">
                            <button
                              onClick={() => copyToClipboard(manageKeyInput, 'Key copied to clipboard!')}
                              className="text-3xs font-bold bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-800 transition"
                            >
                              Copy Key
                            </button>
                            <button
                              onClick={() => downloadKey(manageKeyInput, manageKeyType === 'public' ? 'public_key.pem' : 'private_key.pem')}
                              className="text-3xs font-bold bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-800 transition"
                            >
                              Download Key
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* --- VIEW 4 & 5: encrypt & decrypt (Encrypt/Decrypt Flow Screen) --- */}
        {(currentStep === 'encrypt' || currentStep === 'decrypt') && (
          <div className="container mx-auto px-4 sm:px-6 py-8">
            <div className="max-w-3xl mx-auto bg-white dark:bg-[#0b1326]/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl relative">
              
              <button
                onClick={() => navigateTo('choice')}
                className="absolute top-6 left-6 text-slate-500 hover:text-slate-300 flex items-center gap-1.5 transition text-xs sm:text-sm font-semibold"
              >
                <ArrowLeftIcon className="w-4 h-4" /> Back
              </button>

              {/* Steps Progress Tracker */}
              <div className="flex items-center justify-between mb-8 max-w-sm mx-auto relative pt-8">
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[1px] bg-slate-800 z-0"></div>
                
                <div className="z-10 flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${flowStep >= 1 ? 'bg-cyan-400 text-slate-900 border-cyan-400 shadow-md shadow-cyan-500/20' : 'bg-slate-900 text-slate-400 border-slate-800'}`}>
                    1
                  </div>
                  <span className="text-3xs sm:text-xs font-semibold text-slate-400 mt-1">Upload</span>
                </div>

                <div className="z-10 flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${flowStep >= 2 ? 'bg-cyan-400 text-slate-900 border-cyan-400 shadow-md shadow-cyan-500/20' : 'bg-slate-900 text-slate-400 border-slate-800'}`}>
                    2
                  </div>
                  <span className="text-3xs sm:text-xs font-semibold text-slate-400 mt-1">Configure</span>
                </div>

                <div className="z-10 flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${flowStep >= 3 ? 'bg-cyan-400 text-slate-900 border-cyan-400 shadow-md shadow-cyan-500/20' : 'bg-slate-900 text-slate-400 border-slate-800'}`}>
                    3
                  </div>
                  <span className="text-3xs sm:text-xs font-semibold text-slate-400 mt-1">Complete</span>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-1">{flowTitle}</h2>
              <p className="text-slate-400 text-xs sm:text-sm text-center mb-8">
                {isEncrypt ? 'Secure any file type using RSA keys or passwords' : 'Recover original data from encrypted .enc files'}
              </p>

              {message && (
                <div className={`p-4 mb-6 rounded-2xl border text-xs sm:text-sm flex items-center ${operationStatus === 'success' ? 'bg-emerald-900/20 border-emerald-900/40 text-emerald-400' : 'bg-red-900/20 border-red-900/40 text-red-400'}`}>
                  {operationStatus === 'success' ? <CheckCircleIcon className="w-5 h-5 mr-3 flex-shrink-0" /> : <XCircleIcon className="w-5 h-5 mr-3 flex-shrink-0" />}
                  <span className="break-all">{message}</span>
                </div>
              )}

              {flowStep === 1 && (
                <div className="space-y-6">
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all cursor-pointer ${isDragging ? 'border-cyan-400 bg-cyan-950/10' : 'border-slate-800 hover:border-slate-700 bg-slate-950/30'}`}
                  >
                    <input
                      type="file"
                      onChange={handleFileSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept={!isEncrypt ? ".enc" : undefined}
                    />
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-slate-900 text-slate-500 border border-slate-800 flex items-center justify-center">
                        <UploadIcon className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm sm:text-base md:text-lg text-slate-300">
                          Drag & drop your file here, or click to browse
                        </p>
                        <p className="text-slate-500 text-3xs sm:text-xs mt-1">
                          {isEncrypt ? 'Any file format supported' : 'Select a .enc encrypted file'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {flowStep === 2 && (
                <div className="space-y-6">
                  {selectedFile && (
                    <div className="flex items-center justify-between p-4 bg-slate-950/60 border border-slate-800 rounded-2xl">
                      <div className="flex items-center space-x-3 min-w-0">
                        <DocumentIcon className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-semibold text-xs sm:text-sm truncate pr-2">{selectedFile.name}</p>
                          <p className="text-3xs sm:text-xs text-slate-500">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => { setSelectedFile(null); setFlowStep(1); }}
                        className="text-2xs sm:text-xs font-bold text-red-400 hover:text-red-500 transition flex-shrink-0"
                      >
                        Change File
                      </button>
                    </div>
                  )}

                  <div>
                    <label className="block text-3xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Security Protocol
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <button
                        onClick={() => setEncryptionMethod('hybrid')}
                        className={`flex flex-row sm:flex-col items-center sm:justify-center p-3.5 sm:p-4 border rounded-2xl transition-all ${encryptionMethod === 'hybrid' ? 'border-cyan-400 bg-cyan-950/20 text-cyan-400' : 'border-slate-800 hover:bg-slate-900/40 text-slate-400'}`}
                      >
                        <KeyIcon className="w-5 h-5 sm:mb-2 mr-3 sm:mr-0 flex-shrink-0 text-cyan-400" />
                        <div className="text-left sm:text-center">
                          <span className="text-xs sm:text-sm font-bold block">RSA Asymmetric</span>
                          <span className="text-3xs text-slate-500 block sm:mt-0.5">Most Secure (PEM files)</span>
                        </div>
                      </button>

                      <button
                        onClick={() => setEncryptionMethod('password')}
                        className={`flex flex-row sm:flex-col items-center sm:justify-center p-3.5 sm:p-4 border rounded-2xl transition-all ${encryptionMethod === 'password' ? 'border-cyan-400 bg-cyan-950/20 text-cyan-400' : 'border-slate-800 hover:bg-slate-900/40 text-slate-400'}`}
                      >
                        <LockIcon className="w-5 h-5 sm:mb-2 mr-3 sm:mr-0 flex-shrink-0 text-cyan-400" />
                        <div className="text-left sm:text-center">
                          <span className="text-xs sm:text-sm font-bold block">Password Symmetric</span>
                          <span className="text-3xs text-slate-500 block sm:mt-0.5">Easy sharing (Secret phrase)</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {encryptionMethod === 'hybrid' ? (
                    <div className="space-y-4">
                      {isEncrypt ? (
                        <div>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                            <label className="block text-3xs font-bold text-slate-400 uppercase tracking-wider">
                              Recipient's RSA Public Key (PEM)
                            </label>
                            <button
                              onClick={handleGenerateKeys}
                              disabled={keyGenLoading}
                              className="text-3xs font-bold text-cyan-400 hover:underline inline-flex items-center self-start"
                            >
                              {keyGenLoading ? 'Generating...' : 'Auto-Generate Keys'}
                            </button>
                          </div>
                          <textarea
                            value={publicKey}
                            onChange={(e) => setPublicKey(e.target.value)}
                            placeholder="Paste standard public key here (starts with -----BEGIN PUBLIC KEY-----)"
                            rows={4}
                            className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-slate-100 text-3xs sm:text-xs font-mono focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition outline-none resize-none"
                          />
                          {publicKey && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              <button
                                onClick={() => copyToClipboard(publicKey)}
                                className="inline-flex items-center text-3xs font-bold text-slate-400 hover:text-slate-200 bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800"
                              >
                                Copy Public Key
                              </button>
                              <button
                                onClick={() => downloadKey(publicKey, 'public_key.pem')}
                                className="inline-flex items-center text-3xs font-bold text-slate-400 hover:text-slate-200 bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800"
                              >
                                Download Public Key
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          <label className="block text-3xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Your RSA Private Key (PEM)
                          </label>
                          <textarea
                            value={privateKey}
                            onChange={(e) => setPrivateKey(e.target.value)}
                            placeholder="Paste private key here (starts with -----BEGIN RSA PRIVATE KEY-----)"
                            rows={4}
                           className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-slate-100 text-3xs sm:text-xs font-mono focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition outline-none resize-none"
                          />
                          {privateKey && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              <button
                                onClick={() => copyToClipboard(privateKey)}
                                className="inline-flex items-center text-3xs font-bold text-slate-400 hover:text-slate-200 bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800"
                              >
                                Copy Private Key
                              </button>
                              <button
                                onClick={() => downloadKey(privateKey, 'private_key.pem')}
                                className="inline-flex items-center text-3xs font-bold text-slate-400 hover:text-slate-200 bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800"
                              >
                                Download Private Key
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-3xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                          Passphrase / Security Password
                        </label>
                        <div className="relative">
                          <input
                            type={showKey ? 'text' : 'password'}
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                            placeholder="Enter your security password"
                            className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-slate-100 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition outline-none pr-12 text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => setShowKey(!showKey)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-350 transition"
                          >
                            {showKey ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                          </button>
                        </div>
                        {isEncrypt && key.length > 0 && (
                          <div className="mt-2">
                            <div className="flex justify-between items-center text-3xs sm:text-xs mb-1">
                              <span className="text-slate-500">Password Strength:</span>
                              <span className="font-bold text-slate-300">{getPasswordStrengthLabel().label}</span>
                            </div>
                            <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all duration-300 ${getPasswordStrengthLabel().color}`}
                                style={{ width: `${(passwordStrength / 5) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setFlowStep(1)}
                      className="w-full sm:flex-1 py-3 px-6 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-2xl font-bold text-xs sm:text-sm text-slate-300 transition order-2 sm:order-1"
                    >
                      Previous Step
                    </button>
                    <button
                      type="button"
                      onClick={handleProcess}
                      disabled={loading}
                      className="w-full sm:flex-1 py-3 px-6 text-slate-900 font-bold text-xs sm:text-sm bg-gradient-to-r from-[#00bfa5] to-cyan-400 hover:from-cyan-400 hover:to-[#00bfa5] rounded-2xl shadow-lg active:scale-[0.99] transition-all disabled:opacity-50 inline-flex items-center justify-center order-1 sm:order-2"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-900" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>{isEncrypt ? 'Encrypt File' : 'Decrypt File'}</>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {flowStep === 3 && (
                <div className="text-center py-6 space-y-6">
                  <div className="w-14 h-14 rounded-full bg-emerald-900/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-900/40">
                    <CheckCircleIcon className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Operation Successful!</h3>
                    <p className="text-slate-400 text-xs sm:text-sm mt-1.5 max-w-xs mx-auto leading-relaxed">
                      {isEncrypt ? 'The encrypted archive was packaged successfully. The download should have started automatically.' : 'The encrypted archive was successfully decrypted and original data restored.'}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-4">
                    <button
                      onClick={() => { resetForm(); setFlowStep(1); }}
                      className="w-full sm:flex-1 py-3 px-6 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-2xl font-bold text-xs sm:text-sm text-slate-300 transition"
                    >
                      Process Another
                    </button>
                    <button
                      onClick={() => navigateTo('choice')}
                      className="w-full sm:flex-1 py-3 px-6 bg-cyan-900/20 hover:bg-cyan-900/30 rounded-2xl font-bold text-xs sm:text-sm text-cyan-400 transition"
                    >
                      Go to Home
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </main>

      {/* ========================= FOOTER ========================= */}
      <footer className="w-full bg-slate-100 dark:bg-[#050b18] border-t border-slate-200 dark:border-slate-900 py-8 px-4 sm:px-6 z-10">
        <div className="container mx-auto max-w-5xl flex flex-col items-center space-y-4">
          <div className="flex items-center justify-center gap-6 text-xs sm:text-sm text-slate-400">
            <span className="hover:text-cyan-400 cursor-pointer transition">Privacy Policy</span>
            <span className="text-slate-700">|</span>
            <span className="hover:text-cyan-400 cursor-pointer transition">Documentation</span>
            <span className="text-slate-700">|</span>
            <span className="hover:text-cyan-400 cursor-pointer transition">Support</span>
          </div>

          <div className="w-full h-[1px] bg-slate-900"></div>

          <div className="text-xs text-slate-500 font-medium">
            CryptoNest • Client-side security, absolute privacy
          </div>
        </div>
      </footer>

    </div>
  );
}