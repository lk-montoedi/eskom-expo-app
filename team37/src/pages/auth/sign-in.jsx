import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
  Alert,
} from "@material-tailwind/react";

import { useState } from "react";
import { 
  Eye, 
  EyeOff, 
  Facebook, 
  Instagram, 
  Twitter, 
  Mail, 
  Lock, 
  AlertCircle,
  CheckCircle,
  Loader2,
  Atom,
  FlaskConical,
  Dna,
  Microscope,
  Zap,
  Globe,
  Rocket
} from "lucide-react";
import { Link, useNavigate, NavLink } from "react-router-dom";

import EskomExpoLogoDiscover from "/src/assets/landingpageAssets/EskomExpoLogoDiscover.png";
import EskomExpoExplain from "/src/assets/landingpageAssets/ExpoExplain.png";

import { Footer} from "../../widgets/layout/footer"
import { SelectUserRegister} from "@/pages/auth";
import { socialLinks } from "@/pages/home/dataStructures";

// Science-themed floating elements
const FloatingScience = () => {
  const scienceIcons = [Atom, FlaskConical, Dna, Microscope, Zap, Globe, Rocket];
  
  return (
    <>
      {Array.from({ length: 15 }, (_, i) => {
        const Icon = scienceIcons[i % scienceIcons.length];
        const size = Math.random() * 20 + 15;
        const animationDelay = Math.random() * 10;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const duration = 15 + Math.random() * 20;
        
        return (
          <div
            key={i}
            className="absolute opacity-10 text-blue-600"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              fontSize: `${size}px`,
              animation: `float ${duration}s ease-in-out infinite`,
              animationDelay: `${animationDelay}s`
            }}
          >
            <Icon size={size} />
          </div>
        );
      })}
    </>
  );
};

// DNA Helix Animation Component
const DNAHelix = () => (
  <div className="absolute top-10 left-10 w-20 h-40 opacity-20">
    <div className="relative w-full h-full">
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={i}
          className="absolute w-4 h-4 bg-blue-500 rounded-full"
          style={{
            left: `${Math.sin(i * 0.8) * 30 + 30}px`,
            top: `${i * 18}px`,
            animation: `dnaRotate ${3 + i * 0.2}s ease-in-out infinite`,
            animationDelay: `${i * 0.2}s`
          }}
        />
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={`strand-${i}`}
          className="absolute w-4 h-4 bg-indigo-500 rounded-full"
          style={{
            left: `${Math.sin(i * 0.8 + Math.PI) * 30 + 30}px`,
            top: `${i * 18}px`,
            animation: `dnaRotate ${3 + i * 0.2}s ease-in-out infinite reverse`,
            animationDelay: `${i * 0.2}s`
          }}
        />
      ))}
    </div>
  </div>
);

// Molecular Structure Animation
const MolecularStructure = () => (
  <div className="absolute bottom-20 right-20 w-32 h-32 opacity-15">
    <div className="relative w-full h-full">
      {/* Central atom */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-blue-700 rounded-full animate-pulse" />
      
      {/* Orbiting electrons */}
      {Array.from({ length: 6 }, (_, i) => (
        <div
          key={i}
          className="absolute top-1/2 left-1/2 w-3 h-3 bg-indigo-500 rounded-full"
          style={{
            transformOrigin: '0 0',
            animation: `orbit ${2 + i * 0.5}s linear infinite`,
            transform: `translate(-50%, -50%) rotate(${i * 60}deg) translateX(${20 + i * 8}px)`
          }}
        />
      ))}
    </div>
  </div>
);

// Periodic Table Elements Background
const PeriodicElements = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
    {['H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S'].map((element, i) => (
      <div
        key={element}
        className="absolute w-12 h-12 border border-blue-400 flex items-center justify-center text-xs font-bold text-blue-600"
        style={{
          left: `${(i % 8) * 12 + 5}%`,
          top: `${Math.floor(i / 8) * 15 + 20}%`,
          animation: `fadeInOut ${5 + Math.random() * 10}s ease-in-out infinite`,
          animationDelay: `${Math.random() * 5}s`
        }}
      >
        {element}
      </div>
    ))}
  </div>
);

