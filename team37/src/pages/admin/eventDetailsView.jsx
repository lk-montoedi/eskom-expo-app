// src/pages/admin/EventDetails.jsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Button,
  Select,
  Option,
  Input,
} from "@material-tailwind/react";
import { useParams, useNavigate } from "react-router-dom";
import bg from "../../assets/img/dashboard-bg-shape-1.jpg";
import { DashboardNavbar } from "@/widgets/layout";
import { FaUser, FaEnvelope, FaTrophy, FaCalendarAlt, FaFlask, FaClipboardList, FaArrowLeft } from 'react-icons/fa';
import { useConveners } from "@/context/convenerContext";
import ProjectsPage from "./projectView";

const categories = [
  "agricultural sciences",
  "animal sciences",
  "biomedical and medical sciences",
  "chemistry and biochemistry",
  "computer sciences and software development",
  "earth sciences",
  "energy",
  "engineering",
  "environmental studies",
  "mathematics",
  "plant sciences",
  "physics, astronomy & space sciences",
  "social sciences",
];

const EventDetails = () => {
  const { eventid } = useParams();
  const navigate = useNavigate();

  const userName = localStorage.getItem("userName");
  const userRole = localStorage.getItem("userRole");

  // Context for conveners
  const {
    conveners,
    fetchConveners, 
    handleAddConvener, 
    handleRetryRejected, 
    loadingConveners ,
    handleAutoAllocate,
  } = useConveners();

  // State variables
  const [event, setEvent] = useState(null);
  const [judges, setJudges] = useState([]);
  const [eventCountsData, setEventCountsData] = useState({});

  
  
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  const [categoryToAdd, setCategoryToAdd] = useState("");
  const [judgeToAdd, setJudgeToAdd] = useState("");

  const [judgeSearch, setJudgeSearch] = useState("");
  const [projectSearch, setProjectSearch] = useState("");

  const [projectToAssign, setProjectToAssign] = useState("");
  // STATE for judge attendance
  const [judgeAttendance, setJudgeAttendance] = useState([]);
  const [latePoolProjects, setLatePoolProjects] = useState([]);

  const [loadingProjects, setLoadingProjects] = useState(false);
  // New state for the Judge Profile Modal
  const [isJudgeModalOpen, setIsJudgeModalOpen] = useState(false);
  const [selectedJudgeInfo, setSelectedJudgeInfo] = useState(null);


  // Centralize your data fetching into separate functions
  const fetchEventData = useCallback( async () => {
    try {
      const res = await fetch(`/api/events/get/event/details/${eventid}`);
      const data = await res.json();
      setEvent(data);
    } catch (error) {
      console.error("Failed to fetch event details:", error);
    }
  });

  // New function to fetch judge attendance
  const fetchJudgeAttendance = useCallback(async () => {
    try {
      const res = await fetch(`/api/events/attendance/${eventid}`);
      const data = await res.json();
      setJudgeAttendance(data || []);
    } catch (error) {
      console.error("Failed to fetch judge attendance:", error);
    }
  }, [eventid]);

  // Memoized map for quick attendance status lookup
  const attendanceStatusMap = useMemo(() => {
    const map = new Map();
    judgeAttendance.forEach(record => {
      map.set(record.judgeid, record.status);
    });
    return map;
  }, [judgeAttendance]);

  const eventCounts = useCallback(async (eventid) => {
    try {   
      const res = await fetch(`/api/events/event/${eventid}`); 
      const data = await res.json(); 
      console.log("Event counts data:", data);
      
      setEventCountsData(data);
    } catch (error) {
      console.error("Failed to fetch event counts:", error);   
    }   
  });

  const fetchLatePoolProjects = useCallback(async () => {
    try {
      const res = await fetch(`/api/projects/get/late/pool/projects/${eventid}`);
      const data = await res.json();
      setLatePoolProjects(data || []);
    } catch (error) {
      console.error("Failed to fetch late pool projects:", error);
    }
  }, [eventid]);

  const fetchProjectData = useCallback( async () => {
    try {
      const res = await fetch(`/api/projects/event/${eventid}`);
      const data = await res.json();
      console.log("Fetched projects:", data);
      setProjects(data.projects || []);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  });

  
  // This is your main function for getting all judge info
  const fetchJudgesWithProjects = useCallback( async () => {
    try {
      const res = await fetch(`/api/event/judge/projects/${eventid}`);
      const data = await res.json();
      setJudges(data.assignments || []);
    } catch (error) {
      console.error("Failed to fetch judge-project assignments:", error);
      setJudges([]); // Set to empty array on error
    }
  });

  /* useEffect(() => { 
    if (eventid) { 
      eventCounts(eventid);
    } 
  }, [eventid]); */  




  useEffect(() => {
    if (eventid) {
      // Create a new EventSource connection to your backend endpoint
      const eventSource = new EventSource(`/api/events/stream/${eventid}`);

      eventSource.addEventListener('convener-update', (event) => {
          console.log('Convener data is stale, refetching:', JSON.parse(event.data));
          // ONLY refetch what's needed for a convener change.
          fetchConveners(eventid);
      });

      eventSource.addEventListener('project-reallocated', (event) => {
            console.log('Project data is stale, refetching:', JSON.parse(event.data));
            // ONLY refetch what's needed for a project change.
            fetchJudgesWithProjects();
            fetchLatePoolProjects();
            fetchJudgeAttendance();

      });

      eventSource.addEventListener('marksheet-updated', (event) => {
          console.log('Marksheet update received, refetching projects...');
          fetchProjectData(); // This function is already in EventDetails
          
          // ALSO, if a project detail view is open, we need to refresh its judges/scores
          // This is a more advanced step, for now, refetching the main list is key.
      });
      /* // This is called when a new message is received from the server
      eventSource.onmessage = (event) => {
        console.log('Received server update:', event.data);
        // When we get any update, we know the data is stale.
        // So, we re-fetch the latest list of conveners.
        fetchConveners(eventid);
        fetchJudgesWithProjects();
        fetchLatePoolProjects();
        fetchJudgeAttendance();
      }; */
      
      // Handle any errors
      eventSource.onerror = (err) => {
        console.error('EventSource failed:', err);
      };

      // IMPORTANT: Close the connection when the component unmounts
      return () => {
        eventSource.close();
      };
    }
  }, [eventid]);


// A SINGLE, CORRECTED HOOK FOR INITIAL DATA LOADING
useEffect(() => {
  if (eventid) {
    // These functions will all be called once when the component mounts
    // or if the eventid changes.
    fetchConveners(eventid);
    fetchEventData();
    fetchProjectData();
    fetchJudgesWithProjects();
    fetchLatePoolProjects();
    fetchJudgeAttendance();
    eventCounts(eventid); // Don't forget this one
  }
}, [
  eventid
]); 
// All fetch functions are stable thanks to useCallback

// You can now also remove the separate useEffect for eventCounts
/* useEffect(() => { 
     if (eventid) { 
       eventCounts(eventid);
     } 
  }, [eventid]); // This is now redundant
*/

  // Apply the "Fetch After Action" pattern everywhere
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!categoryToAdd || !judgeToAdd) {
      return alert("Select both category and judge");
    }

    // This function from context should handle its own state update for conveners
    await handleAddConvener(eventid, categoryToAdd, judgeToAdd);
    // Fetch new convener list
    await fetchConveners(eventid);
    // After adding a convener (who is a judge), refresh the judges list
    await fetchJudgesWithProjects();

    setJudgeToAdd("");
    setCategoryToAdd("");
  };

  const handleAutoAllocateClick = async () => {
    // First, wait for the allocation to finish.
    await handleAutoAllocate(eventid);

    // Then, refresh the data for the other tab.
    await fetchJudgesWithProjects();
  };



  const handleAllocateProjects = async () => {
    try {
      setLoadingProjects(true);
      const res = await fetch(`/api/event/allocate/projects/${eventid}`, { method: "POST" });
      const data = await res.json();
      alert(data.message || "Projects allocated");
      fetchJudgesWithProjects();
    } catch (err) {
      alert("Failed to auto allocate projects");
      console.error(err);
    } finally {
      setLoadingProjects(false);
    }
  };
  
  const handleAssignProject = async () => {
    if (!judgeToAdd || !projectToAssign) return alert("Select both judge and project");

    try {
      const res = await fetch(`/api/event/judgeprojects/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ judgeid: judgeToAdd, projectid: projectToAssign, eventid: eventid }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Project assigned successfully");
        fetchJudgesWithProjects();
      } else {
        alert(data.error || "Failed to assign project");
      }
    } catch (err) {
      console.error("Assign project error:", err);
      alert("Failed to assign project");
    }

  };

  const handleReallocateClick = async () => {
    // Wait for the context function to finish reallocating the convener.
    await handleRetryRejected(eventid);

    // Refresh BOTH lists to ensure the entire UI is in sync.
    await fetchConveners(eventid);       // Refreshes the "Conveners" tab.
    await fetchJudgesWithProjects(); // Refreshes the "Judges" tab.
  };

  const handleRemoveProject = async (judgeid, projectid) => {
    try {
      const res = await fetch(`/api/event/judgeprojects/${judgeid}/${projectid}`, {
        method: "DELETE",
      });

      if (res.ok) {
        //alert("Project removed");
        fetchJudgesWithProjects();
      } else {
        alert("Failed to remove project");
      }
    } catch (err) {
      console.error(err);
      alert("Error removing project");
    }
  };

  const handleStartEvent = async () => {
    try {
        const res = await fetch(`/api/events/start/event/${eventid}`, {
            method: "POST",
        });
        const data = await res.json();
        if (res.ok) {
            window.location.reload(); // Refresh the page
        } else {
            alert(data.message || "Failed to start event.");
        }
    } catch (error) {
        console.error("Failed to start event:", error);
        alert("An error occurred while trying to start the event.");
    }
  };

  // Handler functions for the modal
  const handleViewJudgeInfo = (judge) => {
    setSelectedJudgeInfo(judge);
    setIsJudgeModalOpen(true);
  };

  const handleCloseJudgeModal = () => {
    setIsJudgeModalOpen(false);
    setSelectedJudgeInfo(null);
  };
  // End of modal handler functions
  // FILTER JUDGES BY ATTENDANCE STATUS FIRST
  const presentJudges = useMemo(() => {
    // Create a Set of judge IDs who are marked as 'present' for fast lookups
    const presentJudgeIds = new Set(
      judgeAttendance
        .filter(att => att.status === 'present')
        .map(att => att.judgeid)
    );
    // Return only the judges from the main list whose ID is in the 'present' set
    return judges.filter(j => presentJudgeIds.has(j.userid));
  }, [judges, judgeAttendance]);

  // Helper for filtaring judges and projects based on search input
  const filteredJudges = judges.filter(j =>
    `${j.firstname} ${j.lastname} ${j.email}`.toLowerCase().includes(judgeSearch.toLowerCase())
  );

  const filteredProjects = projects.filter(p =>
    `${p.projectname} ${p.projectid} ${p.learnerid}`.toLowerCase().includes(projectSearch.toLowerCase())
  );

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 p-6">
      <DashboardNavbar name={userName} role={userRole} />
      
      {/* Back Button and Header */}
      <div className="mb-6 mt-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-indigo-200/40 shadow-xl shadow-indigo-100/30">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
            <div className="flex justify-between items-center gap-4 mb-2">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="bg-white/20 hover:bg-white/30 p-3 rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/20 hover:border-white/30"
                >
                  <FaArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <Typography variant="h4" className="font-bold text-white">
                    Event Management Dashboard
                  </Typography>
                  <Typography className="text-blue-100 text-sm font-medium">
                    Event ID: {eventid} • Manage conveners, judges, and projects
                  </Typography>
                </div>
              </div>
              <div>
                {event?.progress_state === 'Not Started' || !event?.progress_state ? (
                  <Button onClick={handleStartEvent} color="green" className="text-white font-bold bg-green-600 hover:bg-green-700">
                    Start Event
                  </Button>
                ) : event?.progress_state === 'In Progress' ? (
                  <Button disabled color="green" className="text-white font-bold opacity-75 cursor-not-allowed">
                    Event Started
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
     <div className="w-full">
        <Card className="bg-white/80 backdrop-blur-sm border border-indigo-100 shadow-2xl shadow-indigo-100/40 rounded-2xl overflow-hidden">
          <CardBody className="p-0">
                 <Tabs value={activeTab}>
              <TabsHeader 
                className="sticky top-32 z-40 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-none border-b-4 border-indigo-200 p-2"
                indicatorProps={{
                  className: "bg-white/30 shadow-none"
                }}
              >
                <Tab 
                  value="overview"
                  onClick={() => setActiveTab("overview")}
                  className="text-white/100 hover:text-white font-semibold transition-colors px-4 py-2 relative z-10"
                  activeClassName="!text-white"
                >
                  <div className="flex items-center gap-2 relative z-10">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Overview
                  </div>
                </Tab>
                <Tab 
                  value="conveners"
                  onClick={() => setActiveTab("conveners")}
                  className="text-white/100 hover:text-white font-semibold transition-colors px-4 py-2 relative z-10"
                  activeClassName="!text-white"
                >
                  <div className="flex items-center gap-2 relative z-10">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Conveners
                  </div>
                </Tab>
                <Tab 
                  value="judges"
                  onClick={() => setActiveTab("judges")}
                  className="text-white/100 hover:text-white font-semibold transition-colors px-4 py-2 relative z-10"
                  activeClassName="!text-white"
                >
                  <div className="flex items-center gap-2 relative z-10">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    Judges
                  </div>
                </Tab>
                <Tab 
                  value="projects"
                  onClick={() => setActiveTab("projects")}
                  className="text-white/100 hover:text-white font-semibold transition-colors px-4 py-2 relative z-10"
                  activeClassName="!text-white"
                >
                  <div className="flex items-center gap-2 relative z-10">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Projects
                  </div>
                </Tab>
              </TabsHeader>
              
              <TabsBody className="p-8">
                <TabPanel value="overview" className="p-0">
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-100 rounded-2xl p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-xl">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <Typography variant="h5" className="text-indigo-800 font-bold">
                        Event Information
                      </Typography>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-indigo-200/40 shadow-lg">
                        <Typography variant="h6" className="text-indigo-700 font-bold mb-2 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          Event Name
                        </Typography>
                        <Typography className="text-gray-700 font-medium">{event?.name || "Unnamed Event"}</Typography>
                      </div>

                      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-indigo-200/40 shadow-lg">
                        <Typography variant="h6" className="text-indigo-700 font-bold mb-2 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                          Event Type
                        </Typography>
                        <span className="bg-gradient-to-r from-blue-100 to-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-bold">
                          {event?.type || "N/A"}
                        </span>
                      </div>

                      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-indigo-200/40 shadow-lg">
                        <Typography variant="h6" className="text-indigo-700 font-bold mb-2 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Region
                        </Typography>
                        <Typography className="text-gray-700 font-medium">{event?.region || "N/A"}</Typography>
                      </div>

                      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-indigo-200/40 shadow-lg">
                        <Typography variant="h6" className="text-indigo-700 font-bold mb-2 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          Venue
                        </Typography>
                        <Typography className="text-gray-700 font-medium">{event?.venue || "N/A"}</Typography>
                      </div>

                      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-indigo-200/40 shadow-lg">
                        <Typography variant="h6" className="text-indigo-700 font-bold mb-2 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Start Date
                        </Typography>
                        <Typography className="text-gray-700 font-medium">{event?.start_date ? new Date(event.start_date).toLocaleDateString() : "N/A"}</Typography>
                      </div>

                      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-indigo-200/40 shadow-lg">
                        <Typography variant="h6" className="text-indigo-700 font-bold mb-2 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          End Date
                        </Typography>
                        <Typography className="text-gray-700 font-medium">{event?.end_date ? new Date(event.end_date).toLocaleDateString() : "N/A"}</Typography>
                      </div>

                      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-indigo-200/40 shadow-lg">
                        <Typography variant="h6" className="text-indigo-700 font-bold mb-2 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                          Attendance Code
                        </Typography>
                        {event?.attendance_code ? (
                          <div className="flex justify-center">
                            <img src={event.attendance_code} alt="Attendance QR Code" className="w-32 h-32" />
                          </div>
                        ) : (
                          <Typography className="text-gray-700 font-medium">
                            N/A
                          </Typography>
                        )}
                      </div>
                    </div>

                    {/* Event Statistics */}
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-xl">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <Typography variant="h5" className="text-indigo-800 font-bold">
                        Event Statistics
                      </Typography>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-indigo-200/40 shadow-lg text-center">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-4 rounded-full w-16 h-16 mx-auto mb-4">
                          <svg className="w-8 h-8 text-white mx-auto mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                          </svg>
                        </div>
                        <Typography variant="h3" className="text-indigo-800 font-bold mb-2">
                          {judges.length}
                        </Typography>
                        <Typography className="text-indigo-600 font-semibold">
                          Registered Judges
                        </Typography>
                      </div>

                      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-indigo-200/40 shadow-lg text-center">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-full w-16 h-16 mx-auto mb-4">
                          <svg className="w-8 h-8 text-white mx-auto mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        </div>
                        <Typography variant="h3" className="text-green-800 font-bold mb-2">
                          {projects.length}
                        </Typography>
                        <Typography className="text-green-600 font-semibold">
                          Registered Projects
                        </Typography>
                      </div>
                    </div>
                  </div>
                </TabPanel>

                <TabPanel value="conveners" className="p-0">
  <div className="bg-gradient-to-br from-indigo-50 to-blue-100 rounded-2xl p-6 mb-8">
    <div className="flex items-center gap-3 mb-6">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-xl">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      <Typography variant="h5" className="text-indigo-800 font-bold">
        Convener Management
      </Typography>
    </div>

    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-indigo-200/40 shadow-lg mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 space-y-4 lg:space-y-0">
        <div className="lg:w-1/3">
          <label className="block text-sm font-semibold text-indigo-700 mb-2">Select Category</label>
          <select 
            value={categoryToAdd} 
            onChange={(e) => setCategoryToAdd(e.target.value)}
            className="w-full p-3 border border-indigo-200 bg-white rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-indigo-800 font-medium"
          >
            <option value="">Choose a category...</option>
            {categories.map((cat) => (
              <option key={cat} value={cat} className="text-indigo-800">{cat}</option>
            ))}
          </select>
        </div>

        <div className="lg:w-1/3">
          <label className="block text-sm font-semibold text-indigo-700 mb-2">Select Judge</label>
          <select 
            value={judgeToAdd} 
            onChange={(e) => setJudgeToAdd(e.target.value)}
            className="w-full p-3 border border-indigo-200 bg-white rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-indigo-800 font-medium"
          >
            <option value="">Choose a judge...</option>
            {judges.map((j) => (
              <option key={j.userid} value={j.userid} className="text-indigo-800">
                {j.firstname} {j.lastname} ({j.email}) - {j.yearsjudged} yrs exp.
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3">
          <Button 
            onClick={handleAddSubmit}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3 rounded-xl font-semibold"
          >
            Add Convener
          </Button>
          <Button 
            onClick={handleAutoAllocateClick} 
            loading={loadingConveners}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3 rounded-xl font-semibold"
          >
            Auto Allocate
          </Button>
        </div>
      </div>
    </div>

    <div className="max-h-[70vh] overflow-y-auto space-y-4 pr-2">
      {categories.map((cat) => {
        const catConveners = conveners.filter((c) => c.category === cat);
        return (
          <Card key={cat} className="bg-white/80 backdrop-blur-sm border border-indigo-100 shadow-lg rounded-xl">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-t-xl border-b border-indigo-100">
              <Typography variant="h6" className="text-indigo-800 font-bold capitalize">
                {cat}
              </Typography>
            </div>
            <div className="p-4">
              {catConveners.length > 0 ? (
                <div className="space-y-3">
                  {catConveners.map((c) => (
                    <div key={c.userid} className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-lg border border-indigo-100">
                      <span className="text-gray-700 font-medium">
                        {c.firstname || c.name} {c.lastname || c.surname} ({c.email})
                      </span>
                      
                      <div className="flex items-center gap-3">
                        {/* MODIFICATION START: New styling and text format */}
                        <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                          Experience: {c.yearsjudged} yrs
                        </span>
                        {/* MODIFICATION END */}
                        <div>
                          {c.accepted === true && (
                            <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                              Accepted
                            </span>
                          )}
                          {c.accepted === false && (
                            <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                              Rejected
                            </span>
                          )}
                          {c.accepted === null && (
                            <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                              Appointed
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-indigo-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <Typography className="text-indigo-400 font-medium">No convener assigned</Typography>
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  </div>
</TabPanel>

                <TabPanel value="judges" className="p-0">
  <div className="bg-gradient-to-br from-indigo-50 to-blue-100 rounded-2xl p-6 mb-8">
    <div className="flex items-center gap-3 mb-6">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-xl">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      </div>
      <Typography variant="h5" className="text-indigo-800 font-bold">
        Judge Management
      </Typography>
    </div>

    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-indigo-200/40 shadow-lg mb-6">
      <div className="relative mb-6">
        <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <Input
          label="Search Judges"
          value={judgeSearch}
          onChange={(e) => setJudgeSearch(e.target.value)}
          className="pl-12 bg-white border-indigo-200 focus:border-indigo-400"
        />
      </div>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <Typography variant="h5" className="text-indigo-800 font-bold">
          Judges and Project Allocations
        </Typography>
        <Button
          onClick={handleAllocateProjects}
          loading={loadingProjects}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3 rounded-xl font-semibold"
        >
          Auto-Allocate All Projects
        </Button>
      </div>
    </div>

    <div className="grid gap-6">
      {filteredJudges.map((j) => {
        // Created a Set of project IDs already assigned to this specific judge for quick lookups.
        const status = attendanceStatusMap.get(j.userid);
        const isAbsent = status === 'absent';
        const assignedProjectIds = new Set(j.projects?.map(proj => proj.projectid) || []);

        return (
          <div key={j.userid} className={`bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-indigo-100 overflow-hidden transition-opacity ${isAbsent ? 'opacity-50' : ''}`}>
                          <details className="group">
                            <summary className="cursor-pointer bg-gradient-to-r from-blue-50 to-indigo-50 p-6 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 list-none">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-full">
                                    <FaUser className="w-5 h-5 text-white" />
                                  </div>
                                  <div>
                                    <Typography variant="h6" className="text-indigo-800 font-bold">{j.firstname} {j.lastname}</Typography>
                                    <Typography className="text-indigo-600 text-sm">{j.email}</Typography>
                                    <Typography className="text-indigo-600 text-sm">{j.firstcategory}</Typography>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  {/* NEW: Display an "ABSENT" badge if the judge is absent */}
                                  {isAbsent && (
                                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                                      ABSENT
                                    </span>
                                  )}
                                  <Button size="sm" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleViewJudgeInfo(j); }} className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-lg px-4 py-2">View Details</Button>
                                  <span className="bg-gradient-to-r from-blue-100 to-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-bold">{j.projects?.length || 0} Projects</span>
                                  <svg className="w-5 h-5 text-indigo-400 group-open:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </div>
                              </div>
                            </summary>
              <div className="p-6 bg-white border-t border-indigo-100">
                {/* ASSIGNED PROJECTS SECTION */}
                <Typography variant="h6" className="text-indigo-700 font-bold mb-4">Assigned Projects</Typography>
                {j.projects && j.projects.length > 0 ? (
                  <div className="overflow-x-auto mb-8">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-indigo-100">
                          <th className="text-left p-4 text-indigo-700 font-bold">Project ID</th>
                          <th className="text-left p-4 text-indigo-700 font-bold">Project Name</th>
                          <th className="text-left p-4 text-indigo-700 font-bold">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {j.projects.map((proj) => (
                          <tr key={proj.projectid} className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 border-b border-indigo-50 transition-all duration-200">
                            <td className="p-4 text-gray-700 font-medium">{proj.projectid}</td>
                            <td className="p-4 text-gray-700 font-medium">{proj.projectname}</td>
                            <td className="p-4"><Button size="sm" onClick={() => handleRemoveProject(j.userid, proj.projectid)} className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-lg px-4 py-2">Remove</Button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 mb-8">
                    <svg className="w-16 h-16 text-indigo-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                    <Typography className="text-indigo-400 font-medium">No projects assigned yet.</Typography>
                  </div>
                )}

                {/* ADDITIONAL PROJECTS SECTION */}
                {!isAbsent ? (
                                <div className="border-t border-indigo-200 pt-6">
                                  <Typography variant="h6" className="text-indigo-700 font-bold mb-4">Additional Projects (From Pool)</Typography>
                                  {latePoolProjects.filter(p => p.category === j.firstcategory && !assignedProjectIds.has(p.projectid)).length > 0 ? (
                                    <div className="overflow-x-auto">
                                      <table className="w-full">
                                        {/* ... table header ... */}
                                        <tbody>
                                          {latePoolProjects
                                            .filter(p => p.category === j.firstcategory && !assignedProjectIds.has(p.projectid))
                                            .map((p) => (
                                              <tr key={p.projectid} className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 border-b border-indigo-50 transition-all duration-200">
                                                <td className="p-4 text-gray-700 font-medium">{p.projectid}</td>
                                                <td className="p-4 text-gray-700 font-medium">{p.projectname}</td>
                                                <td className="p-4">
                                                  <Button size="sm" onClick={() => handleRemoveProject(j.userid, p.projectid)} className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-lg px-4 py-2">Remove</Button>
                                                </td>
                                              </tr>
                                            ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  ) : (
                                    <div className="text-center py-8">
                                      <Typography className="text-indigo-400 font-medium">No additional projects available for this judge's category.</Typography>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="border-t border-indigo-200 pt-6 text-center py-8">
                                  <Typography className="text-red-600 font-semibold">
                                    This judge is marked as absent and cannot be assigned additional projects.
                                  </Typography>
                                </div>
                              )}
                            </div>
                          </details>
                        </div>
                      )
                    })}
    </div>
  </div>
</TabPanel>

                <TabPanel value="projects" className="p-0">
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-100 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-xl">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <Typography variant="h5" className="text-indigo-800 font-bold">
                        Project Overview
                      </Typography>
                    </div>
                    <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-indigo-200/40 shadow-lg">
                      <ProjectsPage />
                    </div>
                  </div>
                </TabPanel>
              </TabsBody>
            </Tabs>
          </CardBody>
        </Card>
      </div>

      {/*  Judge Profile Modal */}
      {isJudgeModalOpen && selectedJudgeInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl max-w-2xl w-full transform transition-all duration-300 border border-indigo-200">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-3xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-full">
                    <FaUser className="w-6 h-6" />
                  </div>
                  <div>
                    <Typography variant="h4" className="font-bold text-white">
                      {selectedJudgeInfo.firstname} {selectedJudgeInfo.lastname}
                    </Typography>
                    <Typography className="text-blue-100">
                      Judge Profile & Information
                    </Typography>
                  </div>
                </div>
                <button 
                  onClick={handleCloseJudgeModal} 
                  className="bg-white/20 hover:bg-white/30 p-3 rounded-full transition-all duration-200 border border-white/20 hover:border-white/30"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-indigo-100">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-full">
                      <FaEnvelope className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <Typography className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">
                        Email Address
                      </Typography>
                      <Typography className="font-bold text-indigo-800 text-lg">
                        {selectedJudgeInfo.email}
                      </Typography>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-full">
                      <FaCalendarAlt className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <Typography className="text-sm font-semibold text-green-600 uppercase tracking-wide">
                        Years Judging
                      </Typography>
                      <Typography className="font-bold text-green-800 text-lg">
                        {selectedJudgeInfo.yearsjudged || 'N/A'}
                      </Typography>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-xl border border-purple-100">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="bg-gradient-to-r from-purple-500 to-violet-500 p-3 rounded-full">
                      <FaTrophy className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <Typography className="text-sm font-semibold text-purple-600 uppercase tracking-wide">
                        Events Judged
                      </Typography>
                      <Typography className="font-bold text-purple-800 text-lg">
                        {selectedJudgeInfo.numeventsjudged || 0}
                      </Typography>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-xl border border-orange-100">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-3 rounded-full">
                      <FaFlask className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <Typography className="text-sm font-semibold text-orange-600 uppercase tracking-wide">
                        First Category
                      </Typography>
                      <Typography className="font-bold text-orange-800 text-lg capitalize">
                        {selectedJudgeInfo.firstcategory || 'N/A'}
                      </Typography>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 bg-gradient-to-br from-teal-50 to-cyan-50 p-6 rounded-xl border border-teal-100">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-3 rounded-full">
                      <FaClipboardList className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <Typography className="text-sm font-semibold text-teal-600 uppercase tracking-wide">
                        Second Category
                      </Typography>
                      <Typography className="font-bold text-teal-800 text-lg capitalize">
                        {selectedJudgeInfo.secondcategory || 'N/A'}
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetails;
