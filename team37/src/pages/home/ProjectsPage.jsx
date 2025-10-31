// About Us Page from Landing page component for Eskom Expo 
// =============================================================================

import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { Button, Typography } from "@material-tailwind/react";
import { motion } from "framer-motion";
import { Mail, MapPin,School,Rocket,Beaker,Users, ArrowRight} from "lucide-react";

// IMAGE IMPORTS
// Dashboard and content images
import patternImg from "/src/assets/img/tests-eskom.png";
import dashboardImg from "/src/assets/img/dashboard-learner.png";
import contentImg from "/src/assets/img/content-image-3.png";


import { Footer} from "../../widgets/layout/footer"
import Header from "../../widgets/layout/header"

// Projects Page images
import MainProjectsPage from "/src/assets/ProjectsPageAssests/MainProjectsPage.jpg";
import ScienceImage from "/src/assets/ProjectsPageAssests/ScienceImage.png";
import ScienceWrite from "/src/assets/ProjectsPageAssests/ScienceWrite.png";

// Explanation and logo images
import EskomExpoLogoDiscover from "/src/assets/landingpageAssets/EskomExpoLogoDiscover.png";


function ProjectsPage() {
  /* ====================
  STATE MANAGEMENT
   ====================*/
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null)

  // =================
  // DATA STRUCTURES
  // =================
