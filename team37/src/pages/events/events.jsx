import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardBody, Button, Spinner, Typography, Input } from "@material-tailwind/react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";

const API_URL = "/api/admin";

export default function AdminEvents() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [eventTypeFilter, setEventTypeFilter] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // **MODIFIED**: Changed default sort order to show newest events first
  const [sortField, setSortField] = useState("eventid");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  

  // Fetch events
  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/events/getAll`);
        if (!response.ok) throw new Error("Failed to fetch events.");
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError(err.message || "Failed to load events.");
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  // Reset page when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [eventTypeFilter, regionFilter, statusFilter, searchQuery]);

  const uniqueRegions = useMemo(() => {
    const regions = events.map((e) => e.region).filter(Boolean);
    return Array.from(new Set(regions));
  }, [events]);

  const statusCounts = useMemo(() => {
    const counts = { published: 0, unpublished: 0 };
    for (const e of events) {
      const status = (e.event_status || "").toLowerCase();
      if (counts.hasOwnProperty(status)) counts[status]++;
    }
    return counts;
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const matchesStatus = statusFilter ? (e.event_status || "").toLowerCase() === statusFilter : true;
      const matchesType = eventTypeFilter ? (e.type || "").toLowerCase() === eventTypeFilter : true;
      const matchesRegion = regionFilter ? (e.region || "") === regionFilter : true;

      const query = searchQuery.toLowerCase();
      const matchesSearch = query
        ? (e.type?.toLowerCase().includes(query) ||
            e.venue?.toLowerCase().includes(query) ||
            e.region?.toLowerCase().includes(query) ||
            new Date(e.start_date).toLocaleDateString().toLowerCase().includes(query))
        : true;

      return matchesStatus && matchesType && matchesRegion && matchesSearch;
    });
  }, [events, statusFilter, eventTypeFilter, regionFilter, searchQuery]);

  const sortedEvents = useMemo(() => {
    let sorted = [...filteredEvents];
    sorted.sort((a, b) => {
      let aVal, bVal;
      if (sortField === "start_date") {
        aVal = new Date(a.start_date);
        bVal = new Date(b.start_date);
      } else if (sortField === "start_time") {
        aVal = a.start_time;
        bVal = b.start_time;
      } else {
        aVal = a[sortField];
        bVal = b[sortField];
      }
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredEvents, sortField, sortOrder]);

  const paginatedEvents = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return sortedEvents.slice(indexOfFirstItem, indexOfLastItem);
  }, [sortedEvents, currentPage]);

  const totalPages = Math.ceil(sortedEvents.length / itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const updateEventStatus = async (eventid, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/events/status/${eventid}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error("Failed to update status");
      setEvents((prev) =>
        prev.map((e) => (e.eventid === eventid ? { ...e, event_status: newStatus } : e))
      );
    } catch (error) {
      alert(error.message);
    }
  };

  const deleteEvent = async (eventid) => {
    try {
      const response = await fetch(`${API_URL}/${eventid}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete event.");
      setEvents((prev) => prev.filter((e) => e.eventid !== eventid));
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
       <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-indigo-200/40 shadow-xl shadow-indigo-100/30">
 <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-t-2xl">
   <h2 className="text-xl font-bold flex items-center gap-2">
     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
     </svg>
     Events Management
   </h2>
   <p className="text-blue-100 mt-1 text-sm">Manage and organize your events</p>
 </div>
 
 <div className="px-4 py-2 bg-white rounded-b-2xl">
   <ul className="flex flex-row gap-4 py-1">
     {["unpublished", "published"].map((status) => (
       <li key={status}>
         <button
           onClick={() => setStatusFilter(status)}
           className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-200 ${
             statusFilter === status 
               ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md" 
               : "text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
           }`}
         >
           {status.charAt(0).toUpperCase() + status.slice(1)}{" "}
           <span className={`${statusFilter === status ? 'text-blue-100' : 'text-gray-500'}`}>
             ({statusCounts[status]})
           </span>
         </button>
       </li>
     ))}
     <li>
       <button
         onClick={() => setStatusFilter("")}
         className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-200 ${
           statusFilter === "" 
             ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md" 
             : "text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
         }`}
       >
         All ({events.length})
       </button>
     </li>
   </ul>
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

              <div className="relative">
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <Input
                  type="text"
                  placeholder="Search events, venue, region..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 w-full sm:w-80 bg-white border-indigo-200 focus:border-indigo-400 rounded-xl shadow-sm text-gray-700"
                  color="indigo"
                />
              </div>
            </div>

            <Link
              to="/events/create"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Event
            </Link>
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
                </div>
              </div>
            ) : (
              <div className="w-full min-w-[350px] md:min-w-[700px]">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-indigo-100">
                      {["Type", "Venue", "Region", "Date", "Time", "Actions"].map((el) => {
                        const isSortable = el === "Date" || el === "Time";
                        const sortKey = el === "Date" ? "start_date" : el === "Time" ? "start_time" : "";
                        return (
                          <th
                            key={el}
                            className={`py-6 px-6 text-left text-indigo-700 text-sm font-bold uppercase tracking-wide ${
                              isSortable ? "cursor-pointer select-none hover:bg-indigo-100/50 transition-colors" : ""
                            }`}
                            onClick={isSortable ? () => handleSort(sortKey) : undefined}
                          >
                            <span className="flex items-center gap-2">
                              {el}
                              {sortField === sortKey &&
                                (sortOrder === "asc" ? (
                                  <ChevronUpIcon className="w-4 h-4 text-indigo-600" />
                                ) : (
                                  <ChevronDownIcon className="w-4 h-4 text-indigo-600" />
                                ))}
                              {isSortable && sortField !== sortKey && (
                                <ChevronUpIcon className="w-4 h-4 opacity-30 text-indigo-400" />
                              )}
                            </span>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedEvents.map(({ eventid, type, venue, region, start_date, start_time, event_status }, index) => (
                      <tr
                        key={eventid}
                        className={`hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200 border-b border-indigo-50 ${
                          event_status === "published" ? "cursor-pointer" : "cursor-not-allowed"
                        } ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
                        onClick={() =>
                          event_status === "published" && navigate(`/admin/view/event/${eventid}`)
                        }
                      >
                        <td className="py-6 px-6">
                          <span className="bg-gradient-to-r from-blue-100 to-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-bold shadow-sm">
                            {type}
                          </span>
                        </td>
                        <td className="py-6 px-6 text-gray-700 font-medium">{venue}</td>
                        <td className="py-6 px-6 text-gray-700 font-medium">{region}</td>
                        <td className="py-6 px-6 text-gray-700 font-medium">
                          {new Date(start_date).toLocaleDateString()}
                        </td>
                        <td className="py-6 px-6 text-gray-700 font-medium">{start_time}</td>
                        <td className="py-6 px-6">
                          {event_status === "unpublished" && (
                            <div className="flex flex-row items-center gap-3">
                              <Button
                                size="sm"
                                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-lg px-4 py-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateEventStatus(eventid, "published");
                                }}
                              >
                                Publish
                              </Button>
                              <Button
                                size="sm"
                                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-lg px-4 py-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteEvent(eventid);
                                }}
                              >
                                Delete
                              </Button>
                            </div>
                          )}
                          {event_status === "published" && (
                            <div className="flex flex-row items-center gap-3">
                              <Button
                                size="sm"
                                className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-lg px-4 py-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateEventStatus(eventid, "unpublished");
                                }}
                              >
                                Unpublish
                              </Button>
                              <Button
                                size="sm"
                                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-lg px-4 py-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteEvent(eventid);
                                }}
                              >
                                Delete
                              </Button>
                            </div>
                          )}
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
                  variant="outlined"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
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
                  variant="outlined"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
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