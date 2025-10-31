// Main landing page component for Eskom Expo 
// =============================================================================

import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { Button, Typography } from "@material-tailwind/react";
import { motion } from "framer-motion";

// IMAGE IMPORTS
// Dashboard and content images
import patternImg from "/src/assets/img/tests-eskom.png";
import dashboardImg from "/src/assets/img/dashboard-learner.png";
import contentImg from "/src/assets/img/content-image-3.png";

// Landing page carousel images
import pic0 from "/src/assets/landingpageAssets/picland0.jpg";
import pic1 from "/src/assets/landingpageAssets/picland1.jpg";
import pic2 from "/src/assets/landingpageAssets/picland2.jpg";
import pic3 from "/src/assets/landingpageAssets/picland3.jpg";
import pic4 from "/src/assets/landingpageAssets/picland4.jpg";
import pic5 from "/src/assets/landingpageAssets/picland5.jpg";
import pic6 from "/src/assets/landingpageAssets/picland6.jpeg";
import pic7 from "/src/assets/landingpageAssets/picland7.jpg";
import pic8 from "/src/assets/landingpageAssets/picland8.jpg";
import pic9 from "/src/assets/landingpageAssets/picland9.png";
import pic10 from "/src/assets/landingpageAssets/picland10.jpg";
import pic11 from "/src/assets/landingpageAssets/picland11.jpg";


// Registration section images
import judge from "/src/assets/landingpageAssets/JudgeApp.jpg";
import teacher from "/src/assets/landingpageAssets/TeacherApp.jpg";
import learner from "/src/assets/landingpageAssets/LearnerApp.jpg";

// Explanation and logo images
import ExpoExplain from "/src/assets/landingpageAssets/ExpoExplain.png";
import EskomExpoLogoDiscover from "/src/assets/landingpageAssets/EskomExpoLogoDiscover.png";

// Alumni/Where Are They Now section images
import saneaLogo from "/src/assets/landingpageAssets/sanea.png";
import scienceEngineeringImg from "/src/assets/landingpageAssets/nstf.png";
import researchImg from "/src/assets/landingpageAssets/Bursaries.png";

// Sponsor logos
import WitsLogo from "/src/assets/landingpageAssets/WitsLogo.png";
import UPLogo from "/src/assets/landingpageAssets/UPLogo.png";
import ScienceInnovationLogo from "/src/assets/landingpageAssets/ScienceInnovationLogo.png";
import NRFLogo from "/src/assets/landingpageAssets/NRFLogo.jpg";
import BasicEducationLogo from "/src/assets/landingpageAssets/BasicEducationLogo.png";
import SiemensLogo from "/src/assets/landingpageAssets/SiemensLogo.png";
import TechonolgyInnoLogo from "/src/assets/landingpageAssets/TechonolgyInnoLogo.png";
import EskomLogo from "/src/assets/landingpageAssets/EskomLogo.png";

import Header from "../../widgets/layout/header"
import { Footer} from "../../widgets/layout/footer"

// MAIN COMPONENT

