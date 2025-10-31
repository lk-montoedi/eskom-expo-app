import { Routes, Route } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import { useState, useEffect } from "react";
import {
  Sidenav,
  DashboardNavbar,
  Footer,
} from "@/widgets/layout";
import routes from "@/routes";
import bg from "../assets/img/dashboard-bg-shape-1.jpg"
import { useLocation, useNavigate } from "react-router-dom";
import AdminEvents from "@/pages/events/events";
import { Events } from "@/pages/dashboard";
import SchoolAdmin from "@/pages/dashboard/schoolManagement/schoolAdmin";
import SchoolTeacher from "@/pages/dashboard/schoolManagement/schoolTeacher";

export function Dashboard() {
  //User data retrieval for dashboard
  const location = useLocation();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // First, try to get userData from location state
    const stateUserData = location.state?.userData;
    
    if (stateUserData) {
      // If we have userData from location state, store it and use it
      setUserData(stateUserData);

      // Store in sessionStorage to persist across route changes
      sessionStorage.setItem('userData', JSON.stringify(stateUserData));
      setLoading(false);
    } else {
      // If no userData in location state, try to get from sessionStorage
      const storedUserData = sessionStorage.getItem('userData');
      if (storedUserData) {
        try {
          const parsedUserData = JSON.parse(storedUserData);
          console.log("data",storedUserData)
          setUserData(parsedUserData);
          setLoading(false);
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          // Redirect to login if data is corrupted
          navigate('/auth/sign-in');
        }
      } else {
        // No userData found anywhere, redirect to login
        navigate('/auth/sign-in');
      }
    }
  }, [location.state, navigate]);

  // Show loading state while checking for user data
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show error if userData is still not available
  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">User data not found</p>
          <button
            onClick={() => navigate('/auth/sign-in')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  console.log("role:" + userData.role);

  return (
    <div className="min-h-screen flex flex-col bg-blue-gray-50" style={{ 
      backgroundImage: `url(${bg})`,
      backgroundSize: "100% 100%", // stretches both width & height
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center", }}>
      {/* Content wrapper */}
      <div className="m-4">
        <DashboardNavbar  role={userData.role} name={userData.name}/>
      </div>
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-80 min-h-screen">
          <Sidenav routes={routes} Role={userData.role} Id={userData.userid} className="h-full" />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4">
          {/* Floating Settings Button */}
          {/* <IconButton
            size="lg"
            color="white"
            className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
            ripple={false}
          >
          <Cog6ToothIcon className="h-5 w-5" />
          </IconButton> */}

          {/* Render Routes */}
          <Routes>
            {routes
              .find(({ layout }) => layout === "dashboard")
              .pages.map(({ path, element, dynamic }) => {
                let Component = element;
                if (dynamic && path === "/events") {
                  // Switch based on user role
                  if (userData.role === "admin") {
                    Component = <AdminEvents />;
                  } else if (userData.role === "judge" || userData.role === "convener") {
                    Component = <Events />;
                  } else if (userData.role === "learner") {
                    Component = <Events />;
                  }else if (userData.role === "teacher") {
                    Component = <Events />;
                  } else {
                    Component = <div>Unauthorized</div>;
                  }
                }

                if( dynamic && path === "/schoolManagement/school"){
                  if(userData.role === "admin"){
                    Component = <SchoolAdmin/>;
                  }else if (userData.role === "teacher"){
                    Component  = <SchoolTeacher/>;
                  }
                }

                return (
                  <Route
                    key={path}
                    path={path.replace("/", "")}
                    element={Component}
                  />
                );
              })}
          </Routes>

        </div>
      </div>

      {/* Footer (below sidebar + content) */}
      <Footer />
    </div>
  );
}

export default Dashboard;