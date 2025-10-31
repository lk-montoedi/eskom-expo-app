// Importing icons from lucide-react library to be used in navigation and social links
import {
  ChevronLeft, ChevronRight, Play, Pause, MapPin, Mail, Phone, MessageCircle,
  Facebook, Instagram, Twitter, Youtube, Search, Menu, X
} from "lucide-react";

/* =============================
   NAVIGATION DATA STRUCTURE
   ============================= */

// This array holds all main navigation items for the website
const navigationItems = [
  { 
    name: "Home", 
    href: "/", 
    icon: "🏠",
    subItems: [] // No sub-items for Home
  },
  { 
    name: "About Us", 
    href: "/home/AboutUsPage", 
    icon: "📋",
    subItems: [ // Sub-navigation under About Us
      { name: "Our Team", href: "/home/ourTeam" },
      { name: "Website Terms", href: "/about/terms" }
    ]
  },
  { 
    name: "Projects", 
    href: "/home/ProjectsPage", 
    icon: "📊",
    subItems: [ // Categories of projects
      { name: "Categories", href: "/home/CategoriesPage" },
     // { name: "Ethics", href: "/projects/ethics" }
    ]
  },
  /*{ 
    name: "News", 
    href: "https://exposcience.co.za/news/", 
    icon: "📰",
    subItems: [ // Different news-related pages
      { name: "Gallery", href: "/news/gallery" }
    ]
  },
  { 
    name: "Resources", 
    href: "https://exposcience.co.za/get-involved/resources/", 
    icon: "📚",
    subItems: [] // No sub-items listed for Resources
  },
  { 
    name: "Get Involved", 
    href: "https://exposcience.co.za/get-involved/", 
    icon: "✋",
    subItems: [ // Engagement opportunities
      { name: "Participate", href: "/get-involved/join", icon: "🤝" },
      { name: "Judges", href: "/get-involved/volunteer", icon: "🙋" }
    ]
  },
 /* { 
    name: "ISF", 
    href: "https://exposcience.co.za/isf/", 
    icon: "🏆",
    subItems: [ // International Science Fair info
      { name: "About ISF", href: "/isf/about", icon: "ℹ️" },
      { name: "Competitions", href: "/isf/competitions", icon: "🏅" },
      { name: "Results", href: "/isf/results", icon: "📊" }
    ]
  },
  { 
    name: "FAQ", 
    href: "/faq", 
    icon: "❓",
    subItems: [] // No sub-items for FAQ
  }*/
];

/* =============================
   SOCIAL MEDIA LINKS 
   ============================= */

// This array stores external social media links and their corresponding icon components
const socialLinks = [
  { name: "Facebook", href: "https://www.facebook.com/Exposcience/", icon: Facebook },
  { name: "Instagram", href: "https://www.instagram.com/eskom_expo/#", icon: Instagram },
  { name: "Twitter", href: "https://x.com/Exposcience", icon: Twitter }, // Fixed Twitter link
  { name: "Youtube", href: "#", icon: Youtube }
];

/* =============================
   EXPORTING DATA STRUCTURES
   ============================= */

// Export both navigationItems and socialLinks to be used in other components
export {
  socialLinks,
  navigationItems
};
