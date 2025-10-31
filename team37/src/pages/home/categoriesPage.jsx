// About Us Page from Landing page component for Eskom Expo 
// =============================================================================

import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { Button, Typography } from "@material-tailwind/react";
import { motion } from "framer-motion";

// IMAGE IMPORTS

import { Footer} from "../../widgets/layout/footer"
import Header from "../../widgets/layout/header"

// Categories page  images
import Agricultural from "/src/assets/ProjectsPageAssests/agricultural.png";
import Engineering from "/src/assets/ProjectsPageAssests/engineering.png";
import AnimalSciences from "/src/assets/ProjectsPageAssests/animal-sciences.png";
import Biomedical from "/src/assets/ProjectsPageAssests/bio-medical.png";
import Chemistry from "/src/assets/ProjectsPageAssests/chemistry.png";
import ComputerScience from "/src/assets/ProjectsPageAssests/computer-science.png";
import Earthsciences from "/src/assets/ProjectsPageAssests/earth-sciences.png";
import Socialsciences from "/src/assets/ProjectsPageAssests/social-sciences.png";
import Plantsciences from "/src/assets/ProjectsPageAssests/plant-sciences.png";
import Energy from "/src/assets/ProjectsPageAssests/energy.png";
import Enviromental from "/src/assets/ProjectsPageAssests/enviromental.png";
import Maths from "/src/assets/ProjectsPageAssests/maths.png";
import Physics from "/src/assets/ProjectsPageAssests/physics.png";


