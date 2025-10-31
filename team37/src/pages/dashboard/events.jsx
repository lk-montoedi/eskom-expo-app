import React, { useEffect, useState, useMemo } from "react";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Input,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import ProjectManagementCard from "../../widgets/cards/projectManagementCard";
import { MapPin } from "lucide-react";

// Adjust this to match your backend route
const API_URL = "/api/student";

export function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const navigate = useNavigate();

  const [showProjectCard, setShowProjectCard] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [joiningEventId, setJoiningEventId] = useState(null);
  const [userProfile, setUserProfile] = useState(null);



  // Filters and sorting
  const [eventTypeFilter, setEventTypeFilter] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortField, setSortField] = useState("start_date");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState(""); 

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 6;

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/events`);
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        setError(err.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  // Fetch the logged-in user's profile when the page loads
  useEffect(() => {
    const fetchUserProfile = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        // No user logged in, so we don't need to do anything
        return;
      }
      try {
        const res = await fetch(`/api/user/get/userProfile/${userId}`);
        if (res.ok) {
          const data = await res.json();
          setUserProfile(data);
        }
      } catch (err) {
        console.error("Failed to fetch user profile", err);
      }
    };

    fetchUserProfile();
  }, []); // Empty dependency array means this runs once on page load
  console.log("We back bay:",userProfile);

  // Automatically set the region filter once the user's profile is loaded
  useEffect(() => {
    // This effect runs whenever the userProfile state changes
    if (userProfile && userProfile.province) {
      setRegionFilter(userProfile.province);
    }
  }, [userProfile]); // The dependency on 'userProfile' is key

  // Get unique regions from events
  const uniqueRegions = useMemo(() => {
    const regions = events.map((e) => e.region).filter(Boolean);
    return Array.from(new Set(regions));
  }, [events]);

  // Filter to only published and unpublished events
  const filteredEvents = useMemo(() => {
    return events
      .filter((e) =>
        ["published", "unpublished"].includes((e.event_status || "").toLowerCase())
      )
      .filter((e) => {
        const matchesType = eventTypeFilter
          ? (e.type || "").toLowerCase() === eventTypeFilter
          : true;
        const matchesRegion = regionFilter
          ? (e.region || "") === regionFilter
          : true;
        const matchesStatus = statusFilter
          ? statusFilter === "joined"
            ? joinedEvents.some(je => je.eventid === e.eventid)
            : (e.event_status || "").toLowerCase() === statusFilter
          : true;
        const matchesSearch = searchTerm
          ? (e.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (e.venue || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (e.region || "").toLowerCase().includes(searchTerm.toLowerCase())
          : true;
        return matchesType && matchesRegion && matchesStatus && matchesSearch;
      });
  }, [events, eventTypeFilter, regionFilter, statusFilter, searchTerm, joinedEvents]);

  // Sort events
  const sortedEvents = useMemo(() => {
    return [...filteredEvents].sort((a, b) => {
      const aVal = sortField.includes("date") ? new Date(a[sortField]) : a[sortField];
      const bVal = sortField.includes("date") ? new Date(b[sortField]) : b[sortField];
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredEvents, sortField, sortOrder]);

  // Pagination logic
  const indexOfLast = currentPage * eventsPerPage;
  const indexOfFirst = indexOfLast - eventsPerPage;
  const currentEvents = sortedEvents.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedEvents.length / eventsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Check which events user has joined
  const fetchJoinedEvents = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      const res = await fetch(`/api/events/joined/${userId}`);
      const data = await res.json();

      if (res.ok && data && Array.isArray(data.joinedEventsIds)) {
        setJoinedEvents(data.joinedEventsIds);
      }
    } catch (err) {
      console.error("Failed to check joined events", err);
    }
  };

  // Method to handle the event joining.
  const handleJoinEvent = async (eventId) => {
    setJoiningEventId(eventId);
    const userId = localStorage.getItem("userId");
    if (!userId) {
        alert("Please log in first");
        setJoiningEventId(null);
        return;
    }

    try {
      const response = await fetch(`${API_URL}/join/event/${eventId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      await fetchJoinedEvents();
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to join event.");
    } finally {
        setJoiningEventId(null);
    }
  };

  const handleProjectAction = (eventId, projectId) => {
    setSelectedEvent({ eventId, projectId });
    setShowProjectCard(true);
  };

  const handleCloseProjectCard = () => {
    setShowProjectCard(false);
    setSelectedEvent(null);
    fetchJoinedEvents();
  };

  useEffect(() => {
    fetchJoinedEvents();
  }, []);

  if (showProjectCard) {
    return <ProjectManagementCard event={selectedEvent} onClose={handleCloseProjectCard} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-indigo-200/40 shadow-xl shadow-indigo-100/30">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Available Events
            </h2>
            <p className="text-blue-100 mt-2 text-sm">Discover and join exciting events in your area</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-indigo-200/40 shadow-lg shadow-indigo-100/30">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <select
                className="px-4 py-3 rounded-xl border border-indigo-200 bg-white text-indigo-700 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 font-medium"
                value={eventTypeFilter}
                onChange={(e) => setEventTypeFilter(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="district">District</option>
                <option value="regional">Regional</option>
                <option value="international">International</option>
              </select>

              <select
                className="px-4 py-3 rounded-xl border border-indigo-200 bg-white text-indigo-700 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 font-medium"
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
              >
                <option value="">All Regions</option>
                {uniqueRegions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>

              <select
                className="px-4 py-3 rounded-xl border border-indigo-200 bg-white text-indigo-700 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 font-medium"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="joined">Joined</option>
                <option value="published">Published</option>
                <option value="unpublished">Coming Soon</option>
              </select>

              <div className="relative">
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <Input
                  type="text"
                  placeholder="Search events, venue, region..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 w-full sm:w-80 bg-white border-indigo-200 focus:border-indigo-400 rounded-xl shadow-sm text-gray-700"
                  color="indigo"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Events Table */}
        <Card className="bg-white/80 backdrop-blur-sm border border-indigo-100 shadow-2xl shadow-indigo-100/40 rounded-2xl overflow-hidden">
          <CardBody className="overflow-x-auto px-0 pt-0 pb-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-500 mb-6"></div>
                <Typography className="text-indigo-600 text-lg font-semibold">
                  Loading events...
                </Typography>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
                  <Typography className="text-red-600 text-lg font-semibold">
                    {error}
                  </Typography>
                </div>
              </div>
            ) : sortedEvents.length === 0 ? (
              <div className="text-center py-20">
                <div className="bg-gradient-to-br from-indigo-50 to-blue-100 p-8 rounded-3xl max-w-md mx-auto">
                  <svg className="w-16 h-16 text-indigo-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <Typography className="text-indigo-600 text-lg font-semibold">
                    No events found
                  </Typography>
                  <Typography className="text-indigo-500 text-sm mt-2">
                    Try adjusting your search or filters
                  </Typography>
                </div>
              </div>
            ) : (
              <div className="w-full min-w-[350px] md:min-w-[700px]">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-indigo-100">
                      {["Name", "Venue", "Region", "Date", "Time", "Status", "Action"].map((el) => (
                        <th
                          key={el}
                          className="py-6 px-6 text-left text-indigo-700 text-sm font-bold uppercase tracking-wide"
                        >
                          {el}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentEvents.map((event, index) => (
                      <tr
                        key={event.eventid}
                        className={`hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200 border-b border-indigo-50 ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                        }`}
                      >
                        <td className="py-6 px-6 text-gray-900 font-semibold">{event.name}</td>
                        <td className="py-6 px-6 text-gray-700 font-medium">{event.venue}</td>
                        <td className="py-6 px-6 text-gray-700 font-medium">{event.region}</td>
                        <td className="py-6 px-6 text-gray-700 font-medium">
                          {new Date(event.start_date).toLocaleDateString()}
                        </td>
                        <td className="py-6 px-6 text-gray-700 font-medium">{event.start_time}</td>
                        <td className="py-6 px-6">
                          {event.event_status.toLowerCase() === "published" ? (
                            <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-4 py-2 rounded-full text-sm font-bold shadow-sm">
                              Published
                            </span>
                          ) : (
                            <span className="bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-bold shadow-sm">
                              Coming Soon
                            </span>
                          )}
                        </td>
                        <td className="py-6 px-6">
                          {(() => {
                            if (event.event_status.toLowerCase() !== "published") {
                              return <span className="text-orange-600 font-medium italic">Coming soon</span>;
                            }

                            const joinedEvent = joinedEvents.find(je => je.eventid === event.eventid);

                            if (joinedEvent) {
                              if (joinedEvent.projectid) {
                                return (
                                  <Button
                                    size="sm"
                                    onClick={() => handleProjectAction(joinedEvent.eventid, joinedEvent.projectid)}
                                    className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl flex items-center gap-2 hover:scale-105"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    View Project
                                  </Button>
                                );
                              } else {
                                return (
                                  <Button
                                    size="sm"
                                    onClick={() => handleProjectAction(joinedEvent.eventid, null)}
                                    className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl flex items-center gap-2 hover:scale-105"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                    </svg>
                                    Add Project
                                  </Button>
                                );
                              }
                            } else {
                              return (
                                <Button
                                  onClick={() => handleJoinEvent(event.eventid)}
                                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-lg px-6 py-2 font-semibold flex items-center gap-2"
                                  disabled={joiningEventId === event.eventid}
                                >
                                  {joiningEventId === event.eventid ? (
                                    <>
                                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                      Joining...
                                    </>
                                  ) : (
                                    <>
                                      <MapPin className="h-5 w-5" />
                                      Join Event
                                    </>
                                  )}
                                </Button>
                              );
                            }
                          })()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {sortedEvents.length > 0 && (
              <div className="flex justify-between items-center px-8 pt-6 border-t border-indigo-100 mt-6">
                <Button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-0 px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </Button>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-3 rounded-xl border border-indigo-200">
                  <Typography className="font-semibold text-indigo-700">
                    Page <span className="text-indigo-900">{currentPage}</span> of{" "}
                    <span className="text-indigo-900">{totalPages}</span>
                  </Typography>
                </div>
                <Button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-0 px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </Button>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default Events;
