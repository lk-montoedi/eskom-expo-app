import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const WelcomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const stateUserData = location.state?.userData;

    if (stateUserData) {
      setUserData(stateUserData);
      sessionStorage.setItem("userData", JSON.stringify(stateUserData));
    } else {
      const storedUserData = sessionStorage.getItem("userData");
      if (storedUserData) {
        try {
          const parsedUserData = JSON.parse(storedUserData);
          setUserData(parsedUserData);
        } catch (error) {
          console.error("Error parsing stored user data:", error);
          navigate("/auth/sign-in");
        }
      } else {
        navigate("/auth/sign-in");
      }
    }
  }, [location.state, navigate]);

  const getRoleDisplayName = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "Admin";
      case "teacher":
        return "Teacher";
      case "learner":
        return "Learner";
      case "judge":
        return "Judge";
      default:
        return "Participant";
    }
  };

  const getRoleMessage = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "Manage the platform and support our amazing community of young scientists!";
      case "teacher":
        return "Guide and inspire the next generation of brilliant minds!";
      case "learner":
        return "Explore, discover, and showcase your amazing scientific projects!";
      case "judge":
        return "Evaluate and celebrate the incredible work of our young scientists!";
      default:
        return "Be part of our exciting scientific community!";
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: spin-slow 6s linear infinite;
          }
          @keyframes spin-reverse {
            from { transform: rotate(360deg); }
            to { transform: rotate(0deg); }
          }
          .animate-spin-reverse {
            animation: spin-reverse 8s linear infinite;
          }
        `}
      </style>

      <div className="bg-white rounded-lg shadow-lg p-8 mb-6 border-t-4 border-blue-600">
        <div className="text-center">
          {/* Main Welcome Title */}
          <h1 className="text-4xl font-bold text-blue-800 mb-1">
            Welcome Back to Eskom Expo for Young Scientists
          </h1>

          {/* User greeting with role */}
          <div className="mb-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-1">
              Hello, {userData?.name || "Guest"}!
            </h2>
            <div className="inline-block relative">
              <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-lg font-medium border-2 border-blue-200 animate-spin-slow">
                {getRoleDisplayName(userData?.role)}
              </span>
            </div>
          </div>

          {/* Role-specific message */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
            <p className="text-lg text-blue-700 font-medium">
              {getRoleMessage(userData?.role)}
            </p>
          </div>

          {/* Fun motivational message */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border-l-4 border-purple-400 mb-6">
            <div className="flex items-center justify-center mb-3">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center mr-3 animate-spin-reverse">
                <span className="text-yellow-800 font-bold">✨</span>
              </div>
              <h3 className="text-xl font-bold text-purple-800">
                Have a Great Time on the Web!
              </h3>
            </div>
            <p className="text-purple-700">
              Dive into the world of science, innovation, and discovery. 
              Make the most of your time here and let your curiosity lead the way!
            </p>
          </div>

          {/* Quick stats or features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 relative">
              <div className="text-2xl font-bold text-blue-600 mb-1 animate-spin-slow">🔬</div>
              <h4 className="font-semibold text-blue-800">Explore</h4>
              <p className="text-sm text-blue-600">Discover new opportunities</p>
            </div>

            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200 relative">
              <div className="text-2xl font-bold text-indigo-600 mb-1 animate-spin-reverse">🏆</div>
              <h4 className="font-semibold text-indigo-800">Achieve</h4>
              <p className="text-sm text-indigo-600">Reach your scientific goals</p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200 relative">
              <div className="text-2xl font-bold text-purple-600 mb-1 animate-spin-slow">🌟</div>
              <h4 className="font-semibold text-purple-800">Inspire</h4>
              <p className="text-sm text-purple-600">Share your passion for science</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WelcomePage;