const steps = [
    "Tap into your curiosity and unleash your creativity—identifying what interests you",
    "Narrow your interests and focus on a specific topic for your research",
    "Determine the significance/value of your research",
    "Read up on the chosen topic—literature review",
    "How will you go about creating/testing/sampling",
    "Think about any potential Ethics or safety issues that you may encounter when doing this research.",
    "Submit Identify Potential Ethics Violations document—ethics@exposcience.co.za",
    "Wait for response from ethics committee.",
    "Write your Research Plan",
    "Jot down everything that you do concerning your project, in a book",
    "Take pictures and/or video whilst doing the research",
    "Write your Research Report",
    "Write your Abstract",
    "Write up your Poster"
  ];

  // ==================
  // PROJECTS PAGE EFFECTS
  // ==================
          useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
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
  // RENDERING OF THE PROJECTS PAGE
  // ============================
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
                              src={MainProjectsPage}
                              alt="Eskom Expo Young Scientists Group Photo" 
                              className="w-full h-full object-cover scale-100"
                              />
                              
                              {/* Dark Overlay for Better Text Visibility */}
                              <div className="absolute inset-0 bg-black/50"></div>
                              
                              {/* About Us Title Overlay */}
                              <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center text-white">
                                  <h2 className="text-4xl md:text-6xl font-playfair font-thin ">
                                  Projects
                                  </h2>
                                 {/*underlining text- <div className="w-25 h-1 bg-white mx-auto mt-4 opacity-80"></div>*/} 
                              </div>
                              </div>
                          </div>
                       </section>  
        </main>
    
      {/* ======================= */}
      {/* NEXT SECTION */}
      {/* ======================= */}

      <div ref={sectionRef} className="w-full overflow-hidden">

      {/* First Section - Scientists in the Making */}

      <div className="min-h-screen flex">
        {/* Left Side - White Background */}
        <div className={`w-1/2 bg-white p-16 flex flex-col justify-center transition-all duration-1000 ease-out ${
          isVisible 
            ? 'transform translate-x-0 opacity-100' 
            : 'transform -translate-x-full opacity-0'
        }`}>
          <div className="max-w-lg">
            <h1 className="text-5xl md:text-6xl font-playfair font-bold text-gray-800 mb-8 leading-tight">
              SCIENTISTS IN THE MAKING
            </h1>
            <h2 className="text-xl text-gray-600 font-playfair font-medium mb-12">
              THIS IS WHERE IT ALL STARTS
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Are you in school and working on an innovation or expanding on existing knowledge? 
              Join Eskom Expo for Young Scientists and exhibit your project at one of 35 regional 
              expos countrywide. Conduct research and present it in written and visual form at your 
              nearest expo region
            </p>
          </div>
        </div>

        {/* Right Side - Green Background */}
        <div className={`w-1/2 bg-[#8B9B3A] p-16 flex flex-col justify-center text-white transition-all duration-1000 ease-out delay-200 ${
          isVisible 
            ? 'transform translate-x-0 opacity-100' 
            : 'transform translate-x-full opacity-0'
        }`}>
          <div className="max-w-lg">
            <h2 className="text-4xl font-playfair font-bold mb-8">TYPES OF PROJECTS</h2>
            <p className="text-lg mb-12 opacity-90">
              Your project idea can be classified as one of four types of projects, namely:
            </p>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-playfair font-bold mb-3">Scientific Investigations/Experimental</h3>
                <p className="text-sm leading-relaxed opacity-90">
                  They follow a method that answers a research question and tests a hypothesis, usually through 
                  observations and experimentation. It involves collecting and analysing data to reach a conclusion.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-playfair font-bold mb-3">Engineering/Computer Science</h3>
                <p className="text-sm leading-relaxed opacity-90">
                  They follow a design process according to the criteria, to build, test, redesign and retest a 
                  prototype/product/solution e.g. a device or a computer code.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-playfair font-bold mb-3">Social Sciences</h3>
                <p className="text-sm leading-relaxed opacity-90">
                  They follow a systematic approach that involves answering questions or testing a hypothesis of the functioning of human 
                  society by observations and analysing of human behaviour, social relationships, social issues, and other phenomena.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-playfair  font-bold mb-3">Mathematics/Theoretical</h3>
                <p className="text-sm leading-relaxed opacity-90">
                  These projects explore quantity, structure, space and change. Starting with an observation, problem or question, make 
                  conjectures/hypotheses, prove your claim using new or existing methods, make valid deductions and test your ideas theoretically. Your reasoning and 
                  arguments must be logical.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Second Section - Getting Started */}
      <div className="min-h-screen flex">
        {/* Left Side - Blue Background */}
        <div className={`w-1/2 bg-blue-300 p-16 flex flex-col justify-center text-white transition-all duration-1000 ease-out delay-400 ${
          isVisible 
            ? 'transform translate-y-0 opacity-100' 
            : 'transform translate-y-full opacity-0'
        }`}>
          <div className="max-w-lg">
            <h2 className="text-4xl font-playfair font-bold mb-8">GETTING STARTED:</h2>
            <p className="text-lg mb-12 opacity-90">
              To register make sure you have the following:
            </p>
            
            <div className="grid grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-800 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Mail className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-lg font-playfair font-bold">VALID EMAIL ADDRESS</h3>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-800 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <MapPin className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-lg font-playfair  font-bold">REGION NAME</h3>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-800 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <School className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-lg font-playfair font-bold">SCHOOL NAME</h3>
              </div>
            </div>
            
            <p className="text-sm opacity-75">
              — all learners to register own accounts, even group projects.
            </p>
          </div>
        </div>

        {/* Right Side - Green Background with Illustration Space */}
        <div className={`w-1/2 bg-[#8B9B3A] p-16 flex items-center justify-center transition-all duration-1000 ease-out delay-600 ${
          isVisible 
            ? 'transform translate-x-0 opacity-100' 
            : 'transform translate-x-full opacity-0'
        }`}>
          <div className="w-full h-full flex items-center justify-center">
            {/* Placeholder for scientist illustration */}
            
             <img 
              src={ScienceImage} 
              alt="Scientist illustration" 
              className="max-w-full max-h-full object-contain"
            />
          
          </div>
        </div>
      </div>
    </div>

      {/* ====================== */}
      {/* A GOOD EXPO PROJECT SECTION */}
      {/* ====================== */}

          <section ref={sectionRef} className="w-full bg-[#5F8A8B] py-24 px-8 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className={`text-center mb-20 transition-all duration-1000 ease-out ${
              isVisible 
                ? 'transform translate-y-0 opacity-100' 
                : 'transform -translate-y-16 opacity-0'
            }`}>
              <h2 className="text-5xl md:text-6xl font-playfair font-bold text-white mb-6">
                A GOOD EXPO PROJECT:
              </h2>
              <p className="text-xl text-white/80 max-w-4xl mx-auto">
                The best expo projects are not always complicated, but are imaginative and well executed.
              </p>
            </div>

            {/* Three Icons Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 items-center">
              
              {/* First Item - Rocket (Slides from left) */}
              <div className={`text-center transition-all duration-1000 ease-out delay-200 ${
                isVisible 
                  ? 'transform translate-x-0 opacity-100' 
                  : 'transform -translate-x-16 opacity-0'
              }`}>
                <div className="mb-8 flex justify-center">
                  <div className="w-48 h-48 flex items-center justify-center">
                    <Rocket className="w-32 h-32 text-white/30" strokeWidth={1} />
                  </div>
                </div>
                <h3 className="text-2xl font-playfair font-bold text-white mb-4">
                  An innovative solution to an<br />existing problem
                </h3>
              </div>

              {/* Second Item - Flask (Slides from bottom) */}
              <div className={`text-center transition-all duration-1000 ease-out delay-400 ${
                isVisible 
                  ? 'transform translate-y-0 opacity-100' 
                  : 'transform translate-y-16 opacity-0'
              }`}>
                <div className="mb-8 flex justify-center">
                  <div className="w-48 h-48 flex items-center justify-center">
                    <Beaker className="w-32 h-32 text-white/30" strokeWidth={1} />
                  </div>
                </div>
                <h3 className="text-2xl font-playfair  font-bold text-white mb-4">
                  A new approach / methodology<br />to an existing solution
                </h3>
              </div>

              {/* Third Item - Users (Slides from right) */}
              <div className={`text-center transition-all duration-800 ease-out delay-600 ${
                isVisible 
                  ? 'transform translate-x-0 opacity-100' 
                  : 'transform translate-x-16 opacity-0'
              }`}>
                <div className="mb-8 flex justify-center">
                  <div className="w-48 h-48 flex items-center justify-center">
                    <Users className="w-32 h-32 text-white/30" strokeWidth={1} />
                  </div>
                </div>
                <h3 className="text-2xl font-playfair font-bold text-white mb-4">
                  An insight into social behaviour
                </h3>
              </div>

            </div>
          </div>
      </section>



       {/* ====================== */}
      {/* STEPS SECTION */}
      {/* ====================== */}
       <section ref={sectionRef} className="w-full bg-gray-50 py-24 px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className={`text-center mb-20 transition-all duration-1000 ease-out ${
          isVisible 
            ? 'transform translate-y-0 opacity-100' 
            : 'transform -translate-y-16 opacity-0'
        }`}>
          <h2 className="text-5xl md:text-6xl font-playfair font-bold text-gray-800 mb-6">
            GETTING STARTED – PROJECT:
          </h2>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side - Image*/}
          <div className={`flex justify-center lg:justify-end transition-all duration-1000 ease-out delay-200 ${
            isVisible 
              ? 'transform translate-x-0 opacity-100' 
              : 'transform -translate-x-16 opacity-0'
          }`}>
            <div className="w-full max-w-lg">
            
              <img 
                src={ScienceWrite} 
                alt="Project planning illustration" 
                className="w-full h-auto object-contain"
              />
              
            </div>
          </div>

          {/* Right Side - Steps List */}
          <div className={`transition-all duration-1000 ease-out delay-400 ${
            isVisible 
              ? 'transform translate-x-0 opacity-100' 
              : 'transform translate-x-16 opacity-0'
          }`}>
            <div className="space-y-2">
              {steps.map((step, index) => (
                <div 
                  key={index}
                  className={`flex items-start space-x-4 transition-all duration-500 ease-out ${
                    isVisible 
                      ? 'transform translate-x-0 opacity-100' 
                      : 'transform translate-x-8 opacity-0'
                  }`}
                  style={{ transitionDelay: `${600 + (index * 100)}ms` }}
                >
                  <div className="flex-shrink-0 mt-2">
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>

      {/* ====================== */}
      {/* FOOTER SECTION */}
      {/* ====================== */}

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
export default ProjectsPage;