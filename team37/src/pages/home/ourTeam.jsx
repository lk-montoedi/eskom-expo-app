
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

// Explanation and logo images
import EskomExpoLogoDiscover from "/src/assets/landingpageAssets/EskomExpoLogoDiscover.png";
import Banner from "/src/assets/aboutUsAssets/BannerTeam.jpg";

// Team Members Images
import BersanLersch from "/src/assets/aboutUsAssets/BersanLersch.jpg";
import AnithaRamsuran from "/src/assets/aboutUsAssets/AnithaRamsuran.jpg";
import ParthyChetty from "/src/assets/aboutUsAssets/ParthyChetty.jpg";
import KrishieNaidoo from "/src/assets/aboutUsAssets/KrishieNaidoo.jpg";
import JohanMalherbe from "/src/assets/aboutUsAssets/JohanMalherbe.jpg";
import IanJandrell from "/src/assets/aboutUsAssets/IanJandrell.jpg";
import NomalediMbambisa from "/src/assets/aboutUsAssets/NomalediMbambisa.jpg";
import WalterMeyer from "/src/assets/aboutUsAssets/WalterMeyer.jpg";
import ElspethKhembo from "/src/assets/aboutUsAssets/ElspethKhembo.jpg";
import MamoeletsiMosia from "/src/assets/aboutUsAssets/MamoeletsiMosia.jpg";
import RanciaRiba from "/src/assets/aboutUsAssets/RanciaRiba.jpg";
import BoipeloMokgoje from "/src/assets/aboutUsAssets/BoipeloMokgoje.jpg";
import JeVanneGibbs from "/src/assets/aboutUsAssets/JeVanneGibbs.jpg";
import LuluMiya from "/src/assets/aboutUsAssets/LuluMiya.jpg";
import SagwadiMaluleke from "/src/assets/aboutUsAssets/SagwadiMaluleke.jpg";
import NichoSwartz from "/src/assets/aboutUsAssets/NichoSwartz.jpg";
import SureMupezeni from "/src/assets/aboutUsAssets/SureMupezeni.jpg";
import InnocentMarume from "/src/assets/aboutUsAssets/InnocentMarume.jpg";
import LyndonManas from "/src/assets/aboutUsAssets/LyndonManas.jpg";
import SihleShange from "/src/assets/aboutUsAssets/SihleShange.jpg";
import MmabathoMoloedi from "/src/assets/aboutUsAssets/MmabathoMoloedi.jpg";
import RavenMotsewabangwe from "/src/assets/aboutUsAssets/RavenMotsewabangwe.jpg";
import NaliniDookie from "/src/assets/aboutUsAssets/NaliniDookie.jpg";
import KatlegoTsogang from "/src/assets/aboutUsAssets/KatlegoTsogang.jpg";




