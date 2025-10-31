import PropTypes from "prop-types";
import { Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import logoEskom from "/src/assets/img/logo01.png";
import EskomExpoLogoDiscover from "/src/assets/landingpageAssets/EskomExpoLogoDiscover.png";

export function Footer({ brandName, brandLink, routes }) {
  const year = new Date().getFullYear();

  // Helper function to render science balls
  const renderScienceBall = ({ position, size, gradient, orbitSize = 1.5, duration = "4s" }) => {
    return (
      <div
        className={`absolute ${position} w-${size} h-${size} rounded-full ${gradient} bg-opacity-80 shadow-md flex items-center justify-center`}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="absolute w-full h-full animate-spin-orbit" style={{ animationDuration: duration }}>
            <div
              className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-${orbitSize} h-${orbitSize} bg-white rounded-full`}
            ></div>
          </div>
        </div>
      </div>
    );
  };

   {/* ========== Main Footer Grid Content ========== */}
  return (
    <footer className="bg-gray-800 text-white py-12 relative overflow-hidden bg-gradient-to-br from-black to-blue-900">

        {/* Rotating decorative elements - spread out and animated 
              <div className="absolute top-8 left-10 w-10 h-10 bg-green-400 rounded-full animate-spin-slow opacity-70"></div>
              <div className="absolute top-16 right-20 w-6 h-6 bg-purple-400 rounded-full animate-spin-slower opacity-60"></div>
              <div className="absolute bottom-10 left-1/3 w-8 h-8 bg-cyan-400 rounded-full animate-spin-slow opacity-80"></div>
              <div className="absolute bottom-16 right-1/4 w-5 h-5 bg-pink-400 rounded-full animate-spin-slower opacity-75"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-7 h-7 bg-yellow-400 rounded-full animate-spin-slow opacity-50"></div>*/}
      
      {/*Decorative Animated Science Balls === */}
      <>
        {renderScienceBall({ position: "top-8 left-10", size: 6, gradient: "bg-gradient-to-tr from-green-300 to-green-100" })}
        {renderScienceBall({ position: "top-20 right-20", size: 5, gradient: "bg-gradient-to-br from-purple-300 to-purple-100", orbitSize: 1, duration: "6s" })}
        {renderScienceBall({ position: "bottom-10 left-1/3", size: 6, gradient: "bg-gradient-to-tl from-cyan-300 to-cyan-100" })}
        {renderScienceBall({ position: "bottom-16 right-1/4", size: 4, gradient: "bg-gradient-to-bl from-pink-300 to-pink-100", orbitSize: 1, duration: "6s" })}
        {renderScienceBall({ position: "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2", size: 5, gradient: "bg-gradient-to-tr from-yellow-300 to-yellow-100", duration: "5s" })}
        {renderScienceBall({ position: "top-6 right-1/3", size: 5, gradient: "bg-gradient-to-r from-indigo-300 to-indigo-100", orbitSize: 1, duration: "6s" })}
        {renderScienceBall({ position: "bottom-20 left-14", size: 6, gradient: "bg-gradient-to-br from-blue-300 to-blue-100" })}
      </>

      {/* === Grid styling and texts === */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Tweets by Exposcience Section */}
          <a href="https://x.com/Exposcience?ref_src=twsrc%5Etfw" target="_blank" rel="noopener noreferrer" className="block">
            <h3 className="text-lg font-playfair font-thin mb-4 cursor-pointer hover:underline">
              Tweets by Exposcience
            </h3>
          </a>

          {/* About Us Section */}
          <div>
            <h3 className="text-lg font-playfair font-thin mb-4 text-white-300">ABOUT US</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Eskom Expo for Young Scientists is an exposition, or science fair, where 
              students have a chance to show others their projects about their own 
              scientific investigations. At the annual prestigious Eskom Expo for Young 
              Scientists International Science Fair (ISF), selected students from 35 Expo 
              Regions in South Africa then compete against the best young scientists 
              from around the country and around the world.
            </p>
          </div>

          {/* Contact Information Section */}
          <div>
            <h3 className="text-lg font-playfair font-thin mb-4 text-white-300">CONTACT INFORMATION</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-playfair font-thin text-gray-300 mb-1">ADDRESS</h4>
                <p className="text-gray-300 text-sm">63 Reier Road Atlasville Boksburg</p>
              </div>
              <div>
                <h4 className="text-sm font-playfair font-thin text-gray-300 mb-1">TELEPHONE</h4>
                <p className="text-gray-300 text-sm">011 894 1365</p>
              </div>
              <div>
                <h4 className="text-sm font-playfair font-thin text-gray-300 mb-1">EMAIL ADDRESS</h4>
                <p className="text-gray-300 text-sm">support@exposcience.co.za</p>
              </div>
            </div>
          </div>

          {/* Connect With Us Section */}
          <div>
            <h3 className="text-lg font-playfair font-thin mb-4 text-white-300">CONNECT WITH US</h3>
            <div className="space-y-3 mb-6">
              <a href="https://www.instagram.com/eskom_expo/#" className="block text-blue-400 hover:text-blue-300 transition-colors text-sm">
                Twitter
              </a>
              <a href="https://www.facebook.com/Exposcience/" className="block text-blue-400 hover:text-blue-300 transition-colors text-sm">
                Facebook
              </a>
              <a href="https://www.instagram.com/eskom_expo/#" className="block text-blue-400 hover:text-blue-300 transition-colors text-sm">
                Instagram
              </a>
              <a href="#" className="block text-blue-400 hover:text-blue-300 transition-colors text-sm">
                YouTube
              </a>
            </div>

            {/* Logo placeholder */}
            <div className="mt-6">
              <img 
                src={EskomExpoLogoDiscover}
                alt="Discover Your Future Logo" 
                className="w-full max-w-xs"
              />
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>© Expo for Young Scientists. All right reserved. Website Terms.</p>
            <p>
              Crafted by{' '}
              <span className="text-white font-medium">
                <span className="text-blue-400"></span> Top Tech Coders
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