// Toast Notification Component
const Toast = ({ message, type, onClose }) => {
  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  const Icon = type === 'success' ? CheckCircle : type === 'error' ? AlertCircle : AlertCircle;

  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg z-50 flex items-center gap-3 animate-slide-in`}>
      <Icon className="w-5 h-5" />
      <span className="font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-4 text-white hover:text-gray-200 transition-colors"
      >
        ×
      </button>
    </div>
  );
};

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  // Input validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 0;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(password)) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Clear error when user starts typing
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: null }));
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: null }));
    }
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("userId", data.user.userid);
        localStorage.setItem("userRole", data.user.role);
        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
        } else {
          sessionStorage.setItem("userId", data.user.userid);
        }
        
        setTimeout(() => {
          navigate("/dashboard", {
            state: { userData: data.user },
          });
        }, 1500);
      } else {
        showToast(data.message || "Failed to sign in. Please check your credentials.", 'error');
      }
    } catch (error) {
      console.error("Login Error:", error);
      showToast("Network error. Please check your connection and try again.", 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSignIn(e);
    }
  };

  // Colours for the social links
  const socialColorMap = {
    Facebook: "hover:text-blue-800",
    Instagram: "hover:text-pink-600",
    Twitter: "hover:text-blue-400",
    Youtube: "hover:text-red-600",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden relative">
      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Science Background Elements */}
      <FloatingScience />
      <DNAHelix />
      <MolecularStructure />
      <PeriodicElements />

      {/* Science Background Image - Right Side with Animation */}
      <div className="absolute top-1/2 right-20 transform -translate-y-1/2 w-80 h-80 opacity-20 animate-pulse">
        <img 
          src={EskomExpoExplain}
          alt="Science Background"
          className="w-full h-full object-cover filter brightness-110 contrast-125"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full animate-spin-slow"></div>
      </div>

      {/*  Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Particle System */}
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className={`absolute rounded-full opacity-30 animate-float`}
            style={{
              width: `${8 + Math.random() * 16}px`,
              height: `${8 + Math.random() * 16}px`,
              backgroundColor: i % 3 === 0 ? '#3B82F6' : i % 3 === 1 ? '#6366F1' : '#1E40AF',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
        
        {/* Circuit Board Lines */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <defs>
              <pattern id="circuit" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 0 5 L 5 5 L 5 0 M 5 5 L 10 5" stroke="#3B82F6" strokeWidth="0.5" fill="none"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit)"/>
          </svg>
        </div>
      </div>

      {/* Header Section */}
      <header className="container mx-auto py-6 px-4 flex justify-between items-center relative z-10 backdrop-blur-sm">
        <div className="flex items-center group">
          <div className="relative">
            <img 
              src={EskomExpoLogoDiscover}
              alt="EXPO Logo"
              className="w-18 h-12 rounded object-cover mr-3 transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur"></div>
          </div>
        </div>
        <nav className="flex space-x-8 items-center">
          <NavLink 
            to="/home/landingPage"
            className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 relative group cursor-pointer"
            aria-label="Go to Home page"
          >
            Home
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></div>
          </NavLink>
          <NavLink
            href="/login" 
            className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 relative group cursor-pointer"
            aria-label="Go to Login page"
          >
            Login
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></div>
          </NavLink>
          <NavLink 
            to="/auth/select-user-register"
            className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 relative group cursor-pointer"
            aria-label="Go to Registration page"
          >
            Register
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></div>
          </NavLink>
        </nav>
        <div className="flex gap-2">
          {socialLinks.map(({ name, href, icon: Icon }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit our ${name} page`}
              className="group relative"
            >
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur"></div>
              <Icon className={`w-6 h-6 text-gray-600 cursor-pointer transition-all duration-300 relative z-10 group-hover:scale-110 ${socialColorMap[name] || "hover:text-blue-600"}`} />
            </a>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center">
          {/* Top Content with Science Theme */}
          <div className="w-full max-w-3xl text-center mb-6 relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4">
              <div className="flex items-center space-x-2 opacity-20">
                <Atom className="w-8 h-8 text-blue-600 animate-spin-slow" />
                <Dna className="w-8 h-8 text-indigo-600 animate-pulse" />
                <FlaskConical className="w-8 h-8 text-blue-700 animate-bounce" />
              </div>
            </div>
            
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-3 relative">
              <span className="relative">
                Expo for Young Scientists App
                <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-8 bg-gradient-to-r from-blue-200/50 to-indigo-200/50 blur-xl"></div>
              </span>
            </h1>
            
            <div className="relative">
              <p className="text-base text-gray-600 mb-1.5">
                Project management built for you. Expo for Young Scientists is inspiring Young Scientists and Researchers 
              </p>
              <p className="text-base text-gray-600 mb-3">
                to interact with mentors, join schools and develop their science projects.
              </p>
              
              {/* Scientific Formula Background */}
              <div className="absolute -top-4 -right-8 opacity-10 text-blue-600 text-xs font-mono">
                E=mc²
              </div>
              <div className="absolute -bottom-2 -left-8 opacity-10 text-indigo-600 text-xs font-mono">
                H₂O + CO₂
              </div>
            </div>
          </div>

          {/*  Login Form */}
          <div className="w-full max-w-lg relative">
            {/* Glowing Border Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 rounded-3xl opacity-20 blur-sm animate-pulse"></div>
            
            <form 
              onSubmit={handleSignIn}
              className="p-5 rounded-3xl shadow-2xl w-full bg-gradient-to-br from-white/95 to-blue-50/95 backdrop-blur-sm border border-blue-200 relative overflow-hidden"
              noValidate
            >
              {/* Form Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <svg className="w-full h-full" viewBox="0 0 60 60">
                  <defs>
                    <pattern id="hexagon" x="0" y="0" width="30" height="26" patternUnits="userSpaceOnUse">
                      <polygon points="15,2 25,8 25,20 15,26 5,20 5,8" fill="none" stroke="#3B82F6" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#hexagon)"/>
                </svg>
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-indigo-600/5 rounded-3xl"></div>
              <div className="relative z-10">
                <div className="text-center mb-5 relative">
                  {/*  Icon with Science Theme */}
                  <div className="relative mx-auto mb-3 w-12 h-12">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-indigo-700 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-indigo-700 rounded-full flex items-center justify-center shadow-lg">
                      <Lock className="w-6 h-6 text-white animate-pulse" aria-hidden="true" />
                    </div>
                    {/* Orbiting Particles */}
                    {Array.from({ length: 3 }, (_, i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-2 bg-blue-500 rounded-full opacity-60"
                        style={{
                          top: '50%',
                          left: '50%',
                          transformOrigin: '0 0',
                          animation: `orbit ${2 + i * 0.5}s linear infinite`,
                          transform: `translate(-50%, -50%) rotate(${i * 120}deg) translateX(30px)`
                        }}
                      />
                    ))}
                  </div>
                  
                  <h2 className="text-xl font-bold bg-gradient-to-r from-blue-800 to-indigo-700 bg-clip-text text-transparent mb-1 relative">
                    ESKOM EXPO ACCESS PORTAL
                  </h2>
                  <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {/* Enhanced Email Input */}
                  <div className="relative group">
                    <label htmlFor="email" className="sr-only">
                      Email Address
                    </label>
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-all duration-300">
                      <div className="relative">
                        <Mail className="w-4 h-4" aria-hidden="true" />
                        <div className="absolute -inset-1 bg-blue-500 opacity-0 group-focus-within:opacity-20 rounded-full blur transition-opacity duration-300"></div>
                      </div>
                    </div>
                    <input
                      id="email"
                      type="email"
                      placeholder="Email / User ID"
                      value={email}
                      onChange={handleEmailChange}
                      onKeyPress={handleKeyPress}
                      className={`w-full pl-10 pr-4 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all duration-300 bg-white/80 hover:bg-white/90 focus:bg-white group-hover:shadow-lg ${
                        errors.email 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                          : 'border-gray-200 focus:border-blue-500 hover:border-blue-300'
                      }`}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      aria-invalid={errors.email ? "true" : "false"}
                      disabled={isLoading}
                    />
                    {/* Input Glow Effect */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-indigo-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none blur-sm"></div>
                    
                    {errors.email && (
                      <p id="email-error" className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-shake">
                        <AlertCircle className="w-3 h-3" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/*Password Input */}
                  <div className="relative group">
                    <label htmlFor="password" className="sr-only">
                      Password
                    </label>
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-all duration-300">
                      <div className="relative">
                        <Lock className="w-4 h-4" aria-hidden="true" />
                        <div className="absolute -inset-1 bg-blue-500 opacity-0 group-focus-within:opacity-20 rounded-full blur transition-opacity duration-300"></div>
                      </div>
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={handlePasswordChange}
                      onKeyPress={handleKeyPress}
                      className={`w-full pl-10 pr-10 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all duration-300 bg-white/80 hover:bg-white/90 focus:bg-white group-hover:shadow-lg ${
                        errors.password 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                          : 'border-gray-200 focus:border-blue-500 hover:border-blue-300'
                      }`}
                      aria-describedby={errors.password ? "password-error" : undefined}
                      aria-invalid={errors.password ? "true" : "false"}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded hover:scale-110"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    {/* Input Glow Effect */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-indigo-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none blur-sm"></div>
                    
                    {errors.password && (
                      <p id="password-error" className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-shake">
                        <AlertCircle className="w-3 h-3" />
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/*  Remember Me Checkbox */}
                  <div className="flex items-center group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        id="remember"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded focus:ring-2 transition-all duration-300"
                        disabled={isLoading}
                      />
                      <div className="absolute -inset-1 bg-blue-500 opacity-0 group-hover:opacity-10 rounded blur transition-opacity duration-300"></div>
                    </div>
                    <label htmlFor="remember" className="text-sm text-gray-600 font-medium cursor-pointer transition-colors duration-300 group-hover:text-gray-800">
                      Remember me for future sessions
                    </label>
                  </div>

                  {/*  Submit Button */}
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-800 to-indigo-700 hover:from-blue-900 hover:to-indigo-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 rounded-xl transition-all duration-300 hover:shadow-xl text-sm transform hover:scale-105 active:scale-95 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden group"
                  >
                    {/* Button Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Accessing Eskom Expo Portal...
                      </>
                    ) : (
                      <>
                        <Microscope className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                        Login
                      </>
                    )}
                  </button>
                </div>

                {/*  Registration Link */}
                <div className="mt-4 text-center relative">
                  <p className="text-xs text-gray-600 mb-2 flex items-center justify-center gap-1">
                    <FlaskConical className="w-3 h-3 opacity-60" />
                    New to our community?
                    <Atom className="w-3 h-3 opacity-60 animate-spin-slow" />
                  </p>
                  <NavLink 
                    to="/auth/select-user-register" 
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1.5 rounded-full text-xs font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    <Rocket className="w-3 h-3 transition-transform duration-300 group-hover:scale-110" />
                    Sign Up 
                    <Dna className="w-3 h-3 animate-pulse" />
                  </NavLink>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

    

      {/* Bottom Wave with Scientific Pattern */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-r from-blue-800 to-indigo-700 transform -skew-y-1 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 100 32">
            <defs>
              <pattern id="wavePattern" x="0" y="0" width="20" height="8" patternUnits="userSpaceOnUse">
                <path d="M 0 4 Q 5 0 10 4 T 20 4" stroke="white" strokeWidth="0.5" fill="none"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#wavePattern)"/>
          </svg>
        </div>
        {/* Floating molecules in the wave */}
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-white/30 rounded-full"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + Math.sin(i) * 30}%`,
              animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      
      {/* Enhanced Custom Styles with Science Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes slide-in {
          from { 
            transform: translateX(100%); 
            opacity: 0; 
          }
          to { 
            transform: translateX(0); 
            opacity: 1; 
          }
        }
        
        @keyframes orbit {
          from { transform: translate(-50%, -50%) rotate(0deg) translateX(30px) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg) translateX(30px) rotate(-360deg); }
        }
        
        @keyframes dnaRotate {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-5px) scale(1.1); }
        }
        
        @keyframes fadeInOut {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.05); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        /* Particle system  */
        .science-particle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }
        
        /* Glowing text effect */
        .glow-text {
          text-shadow: 0 0 10px rgba(59, 130, 246, 0.5),
                       0 0 20px rgba(59, 130, 246, 0.3),
                       0 0 30px rgba(59, 130, 246, 0.2);
        }
        
        /* Circuit board background */
        .circuit-bg {
          background-image: 
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(0deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        
        /* Holographic effect */
        .holographic {
          background: linear-gradient(45deg, 
            rgba(59, 130, 246, 0.1) 0%,
            rgba(99, 102, 241, 0.1) 25%,
            rgba(59, 130, 246, 0.1) 50%,
            rgba(99, 102, 241, 0.1) 75%,
            rgba(59, 130, 246, 0.1) 100%);
          background-size: 200% 200%;
          animation: holographicShift 3s ease infinite;
        }
        
        @keyframes holographicShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        /* input focus effects */
        input:focus + .input-glow {
          opacity: 1;
          transform: scale(1.02);
        }
        
        /* Molecular bond connections */
        .molecular-bond {
          position: absolute;
          width: 2px;
          background: linear-gradient(to bottom, rgba(59, 130, 246, 0.3), rgba(99, 102, 241, 0.3));
          transform-origin: top;
        }
        
        /* Scientific grid overlay */
        .sci-grid {
          background-image: 
            radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.15) 1px, transparent 0);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
   
  );
}

export default SignIn;