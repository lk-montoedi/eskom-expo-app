import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { useContext } from 'react';
import { NotificationContext } from '@/context/notificationContext';
import logoEskom from "/src/assets/img/logo01.png";
import { Typography } from "@material-tailwind/react";

const roles = [
  "learner",
  "admin",
  "teacher",
  "judge",
  "convener"
];

export function Sidenav({ brandImg, brandName, routes, Role }) {
  const { hasNewNotifications } = useContext(NotificationContext);
  // Added safety check for Role prop
  if (!Role) {
    console.warn("Role prop is missing or undefined in Sidenav component");
    return (
      <aside className="w-64 bg-white shadow-md overflow-y-auto px-4 py-6 rounded-lg mt-6 mb-6 ml-8">
        <div className="mb-6">
          <NavLink to="/" className="flex items-center gap-2">
            <img src={logoEskom} alt="Logo" className="h-10" />
          </NavLink>
        </div>
        <nav className="flex flex-col gap-2">
          <div className="text-center text-gray-500 py-4">
            Loading navigation...
          </div>
        </nav>
      </aside>
    );
  }

  // Function to filter routes based on user role
  const filterRoutesByRole = (routes, userRole) => {
    const allPages = routes
      .filter((section) => section.layout === "dashboard")
      .flatMap((section) => section.pages);
    
    return allPages.filter((page) => {
      const pageName = page.name.toLowerCase();
      
      switch (userRole.toLowerCase()) {
        case "learner":
          // Show only projects, notifications, and profile
          return ["events","projects", "profile", "notifications"].includes(pageName);
        
        case "admin":
          // Show everything
          return ["events", "schools", "notifications", "profile","reports"].includes(pageName);
        
        case "teacher":
          // Show schools, users (learners), and projects
          return ["events","schools", "profile", "notifications"].includes(pageName);
        
        case "judge":
          // Show only events
          return ["events", "profile", "rewards", "notifications"].includes(pageName);

        case "convener":
        // Show only events
        return ["events", "profile", "appointments", "rewards", "notifications"].includes(pageName);
        
        default:
          // If role is not recognized, show nothing
          console.warn(`Unknown role: ${userRole}`);
          return false;
      }
    });
  };

  // Get filtered routes based on the current user's role
  const filteredRoutes = filterRoutesByRole(routes, Role);

  return (
    <aside className="w-64 bg-white shadow-md overflow-y-auto px-4 py-6 rounded-lg mt-6 mb-6 ml-8">
      <div className="mb-6">
        <NavLink to="/" className="flex items-center gap-2">
          <img src={logoEskom} alt="Logo" className="h-10" />
        </NavLink>
      </div>

      <nav className="flex flex-col gap-2">
        {filteredRoutes.map(({ name, path, icon }) => (
          <NavLink
            key={name}
            to={`/dashboard${path}`}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-3 py-2 rounded-lg text-lg font-medium ${
                isActive ? "bg-blue-100 text-blue-900" : "text-blue-gray-700 hover:bg-blue-50"
              }`
            }
          >
            {icon}
            {name}
            {name.toLowerCase() === "notifications" && hasNewNotifications && (
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

Sidenav.propTypes = {
  brandImg: PropTypes.string,
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
  Role: PropTypes.oneOf(roles).isRequired,
};