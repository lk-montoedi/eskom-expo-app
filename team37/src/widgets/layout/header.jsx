import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown, Search, Menu, X, Facebook, Instagram, Twitter, Youtube
} from "lucide-react";
import {
  socialLinks,
  navigationItems
} from "../../pages/home/dataStructures"

// Import your logo and navigation items
import EskomExpoLogoDiscover from "/src/assets/landingpageAssets/EskomExpoLogoDiscover.png";

function Header() {
  // State management
  const [showHeader, setShowHeader] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [lineStyle, setLineStyle] = useState({});
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Refs
  const navRef = useRef(null);
  const itemRefs = useRef([]);

  // Header scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 0) {
        // At top: show header
        setShowHeader(true);
      } else {
        // Scrolled away from top: hide header
        setShowHeader(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation line position effect
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

  // Event handlers
  const handleItemClick = (index) => {
    setActiveIndex(index);
    setOpenDropdown(null);
    setHoveredIndex(null); // Clear hover state to show active state
  };

  const handleItemHover = (index) => {
    setHoveredIndex(index);
  };

  const handleItemLeave = () => {
    setHoveredIndex(null);
  };

  const handleDropdownToggle = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const handleDropdownLeave = () => {
    setOpenDropdown(null);
    setHoveredIndex(null);
  };

  return (
    <div>
      {/* Top bar header - LOGIN, REGISTER & CONTACT INFO */}
      <header className={`fixed top-0 left-0 w-full bg-white shadow-sm z-50 transition-transform duration-300 ${
        showHeader ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="w-full px-2">
          <div className="flex justify-between items-center py-2 text-sm">
            {/* Left: Contact Info */}
            <div className="text-gray-600">
              Phone: +27 (0) 11 894 1365 | Email: support@exposcience.co.za
            </div>

            {/* Right: Login/Register + Social */}
            <div className="flex items-center space-x-4">
              <nav className="flex gap-2">
                <Link 
                  to="/auth/sign-in" 
                  className="px-4 py-1 border-2 border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition-colors duration-300"
                >
                  Login
                </Link>
                <Link 
                  to="/auth/select-user-register" 
                  className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-300"
                >
                  Register
                </Link>
              </nav>
              
              {/* Social Links */}
              <div className="flex items-center space-x-2">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
                      aria-label={social.name}
                    >
                      <IconComponent size={16} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main header - LOGO & NAV BAR */}
      <header className={`fixed w-full bg-white shadow-sm z-40 transition-all duration-300 ${
        showHeader ? 'top-[40px]' : 'top-0'
      }`}>
        <div className="w-full px-2">
          <div className="flex justify-between items-center py-4">
            {/* Left: Logo */}
            <div className="flex items-center">
              <img src={EskomExpoLogoDiscover} alt="Company Logo" className="h-12 w-auto" />
            </div>

            {/* Center: Nav Menu */}
            <nav 
              ref={navRef}
              className="hidden lg:flex items-center space-x-8 relative"
            >
              {/* Animated underline */}
              <div 
                className="absolute bottom-0 h-0.5 bg-blue-600 transition-all duration-300"
                style={lineStyle}
              />
              
              {navigationItems.map((item, index) => (
                <div
                  key={item.name}
                  className="relative"
                  ref={(el) => itemRefs.current[index] = el}
                  onMouseEnter={() => handleItemHover(index)}
                  onMouseLeave={handleItemLeave}
                >
                  <div className="flex items-center space-x-1">
                    {item.href.startsWith('http') ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center space-x-2 py-2 transition-colors duration-300 ${
                          activeIndex === index ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                        }`}
                        onClick={() => handleItemClick(index)}
                      >
                        <span className="text-sm">{item.icon}</span>
                        <span className="font-medium">{item.name}</span>
                      </a>
                    ) : (
                      <Link
                        to={item.href}
                        className={`flex items-center space-x-2 py-2 transition-colors duration-300 ${
                          activeIndex === index ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                        }`}
                        onClick={() => handleItemClick(index)}
                      >
                        <span className="text-sm">{item.icon}</span>
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    )}
                    
                    {item.subItems.length > 0 && (
                      <button
                        onClick={() => handleDropdownToggle(index)}
                        className="text-gray-700 hover:text-blue-600 transition-colors duration-300"
                      >
                        <ChevronDown size={16} />
                      </button>
                    )}
                  </div>

                  {/* Dropdown Menu */}
                  {item.subItems.length > 0 && (openDropdown === index || hoveredIndex === index) && (
                    <div 
                      className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50"
                      onMouseEnter={() => handleItemHover(index)}
                      onMouseLeave={handleDropdownLeave}
                    >
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.href}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors duration-300"
                          onClick={() => setOpenDropdown(null)}
                        >
                          {subItem.icon && <span className="text-xs">{subItem.icon}</span>}
                          <span>{subItem.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right: Search & Mobile Menu */}
           {/* <div className="flex items-center space-x-4">
             
            </div>*/}
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-30 lg:hidden" style={{ top: showHeader ? '88px' : '48px' }}>
          <div className="flex flex-col space-y-4 p-4">
            {navigationItems.map((item, index) => (
              <div key={item.name}>
                <div className="flex items-center justify-between">
                  {item.href.startsWith('http') ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 py-2 text-gray-700 hover:text-blue-600"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleItemClick(index);
                      }}
                    >
                      <span className="text-sm">{item.icon}</span>
                      <span>{item.name}</span>
                    </a>
                  ) : (
                    <Link
                      to={item.href}
                      className="flex items-center space-x-2 py-2 text-gray-700 hover:text-blue-600"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleItemClick(index);
                      }}
                    >
                      <span className="text-sm">{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  )}
                  
                  {item.subItems.length > 0 && (
                    <button
                      onClick={() => handleDropdownToggle(index)}
                      className="text-gray-700 hover:text-blue-600"
                    >
                      <ChevronDown size={16} />
                    </button>
                  )}
                </div>
                
                {/* Mobile dropdown items */}
                {item.subItems.length > 0 && openDropdown === index && (
                  <div className="ml-6 space-y-2">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.name}
                        to={subItem.href}
                        className="flex items-center space-x-2 py-1 text-sm text-gray-600 hover:text-blue-600"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setOpenDropdown(null);
                        }}
                      >
                        {subItem.icon && <span className="text-xs">{subItem.icon}</span>}
                        <span>{subItem.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {/* Mobile Social Links */}
            <div className="border-t pt-4 mt-4">
              <p className="text-sm text-gray-600 mb-2">Follow us:</p>
              <div className="flex space-x-4">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
                      aria-label={social.name}
                    >
                      <IconComponent size={20} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;