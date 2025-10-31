// About Us Page from Landing page component for Eskom Expo 
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


import { Footer} from "../../widgets/layout/footer"
import Header from "../../widgets/layout/header"

// Landing page carousel images
import pic4 from "/src/assets/landingpageAssets/picland4.jpg";
import ParthyYTThumbnail from "/src/assets/landingpageAssets/ParthyYTVideoThumbail.jpg";

// Explanation and logo images
import EskomExpoLogoDiscover from "/src/assets/landingpageAssets/EskomExpoLogoDiscover.png";



// MAIN COMPONENT

function AboutUsPage() {
  // ====================
  // STATE MANAGEMENT
  // ====================
  
  //Header state
  const [showHeader, setShowHeader] = useState(true);

  // Mobile menu state
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  {/*const AnimatedContentSection = () => {*/}
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  //Youtube video section 
   const [showVideo, setShowVideo] = useState(false);
  // =================
  // DATA STRUCTURES
  // =================

   
  
  // ==================
  // UTILITY FUNCTIONS
  // ================== 

  /* ==================
   ABOUT US PAGE EFFECTS
   ==================*/

    //Misson section
        useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15,
        rootMargin: '500px'
       }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
  // ============================
  // RENDERING OF THE ABOUT
  // ============================

   const canvasRef = useRef(null);
  const sectionRefHover = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const animationRef = useRef();
  const nodesRef = useRef([]);

  // Initialize network nodes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const nodes = [];
    
    // Create random nodes
    for (let i = 0; i < 50; i++) {
      nodes.push({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        originalX: Math.random() * rect.width,
        originalY: Math.random() * rect.height,
      });
    }
    
    nodesRef.current = nodes;
  }, []);

  // Handle mouse movement
  const handleMouseMove = (e) => {
    const rect = sectionRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    // Set canvas size
    canvas.width = rect.width;
    canvas.height = rect.height;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const nodes = nodesRef.current;
      
      // Update node positions
      nodes.forEach((node, i) => {
        if (isHovering) {
          // Move nodes towards mouse
          const dx = mousePos.x - node.x;
          const dy = mousePos.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            const force = (150 - distance) / 150;
            node.vx += (dx / distance) * force * 0.02;
            node.vy += (dy / distance) * force * 0.02;
          }
        }
        
        // Apply gentle drift back to original position
        const returnForceX = (node.originalX - node.x) * 0.001;
        const returnForceY = (node.originalY - node.y) * 0.001;
        
        node.vx += returnForceX;
        node.vy += returnForceY;
        
        // Apply velocity with damping
        node.x += node.vx;
        node.y += node.vy;
        node.vx *= 0.99;
        node.vy *= 0.99;
        
        // Keep nodes within bounds
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
        
        node.x = Math.max(0, Math.min(canvas.width, node.x));
        node.y = Math.max(0, Math.min(canvas.height, node.y));
      });
      
      // Draw connections
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            const opacity = (100 - distance) / 100 * 0.3;
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }
      
      // Draw nodes
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      nodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mousePos, isHovering]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
   return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col overflow-auto">
      


      {/* HEADER SECTION */}
      {/* ============================= */}
         <Header/>


      {/* ================================== */}
      {/* HERO CAROUSEL SECTION */}
      {/* ================================== */}
        <main className="relative w-full h-[90vh] overflow-hidden mt-[80px]">{/*Not hidden by header-increasing the mt according to size*/}

             <section className="relative w-full min-h-screen bg-gray-100 flex items-center justify-center">
                {/* Main Image with Overlay */}
                <div className="relative w-full h-screen">
                    <img 
                    src={pic4}
                    alt="Eskom Expo Young Scientists Group Photo" 
                    className="w-full h-full object-cover scale-100"
                    />
                    
                    {/* Dark Overlay for Better Text Visibility */}
                    <div className="absolute inset-0 bg-black/50"></div>
                    
                    {/* About Us Title Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                        <h2 className="text-4xl md:text-6xl font-playfair font-thin ">
                        About Us
                        </h2>
                       {/*underlining text- <div className="w-25 h-1 bg-white mx-auto mt-4 opacity-80"></div>*/} 
                    </div>
                    </div>
                </div>
             </section>
                        
        </main>
    
      {/* ==================================== */}
      {/* VISION AND MISSION SECTION */}
      {/* ==================================== */}

            <section ref={sectionRef} className="w-full bg-white  pt-16 pb-0 px-0">{/*for white gap at the bottom & sides before next section*/}
            <div className="w-full"> {/* removed max-width container */}
                
                {/* Top Text - Slides from Top */}
                <div className={`text-center mb-16 transition-all duration-500 ease-out delay-100 ${
                isVisible 
                    ? 'transform translate-y-0 opacity-100' 
                    : 'transform -translate-y-16 opacity-0'
                }`}>
                    <h4 className="text-xs text-gray-500  font-bold mb-2 ">
                      OUR COMPANY PROFILE
                    </h4>

                    <p className="text-3xl md:text-4xl text-gray-800 font-playfair font-bold leading-relaxed max-w-5xl mx-auto">
                    Since 1980,
                </p>
              <p className="text-3xl md:text-4xl text-gray-800 font-playfair font-bold whitespace-nowrap overflow-hidden text-ellipsis">
                  we've been passionate about achieving better results for our students.
              </p>
                </div>

                {/* Two Column Content - Full Width */}
                <div className="grid grid-cols-1 md:grid-cols-2 w-full min-h-[600px]">
                
                {/* Left Column */}
                <div className={`bg-gray-100 p-16 flex flex-col justify-center transition-all duration-500 ease-out delay-0 ${
                    isVisible 
                    ? 'transform translate-x-0 opacity-100' 
                    : 'transform -translate-x-16 opacity-0'
                }`}>
                    <h2 className="text-4xl md:text-5xl font-playfair font-bold text-gray-800 mb-12">
                        WHO WE ARE
                    </h2>
                    <div className="space-y-8">
                    {/* Our Vision */}
                    <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 mt-1 text-[#1e3a8a] animate-spin-slow">
                            
                    </div>
                        <div>
                        <h3 className="text-xl font-playfair font-semibold text-gray-800 mb-2">Our Vision</h3>
                        <p className="text-gray-600 leading-relaxed">
                            To inspire young scientists and researchers.
                        </p>
                        </div>
                    </div>

                    {/* Our Mission */}
                    <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 mt-1 text-[#1e3a8a]  animate-spin-slow">
                        
                        </div>
                        <div>
                        <h3 className="text-xl font-playfair font-semibold text-gray-800 mb-2">Our Mission</h3>
                        <p className="text-gray-600 leading-relaxed">
                            To develop young scientists who are able to identify a problem, analyse information, find solutions and communicate findings effectively. Eskom Expo for Young Scientists brings together learners, teachers, professional organisations and educational bodies and government institutions from all over the world.
                        </p>
                        </div>
                    </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className={`bg-blue-900 p-16 flex flex-col justify-center text-white transition-all duration-500 ease-out delay-100 ${
                    isVisible 
                    ? 'transform translate-x-0 opacity-100' 
                    : 'transform -translate-x-16 opacity-0'
                }`}>
                    <h2 className="text-4xl md:text-5xl font-playfair font-bold leading-tight mb-8">
                    Our team of highly educated staff have years of experience in the education and development industry.
                    </h2>
                    
                    <Link to="/home/ourTeam">
                      <button
                        className="bg-[#1e3a8a] text-white px-6 py-3 rounded-full shadow-[0_0_10px_#1e3a8a] hover:bg-white/90 hover:text-[#1e3a8a] transition duration-300 ease-in-out self-start"
                      >
                        MEET OUR TEAM
                      </button>
                    </Link>


                </div>
                </div>
            </div>
            </section>



      {/* ================================= */}
      {/* WHAT WE DO SECTION */}
      {/* ================================= */}
 <section ref={sectionRefHover} className="w-full bg-gray-200 pt-0 pb-16 px-4 overflow-hidden">

    <div className="w-full">
        {/* Two Column Content - Full Width */}
        <div className="grid grid-cols-1 lg:grid-cols-2 w-full min-h-[600px] gap-0">
        {/* Left Column - Text Content */}
        <div
            className={`bg-gray-200 p-16 flex flex-col justify-center transition-all duration-5000 ease-out ${
            isVisible
                ? "transform translate-x-0 opacity-100"
                : "transform -translate-x-16 opacity-0"
            }`}>
            <h2 className="text-5xl md:text-5xl font-playfair font-bold text-gray-800 mb-10 ">
            WHAT WE DO
            </h2>

        <div className="space-y-8">
          <p className="text-gray-700 leading-relaxed ">
            Our program is dedicated to teaching students through positive learning experiences so
            that they will be successful in the world of science. We believe the unique learning styles
            of students should be considered when planning and implementing learning activities
            and projects. Our program helps each boy and girl to become a responsible and
            independent young scientist, one who is a creative thinker, respectful of himself and
            others, and appreciative of the differences amongst people.
          </p>

          <button className="bg-[#1e3a8a] text-white px-6 py-3 rounded-full shadow-[0_0_10px_#1e3a8a] hover:bg-[#334acb] transition duration-300 ease-in-out self-start font-thin">
            START HERE
          </button>
        </div>
      </div>

        {/* Right Column - Video/Image */}
            <div
                className={`relative bg-gray-200 flex items-center justify-center transition-all duration-500 ease-out delay-0 ${
                    isVisible
                    ? "transform translate-x-0 opacity-100"
                    : "transform translate-x-16 opacity-0"
                }`}
                style={{ paddingTop: showVideo ? "2rem" : "0", paddingBottom: showVideo ? "2rem" : "0" }}
                >
               <div className="relative w-full aspect-video bg-gradient-to-br from-blue-800 to-blue-900 flex items-center justify-center">

                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 opacity-90"></div>

                    {!showVideo ? (
                    <div className="relative z-10 w-full h-full">
                        {/* Image Cover */}
                        <img
                        src={ParthyYTThumbnail}
                        alt="Video cover"
                       className="w-full h-full object-cover rounded-lg"
                        />

                        {/* Play Button */}
                        <button
                        className="absolute inset-0 flex items-center justify-center"
                        onClick={() => setShowVideo(true)}
                        >
                        <div className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-6 transition-all duration-300 transform hover:scale-110">
                           
                        </div>
                        </button>
                    </div>
                    ) : (
                    <div className="relative z-10 w-full max-w-3xl px-4 py-4">
                        <div className="aspect-video rounded-lg shadow-lg overflow-hidden">
                        <iframe
                            className="w-full h-full"
                            src="https://www.youtube.com/embed/VlDEh_EXwp4?autoplay=1"
                            title="YouTube video player"
                            frameBorder="0"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                        ></iframe>
                        </div>
                    </div>
                    )}

                    {/* Decorative Elements */}
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent opacity-40"></div>
                    <div className="absolute bottom-0 left-0 right-0 flex h-3">
                    <div className="flex-1 bg-orange-500"></div>
                    <div className="flex-1 bg-red-500"></div>
                    <div className="flex-1 bg-blue-500"></div>
                    <div className="flex-1 bg-green-500"></div>
                    <div className="flex-1 bg-yellow-500"></div>
                    <div className="flex-1 bg-purple-500"></div>
                    <div className="flex-1 bg-pink-500"></div>
                    <div className="flex-1 bg-indigo-500"></div>
                 </div>
              </div>
            </div>
         </div>
      </div>
  </section>

      

      {/* ============================== */}
      {/* LATEST NEWS SECTION */}
      {/* ============================== */}

      <section 
      ref={sectionRef}
      className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 py-20 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Animated Network Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ width: '100%', height: '100%' }}
      />
      
      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Image Section */}
          <div className="relative">
            <div className="relative rounded-lg overflow-hidden shadow-2xl">
              {/* Replace this div with your actual image */}
              <div className="bg-gray aspect-[4/3] flex items-center justify-center">
                <div className="text-white text-center">
                  
                   <img 
                src={pic4} 
                alt="Award Winners" 
                className="w-full h-full object-cover"
              /> 
                </div>
              </div>
            
            </div>
          </div>

          {/* Text Content */}
          <div className="text-white space-y-6">
            <div className="space-y-4">
              <div className="inline-block">
                <span className="text-sm font-semibold text-blue-300 tracking-wider uppercase">
                  Award Winners
                </span>
              </div>
              
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight">
                We are proud recipients of the 2018 SANEA Energy Education Award
              </h2>
              
              <p className="text-lg lg:text-xl text-blue-100 leading-relaxed">
                The South African National Energy Association (SANEA) Energy Awards 
                and the NSTF-South32 Award for an outstanding contribution to science, 
                engineering, technology (SET) and innovation.
              </p>
            </div>

            {/* Latest News Button */}
            <div className="pt-4">
              <button className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                <span className="mr-2">Latest News</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Additional decorative elements */}
      <div className="absolute top-10 right-10 w-20 h-20 border border-white/20 rounded-full"></div>
      <div className="absolute bottom-10 left-10 w-16 h-16 border border-white/20 rounded-full"></div>
      <div className="absolute top-1/2 left-1/4 w-12 h-12 border border-white/10 rounded-full"></div>
    </section>

 

      {/* =====================================*/}
      {/* ALUMNI "WHERE ARE THEY NOW" SECTION */}
      {/* ===================================== */}

     
    <section className="bg-gray-200 py-20 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 text-center">
        
        {/* Main Heading */}
        <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-8">
          WEBSITE <span className="italic font-light">TERMS</span>
        </h2>
        
        {/* Description Text */}
        <p className="text-gray-600 text-lg lg:text-xl leading-relaxed mb-12 max-w-3xl mx-auto">
          Access all the information on the Data Processing Agreement, PAIA Manual (Protection of 
          Personal Information Act) and the general use of Website Terms.
        </p>
        
        {/* Call to Action Button */}
        <div className="relative inline-block">
          {/* Button glow effect */}
          <div className="absolute inset-0 bg-blue-400 rounded-full blur-lg opacity-30 scale-110"></div>
          
          {/* Actual button */}
          <button className="relative bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            VIEW HERE
          </button>
        </div>
        
      </div>
    </section>




       <Footer/>

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
export default AboutUsPage;