import React, { useState } from "react";
import ProjectManagementCard from "../../widgets/cards/projectManagementCard.jsx";
import bg from "../../assets/img/dashboard-bg-shape-1.jpg";
import Header from "@/widgets/layout/header.jsx";
import { DashboardNavbar, Navbar } from "@/widgets/layout/index.js";

function LearnerProjectRegistration() {
  const [showAlert, setShowAlert] = useState(true);

  const handleDismissAlert = () => setShowAlert(false);

  const userName = localStorage.getItem("userName");
  const userRole = localStorage.getItem("userRole");

  return (
    <div className=" bg-blue-50" style={{ 
      backgroundImage: `url(${bg})`,
      backgroundSize: "100% 100%", // stretches both width & height
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",}}>
      {/* Alert Section */}
      {/* {showAlert && (
        <div className="container mx-auto mt-4 px-4">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative shadow-sm">
            <strong className="font-bold">Success: </strong>
            <span className="block sm:inline">
              We have automatically created a group for you to continue ahead and submit your project.
            </span>
            <button
              onClick={handleDismissAlert}
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
            >
              <span className="text-2xl leading-none text-green-700">&times;</span>
            </button>
          </div>
        </div>
      )} */}

      {/* Header Section */}
      <div className="m-4">
        <DashboardNavbar name={userName} role={userRole}/>
      </div>
      

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-10">
        <ProjectManagementCard />
      </div>
    </div>
  );
}

export default LearnerProjectRegistration;
