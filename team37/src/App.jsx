import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import { RegistrationProvider } from "./context/registrationContext";
import { NotificationProvider } from "./context/notificationContext";
import LandingPage from "./pages/home/landingPage.jsx";
import AboutUsPage from "./pages/home/AboutUsPage.jsx";
import ProjectsPage from "./pages/home/ProjectsPage.jsx";
import OurTeam from "./pages/home/ourTeam.jsx";
import CategoriesPage from "./pages/home/categoriesPage.jsx";
import LearnerProjectRegistration from "./pages/learner/learnerProjectRegistration.jsx";
import { ToastContainer } from "react-toastify";
import AboutEvent from "./pages/events/aboutEvent.jsx";
import AdminEvents from "./pages/events/events.jsx";
import AddEvent from "./pages/events/addEvent.jsx";
import EventDetails from "./pages/admin/eventDetailsView.jsx";

import AddSchool from "./pages/dashboard/schoolManagement/addSchool";
//import School from "./pages/dashboard/schoolManagement/school";
import UpdateSchool from "./pages/dashboard/schoolManagement/updateSchool";
import DeleteSchool from "./pages/dashboard/schoolManagement/deleteSchool";
import WelcomeComponent from "./pages/dashboard/welcomePage";
import SchoolTeacherLearnerView from "./pages/dashboard/schoolManagement/schoolTeacherLearnerView";
import TeacherLearnerRegister from "./pages/auth/teacherLearnerRegistration";
import { ConvenerProvider } from "./context/convenerContext";


function App() {
  return (
    <ConvenerProvider>
      <RegistrationProvider>
        <NotificationProvider>
          {/* Toast notifications container */}
          <ToastContainer position="top-center" autoClose={3000} />
          <Routes>
          <Route path="/" element={<LandingPage />}/>
          <Route path="/home/landingPage" element={<LandingPage />}/>
          <Route path="/home/AboutUsPage" element={<AboutUsPage />}/>
          <Route path="/home/ourTeam" element={<OurTeam />}/>
          <Route path="/home/ProjectsPage" element={<ProjectsPage/>}/>
          <Route path="/home/CategoriesPage" element={<CategoriesPage />}/>
          <Route path="/dashboard/*" element={<Dashboard />} />
        
          <Route path="/schools/add" element={<AddSchool />} />
          {/*  <Route path="/schools/edit/:id" element={<UpdateSchool />} />
          <Route path="/schools/delete/:schoolid" element={<DeleteScho  ol />} />
          <Route path="/schoolManagement/school" element={<School />} />*/} 
          <Route path="/auth/*" element={<Auth />} />
          <Route path="/events/create" element={<AddEvent />} />
          <Route path="/events/about/:eventid" element={<AboutEvent />} />
          <Route element={<Dashboard />}>
          <Route path="/events" element={<AdminEvents />} /></Route>
          <Route path="/admin/view/event/:eventid" element={< EventDetails />}/>
          <Route path="/learner/projects/addProject" element={< LearnerProjectRegistration/>} />
          <Route path="/teacher/learner/view" element={<SchoolTeacherLearnerView />} />
          <Route path="/teacher/learner/register" element={<TeacherLearnerRegister />} />
          </Routes>
        </NotificationProvider>
      </RegistrationProvider>
    </ConvenerProvider>
    
  );
}

export default App;
