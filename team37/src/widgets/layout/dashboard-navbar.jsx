import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Breadcrumbs,
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Badge,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  BellIcon,
  MagnifyingGlassIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import profilepic from "../../assets/aboutUsAssets/profilepic.png";

// Utility to capitalize breadcrumb text
const formatBreadcrumbText = (text) =>
  text ? text.charAt(0).toUpperCase() + text.slice(1) : "";

const getNotificationCount = () => 2; // You can later replace this with a dynamic fetch

export function DashboardNavbar({ name, role }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    firstContact: "",
    secondContact: "",
    email: "",
    profilePicture: profilepic,
    province: "",
    region: "",
    district: "",
    schoolName: "",
    grade: "",
    disability: "",
    disabilityInfo: "",
    race: "",
    gender: "",
    dateOfBirth: "",
    role: "",
  });

  const [layout, page] = pathname.split("/").filter((el) => el !== "");

  useEffect(() => {
    const getUserData = () => {
      try {
        const storedUserData = sessionStorage.getItem("userData");
        if (storedUserData) {
          const parsedUserData = JSON.parse(storedUserData);
          setFormData((prev) => ({
            ...prev,
            name: parsedUserData.name || "",
            surname: parsedUserData.surname || "",
            email: parsedUserData.email || "",
            role: parsedUserData.role || "",
          }));
        }
      } catch (err) {
        console.error("Error parsing user data from sessionStorage:", err);
      }
    };

    getUserData();
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate("/auth/sign-in");
  };

  return (
    <Navbar className="sticky top-4 z-50 w-full max-w-full px-4 py-3 rounded-none shadow-md bg-blue-900 border-b border-blue-800">
      <div className="flex items-center justify-between w-full gap-4">
        {/* Left Side - Breadcrumbs */}
        <div className="capitalize">
          <Breadcrumbs className="bg-blue-900">
            <Link to={`/${layout}`}>
              <Typography
                variant="small"
                className="font-normal text-blue-300 hover:text-blue-100 transition-all"
              >
                {layout}
              </Typography>
            </Link>
            <Typography variant="small" className="font-normal text-blue-100">
              {page}
            </Typography>
            <Typography variant="small" className="font-semibold text-white">
              {formatBreadcrumbText(page)}
            </Typography>
          </Breadcrumbs>
        </div>

        {/* Right Side - Controls */}
        <div className="flex items-center gap-4 ml-auto">
          

          {/* User Menu */}
          <Menu placement="bottom-end">
            <MenuHandler>
              <Button
                variant="text"
                className="flex items-center gap-2 px-3 py-1.5 text-white bg-gradient-to-r from-blue-700/40 to-indigo-700/40 hover:from-blue-600/60 hover:to-indigo-600/60 transition-all duration-300 rounded-lg border border-blue-500/30 min-w-[120px] max-w-full"
              >
                <Avatar
                  src={formData.profilePicture}
                  alt="profile"
                  size="sm"
                  variant="circular"
                  className="border-2 border-blue-400/50 shadow-lg"
                />
                <div className="hidden lg:block text-left w-fit whitespace-nowrap">
                  <Typography
                    variant="small"
                    className="font-semibold text-white text-xs"
                  >
                    {name}
                  </Typography>
                  <Typography
                    variant="small"
                    className="text-blue-300 text-xs"
                  >
                    {role}
                  </Typography>
                </div>
              </Button>
            </MenuHandler>
            <MenuList className="w-56 border border-blue-600/30 bg-gradient-to-b from-blue-900/95 to-indigo-900/95 backdrop-blur-lg shadow-2xl rounded-xl p-2 mt-2">
              <Link to="/dashboard/profile">
                <MenuItem className="flex items-center gap-3 p-3 hover:bg-blue-800/40 rounded-lg">
                  <UserCircleIcon className="h-4 w-4 text-blue-300" />
                  <Typography variant="small" className="text-white">
                    Profile
                  </Typography>
                </MenuItem>
              </Link>
              <div className="border-t border-blue-700/50 my-2" />
              <MenuItem
                onClick={handleLogout}
                className="flex items-center gap-3 p-3 hover:bg-red-800/40 rounded-lg"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4 text-red-400" />
                <Typography variant="small" className="text-red-400">
                  Sign Out
                </Typography>
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </div>
    </Navbar>
  );
}

export default DashboardNavbar;