function categoriesPage() {

  /* =================
  DATA STRUCTURES
  =================*/

     // Project categories data array
  const projectCategories = [
    {
      id: 1,
      title: "AGRICULTURAL SCIENCES",
      code: "(AGR)",
      description: "The study of farming methods used to raise and take care of plants and animals (livestock and wildlife)",
      subtopics: [
        "Animal Production",
        "Aquaculture",
        "Crop Sciences"
      ],
      imgSrc: Agricultural
    },
    {
      id: 2,
      title: "ANIMAL SCIENCES",
      code: "(ANI)",
      description: "The study of animals",
      subtopics: [
        "Animal Behaviour",
        "Animal Genetics", 
        "Animal Physiology",
        "Aquatic Animals",
        "Entomology"
      ],
      imgSrc: AnimalSciences
    },
    {
      id: 3,
      title: "BIOMEDICAL AND MEDICAL SCIENCES",
      code: "(BIO)",
      description: "Biomedical Sciences is the scientific understanding of how cells, organs and systems function and it is relevant to the understanding of human diseases and treatment. It is the application of science to knowledge, techniques and innovations regarding healthcare and medicine.",
      subtopics: [
        "Diseases and Illnesses"
      ],
      imgSrc: Biomedical
    },
    {
      id: 4,
      title: "CHEMISTRY",
      code: "(CHE)",
      description: "The study of matter and the changes it undergoes",
      subtopics: [
        "Analytical Chemistry",
        "Biochemistry",
        "Inorganic Chemistry",
        "Organic Chemistry",
        "Physical Chemistry"
      ],
      imgSrc: Chemistry
    },
    {
      id: 5,
      title: "COMPUTER SCIENCE",
      code: "(COM)",
      description: "The study of computers and computational systems",
      subtopics: [
        "Artificial Intelligence",
        "Software Development",
        "Data Science",
        "Cybersecurity"
      ],
      imgSrc: ComputerScience
    },
    {
      id: 6,
      title: "EARTH SCIENCES",
      code: "(EAR)",
      description: "The study of Earth and its processes",
      subtopics: [
        "Geology",
        "Meteorology",
        "Oceanography",
        "Seismology"
      ],
      imgSrc: Earthsciences
    },
    {
      id: 7,
      title: "ENGINEERING",
      code: "(ENG)",
      description: "The application of scientific and mathematical principles to design and build structures, machines, and systems",
      subtopics: [
        "Civil Engineering",
        "Mechanical Engineering",
        "Electrical Engineering",
        "Chemical Engineering"
      ],
      imgSrc: Engineering
    },
    {
      id: 8,
      title: "ENERGY",
      code: "(ENE)",
      description: "The study of energy sources, conversion, and utilization",
      subtopics: [
        "Renewable Energy",
        "Energy Storage",
        "Energy Efficiency",
        "Alternative Fuels"
      ],
      imgSrc: Energy
    },
    {
      id: 9,
      title: "ENVIRONMENTAL SCIENCES",
      code: "(ENV)",
      description: "The study of the environment and solutions to environmental problems",
      subtopics: [
        "Climate Change",
        "Pollution Control",
        "Conservation",
        "Sustainability"
      ],
      imgSrc: Enviromental
    },
    {
      id: 10,
      title: "MATHEMATICS",
      code: "(MAT)",
      description: "The study of numbers, shapes, patterns, and logical reasoning",
      subtopics: [
        "Applied Mathematics",
        "Statistics",
        "Mathematical Modeling",
        "Computational Mathematics"
      ],
      imgSrc: Maths
    },
    {
      id: 11,
      title: "PHYSICS",
      code: "(PHY)",
      description: "The study of matter, energy, and their interactions",
      subtopics: [
        "Quantum Physics",
        "Astrophysics",
        "Nuclear Physics",
        "Optics"
      ],
      imgSrc: Physics
    },
    {
      id: 12,
      title: "PLANT SCIENCES",
      code: "(PLA)",
      description: "The study of plants and their biological processes",
      subtopics: [
        "Plant Physiology",
        "Plant Genetics",
        "Botany",
        "Plant Pathology"
      ],
      imgSrc: Plantsciences
    },
    {
      id: 13,
      title: "SOCIAL SCIENCES",
      code: "(SOC)",
      description: "The study of human society and social relationships",
      subtopics: [
        "Psychology",
        "Sociology",
        "Economics",
        "Political Science"
      ],
      imgSrc: Socialsciences
    }
  ]
  
  // ====================
  // STATE MANAGEMENT
  // ====================
  const [stars, setStars] = useState([]);


    /* =================
     STATE MANAGEMENT
    ====================*/

  // Generate falling stars
  useEffect(() => {
    const generateStars = () => {
      const starData = [];
      const starCount = 150;
      
      for (let i = 0; i < starCount; i++) {
        starData.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1, // 1-4px
          speed: Math.random() * 0.3 + 0.1, // 0.1-0.4
          opacity: Math.random() * 0.8 + 0.2,
          twinkleSpeed: Math.random() * 0.02 + 0.01
        });
      }
      return starData;
    };

    setStars(generateStars());
  }, []);

  // Animation loop for falling stars
  useEffect(() => {
    const animate = () => {
      setStars(prevStars => 
        prevStars.map(star => {
          let newY = star.y + star.speed;
          let newX = star.x;
          
          // Reset star to top when it falls off screen
          if (newY > 100) {
            newY = -5;
            newX = Math.random() * 100;
          }
          
          return {
            ...star,
            x: newX,
            y: newY,
            opacity: 0.2 + 0.6 * Math.sin(Date.now() * star.twinkleSpeed)
          };
        })
      );
    };

    const interval = setInterval(animate, 50);
    return () => clearInterval(interval);
  }, []);
 

  // ============================
  // RENDERING OF THE CATEGORIES PAGE
  // ============================
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col overflow-auto">
        
      {/* HEADER SECTION */}
      
       <Header/>

      {/* ================================== */}
      {/* HERO CAROUSEL SECTION */}
      {/* ================================== */}
        <div className="relative w-full h-96 bg-gradient-to-b from-gray-900 via-blue-900 to-indigo-900 overflow-hidden flex items-center justify-center">
          {/* Falling Stars */}
          {stars.map(star => (
            <div
              key={star.id}
              className="absolute rounded-full bg-white"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                opacity: star.opacity,
                boxShadow: `0 0 ${star.size * 3}px rgba(255, 255, 255, 0.8)`,
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}
          
          {/* Additional twinkling background stars */}
          {Array.from({length: 80}).map((_, i) => (
            <div
              key={`bg-star-${i}`}
              className="absolute rounded-full bg-white animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                opacity: Math.random() * 0.6 + 0.2,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 2 + 1}s`
              }}
            />
          ))}
      
          {/* Nebula-like background effects */}
          <div className="absolute inset-0 bg-gradient-radial from-purple-500/10 via-transparent to-transparent"></div>
          <div className="absolute top-10 right-20 w-32 h-32 bg-blue-400/5 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 left-16 w-24 h-24 bg-purple-400/5 rounded-full blur-xl"></div>
          <div className="absolute top-32 left-32 w-20 h-20 bg-pink-400/5 rounded-full blur-xl"></div>
      
        {/* Title */}
          
        <h1 className="text-white text-5xl font-light tracking-wide text-center pt-16">
          Project Categories
        </h1>
      
    </div>
    
      {/* ==================================== */}
      {/* PROJECT CATEGORIES SECTION */}
      {/* ==================================== */}
          <div className="w-full">

            <div className="bg-gray-50 py-16 px-8">
              <div className="max-w-7xl mx-auto">
                {/* Download Button */}
                <div className="flex justify-end mb-12">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                    Download Project Categories
                  </button>
                </div>

                {/* 3-Column Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
                  {projectCategories.map((category, index) => (
                    <div key={category.id} className="flex flex-col items-center">
                      {/* Image Container */}
                      <div className="relative mb-6">
                        {/* Position Number */}
                        <div className="absolute top-2 left-2 z-20 bg-black bg-opacity-50 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center">
                          {index + 1}
                        </div>
                        
                        {/* Image */}
                        <img
                          src={category.imgSrc}
                          alt={category.title}
                          className="w-full h-auto"
                        />
                      </div>

                      {/* Category Title */}
                      <h3 className="text-lg font-bold text-gray-800 mb-2 text-center">
                        {category.title} {category.code}
                      </h3>

                      {/* Description */}
                      <div className="text-center text-gray-700 text-sm leading-relaxed max-w-sm">
                        <p className="mb-3">{category.description}</p>

                        {category.subtopics?.length > 0 && (
                          <div className="space-y-1">
                            {category.subtopics.map((subtopic, subtopicIndex) => (
                              <div key={subtopicIndex} className="text-xs text-gray-600">
                                • {subtopic}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

      
       {/* ============================= */}
       {/* FOOTER SECTION */}
       {/* ============================= */}

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
export default categoriesPage;