function LandingPage() {
  /* ====================
  // STATE MANAGEMENT
   ====================*/

  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  
  // Gallery spinner state
  const spinnerRef = useRef(null);
  const [angle, setAngle] = useState(0);
  
  // News filtering state
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredNews, setFilteredNews] = useState([]);
  const [showAll, setShowAll] = useState(false);
  
  // Sponsor logos carousel state
  const [idx, setIdx] = useState(0);
  const wrapRef = useRef();
  
  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  

  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [lineStyle, setLineStyle] = useState({});
  const navRef = useRef(null);
  const itemRefs = useRef([]);

  /* =================
   DATA STRUCTURES
  =================*/
  
  // Carousel slides data
  const slides = [
    { 
      id: 0, 
      title: "Eskom Expo for Young Scientists Workshop 2025", 
      description: "Discover comprehensive training programs designed to enhance your skills and advance your career in the energy sector.", 
      image: pic10 
    },
    { 
      id: 1, 
      title: "STEM Experts needed: Judge at Eskom Expo ISF 2025", 
      description: "Master cutting-edge technologies and methodologies through our hands-on technical training modules.", 
      image: pic0
    },
    { 
      id: 2, 
      title: "Waheed Amanjee: Bridging science, medicine and innovation", 
      description: "Learn industry-leading safety protocols and best practices to ensure a secure working environment.", 
      image: pic9 
    },
    { 
      id: 3, 
      title: "SA young scientists selected for global competition at Regeneron ISEF in the USA", 
      description: "Explore innovative solutions and emerging trends that are shaping the future of energy.", 
      image: pic11
    },
    { 
      id: 4, 
      title: "Eskom Expo's District Expos aim to refine learners' research projects", 
      description: "Build leadership skills and professional competencies through structured development programs.", 
      image: pic7
    },
    { 
      id: 5, 
      title: "Digital Transformation", 
      description: "Navigate the digital landscape with confidence through our comprehensive digital literacy programs.", 
      image: pic1
    },
    { 
      id: 6, 
      title: "Team Collaboration", 
      description: "Enhance teamwork and communication skills to drive organizational success.", 
      image: pic5
    },
    { 
      id: 7, 
      title: "Industry Insights", 
      description: "Stay ahead with the latest industry trends and market intelligence.", 
      image: pic7 
    },
  
  ];

  // News data for filtering
  const newsData = [
    {
      id: 1,
      title: "Updated: Eskom Expo for Young Scientists Workshops 2025",
      image: pic10,
      date: "June 18, 2025",
      author: "Admin",
      category: "Community",
      tags: ["community", "education"],
      excerpt: "Join us for comprehensive workshops designed to help young scientists prepare for the upcoming expo..."
    },
    {
      id: 2,
      title: "Waheed Amanjee: Bridging science, medicine, and innovation",
      image: pic9,
      date: "June 16, 2025",
      author: "JeVanne Gibbs",
      category: "Community",
      tags: ["community", "profile"],
      excerpt: "Waheed Amanjee's journey is a testament to the power of scientific curiosity and perseverance..."
    },
    {
      id: 3,
      title: "STEM experts needed: Judge at Eskom Expo ISF 2025",
      image: pic0,
      date: "May 28, 2025",
      author: "Sarah Johnson",
      category: "Community",
      tags: ["community", "organization"],
      excerpt: "We are seeking qualified STEM professionals to serve as judges for our international science fair..."
    },
    {
      id: 4,
      title: "New Educational Resources Available",
      image: pic2,
      date: "June 20, 2025",
      author: "Dr. Michael Chen",
      category: "Education",
      tags: ["education", "projects"],
      excerpt: "Discover our latest collection of educational materials designed to enhance science learning..."
    },
    {
      id: 5,
      title: "Organization Updates and Policy Changes",
      image: pic5,
      date: "June 15, 2025",
      author: "Admin Team",
      category: "Organization",
      tags: ["organization"],
      excerpt: "Important updates regarding organizational policies and procedures for the upcoming year..."
    },
    {
      id: 6,
      title: "Featured Student Projects 2025",
      image: pic8,
      date: "June 12, 2025",
      author: "Lisa Williams",
      category: "Projects",
      tags: ["projects", "education", "community"],
      excerpt: "Showcasing exceptional student projects that demonstrate innovation and scientific excellence..."
    }
  ];



  // Sponsor logos data
  const logos = [
    { name: 'University of the Witwatersrand', src: WitsLogo, color: '#4F46E5' },
    { name: 'University of Pretoria', src: UPLogo, color: '#06B6D4' },
    { name: 'Department of Science and Innovation', src: ScienceInnovationLogo, color: '#8B5CF6' },
    { name: 'National Research Foundation', src: NRFLogo, color: '#EC4899' },
    { name: 'Department of Basic Education', src: BasicEducationLogo, color: '#10B981' },
    { name: 'Siemens', src: SiemensLogo, color: '#F59E0B' },
    { name: 'Technology Innovation Agency', src: TechonolgyInnoLogo, color: '#EF4444' },
    { name: 'Eskom', src: EskomLogo, color: '#EF4444' },
  ];

  // News filter categories
  const filterCategories = [
    { key: 'all', label: 'ALL' },
    { key: 'community', label: 'COMMUNITY' },
    { key: 'education', label: 'EDUCATION' },
    { key: 'organization', label: 'ORGANIZATION' },
    { key: 'profile', label: 'PROFILE' },
    { key: 'projects', label: 'PROJECTS' }
  ];

  /* ===================
   UTILITY FUNCTIONS
   ===================*/
  
  // Gallery spinner function
  const gallerySpin = (direction) => {
    const newAngle = angle + (direction === "-" ? -45 : 45);
    setAngle(newAngle);
    if (spinnerRef.current) {
      spinnerRef.current.style.transform = `rotateY(${newAngle}deg)`;
    }
  };

  // Carousel navigation functions
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const togglePlay = () => setIsPlaying(!isPlaying);
  const goToSlide = (index) => setCurrentSlide(index);
   useEffect(() => {
    const updateLinePosition = () => {
      const targetIndex = hoveredIndex !== null ? hoveredIndex : activeIndex;
      const targetElement = itemRefs.current[targetIndex];
      
      if (targetElement && navRef.current) {
        const navRect = navRef.current.getBoundingClientRect();
        const targetRect = targetElement.getBoundingClientRect();
        
        setLineStyle({
          width: targetRect.width,
          left: targetRect.left - navRect.left,
          opacity: 1
        });
      }
    };

    updateLinePosition();
    window.addEventListener('resize', updateLinePosition);
    return () => window.removeEventListener('resize', updateLinePosition);
  }, [activeIndex, hoveredIndex]);


  // Contact form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handling of form submission logic here
  };

  // News filtering function
  const handleFilter = (filterKey) => {
    setActiveFilter(filterKey);
    setShowAll(false);
    if (filterKey === 'all') {
      setFilteredNews(newsData);
    } else {
      const filtered = newsData.filter(item => item.tags.includes(filterKey));
      setFilteredNews(filtered);
    }
  };

  // Sponsor logos carousel styling
  const getStyle = (i) => {
    const total = logos.length;
    const diff = (i - idx + total) % total;

    if (diff > 4 && diff < total - 4) {
      return { opacity: 0, pointerEvents: 'none', transform: 'scale(0.6)', zIndex: 0 };
    }

    const offset = (diff <= 2 ? diff : diff - total) * 110; // spacing
    const scale = diff === 0 ? 1 : 0.85;
    const opacity = diff <= 3 ? 1 : 0.6;
    const z = 10 - Math.abs(diff);

    return {
      transform: `translateX(${offset}%) scale(${scale})`,
      opacity,
      zIndex: z,
    };
  };

  /* ==================
  // LANDING PAGE EFFECTS
 ==================*/

  // Carousel auto-play effect
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, slides.length]);


  // Sponsor logos carousel effect
  useEffect(() => {
    const interval = setInterval(() => {
      setIdx((prev) => (prev + 1) % logos.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [logos.length]);

  
  // Initialize filtered news
  useEffect(() => {
    setFilteredNews(newsData);
  }, []);

  // Computed values for news & logos
  const visibleLogos = Array.from({ length: 4 }, (_, i) => logos[(idx + i) % logos.length]);
  const displayedNews = showAll ? filteredNews : filteredNews.slice(0, 3);

  /* ============================
   RENDERING OF THE LANDING PAGE
  ============================*/
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col overflow-auto">
      
      {/* ============================= */}
      {/* HEADER SECTION */}
      {/* ============================= */}
      
      {/*Top bar header LOGIN , REGISTER & CONTACT INFO*/}
      <Header/>


      {/* ================================== */}
      {/* HERO CAROUSEL SECTION */}
      {/* ================================== */}
      
      <main className="relative w-full h-[90vh] overflow-hidden mt-[80px]">{/*Not hidden by header-increasing the mt according to size*/}
        <div className="relative w-full h-full bg-black">
          
          {/* Carousel Slides */}
          {slides.map((slide, index) => (
            <div 
              key={slide.id} 
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img 
                src={slide.image} 
                alt={slide.title} 
                className="w-full h-full object-cover" 
                loading={index === 0 ? "eager" : "lazy"} 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
              
              {/* Slide Content */}
              <div className="absolute top-1/2 left-12 transform -translate-y-1/2 text-white max-w-md">
                <h2 className="text-4xl font-playfair font-bold mb-4 text-shadow-lg">{slide.title}</h2>
                <p className="text-lg leading-relaxed mb-6 text-shadow">{slide.description}</p>
              </div>
            </div>
          ))}

          {/* Carousel Controls */}
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex items-center gap-4 z-10">
            <button 
              onClick={prevSlide} 
              className="p-3 bg-white/20 border-2 border-white rounded-full hover:bg-white/30 backdrop-blur-sm"
            >
              
            </button>
            
            {/* Thumbnail Navigation */}
            <div className="flex items-center gap-2 max-w-xs overflow-hidden">
              {slides.slice(0, 5).map((_, index) => {
                const actualIndex = (currentSlide + index) % slides.length;
                return (
                  <button 
                    key={actualIndex} 
                    onClick={() => goToSlide(actualIndex)} 
                    className={`relative overflow-hidden rounded-lg border-2 transition-all duration-300 ${
                      actualIndex === currentSlide 
                        ? 'border-white w-20 h-12' 
                        : 'border-white/50 w-16 h-10 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={slides[actualIndex].image} 
                      alt={slides[actualIndex].title} 
                      className="w-full h-full object-cover" 
                    />
                  </button>
                );
              })}
            </div>
            
            <button 
              onClick={nextSlide} 
              className="p-3 bg-white/20 border-2 border-white rounded-full hover:bg-white/30 backdrop-blur-sm"
            >
              
            </button>
          </div>

          {/* Slide Indicators */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
            {slides.map((_, index) => (
              <button 
                key={index} 
                onClick={() => goToSlide(index)} 
                className={`w-3 h-3 rounded-full ${
                  index === currentSlide 
                    ? 'bg-white scale-125' 
                    : 'bg-white/50 hover:bg-white/75'
                }`} 
              />
            ))}
          </div>
        </div>
      </main>

      {/* ==================================== */}
      {/* REGISTRATION CARDS SECTION */}
      {/* ==================================== */}
      
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            
            {/* Learners Registration Card */}
            <div className="bg-blue-50 p-6 rounded-lg shadow-md flex flex-col items-center">
              <img src={learner} alt="Learners" className="w-40 h-40 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Learners register your expo project for assessment
              </h3>
              <a 
                href="auth/sign-up" 
                className="mt-4 px-6 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition"
              >
                LEARNERS REGISTER HERE
              </a>
            </div>
            
            {/* Teachers Registration Card */}
            <div className="bg-gray-100 p-6 rounded-lg shadow-md flex flex-col items-center">
              <img src={teacher} alt="Teachers" className="w-40 h-40 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Teachers register your schools for the science expo
              </h3>
              <a 
                href="auth/teacherRegistration" 
                className="mt-4 px-6 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition"
              >
                TEACHERS REGISTER HERE
              </a>
            </div>
            
            {/* Judges Registration Card */}
            <div className="bg-yellow-100 p-6 rounded-lg shadow-md flex flex-col items-center">
              <img src={judge} alt="Judges" className="w-40 h-40 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Do you have what it takes to judge at the science expo?
              </h3>
              <a
                href="auth/judgeRegistration"
                className="mt-4 px-6 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition"
              >
              JUDGES REGISTER HERE
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================================= */}
      {/* EXPO EXPLANATION SECTION */}
      {/* ================================= */}
      
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            
            {/* Left Content - Text Information */}
            <div className="lg:w-1/2 space-y-6">
              <div>
                <p className="text-gray-600 text-lg mb-2 font-playfair">What is</p>
                <h2 className="text-4xl lg:text-5xl font-playfair font-bold text-gray-800 leading-tight">
                  Expo for Young Scientists
                </h2>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed">
                "Eskom Expo for Young Scientists is an exposition, or science fair, where 
                students have a chance to show others their projects about their own 
                scientific investigations. At the annual prestigious Eskom Expo for Young 
                Scientists International Science Fair (ISF), selected students from 35 Expo 
                Regions in South Africa then compete against the best young scientists from 
                around the country and around the world."
              </p>
            </div>

            {/* Right Illustration - Visual Elements */}
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md">
                
                {/* Main illustration image */}
                <div className="relative">
                  <img 
                    src={ExpoExplain} 
                    alt="Science illustration with laboratory equipment and scientific elements" 
                    className="w-full h-auto max-w-lg mx-auto animate-float"
                  />
                </div>
                
                {/* Floating decorative elements around the image */}
                <div className="absolute -top-4 -left-8 w-12 h-12 bg-green-400 rounded-full animate-float opacity-80"></div>
                <div className="absolute -top-8 right-16 w-8 h-8 bg-purple-400 rounded-full animate-float-delayed opacity-80"></div>
                <div className="absolute -bottom-4 -right-8 w-10 h-10 bg-cyan-400 rounded-full animate-float opacity-80"></div>
                <div className="absolute bottom-12 -left-12 w-6 h-6 bg-pink-400 rounded-full animate-pulse opacity-80"></div>
                <div className="absolute top-32 -right-12 w-8 h-8 bg-yellow-400 rounded-full animate-float-delayed opacity-80"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================== */}
      {/* LATEST NEWS SECTION */}
      {/* ============================== */}

      <div className="bg-gray-900 py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          
          {/* Header Section */}
          <div className="text-center mb-12">
            <p className="text-white text-lg mb-2 font-playfair">Keep up-to-date with all the latest events and expos news</p>
            <h2 className="text-4xl lg:text-5xl font-playfair font-bold text-white mb-8">Latest News</h2>
            
            {/* Filter Navigation */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              {filterCategories.map((category) => (
                <button
                  key={category.key}
                  onClick={() => handleFilter(category.key)}
                  className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    activeFilter === category.key
                      ? 'text-white border-b-2 border-blue-500'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* News Grid Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map((item) => (
              <div
                key={item.id}
                className="group relative bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                {/* News Item Image */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Overlay Content on Hover */}
                <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  
                  {/* Article Meta Information */}
                  <div className="text-gray-400 text-sm mb-2">
                    {item.date} in {item.category}
                  </div>

                  {/* Article Title */}
                  <h3 className="text-white text-xl font-bold mb-2 group-hover:text-blue-400">
                    {item.title}
                  </h3>

                  {/* Article Excerpt */}
                  <p className="text-gray-300 text-sm mb-4">{item.excerpt}</p>

                  {/* Author Information */}
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white text-xs font-medium mr-3">
                      {item.author.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-gray-300 text-sm">by {item.author}</span>
                  </div>

                  {/* Article Tags */}
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-800 text-gray-300 px-2 py-1 rounded-full text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* =====================================*/}
      {/* ALUMNI "WHERE ARE THEY NOW" SECTION */}
      {/* ===================================== */}

      <section
        className="relative bg-black bg-cover bg-center py-20 overflow-hidden"
        style={{
          backgroundImage: `url(${pic4})`, // Background image for alumni section
        }}
      >
        {/* Gradient Overlay for Better Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 via-blue-900/50 to-indigo-900/60"></div>

        {/* Optional Decorative Pattern Layer */}
        <div className="absolute inset-0 opacity-10 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-y-12"></div>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)",
              backgroundSize: "20px 20px",
            }}
          ></div>
        </div>

        {/* Main Content Container */}
        <div className="container mx-auto px-4 relative z-10">
          
          {/* Section Header and Description */}
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-playfair font-bold text-white drop-shadow-lg mb-8 tracking-wide">
              WHERE ARE THEY NOW?
            </h2>
            <div className="max-w-3xl mx-auto text-white/90 text-lg  leading-relaxed space-y-4 drop-shadow-md">
              <p>
                Eskom Expo for Young Scientists invites past participants to please
                complete the Alumni Survey as part of the ongoing relationship between
                Eskom Expo and its former participants. Click below to access the
                survey.
              </p>
              <p className="text-sm">
                Enquiries:{" "}
                <a
                  href="mailto:support@exposcience.co.za"
                  className="text-blue-300 hover:text-blue-200 underline"
                >
                  support@exposcience.co.za
                </a>
              </p>
            </div>

            {/* Call-to-Action Button for Alumni Survey */}
            <div className="mt-8">
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSd6_bpIA5Ub6w36tSNfvnIW_YRXXr0Sf5xqrjLGaqau6QlNpA/viewform"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-10 py-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                COMPLETE THE SURVEY
              </a>
            </div>
          </div>

          {/* Alumni Success Stories Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">
            {/* Dynamic Card Generation */}
            {[...Array(3)].map((_, i) => {
              const data = [
                {
                  title: "Energy Sector",
                  desc: `Alumni contributing to South Africa's energy future through innovative solutions and sustainable practices.`,
                  img: saneaLogo,
                  bg: "bg-white",
                  tag: "SANEA",
                },
                {
                  title: "Science & Engineering",
                  desc: `Former participants now leading breakthrough research and development in various scientific fields.`,
                  img: scienceEngineeringImg,
                  bg: "bg-gradient-to-br from-blue-500 to-teal-500",
                  tag: "S&E",
                },
                {
                  title: "Research & Development",
                  desc: `Alumni making significant contributions to research institutions and driving innovation globally.`,
                  img: researchImg,
                  bg: "bg-gradient-to-br from-yellow-400 to-orange-500",
                  tag: "R&D",
                },
              ][i];

              return (
                <div
                  key={i}
                  className="relative group bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 border border-white/20"
                >
                  {/* Category Tag */}
                  <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-[10px]">
                    {data.tag}
                  </div>

                  {/* Card Content */}
                  <div className="flex flex-col items-center mb-6">
                    {/* Icon/Logo Container */}
                    <div
                      className={`w-32 h-32 ${data.bg} rounded-xl flex items-center justify-center shadow-xl mb-4`}
                    >
                      <img
                        src={data.img}
                        alt={`${data.title} Logo`}
                        className="w-24 h-24 object-contain"
                      />
                    </div>
                    
                    {/* Card Title and Description */}
                    <h3 className="text-white font-semibold text-xl text-center mb-2">
                      {data.title}
                    </h3>
                    <p className="text-white/80 text-sm text-center">{data.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

        
        </div>
      </section>

      {/* =========================== */}
      {/* SPONSORS SECTION */}
      {/* =========================== */}

      <section className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          
          {/* Section Title */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-playfair font-bold text-gray-800">Our Sponsors</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-2" />
          </div>

          {/* Sponsors Logos Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 items-center justify-center">
            {Array.from({ length: 4 }, (_, i) => {
              const logo = logos[(idx + i) % logos.length];
              return (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center bg-white border border-gray-200 rounded-xl shadow-sm p-4"
                >
                  <img src={logo.src} alt={logo.name} className="w-[100px] object-contain mb-2" />
                  <p className="text-xs text-gray-700 text-center">{logo.name}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====================== */}
      {/* FOOTER SECTION */}
      {/* ====================== */}
     < Footer/>

      
      {/* ===================== */}
      {/* CUSTOM STYLES */}
      {/* ===================== */}

      {/* Text shadow utility styles */}
      <style jsx>{`
        .text-shadow {
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }
        .text-shadow-lg {
          text-shadow: 0 4px 8px rgba(0, 0, 0, 0.6);
        }
      `}</style>
    </div>
  );
}
export default LandingPage;