import React, { useEffect, useState, useMemo, useCallback } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { useParams } from "react-router-dom";
import {
  UserCircle,
  BookOpen,
  Users,
  X,
  User,
  Briefcase,
  Book,
  Layers,
  Star,
  Trophy,
  Search,
  CheckCircle,
  XCircle,
  ArrowUpCircle,
} from "lucide-react";


// --- REUSABLE SUB-COMPONENTS ---

const Spinner = () => (
  <div className="flex justify-center items-center">
    <svg className="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  </div>
);

const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center space-x-2 text-sm text-indigo-800">
    <Icon size={16} className="text-indigo-500" />
    <p>{label}: <span className="font-medium text-indigo-900">{value}</span></p>
  </div>
);

const ProjectDetails = ({ project, judges, loadingJudges }) => (
  <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-indigo-200/40 p-8 space-y-8">
    <div className="space-y-4 border-b border-indigo-100 pb-6">
        <div className="flex items-center space-x-3">
            <div className="bg-amber-500 p-3 rounded-xl"><Trophy size={24} className="text-white" /></div>
            <div>
                <h6 className="font-bold text-indigo-900 text-xl">{project.projectname}</h6>
                <p className="text-indigo-600 text-sm font-medium">Project Details</p>
            </div>
        </div>
        <div className="ml-12"><DetailItem icon={Book} label="Category" value={project.category} /></div>
    </div>
    <div className="space-y-4 border-b border-indigo-100 pb-6">
        <div className="flex items-center space-x-3">
            <div className="bg-blue-500 p-3 rounded-xl"><UserCircle size={24} className="text-white" /></div>
            <div>
                <h6 className="font-bold text-indigo-900 text-xl">Project Owner</h6>
                <p className="text-indigo-600 text-sm font-medium">Student Information</p>
            </div>
        </div>
        <div className="ml-12 space-y-3">
            <DetailItem icon={User} label="Name" value={`${project.learnername} ${project.learnersurname}`} />
            <DetailItem icon={Layers} label="Grade" value={project.grade} />
            <DetailItem icon={Briefcase} label="School" value={project.schoolname} />
        </div>
    </div>
    <div className="space-y-4">
        <div className="flex items-center space-x-3">
            <div className="bg-emerald-500 p-3 rounded-xl"><Users size={24} className="text-white" /></div>
            <div>
                <h6 className="font-bold text-indigo-900 text-xl">Assigned Judges</h6>
                <p className="text-indigo-600 text-sm font-medium">Evaluation Team</p>
            </div>
        </div>
        {loadingJudges ? (
            <div className="flex justify-center items-center h-24 bg-indigo-50/50 rounded-xl"><Spinner /></div>
        ) : (
            <div className="ml-12 space-y-4">
                {judges.length > 0 ? (
                    judges.map((judge, index) => (
                        <div key={index} className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex justify-between items-center shadow-sm">
                            <div className="flex items-center space-x-3">
                                <div className="bg-indigo-500 p-2 rounded-full"><UserCircle size={20} className="text-white" /></div>
                                <p className="font-semibold text-indigo-800">{judge.title} {judge.judgename} {judge.judgesurname}</p>
                            </div>
                            <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm px-3 py-2 rounded-lg border border-indigo-200/40">
                                <Star size={18} className="text-amber-500" />
                                <p className="font-bold text-indigo-800">{judge.mark || "N/A"}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-indigo-50/50 rounded-xl border border-indigo-100">
                        <Users size={48} className="text-indigo-300 mx-auto mb-3" />
                        <p className="text-indigo-500 font-medium">No judges assigned yet.</p>
                    </div>
                )}
            </div>
        )}
    </div>
  </div>
);

const PromoteModal = ({ isOpen, onClose, project, targetEvents, onSelectEvent, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg m-4">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-indigo-900">Promote Project</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors"><X size={24} /></button>
        </div>
        <div className="p-8">
          <p className="text-gray-600 mb-2">You are promoting:</p>
          <h3 className="text-2xl font-bold text-indigo-800 mb-6">{project?.projectname}</h3>
          
          <p className="font-semibold text-gray-700 mb-3">Select a target event:</p>
          
          {isLoading ? (
            <div className="h-40 flex justify-center items-center"><Spinner /></div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {targetEvents.length > 0 ? (
                targetEvents.map((event) => (
                  <button
                    key={event.eventid}
                    onClick={() => onSelectEvent(event.eventid)}
                    className="w-full text-left p-4 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-all group"
                  >
                    <p className="font-bold text-indigo-700 group-hover:text-indigo-900">{event.name}</p>
                    <p className="text-sm text-indigo-500">
                      Starts: {new Date(event.start_date).toLocaleDateString()}
                    </p>
                  </button>
                ))
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 font-medium">No available events for promotion.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- REFACTORED DYNAMIC TABLE COMPONENT ---
const ProjectDisplayTable = ({ projects, columns, handleSort, sortField, sortOrder }) => {
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [projectJudges, setProjectJudges] = useState([]);
  const [loadingJudges, setLoadingJudges] = useState(false);

  const fetchProjectJudges = async (projectid) => {
    setLoadingJudges(true);
    try {
      const res = await fetch(`/api/project-judges/get/results/${projectid}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setProjectJudges(data.judges);
    } catch (err) {
      console.error("Failed to fetch judges:", err);
    } finally {
      setLoadingJudges(false);
    }
  };

  const handleProjectView = (projectid) => {
    if (selectedProjectId === projectid) {
      setSelectedProjectId(null);
    } else {
      setSelectedProjectId(projectid);
      fetchProjectJudges(projectid);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm shadow-2xl shadow-indigo-100/40 rounded-2xl overflow-hidden border border-indigo-100">
      <div>
        <table className="w-full table-fixed text-left">
          <thead>
            <tr className="bg-indigo-600 text-white">
              {columns.map((col) => (
                <th 
                  key={col.key} 
                  className={`p-6 ${col.width} font-bold text-sm uppercase tracking-wide ${col.sortable ? 'cursor-pointer hover:bg-indigo-700 transition-colors' : ''}`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-2">
                    {col.label}
                    {col.sortable && sortField === col.key && (sortOrder === "asc" ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projects.length > 0 ? (
              projects.map((p) => (
                <React.Fragment key={p.projectid}>
                  <tr className="cursor-pointer transition-all duration-200 border-b border-indigo-100 hover:bg-indigo-50" onClick={() => handleProjectView(p.projectid)}>
                    {columns.map(col => (
                      <td key={col.key} className="p-6 break-words align-top">
                        {col.render(p)}
                      </td>
                    ))}
                  </tr>
                  {selectedProjectId === p.projectid && (
                    <tr className="bg-indigo-50/30">
                      <td colSpan={columns.length} className="p-6">
                        <ProjectDetails project={p} judges={projectJudges} loadingJudges={loadingJudges} />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="p-12 text-center bg-indigo-50/30">
                    <div className="flex flex-col items-center">
                        <div className="bg-indigo-400 p-6 rounded-full mb-6"><BookOpen size={48} className="text-white" /></div>
                        <h3 className="text-indigo-700 font-bold text-xl mb-2">No Projects Found</h3>
                        <p className="text-indigo-500 font-medium">No projects match the current filters.</p>
                    </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};


// --- MAIN PAGE COMPONENT WITH ALL LOGIC ---
export default function ProjectsPage() {
  const { eventid } = useParams();
  const [allProjects, setAllProjects] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [shortlistedProjects, setShortlistedProjects] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("projects");

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [badgeFilter, setBadgeFilter] = useState("");
  const [sortField, setSortField] = useState("totalscore");
  const [sortOrder, setSortOrder] = useState("desc");

  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
  const [projectToPromote, setProjectToPromote] = useState(null);
  const [promotionTargets, setPromotionTargets] = useState([]);
  const [isLoadingTargets, setIsLoadingTargets] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [projectsRes, recsRes, shortlistRes] = await Promise.all([
        fetch(`/api/projects/event/${eventid}`),
        fetch(`/api/projects/get/recommended/projects/${eventid}`),
        fetch(`/api/projects/get/shortlist/${eventid}`) 
      ]);
      if (!projectsRes.ok || !recsRes.ok || !shortlistRes.ok) throw new Error("Failed to fetch all required project data.");
      
      const projectsData = await projectsRes.json();
      const recsData = await recsRes.json();
      const shortlistData = await shortlistRes.json();

      setAllProjects(projectsData.projects || []);
      setRecommendations(recsData || []);
      setShortlistedProjects(shortlistData || []);
    } catch (err) { setError(err.message); }
  }, [eventid]);
  
  useEffect(() => {
    setLoading(true);
    fetchData().finally(() => setLoading(false));

    const eventSource = new EventSource(`/api/events/stream/${eventid}`);
    const handleShortlistEvent = (event) => {
      try {
        const { project } = JSON.parse(event.data);
        if (!project) return;
        setShortlistedProjects(prev => {
          if (prev.some(p => p.projectid === project.projectid)) return prev;
          return [...prev, project];
        });
        setRecommendations(prev => prev.filter(r => r.projectid !== project.projectid));
      } catch (e) { console.error("Failed to parse shortlist event:", e); }
    };
    const handleRemoveShortlistEvent = (event) => {
      try {
        const { projectId } = JSON.parse(event.data);
        if (!projectId) return;
        setShortlistedProjects(prev => prev.filter(p => p.projectid !== projectId));
      } catch (e) { console.error("Failed to parse remove shortlist event:", e); }
    };
    const handlePromoteEvent = (event) => {
      try {
        const { projectId } = JSON.parse(event.data);
        if (!projectId) return;
        setShortlistedProjects(prev => 
            prev.map(p => p.projectid === projectId ? { ...p, isActioned: true } : p)
        );
      } catch (e) { console.error("Failed to parse promote event", e); }
    };

    eventSource.addEventListener('project-shortlisted', handleShortlistEvent);
    eventSource.addEventListener('project-removed-from-shortlist', handleRemoveShortlistEvent);
    eventSource.addEventListener('project-promoted', handlePromoteEvent);

    eventSource.onerror = (err) => {
      console.error("EventSource Error:", err);
      eventSource.close();
    };
    return () => { eventSource.close(); };
  }, [eventid, fetchData]);
  
  const handleShortlist = async (project) => {
      try {
          const res = await fetch(`/api/shortlists`, { 
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ projectId: project.projectid, eventId: eventid }),
          });
          if (!res.ok) throw new Error("Failed to shortlist project");
      } catch (err) { alert(`Error: ${err.message}`); }
  };

  const handleRemoveShortlist = async (project) => {
      try {
        const res = await fetch(`/api/shortlists`, { 
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ projectId: project.projectid, eventId: eventid }),
        });
        if (!res.ok) throw new Error("Failed to remove project from shortlist");
      } catch (err) { alert(`Error: ${err.message}`); }
  };

  const handlePromote = async (project) => {
    setProjectToPromote(project);
    setIsPromoteModalOpen(true);
    setIsLoadingTargets(true);
    try {
      const res = await fetch(`/api/events/promote-targets/${eventid}`);
      if (!res.ok) throw new Error("Could not fetch target events.");
      const data = await res.json();
      console.log("Promotion targets:", data);
      setPromotionTargets(data);
    } catch (err) {
      alert(err.message);
      setPromotionTargets([]);
    } finally {
      setIsLoadingTargets(false);
    }
  };

  const handleConfirmPromotion = async (newEventId) => {
    if (!projectToPromote) return;
    try {
        const res = await fetch(`/api/projects/promote`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              projectId: projectToPromote.projectid, 
              newEventId: parseInt(newEventId) 
            }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        alert(`Project "${projectToPromote.projectname}" promoted successfully!`);
    } catch (err) {
        alert(`Error: ${err.message}`);
    } finally {
        setIsPromoteModalOpen(false);
        setProjectToPromote(null);
        setPromotionTargets([]);
    }
  };
  
  const categories = useMemo(() => [...new Set(allProjects.map(p => p.category).filter(Boolean))].sort(), [allProjects]);

  const handleSort = (field) => {
    setSortField(field);
    setSortOrder(prev => (sortField === field && prev === "desc" ? "asc" : "desc"));
  };
  
  const filterAndSort = useCallback((sourceList) => {
    const filtered = sourceList.filter(project => {
      if (!project || !project.projectname) return false;
      const searchMatch = project.projectname.toLowerCase().includes(searchQuery.toLowerCase());
      const categoryMatch = categoryFilter ? project.category === categoryFilter : true;
      let badgeMatch = true;
      if (badgeFilter) {
        if (badgeFilter === 'badged') {
          const validBadges = ['gold', 'silver', 'bronze'];
          badgeMatch = validBadges.includes(project.badge?.toLowerCase());
        } else {
          badgeMatch = project.badge?.toLowerCase() === badgeFilter.toLowerCase();
        }
      }
      return searchMatch && categoryMatch && badgeMatch;
    });

    return [...filtered].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (sortField === 'totalscore') { aVal = aVal ?? -1; bVal = bVal ?? -1; } 
      else { aVal = aVal ?? ''; bVal = bVal ?? ''; }
      if (aVal === bVal) return 0;
      if (typeof aVal === 'number') { return sortOrder === "asc" ? aVal - bVal : bVal - aVal; }
      return sortOrder === "asc" ? (String(aVal).localeCompare(String(bVal))) : (String(bVal).localeCompare(String(aVal)));
    });
  }, [searchQuery, categoryFilter, badgeFilter, sortField, sortOrder]);
  
  const allProjectsForDisplay = useMemo(() => {
    const shortlistedIds = new Set(shortlistedProjects.map(p => p.projectid));
    return allProjects.map(p => ({ ...p, isActioned: shortlistedIds.has(p.projectid) }));
  }, [allProjects, shortlistedProjects]);

  const recommendationsForDisplay = useMemo(() => {
    const shortlistedIds = new Set(shortlistedProjects.map(p => p.projectid));
    return recommendations.map(p => ({ ...p, isActioned: shortlistedIds.has(p.projectid) }));
  }, [recommendations, shortlistedProjects]);
  
  const shortlistedForDisplay = useMemo(() => {
    return shortlistedProjects.map(p => ({...p, isActioned: p.isActioned || false }));
  }, [shortlistedProjects]);

  const displayedProjects = useMemo(() => {
    let sourceList = [];
    if (activeTab === 'projects') sourceList = allProjectsForDisplay;
    if (activeTab === 'recommendations') sourceList = recommendationsForDisplay;
    if (activeTab === 'shortlisted') sourceList = shortlistedForDisplay;
    return filterAndSort(sourceList);
  }, [activeTab, allProjectsForDisplay, recommendationsForDisplay, shortlistedForDisplay, filterAndSort]);

  const columnsConfig = {
    projects: [
      { key: 'projectname', label: 'Project', width: 'w-[30%]', sortable: true, render: p => (<div className="flex items-center gap-3"><div className="bg-indigo-500 p-2 rounded-lg"><Trophy size={16} className="text-white" /></div><span className="font-semibold text-indigo-900">{p.projectname}</span></div>)},
      { key: 'badge', label: 'Badge', width: 'w-[15%]', sortable: true, render: p => (<span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-bold capitalize">{p.badge || "N/A"}</span>)},
      { key: 'totalscore', label: 'Score', width: 'w-[15%]', sortable: true, render: p => (<div className="flex items-center gap-2"><Star size={16} className="text-amber-500" /><span className="font-bold text-indigo-800">{p.totalscore ?? "N/A"}</span></div>)},
      { key: 'category', label: 'Category', width: 'w-[25%]', sortable: true, render: p => <span className="text-indigo-700 font-medium">{p.category}</span> },
      { key: 'action', label: 'Action', width: 'w-[15%]', sortable: false, render: p => (<button onClick={(e) => { e.stopPropagation(); handleShortlist(p); }} disabled={p.isActioned} className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 shadow-lg hover:shadow-xs text-white px-5 py-2 text-sm font-bold rounded-xl disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"><CheckCircle size={16} />{p.isActioned ? 'Shortlisted' : 'Shortlist'}</button>)},
    ],
    recommendations: [
      { key: 'projectname', label: 'Project', width: 'w-[30%]', sortable: true, render: p => (<div className="flex items-center gap-3"><div className="bg-indigo-500 p-2 rounded-lg"><Trophy size={16} className="text-white" /></div><span className="font-semibold text-indigo-900">{p.projectname}</span></div>)},
      { key: 'badge', label: 'Badge', width: 'w-[15%]', sortable: true, render: p => (<span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-bold capitalize">{p.badge || "N/A"}</span>)},
      { key: 'totalscore', label: 'Score', width: 'w-[15%]', sortable: true, render: p => (<div className="flex items-center gap-2"><Star size={16} className="text-amber-500" /><span className="font-bold text-indigo-800">{p.totalscore ?? "N/A"}</span></div>)},
      { key: 'recommendedBy', label: 'By', width: 'w-[15%]', sortable: false, render: p => <span className="text-indigo-700">{p.convenername ? `${p.convenername.substring(0,1)}.` : ''} {p.convenersurname}</span> },
      { key: 'action', label: 'Action', width: 'w-[15%]', sortable: false, render: p => (<button onClick={(e) => { e.stopPropagation(); handleShortlist(p); }} disabled={p.isActioned} className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 shadow-lg hover:shadow-xs text-white px-5 py-2 text-sm font-bold rounded-xl disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"><CheckCircle size={16} />{p.isActioned ? 'Shortlisted' : 'Shortlist'}</button>)},
    ],
    shortlisted: [
      { key: 'projectname', label: 'Project', width: 'w-[35%]', sortable: true, render: p => (<div className="flex items-center gap-3"><div className="bg-indigo-500 p-2 rounded-lg"><Trophy size={16} className="text-white" /></div><span className="font-semibold text-indigo-900">{p.projectname}</span></div>)},
      { key: 'badge', label: 'Badge', width: 'w-[15%]', sortable: true, render: p => (<span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-bold capitalize">{p.badge || "N/A"}</span>)},
      { key: 'totalscore', label: 'Score', width: 'w-[15%]', sortable: true, render: p => (<div className="flex items-center gap-2"><Star size={16} className="text-amber-500" /><span className="font-bold text-indigo-800">{p.totalscore ?? "N/A"}</span></div>)},
      { key: 'action', label: 'Action', width: 'w-[35%]', sortable: false, render: p => (<div className="flex items-center gap-2"><button onClick={(e) => { e.stopPropagation(); handlePromote(p); }} disabled={p.isActioned} className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xs text-white px-4 py-2 text-sm font-bold rounded-xl transition-all duration-200 flex items-center gap-2"><ArrowUpCircle size={16} /> {p.isActioned ? 'Promoted' : 'Promote'}</button><button onClick={(e) => { e.stopPropagation(); handleRemoveShortlist(p); }} className="bg-red-500 hover:bg-red-600 shadow-lg hover:shadow-xs text-white px-4 py-2 text-sm font-bold rounded-xl transition-all duration-200 flex items-center gap-2"><XCircle size={16} /> Remove</button></div>)},
    ],
  };

  if (loading) { return (<div className="flex flex-col justify-center items-center h-64"><Spinner /><p className="text-indigo-600 font-medium mt-4">Loading project data...</p></div>); }
  if (error) { return (<div className="text-center py-12 bg-red-50/50 border border-red-100 rounded-xl"><div className="bg-red-500 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4"><X size={32} className="text-white" /></div><p className="text-red-600 font-semibold text-lg mb-2">Error Loading Data</p><p className="text-red-500 px-4">{error}</p></div>); }

  return (
    <div className="p-4 sm:p-8 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-t-2xl border border-b-0 border-indigo-200/40 shadow-xl shadow-indigo-100/30">
          <div className="bg-indigo-600 text-white p-6 rounded-t-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex items-center gap-3 mb-4 md:mb-0">
                    <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm border border-white/20"><BookOpen className="w-6 h-6" /></div>
                    <div><h3 className="font-bold text-white text-2xl">Event Projects</h3><p className="text-indigo-100 text-sm font-medium">Managing projects for Event {eventid}</p></div>
                </div>
                <div className="flex flex-wrap gap-3">
                    <div className="relative"><input type="text" placeholder="Search projects..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="p-3 border border-white/20 bg-white/20 backdrop-blur-sm rounded-xl text-white placeholder-white/70 focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all pl-10" /><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70" /></div>
                    <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="p-3 border border-white/20 bg-white/20 backdrop-blur-sm rounded-xl text-white placeholder-white/70 focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all"><option value="" className="text-indigo-800">All Categories</option>{categories.map(cat => (<option key={cat} value={cat} className="text-indigo-800">{cat}</option>))}</select>
                    <select value={badgeFilter} onChange={(e) => setBadgeFilter(e.target.value)} className="p-3 border border-white/20 bg-white/20 backdrop-blur-sm rounded-xl text-white placeholder-white/70 focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all"><option value="" className="text-indigo-800">All Projects</option><option value="badged" className="text-indigo-800">Any Badge</option><option value="gold" className="text-indigo-800">Gold</option><option value="silver" className="text-indigo-800">Silver</option><option value="bronze" className="text-indigo-800">Bronze</option></select>
                </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm p-2 border-x border-b border-indigo-200/40 rounded-b-2xl mb-8 shadow-xl shadow-indigo-100/30">
          <div className="flex space-x-2 bg-indigo-100/50 p-1.5 rounded-xl">
            <button onClick={() => setActiveTab('projects')} className={`w-full p-3 rounded-lg text-sm font-bold transition-all duration-300 ${activeTab === 'projects' ? 'bg-white shadow-md text-indigo-700' : 'text-indigo-500 hover:bg-white/50'}`}>All Projects ({allProjects.length})</button>
            <button onClick={() => setActiveTab('recommendations')} className={`w-full p-3 rounded-lg text-sm font-bold transition-all duration-300 ${activeTab === 'recommendations' ? 'bg-white shadow-md text-indigo-700' : 'text-indigo-500 hover:bg-white/50'}`}>Recommendations ({recommendations.length})</button>
            <button onClick={() => setActiveTab('shortlisted')} className={`w-full p-3 rounded-lg text-sm font-bold transition-all duration-300 ${activeTab === 'shortlisted' ? 'bg-white shadow-md text-indigo-700' : 'text-indigo-500 hover:bg-white/50'}`}>Shortlisted ({shortlistedProjects.length})</button>
          </div>
        </div>

        <ProjectDisplayTable
            projects={displayedProjects}
            columns={columnsConfig[activeTab]}
            handleSort={handleSort}
            sortField={sortField}
            sortOrder={sortOrder}
        />
      </div>

      <PromoteModal
        isOpen={isPromoteModalOpen}
        onClose={() => setIsPromoteModalOpen(false)}
        project={projectToPromote}
        targetEvents={promotionTargets}
        isLoading={isLoadingTargets}
        onSelectEvent={handleConfirmPromotion}
      />
    </div>
  );
}