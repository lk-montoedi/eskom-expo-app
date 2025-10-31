import learnerIcon from '/src/assets/img/Onboard-icns_learner.svg';
import teacherIcon from '/src/assets/img/Onboard-icns_teacher.svg';
import judgeIcon from '/src/assets/img/Onboard-icns_judge.svg';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import logoEskom from '/src/assets/img/logo01.png';


import EskomExpoLogoDiscover from "/src/assets/landingpageAssets/EskomExpoLogoDiscover.png";
import EskomExpoExplain from "/src/assets/landingpageAssets/ExpoExplain.png";
import { socialLinks } from "@/pages/home/dataStructures";

import {
  Card,
  CardHeader,
  Button,
  Typography,
} from "@material-tailwind/react";

import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Users,
  GraduationCap,
  Scale,
  UserPlus,
  Atom,
  FlaskConical,
  Dna,
  Microscope,
  Zap,
  Globe,
  Rocket,
  BookOpen,
  Award,
  Brain,
  Lightbulb,
  Target,
  Star
} from "lucide-react";

// Science-themed floating elements
const FloatingScience = () => {
  const scienceIcons = [Atom, FlaskConical, Dna, Microscope, Zap, Globe, Rocket, Brain, Lightbulb];
  
  return (
    <>
      {Array.from({ length: 20 }, (_, i) => {
        const Icon = scienceIcons[i % scienceIcons.length];
        const size = Math.random() * 20 + 12;
        const animationDelay = Math.random() * 15;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const duration = 20 + Math.random() * 25;
        
        return (
          <div
            key={i}
            className="absolute opacity-8 text-blue-500"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              fontSize: `${size}px`,
              animation: `float ${duration}s ease-in-out infinite, drift ${duration * 2}s linear infinite`,
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
  <div className="absolute top-10 left-10 w-24 h-48 opacity-15">
    <div className="relative w-full h-full">
      {Array.from({ length: 12 }, (_, i) => (
        <div
          key={i}
          className="absolute w-3 h-3 bg-blue-500 rounded-full shadow-lg"
          style={{
            left: `${Math.sin(i * 0.6) * 35 + 35}px`,
            top: `${i * 16}px`,
            animation: `dnaRotate ${4 + i * 0.15}s ease-in-out infinite`,
            animationDelay: `${i * 0.15}s`
          }}
        />
      ))}
      {Array.from({ length: 12 }, (_, i) => (
        <div
          key={`strand-${i}`}
          className="absolute w-3 h-3 bg-indigo-500 rounded-full shadow-lg"
          style={{
            left: `${Math.sin(i * 0.6 + Math.PI) * 35 + 35}px`,
            top: `${i * 16}px`,
            animation: `dnaRotate ${4 + i * 0.15}s ease-in-out infinite reverse`,
            animationDelay: `${i * 0.15}s`
          }}
        />
      ))}
      {/* Connecting bonds */}
      {Array.from({ length: 11 }, (_, i) => (
        <div
          key={`bond-${i}`}
          className="absolute w-0.5 h-4 bg-gradient-to-b from-blue-400 to-indigo-400 opacity-60"
          style={{
            left: `${Math.sin(i * 0.6) * 35 + 37}px`,
            top: `${i * 16 + 8}px`,
            transform: `rotate(${Math.sin(i * 0.6) * 30}deg)`
          }}
        />
      ))}
    </div>
  </div>
);

//  Molecular Structure Animation
const MolecularStructure = () => (
  <div className="absolute bottom-20 right-20 w-40 h-40 opacity-12">
    <div className="relative w-full h-full">
      {/* Central nucleus */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-blue-700 to-indigo-700 rounded-full animate-pulse shadow-lg" />
      
      {/* Electron shells */}
      {Array.from({ length: 3 }, (_, shell) => (
        <div key={shell} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div 
            className="absolute border border-blue-400 rounded-full opacity-30"
            style={{
              width: `${(shell + 1) * 60}px`,
              height: `${(shell + 1) * 60}px`,
              left: `${-(shell + 1) * 30}px`,
              top: `${-(shell + 1) * 30}px`,
            }}
          />
          {/* Electrons for this shell */}
          {Array.from({ length: shell + 2 }, (_, electron) => (
            <div
              key={`${shell}-${electron}`}
              className="absolute w-2 h-2 bg-indigo-500 rounded-full shadow-sm"
              style={{
                transformOrigin: '0 0',
                animation: `orbit ${3 + shell * 0.8}s linear infinite`,
                transform: `translate(-50%, -50%) rotate(${(electron * 360) / (shell + 2)}deg) translateX(${(shell + 1) * 30}px)`,
                animationDelay: `${electron * 0.2}s`
              }}
            />
          ))}
        </div>
      ))}
    </div>
  </div>
);

// Periodic Table Elements Background
const PeriodicElements = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-4">
    {['H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca'].map((element, i) => (
      <div
        key={element}
        className="absolute w-14 h-14 border-2 border-blue-400 flex items-center justify-center text-sm font-bold text-blue-600 bg-white/20 backdrop-blur-sm rounded-lg"
        style={{
          left: `${(i % 10) * 9 + 5}%`,
          top: `${Math.floor(i / 10) * 12 + 15}%`,
          animation: `fadeInOut ${8 + Math.random() * 12}s ease-in-out infinite, elementFloat 6s ease-in-out infinite`,
          animationDelay: `${Math.random() * 8}s`
        }}
      >
        {element}
      </div>
    ))}
  </div>
);

// Science Lab Equipment Background
const LabEquipment = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[FlaskConical, Microscope, Atom, Dna, Brain].map((Icon, i) => (
      <div
        key={i}
        className="absolute opacity-5 text-blue-600"
        style={{
          left: `${15 + (i * 18)}%`,
          top: `${20 + Math.sin(i) * 30}%`,
          fontSize: '4rem',
          animation: `labFloat ${5 + i}s ease-in-out infinite`,
          animationDelay: `${i * 0.8}s`
        }}
      >
        <Icon size={64} />
      </div>
    ))}
  </div>
);

export function SelectUserRegister() {
    const navigate = useNavigate();

    // Colours for the social links 
    const socialColorMap = {
        Facebook: "hover:text-blue-800",
        Instagram: "hover:text-pink-600",
        Twitter: "hover:text-blue-400",
        Youtube: "hover:text-red-600",
    };

    // role data with science themes
    const roles = [
        {
            to: "/auth/sign-up",
            icon: learnerIcon,
            title: "Learner ",
            description: "Embark on your scientific journey, conduct research, and showcase groundbreaking discoveries",
            gradient: "from-blue-500 to-indigo-600",
            hoverGradient: "hover:from-blue-600 hover:to-indigo-700",
            scienceIcon: Rocket,
            particles: ['⚛️', '🧪', '🔬'],
            bgPattern: "circuit"
        },
        {
            to: "/auth/teacherRegistration", 
            icon: teacherIcon,
            title: "Teacher",
            description: "Guide future scientists, share knowledge, and inspire the next generation of researchers",
            gradient: "from-green-500 to-teal-600",
            hoverGradient: "hover:from-green-600 hover:to-teal-700",
            scienceIcon: Brain,
            particles: ['🧠', '💡', '⚡'],
            bgPattern: "dna"
        },
        {
            to: "/auth/judgeRegistration",
            icon: judgeIcon, 
            title: "Judge ",
            description: "Assess innovative projects, provide expert feedback, and recognize scientific excellence",
            gradient: "from-purple-500 to-pink-600",
            hoverGradient: "hover:from-purple-600 hover:to-pink-700",
            scienceIcon: Award,
            particles: ['🏆', '⭐', '🎯'],
            bgPattern: "molecular"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden relative">
            {/*  Science Background Elements */}
            <FloatingScience />
            <DNAHelix />
            <MolecularStructure />
            <PeriodicElements />
            <LabEquipment />

            {/* Science Background Image - Right Side with  Effects */}
            <div className="absolute top-1/2 right-20 transform -translate-y-1/2 w-80 h-80 opacity-15">
                <div className="relative w-full h-full">
                    <img 
                        src={EskomExpoExplain}
                        alt="Science Background"
                        className="w-full h-full object-cover filter brightness-110 contrast-125"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full animate-spin-slow"></div>
                    {/* Orbiting science elements */}
                    {[Atom, Dna, FlaskConical].map((Icon, i) => (
                        <div
                            key={i}
                            className="absolute w-8 h-8 text-blue-500 opacity-30"
                            style={{
                                top: '50%',
                                left: '50%',
                                transformOrigin: '0 0',
                                animation: `orbit ${4 + i}s linear infinite`,
                                transform: `translate(-50%, -50%) rotate(${i * 120}deg) translateX(${120 + i * 20}px)`
                            }}
                        >
                            <Icon size={32} />
                        </div>
                    ))}
                </div>
            </div>

            {/*  Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Enhanced Particle System */}
                {Array.from({ length: 25 }, (_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full opacity-20 shadow-lg"
                        style={{
                            width: `${6 + Math.random() * 20}px`,
                            height: `${6 + Math.random() * 20}px`,
                            background: `linear-gradient(45deg, ${
                                i % 4 === 0 ? '#3B82F6' : 
                                i % 4 === 1 ? '#6366F1' : 
                                i % 4 === 2 ? '#1E40AF' : '#4F46E5'
                            }, ${
                                i % 4 === 0 ? '#6366F1' : 
                                i % 4 === 1 ? '#8B5CF6' : 
                                i % 4 === 2 ? '#3B82F6' : '#6366F1'
                            })`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animation: `particleFloat ${4 + Math.random() * 6}s ease-in-out infinite, particleDrift ${15 + Math.random() * 20}s linear infinite`,
                            animationDelay: `${Math.random() * 8}s`
                        }}
                    />
                ))}
                
                {/*  Circuit Board Lines */}
                <div className="absolute top-0 left-0 w-full h-full opacity-8">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                        <defs>
                            <pattern id="advancedCircuit" x="0" y="0" width="15" height="15" patternUnits="userSpaceOnUse">
                                <path d="M 0 7.5 L 7.5 7.5 L 7.5 0 M 7.5 7.5 L 15 7.5 M 7.5 7.5 L 7.5 15" stroke="#3B82F6" strokeWidth="0.3" fill="none"/>
                                <circle cx="7.5" cy="7.5" r="1" fill="#6366F1" opacity="0.6"/>
                            </pattern>
                            <linearGradient id="circuitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.1"/>
                                <stop offset="100%" stopColor="#6366F1" stopOpacity="0.05"/>
                            </linearGradient>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#advancedCircuit)"/>
                        <rect width="100%" height="100%" fill="url(#circuitGrad)"/>
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
                            className="w-18 h-12 rounded object-cover mr-3 transition-all duration-300 group-hover:scale-110"
                            loading="lazy"
                        />
                        <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur"></div>
                        {/* Scientific formula overlay */}
                        <div className="absolute -top-2 -right-2 text-blue-600 text-xs opacity-0 group-hover:opacity-60 transition-opacity duration-300 font-mono">
                            E=mc²
                        </div>
                    </div>
                </div>
                <nav className="flex space-x-8 items-center">
                    <NavLink 
                        to="/home/landingPage"
                        className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 relative group cursor-pointer"
                        aria-label="Go to Home page"
                    >
                        Home
                        <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 group-hover:w-full"></div>
                        <Atom className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-4 h-4 text-blue-500 opacity-0 group-hover:opacity-60 transition-all duration-300 animate-spin-slow" />
                    </NavLink>
                    <a 
                        href="/auth/sign-in" 
                        className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 relative group cursor-pointer"
                        aria-label="Go to Login page"
                    >
                        Login
                        <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 group-hover:w-full"></div>
                        <Microscope className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-4 h-4 text-blue-500 opacity-0 group-hover:opacity-60 transition-all duration-300 animate-bounce" />
                    </a>
                    <NavLink 
                        to="/auth/select-user-register"
                        className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 relative group cursor-pointer"
                        aria-label="Go to Registration page"
                    >
                        Register
                        <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                        <Rocket className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-4 h-4 text-blue-500 opacity-60 animate-pulse" />
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
                            <div className="absolute -inset-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full opacity-0 group-hover:opacity-15 transition-all duration-300 blur animate-pulse"></div>
                            <Icon className={`w-6 h-6 text-gray-600 cursor-pointer transition-all duration-300 relative z-10 group-hover:scale-110 group-hover:rotate-12 ${socialColorMap[name] || "hover:text-blue-600"}`} />
                        </a>
                    ))}
                </div>
            </header>

            {/* Main Content */}
            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col items-center">
                    {/* Top Content  */}
                    <div className="w-full max-w-3xl text-center mb-6">
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-3">
                            Expo for Young Scientists 
                        </h1>
                        <p className="text-base text-gray-600 mb-1.5 ">
                            Choose your role and become part of our community dedicated to fostering scientific innovation
                        </p>
                        <p className="text-base text-gray-600 mb-3">
                            among young learners and teachers across the nation.
                        </p>
                    </div>

                    {/* Registration Form */}
                    <div className="w-full max-w-5xl">
                        {/* Glowing Border Effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 rounded-3xl opacity-20 blur-sm animate-pulse"></div>
                        
                        <form 
                            className="p-5 rounded-3xl shadow-2xl w-full bg-gradient-to-br from-white/95 to-blue-50/95 backdrop-blur-sm border border-blue-200 relative overflow-hidden"
                            onSubmit={(e) => e.preventDefault()}
                        >
                            {/* Enhanced Background Pattern */}
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
                                {/* Header */}
                                <div className="text-center mb-5">
                                    <div className="relative mx-auto mb-3 w-12 h-12">
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-indigo-700 rounded-full animate-pulse"></div>
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-indigo-700 rounded-full flex items-center justify-center shadow-lg">
                                            <UserPlus className="w-6 h-6 text-white animate-pulse" aria-hidden="true" />
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
                                        SCIENTIFIC ROLE SELECTION REGISTRATION
                                    </h2>
                                    <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
                                    </div>
                                </div>

                                {/* Role Cards in 3 Column Layout */}
                                <div className="flex flex-wrap gap-6 justify-center">
                                    {roles.map((role, index) => (
                                        <Link 
                                            key={role.title}
                                            to={role.to} 
                                            className="group"
                                            aria-label={`Register as a ${role.title}`}
                                        >
                                            <div className="p-6 w-72 bg-white rounded-2xl shadow-lg hover:shadow-2xl flex flex-col items-center gap-5 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 border-2 border-transparent hover:border-blue-200 relative overflow-hidden">
                                                {/* Gradient background overlay on hover */}
                                                <div className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`}></div>
                                                
                                                {/* Enhanced Role Icon */}
                                                <div className="relative z-10 p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full group-hover:from-white group-hover:to-blue-50 transition-all duration-300">
                                                    <img 
                                                        className='w-14 h-14 group-hover:scale-110 transition-transform duration-300' 
                                                        src={role.icon} 
                                                        alt={`${role.title} icon`}
                                                        loading="lazy"
                                                    />
                                                    {/* Science overlay icon */}
                                                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                        <role.scienceIcon className="w-2.5 h-2.5 text-white" />
                                                    </div>
                                                </div>
                                                
                                                {/* Role Title */}
                                                <div className="text-center relative z-10">
                                                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-800 transition-colors duration-300 mb-2">
                                                        {role.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300 leading-relaxed">
                                                        {role.description}
                                                    </p>
                                                </div>

                                                {/* Call to Action Button */}
                                                <div className="relative z-10 w-full">
                                                    <button className={`w-full py-2.5 px-5 bg-gradient-to-r ${role.gradient} ${role.hoverGradient} text-white font-semibold rounded-xl transition-all duration-300 transform group-hover:shadow-lg text-sm opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 relative overflow-hidden`}>
                                                        {/* Button shimmer effect */}
                                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                                        
                                                        <div className="flex items-center justify-center gap-2 relative z-10">
                                                            <role.scienceIcon className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                                                            Register as a {role.title}
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                {/* Sign In Link - Similar to Login Page */}
                                <div className="mt-4 text-center">
                                    <p className="text-xs text-gray-600 mb-2 flex items-center justify-center gap-1">
                                        <FlaskConical className="w-3 h-3 opacity-60" />
                                        Already part of our Eskom Expo community?
                                        <Atom className="w-3 h-3 opacity-60 animate-spin-slow" />
                                    </p>
                                    <NavLink 
                                        to="/auth/sign-in" 
                                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1.5 rounded-full text-xs font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 group relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                        <Microscope className="w-3 h-3 transition-transform duration-300 group-hover:scale-110" />
                                      Login
                                        <Zap className="w-3 h-3 animate-pulse" />
                                    </NavLink>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Enhanced Bottom Wave with Scientific Pattern */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-r from-blue-800 to-indigo-700 transform -skew-y-1 overflow-hidden" aria-hidden="true">
                <div className="absolute inset-0 opacity-15">
                    <svg className="w-full h-full" viewBox="0 0 100 32">
                        <defs>
                            <pattern id="scientificWave" x="0" y="0" width="25" height="8" patternUnits="userSpaceOnUse">
                                <path d="M 0 4 Q 6.25 0 12.5 4 T 25 4" stroke="white" strokeWidth="0.6" fill="none"/>
                                <circle cx="12.5" cy="4" r="0.8" fill="white" opacity="0.4"/>
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#scientificWave)"/>
                    </svg>
                </div>
                {/* Scientific elements floating in the wave */}
                {[Atom, Dna, FlaskConical, Brain, Microscope].map((Icon, i) => (
                    <div
                        key={i}
                        className="absolute text-white/20"
                        style={{
                            left: `${15 + i * 18}%`,
                            top: `${15 + Math.sin(i * 1.2) * 40}%`,
                            fontSize: '1.5rem',
                            animation: `waveFloat ${4 + Math.random() * 3}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 3}s`
                        }}
                    >
                        <Icon size={24} />
                    </div>
                ))}
                
                {/* Molecular bonds connecting elements */}
                <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" viewBox="0 0 100 32">
                        <line x1="20" y1="16" x2="40" y2="12" stroke="white" strokeWidth="0.5" opacity="0.6"/>
                        <line x1="40" y1="12" x2="60" y2="20" stroke="white" strokeWidth="0.5" opacity="0.6"/>
                        <line x1="60" y1="20" x2="80" y2="14" stroke="white" strokeWidth="0.5" opacity="0.6"/>
                    </svg>
                </div>
            </div>
            
            {/* Enhanced Custom Styles with Advanced Science Animations */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.8; }
                    50% { transform: translateY(-25px) rotate(180deg); opacity: 1; }
                }
                
                @keyframes drift {
                    0% { transform: translateX(-10px); }
                    100% { transform: translateX(10px); }
                }
                
                @keyframes particleFloat {
                    0%, 100% { transform: translateY(0px) scale(1); opacity: 0.6; }
                    50% { transform: translateY(-15px) scale(1.2); opacity: 1; }
                }
                
                @keyframes particleDrift {
                    0% { transform: translateX(-5px) rotate(0deg); }
                    100% { transform: translateX(5px) rotate(360deg); }
                }
                
                @keyframes orbit {
                    from { transform: translate(-50%, -50%) rotate(0deg) translateX(30px) rotate(0deg); }
                    to { transform: translate(-50%, -50%) rotate(360deg) translateX(30px) rotate(-360deg); }
                }
                
                @keyframes dnaRotate {
                    0%, 100% { transform: translateY(0px) scale(1) rotate(0deg); }
                    25% { transform: translateY(-3px) scale(1.05) rotate(90deg); }
                    50% { transform: translateY(-5px) scale(1.1) rotate(180deg); }
                    75% { transform: translateY(-3px) scale(1.05) rotate(270deg); }
                }
                
                @keyframes fadeInOut {
                    0%, 100% { opacity: 0.05; transform: scale(1) rotate(0deg); }
                    50% { opacity: 0.15; transform: scale(1.1) rotate(180deg); }
                }
                
                @keyframes elementFloat {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    33% { transform: translateY(-8px) rotate(120deg); }
                    66% { transform: translateY(-4px) rotate(240deg); }
                }
                
                @keyframes labFloat {
                    0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
                    50% { transform: translateY(-20px) rotate(180deg) scale(1.1); }
                }
                
                @keyframes waveFloat {
                    0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.2; }
                    50% { transform: translateY(-10px) rotate(180deg); opacity: 0.4; }
                }
                
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                
                @keyframes holographicShift {
                    0% { background-position: 0% 50%; filter: hue-rotate(0deg); }
                    50% { background-position: 100% 50%; filter: hue-rotate(180deg); }
                    100% { background-position: 0% 50%; filter: hue-rotate(360deg); }
                }
                
                .animate-float {
                    animation: float 4s ease-in-out infinite;
                }
                
                .animate-spin-slow {
                    animation: spin 12s linear infinite;
                }
                
                .animate-shimmer {
                    animation: shimmer 3s infinite;
                }
                
                /* Advanced particle effects */
                .science-particle {
                    position: absolute;
                    border-radius: 50%;
                    pointer-events: none;
                    box-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
                }
                
                /* Glowing text effect */
                .glow-text {
                    text-shadow: 0 0 15px rgba(59, 130, 246, 0.4),
                                 0 0 25px rgba(59, 130, 246, 0.2),
                                 0 0 35px rgba(59, 130, 246, 0.1);
                }
                
                /* Enhanced circuit board background */
                .circuit-bg {
                    background-image: 
                        linear-gradient(90deg, rgba(59, 130, 246, 0.08) 1px, transparent 1px),
                        linear-gradient(0deg, rgba(59, 130, 246, 0.08) 1px, transparent 1px),
                        radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.05) 1px, transparent 1px);
                    background-size: 25px 25px, 25px 25px, 50px 50px;
                }
                
                /* Holographic effect enhancement */
                .holographic {
                    background: linear-gradient(45deg, 
                        rgba(59, 130, 246, 0.08) 0%,
                        rgba(99, 102, 241, 0.08) 20%,
                        rgba(168, 85, 247, 0.08) 40%,
                        rgba(59, 130, 246, 0.08) 60%,
                        rgba(99, 102, 241, 0.08) 80%,
                        rgba(59, 130, 246, 0.08) 100%);
                    background-size: 300% 300%;
                    animation: holographicShift 5s ease infinite;
                }
                
                /* Scientific grid overlay enhancement */
                .sci-grid {
                    background-image: 
                        radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.12) 2px, transparent 0),
                        linear-gradient(90deg, rgba(59, 130, 246, 0.04) 1px, transparent 1px),
                        linear-gradient(0deg, rgba(59, 130, 246, 0.04) 1px, transparent 1px);
                    background-size: 30px 30px, 30px 30px, 30px 30px;
                }
                
                /* Molecular animation enhancements */
                .molecular-bond {
                    position: absolute;
                    width: 2px;
                    background: linear-gradient(to bottom, 
                        rgba(59, 130, 246, 0.4), 
                        rgba(99, 102, 241, 0.4),
                        rgba(168, 85, 247, 0.4));
                    transform-origin: top;
                    animation: bondPulse 3s ease-in-out infinite;
                }
                
                @keyframes bondPulse {
                    0%, 100% { opacity: 0.4; transform: scaleY(1); }
                    50% { opacity: 0.8; transform: scaleY(1.1); }
                }
                
                /* Enhanced input focus effects */
                input:focus + .input-glow {
                    opacity: 1;
                    transform: scale(1.03);
                    box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
                }
                
                /* Role card enhancement */
                .role-card:hover .role-particles {
                    animation: particleExplosion 0.6s ease-out;
                }
                
                @keyframes particleExplosion {
                    0% { transform: scale(1); opacity: 0; }
                    50% { transform: scale(1.2); opacity: 1; }
                    100% { transform: scale(1.5); opacity: 0; }
                }
            `}</style>
        </div>
    );
}

export default SelectUserRegister;