export default function OurTeam(){
  
  
    const [visibleItems, setVisibleItems] = useState(new Set());
  const itemRefsPic = useRef([]);

    const directorsData = [
    {
      id: 1,
      name: "Bersan Lersch",
      position: "Chairman",
      department: "Department of Science and Innovation",
      image: BersanLersch
    },
    {
      id: 2,
      name: "Dr Anitha Ramsuran",
      position: "Vice Chairman",
      department: "Technology Innovation Agency",
      image: AnithaRamsuran
    },
    {
      id: 3,
      name: "Parthy Chetty",
      position: "Executive Director",
      department: "Eskom Expo for young scientists",
      image: ParthyChetty
    },
    {
      id: 4,
      name: "Dr Krishie Naidoo",
      position: "Academic Director",
      department: "Eskom Expo for young scientists",
      image: KrishieNaidoo
    },
    {
      id: 5,
      name: "Prof Johan Malherbe",
      position: "Director",
      department: "University of Pretoria",
      image: JohanMalherbe
    },
    {
      id: 6,
      name: "Prof Ian Jandrell",
      position: "Director",
      department: "University of Witswatersrand",
      image: IanJandrell
    },
    {
      id: 7,
      name: "Nomaledi Mbambisa",
      position: "Director",
      department: "Regional Science Fair representative",
      image: NomalediMbambisa
    },
    {
      id: 8,
      name: "Prof Walter Meyer",
      position: "Finance Director",
      department: "UP/Derek Gray Trust",
      image: WalterMeyer
    }
  ];
  const restData=[
    {
      id: 1,
      name: "Elspeth Khembo",
      position: "Director",
      department: "Department of Basic Education",
      image: ElspethKhembo
    },
    {
      id: 2,
      name: "Dr Mamoeletsi Mosia ",
      position: "Director",
      department: "South Africa Agency for Science and Technology Advancement(SAASTA)",
      image: MamoeletsiMosia
    },
    {
      id: 3,
      name: "Rancia Riba",
      position: "Expo Business Manager/Scribe",
      image: RanciaRiba
    },
    {
      id: 4,
      name: "Boipelo Mokgoje",
      position: "Finance Manager",
      image: BoipeloMokgoje
    },
    {
      id: 5,
      name: "JeVanne Gibbs",
      position: "Communications Manager",
      image: JeVanneGibbs
    },
    {
      id: 6,
      name: "Lulu Miya",
      position: "Academic Promgrammes Officer",
      image: LuluMiya
    },
    {
      id: 7,
      name: "Sagwadi Maluleke",
      position: "Academic Promgrammes Officer",
      image: SagwadiMaluleke
    },

  ]

  const provincialData = [
    {
      id: 1,
      name: "Nicho Swartz",
      position: "Free State Provincial Coordinator",
      image: NichoSwartz
    },
    {
      id: 2,
      name: "Sure Mupezeni",
      position: "Limpopo Provincial Coordinator",
      image: SureMupezeni
    },
    {
      id: 3,
      name: "Innocent Marume",
      position: "Mpumalanga Provincial Coordinator",
      image: InnocentMarume
    },
    {
      id: 4,
      name: "Lyndon Manas",
      position: "Western Cape Provincial Coordinator",
      image: LyndonManas
    },
    {
      id: 5,
      name: "Sihle Shange",
      position: "Eastern Cape Provincial Coordinator",
      image: SihleShange
    },
    {
      id: 6,
      name: "Mmabatho Moloedi",
      position: "North West Provincial  Coordinator",
      image: MmabathoMoloedi
    },{
      id: 7,
      name: "Raven Motsewabangwe",
      position: "Gauteng Provincial Coordinator",
      image: RavenMotsewabangwe
    },{
      id: 8,
      name: "Nalini Dookie",
      position: "Kwa-Zulu Natal Provincial Coordinator",
      image: NaliniDookie
    },{
      id: 9,
      name: "Katlego Tsogang",
      position: "Northern Cape Provincial Coordinator",
      image: KatlegoTsogang
    },
  
  
  
  ]
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            setVisibleItems(prev => new Set([...prev, index]));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    itemRefsPic.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const getAnimationClass = (index) => {
    const isVisible = visibleItems.has(index);
    // First row (0-3): alternate left-right
    // Second row (4-7): alternate left-right
    const isFromLeft = index % 2 === 0;
    
    if (!isVisible) {
      return isFromLeft 
        ? 'translate-x-[-100px] opacity-0' 
        : 'translate-x-[100px] opacity-0';
    }
    
    return 'translate-x-0 opacity-100';
  };

  
  const [currentDirectorIndex, setCurrentDirectorIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [charIndex, setCharIndex] = useState(0);

  const currentDirector = directorsData[currentDirectorIndex];
  const targetText = currentDirector.name;

  useEffect(() => {
    let timeout;

    if (isTyping) {
      if (charIndex < targetText.length) {
        timeout = setTimeout(() => {
          setDisplayedText(targetText.slice(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        }, 100); // Typing speed
      } else {
        // Finished typing, wait before starting to erase
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, 2000); // Display complete name for 2 seconds
      }
    } else {
      if (charIndex > 0) {
        timeout = setTimeout(() => {
          setDisplayedText(targetText.slice(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        }, 50); // Erasing speed (faster than typing)
      } else {
        // Finished erasing, move to next director
        setCurrentDirectorIndex((prevIndex) => 
          prevIndex === directorsData.length - 1 ? 0 : prevIndex + 1
        );
        setIsTyping(true);
      }
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isTyping, targetText, currentDirectorIndex, directorsData.length]);




    return (
         <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col overflow-auto">
        <Header/>


               {/* ================================== */}
                    {/* HERO CAROUSEL SECTION */}
                    {/* ================================== */}
                      <main className="relative w-full h-[70vh] overflow-hidden mt-[80px]">{/*Not hidden by header-increasing the mt according to size*/}
              
                           <section className="relative w-full h-full bg-gray-100 flex items-center justify-center">
                              {/* Main Image with Overlay */}
                              <div className="relative w-full h-screen">
                                  <img 
                                  src={Banner}
                                  alt="Banner" 
                                  className="w-full h-full object-cover scale-100"
                                  />
                                  
                                  
                                  
                                 
                              </div>
                           </section>
                                      
                      </main>

{/*Directors Data*/}
  <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-playfair font-bold text-gray-800 mb-4">Directors</h1>
          <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
        </div>

        {/* Directors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {directorsData.map((director, index) => (
            <div
              key={director.id}
              ref={el => itemRefsPic.current[index] = el}
              data-index={index}
              className={`group relative overflow-hidden rounded-lg shadow-lg transition-all duration-700 ease-out hover:shadow-2xl hover:scale-105 ${getAnimationClass(index)}`}
            >
              {/* Director Image */}
              <div className="relative h-80 overflow-hidden">
                <img
                  src={director.image}
                  alt={director.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                  
                  {/* Hover Content */}
                  <div className="text-white text-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 px-4">
                    <h3 className="text-xl font-playfair font-bold mb-2">{director.name}</h3>
                    <p className="text-xs text-gray-300">{director.department}</p>
                  </div>
                </div>
              </div>

              {/* Bottom info bar (always visible) */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black to-transparent p-4">
                <p className="text-blue-300 text-sm">{director.position}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Directors Section */}
        <div className="pt-12 pb-4 to-slate-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl w-full text-center">
            {/* Main heading */}
            <h1 className="text-5xl md:text-7xl font-playfair font-bold mb-8 leading-tight">
              <span className="text-black">Let's meet </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-black to-blue-900 relative">
                {displayedText}
                <span className="animate-pulse text-blue-400">|</span>
              </span>
              <span className="text-black"> and the rest of the team...</span>
            </h1>

            {/* Subtitle */}
            <p className="text-black-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              All our team are highly educated and have years of experience in education. 
              They do their best to ensure fascinating and educational lessons, so your children 
              get either basic knowledge and social skills they can implement in future.
            </p>
          </div>
        </div>      
    </div>
  </div>




    {/*Rest of the Directors Data*/}
          <div className="min-h-screen bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
            {/* Rest of the Directors/Team Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {restData.map((director, index) => (
                <div
                  key={director.id}
                  ref={el => itemRefsPic.current[index] = el}
                  data-index={index}
                  className={`group relative overflow-hidden rounded-lg shadow-lg transition-all duration-700 ease-out hover:shadow-2xl hover:scale-105 ${getAnimationClass(index)}`}
                >
                  {/* Director Image */}
                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={director.image}
                      alt={director.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                      {/* Hover Content */}
                      <div className="text-white text-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 px-4">
                        <h3 className="text-xl font-playfair font-bold mb-2">{director.name}</h3>
                        <p className="text-xs text-gray-300">{director.department}</p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom info bar (always visible) */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black to-transparent p-4">
                    <p className="text-blue-300 text-sm">{director.position}</p>
                  </div>
                </div>
              ))}
            </div>
          </div> {/* Close max-w-7xl container */}
        </div> {/* Close min-h-screen container */}


        <div className="min-h-screen bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-5xl font-playfair font-bold text-gray-800 mb-4">Provincial Coordinators</h1>
              <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
            </div>

            {/* Coordinators Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {provincialData.map((director, index) => (
                <div
                  key={director.id}
                  ref={el => itemRefsPic.current[index] = el}
                  data-index={index}
                  className={`group relative overflow-hidden rounded-lg shadow-lg transition-all duration-700 ease-out hover:shadow-2xl hover:scale-105 ${getAnimationClass(index)}`}
                >
                  {/* Coordinator Image */}
                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={director.image}
                      alt={director.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                      {/* Hover Content */}
                      <div className="text-white text-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 px-4">
                        <h3 className="text-xl font-bold mb-2">{director.name}</h3>
                      </div>
                    </div>
                  </div>

                  {/* Bottom info bar (always visible) */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black to-transparent p-4">
                    <p className="text-blue-300 text-sm">{director.position}</p>
                  </div>
                </div>
              ))}
            </div>
          </div> {/* Close max-w-7xl container */}
        </div> {/* Close min-h-screen container */}


      {/*------------------
      FOOTER HEADER
      ------------------*/}

       <Footer/>
      
    </div>
    );
}