import {
  HomeIcon,
  UserCircleIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  ScaleIcon,
  DocumentTextIcon,
  BuildingLibraryIcon,
  ClipboardDocumentCheckIcon,
  BellIcon,
  GiftIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Notifications, Events, Convenors, Judges, AddProject, AddConvenor, Users, Appointments, Rewards } from "@/pages/dashboard";
import AddEvent from "./pages/events/addEvent";
import AboutEvent from "./pages/events/aboutEvent";
import Projects from "./pages/admin/projectView";
import ProjectList from "./pages/learner/learnerProjectView";
import { SignIn, SignUp, SelectUserRegister, SignUpStep2, JudgeRegistration, JudgeRegistrationStep2, TeacherRegistration, TeacherRegistrationStep2} from "@/pages/auth";
import Schools from "./pages/dashboard/schoolManagement/school";
import { element } from "prop-types";
import WelcomePage from "./pages/dashboard/welcomePage";
import { Reports } from "./pages/dashboard/Reports/report";
import { Checkbox } from "@material-tailwind/react";

const icon = {
  className: "w-5 h-5 text-blue-800", 
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        name:"Welcome",
        path: "/",
        element: <WelcomePage />
      },

      {
        icon: <CalendarDaysIcon {...icon} />,
        name: "Events",
        path: "/events",
        element: null, 
        roles: ["admin", "learner", "teacher"], 
        dynamic: true,
      },

      {
        icon: <DocumentTextIcon {...icon} />,
        name: "Projects",
        path: "/projects",
        element: <ProjectList />,
      },

      {
        icon: <DocumentTextIcon {...icon} />,
        name: "add project",
        path: "/addProjects",
        element: <AddProject />,
      },

      {
        icon: <UserGroupIcon {...icon} />,
        name: "Convenors",
        path: "/convenor",
        element: <Convenors />,
      },

      {
        icon: <ScaleIcon {...icon} />,
        name: "Judges",
        path: "/judges",
        element: <Judges />,
      },

      {
        icon: <BuildingLibraryIcon {...icon} />,
        name: "Schools",
        path: "/schoolManagement/school",
        element: <Schools /> ,
        roles: ["admin", "learner", "teacher"],
        dynamic: true,
      },

      {
        icon: <UserCircleIcon {...icon} />,
        name: "Profile",
        path: "/profile",
        element: <Profile />,
        
      },
      {
        icon: <GiftIcon {...icon} />,
        name: "Rewards",
        path: "/rewards",
        element: <Rewards />,
        roles: ["judge", "convener"],
      },

      {
        icon: <ClipboardDocumentCheckIcon {...icon} />,
        name: "Appointments",
        path: "/appointments",
        element: <Appointments />,
      },

      {
        icon: <BellIcon {...icon} />,
        name: "Notifications",
        path: "/notifications",
        element: <Notifications />,
      },
       {
        icon: <DocumentTextIcon {...icon} />,
        name: "Reports",
        path: "/Reports/report",
        element: <Reports />,
      },
      
      {
        icon: <UserCircleIcon {...icon} />,
        name: "Users",
        path: "/users",
        element: <Users />,
      },
    ],
  },

  {
    layout: "subDashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },

      {
        icon: <CalendarDaysIcon {...icon} />,
        name: "add event",
        path: "/addEvent",
        element: <AddEvent />,
      },

      
      {
        name: "about event",
        path: "/events/about/:eventid",
        element: <AboutEvent />,
      },
      
      {
        icon: <DocumentTextIcon {...icon} />,
        name: "add project",
        path: "/addProjects",
        element: <AddProject />,
      },
      
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "add convenor",
        path: "/addConvenor",
        element: <AddConvenor />,
      },

    ]
  },

  {
    title: "authentication",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "sign up",
        path: "/sign-up",
        element: <SignUp />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "sign up step 2",
        path: "/sign-up-step2",
        element: <SignUpStep2 />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "judge registration",
        path: "/judgeRegistration",
        element: <JudgeRegistration />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "judge registration step 2",
        path: "/judgeRegistrationStep2",
        element: <JudgeRegistrationStep2 />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "teacher registration",
        path: "/teacherRegistration",
        element: <TeacherRegistration />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "teacher registration step 2",
        path: "/teacherRegistrationStep2",
        element: <TeacherRegistrationStep2 />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "select registration type",
        path: "/select-user-register",
        element: <SelectUserRegister />,
      },
    ],
  },
];

export default routes;