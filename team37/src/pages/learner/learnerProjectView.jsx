import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  Input,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { FolderIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ProjectManagementCard from "../../widgets/cards/projectManagementCard";

const ProjectList = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [showProjectCard, setShowProjectCard] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const fetchLearnerProjects = async (userId) => {
    try {
      const response = await fetch(`/api/projects/learner/project/${userId}`);
      const data = await response.json();

      if (response.ok) {
        setProjects(data.projects || []);
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error("Failed to fetch learner projects", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) return alert("Please log in first");
    fetchLearnerProjects(storedUserId);
  }, []);

  const handleSearch = (e) => setQuery(e.target.value);

  const filteredProjects = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return projects;

    const hay = (v) => (v ?? "").toString().toLowerCase();

    return projects.filter((p) =>
      hay(p.projectid).includes(value) ||
      hay(p.projectname).includes(value) ||
      hay(p.learnerid).includes(value) ||
      hay(p.category).includes(value) ||
      hay(p.status).includes(value) ||
      hay(p.standnumber).includes(value) ||
      hay(p.badge).includes(value)
    );
  }, [projects, query]);

  const handleEditClick = (project) => {
    setSelectedProject({
      eventId: project.eventid,
      projectId: project.projectid,
    });
    setShowProjectCard(true);
  };

  const handleCloseProjectCard = () => {
    setShowProjectCard(false);
    setSelectedProject(null);
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      fetchLearnerProjects(storedUserId);
    }
  };

  const noBaseProjects = !loading && projects.length === 0;
  const noFilteredResults = !loading && projects.length > 0 && filteredProjects.length === 0;

  if (showProjectCard) {
    return <ProjectManagementCard event={selectedProject} onClose={handleCloseProjectCard} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-indigo-200/40 shadow-lg shadow-indigo-100/30">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 bg-clip-text text-transparent mb-2">
                Project Portfolio 2025
              </h1>
              <p className="text-gray-600 text-sm flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Manage your academic projects
              </p>
            </div>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <Input
                type="text"
                placeholder="Search projects..."
                value={query}
                onChange={handleSearch}
                className="pl-10 w-full sm:w-80 bg-white/80 border-indigo-200 focus:border-indigo-400 rounded-lg shadow-sm text-gray-700"
              />
            </div>
          </div>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border border-purple-100 shadow-2xl shadow-purple-100/40 rounded-3xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
            <div className="flex items-center gap-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7z" />
              </svg>
              <div>
                <h2 className="text-2xl font-bold">Active Projects</h2>
                <p className="text-purple-100 text-base">
                  Displaying {filteredProjects.length} project{filteredProjects.length !== 1 && "s"}
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="overflow-x-auto rounded-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-indigo-100">
                    <th className="py-6 px-6 font-bold text-indigo-700 text-sm uppercase tracking-wide rounded-tl-2xl">Project ID</th>
                    <th className="py-6 px-6 font-bold text-indigo-700 text-sm uppercase tracking-wide">Stand #</th>
                    <th className="py-6 px-6 font-bold text-indigo-700 text-sm uppercase tracking-wide">Project Title</th>
                    <th className="py-6 px-6 font-bold text-indigo-700 text-sm uppercase tracking-wide">Status</th>
                    <th className="py-6 px-6 font-bold text-indigo-700 text-sm uppercase tracking-wide">Category</th>
                    <th className="py-6 px-6 font-bold text-indigo-700 text-sm uppercase tracking-wide">Badge</th>
                    <th className="py-6 px-6 font-bold text-indigo-700 text-sm uppercase tracking-wide rounded-tr-2xl">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="text-center py-20">
                        <div className="flex flex-col items-center">
                          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-500 mb-6"></div>
                          <p className="text-gray-500 text-lg">Loading your amazing projects...</p>
                        </div>
                      </td>
                    </tr>
                  ) : noBaseProjects ? (
                    <tr>
                      <td colSpan={8} className="text-center py-20">
                        <div className="flex flex-col items-center">
                          <div className="bg-gradient-to-br from-blue-100 via-indigo-100 to-blue-200 p-8 rounded-3xl mb-8">
                            <FolderIcon className="w-20 h-20 text-indigo-400 mx-auto" />
                          </div>
                          <h3 className="text-2xl font-bold text-gray-700 mb-3">No Projects Found</h3>
                          <p className="text-gray-500 mb-8 max-w-md text-lg leading-relaxed">
                            You can create projects from the events page after joining an event.
                          </p>
                          <Button 
                             className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl shadow-indigo-200 rounded-2xl px-10 py-4 flex items-center gap-3 text-lg font-semibold"
                            onClick={() => navigate("/dashboard/events")}
                          >
                            Go to Events
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ) : noFilteredResults ? (
                    <tr>
                      <td colSpan={8} className="text-center py-20">
                        <div className="flex flex-col items-center">
                          <svg className="w-16 h-16 text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Results Found</h3>
                          <p className="text-gray-500">
                            No matches for <span className="font-semibold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">"{query}"</span>
                          </p>
                          <p className="text-sm text-gray-400 mt-2">Try adjusting your search terms</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredProjects.map((project, index) => (
                      <tr key={project.projectid} className={`border-b border-purple-50 hover:bg-gradient-to-r hover:from-purple-50/50 hover:via-pink-50/50 hover:to-orange-50/50 transition-all duration-300 group ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                        <td className="py-6 px-6">
                          <span className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-4 py-2 rounded-full text-sm font-bold shadow-sm">
                            #{project.projectid}
                          </span>
                        </td>
                        <td className="py-6 px-6 text-gray-700 font-medium">{project.standnumber || "—"}</td>
                        <td className="py-6 px-6 text-gray-700 font-medium">{project.projectname}</td>
                        <td className="py-6 px-6">
                          <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-sm ${ 
                            project.status === 'Active' ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800' :
                            project.status === 'Pending' ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800' :
                            project.status === 'Completed' ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800' :
                            'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800'
                          }`}>
                            {project.status}
                          </span>
                        </td>
                        <td className="py-6 px-6">
                          <span className="bg-gradient-to-r from-orange-100 to-pink-100 text-orange-800 px-4 py-2 rounded-full text-sm font-bold shadow-sm">
                            {project.category}
                          </span>
                        </td>
                        <td className="py-6 px-6 text-gray-700 font-medium">{project.badge || "—"}</td>
                        <td className="py-6 px-6">
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl flex items-center gap-2 group-hover:scale-105"
                            onClick={() => handleEditClick(project)}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProjectList;
