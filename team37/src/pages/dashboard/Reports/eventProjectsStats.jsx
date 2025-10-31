import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from "recharts";

//  Card Components with animations
const Card = ({ children, className, delay = 0 }) => (
  <div 
    className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-[1.02] ${className}`}
    style={{ animationDelay: `${delay}ms` }}
  >
    {children}
  </div>
);

const CardHeader = ({ children, className }) => (
  <div className={className}>
    {children}
  </div>
);

const CardBody = ({ children, className }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

const Typography = ({ children, variant, className }) => {
  const baseClasses = "font-bold";
  const variantClasses = {
    h4: "text-2xl",
    h5: "text-xl",
    small: "text-sm"
  };
  
  return (
    <div className={`${baseClasses} ${variantClasses[variant] || ""} ${className}`}>
      {children}
    </div>
  );
};

const Select = ({ label, value, onChange, className, children, menuProps }) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full p-3 border border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition-all hover:border-blue-300 ${className}`}
    >
      {children}
    </select>
    <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-blue-600 font-medium">{label}</label>
  </div>
);

const Option = ({ children, value }) => (
  <option value={value}>{children}</option>
);

// Creative Badge Podium Component
const BadgePodium = ({ badgeData }) => {
  const gold = badgeData.find(b => b.name.toLowerCase() === 'gold')?.value || 0;
  const silver = badgeData.find(b => b.name.toLowerCase() === 'silver')?.value || 0;
  const bronze = badgeData.find(b => b.name.toLowerCase() === 'bronze')?.value || 0;
  const certificate = badgeData.find(b => b.name.toLowerCase() === 'certificate')?.value || 0;
  const none = badgeData.find(b => b.name.toLowerCase() === 'none')?.value || 0;
  
  const total = gold + silver + bronze + certificate + none;
  const goldPerc = total > 0 ? ((gold / total) * 100).toFixed(1) : 0;
  const silverPerc = total > 0 ? ((silver / total) * 100).toFixed(1) : 0;
  const bronzePerc = total > 0 ? ((bronze / total) * 100).toFixed(1) : 0;
  
  const maxHeight = Math.max(gold, silver, bronze) || 1;
  
  return (
    <div className="h-80 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-6 flex items-end justify-center gap-4">
      {/* Silver - Left */}
      <div className="flex flex-col items-center animate-slideUp" style={{ animationDelay: '0.5s' }}>
        <div className="text-2xl font-bold text-gray-600 mb-2 animate-bounce" style={{ animationDelay: '2s' }}>
          🥈
        </div>
        <div className="text-lg font-bold text-gray-700">{silver}</div>
        <div className="text-xs font-bold text-gray-600 mb-1">{silverPerc}%</div>
        <div 
          className="w-20 bg-gradient-to-t from-gray-400 to-gray-300 rounded-t-lg flex items-end justify-center pb-2 shadow-lg transition-all duration-1000 hover:shadow-xl"
          style={{ 
            height: `${120 + (silver / maxHeight) * 80}px`,
            animationDelay: '1s'
          }}
        >
          <div className="text-white font-bold text-xs">SILVER</div>
        </div>
        <div className="mt-2 text-center">
          <div className="text-gray-600 text-sm font-medium">2nd Place</div>
        </div>
      </div>
      
      {/* Gold - Center (tallest) */}
      <div className="flex flex-col items-center animate-slideUp" style={{ animationDelay: '0.2s' }}>
        <div className="text-3xl font-bold text-yellow-600 mb-2 animate-bounce" style={{ animationDelay: '2.2s' }}>
          👑
        </div>
        <div className="text-xl font-bold text-yellow-700">{gold}</div>
        <div className="text-sm font-bold text-yellow-600 mb-1">{goldPerc}%</div>
        <div 
          className="w-24 bg-gradient-to-t from-yellow-500 to-yellow-300 rounded-t-lg flex items-end justify-center pb-2 shadow-lg transition-all duration-1000 hover:shadow-xl"
          style={{ 
            height: `${150 + (gold / maxHeight) * 100}px`,
            animationDelay: '0.8s'
          }}
        >
          <div className="text-white font-bold text-sm">GOLD</div>
        </div>
        <div className="mt-2 text-center">
          <div className="text-yellow-600 text-sm font-medium">1st Place</div>
        </div>
      </div>
      
      {/* Bronze - Right */}
      <div className="flex flex-col items-center animate-slideUp" style={{ animationDelay: '0.8s' }}>
        <div className="text-2xl font-bold text-orange-600 mb-2 animate-bounce" style={{ animationDelay: '2.4s' }}>
          🥉
        </div>
        <div className="text-lg font-bold text-orange-700">{bronze}</div>
        <div className="text-xs font-bold text-orange-600 mb-1">{bronzePerc}%</div>
        <div 
          className="w-20 bg-gradient-to-t from-orange-600 to-orange-400 rounded-t-lg flex items-end justify-center pb-2 shadow-lg transition-all duration-1000 hover:shadow-xl"
          style={{ 
            height: `${100 + (bronze / maxHeight) * 60}px`,
            animationDelay: '1.2s'
          }}
        >
          <div className="text-white font-bold text-xs">BRONZE</div>
        </div>
        <div className="mt-2 text-center">
          <div className="text-orange-600 text-sm font-medium">3rd Place</div>
        </div>
      </div>
      
      {/* Additional stats */}
      <div className="ml-8 flex flex-col gap-3">
        <div className="bg-white rounded-lg p-3 shadow-md transform hover:scale-105 transition-transform duration-300">
          <div className="text-blue-600 font-bold text-lg">📜 {certificate}</div>
          <div className="text-blue-800 text-xs font-medium">Certificates</div>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-md transform hover:scale-105 transition-transform duration-300">
          <div className="text-gray-600 font-bold text-lg">⭕ {none}</div>
          <div className="text-gray-800 text-xs font-medium">No Award</div>
        </div>
      </div>
    </div>
  );
};

// Ethical Status Traffic Light
// const EthicalTrafficLight = ({ ethicalData }) => {
//   const approved = ethicalData.find(e => e.name.toLowerCase() === 'approved')?.value || 0;
//   const pending = ethicalData.find(e => e.name.toLowerCase() === 'pending')?.value || 0;
//   const rejected = ethicalData.find(e => e.name.toLowerCase() === 'rejected')?.value || 0;
//   const total = approved + pending + rejected;
  
//   return (
//     <div className="h-80 bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg p-6 flex items-center justify-center">
//       <div className="relative">
//         {/* Traffic Light Frame */}
//         <div className="w-32 h-80 bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-4 flex flex-col items-center justify-around">
//           {/* Red Light - Rejected */}
//           <div className={`relative w-20 h-20 rounded-full transition-all duration-1000 ${rejected > 0 ? 'bg-red-500 shadow-red-500/50 shadow-lg animate-pulse' : 'bg-red-200'}`}>
//             <div className="absolute inset-2 rounded-full bg-gradient-to-br from-red-300 to-red-600"></div>
//             <div className="absolute inset-4 rounded-full bg-red-400 flex items-center justify-center">
//               <span className="text-white font-bold text-sm">❌</span>
//             </div>
//           </div>
          
//           {/* Yellow Light - Pending */}
//           <div className={`relative w-20 h-20 rounded-full transition-all duration-1000 ${pending > 0 ? 'bg-yellow-500 shadow-yellow-500/50 shadow-lg animate-pulse' : 'bg-yellow-200'}`}>
//             <div className="absolute inset-2 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600"></div>
//             <div className="absolute inset-4 rounded-full bg-yellow-400 flex items-center justify-center">
//               <span className="text-white font-bold text-sm">⏳</span>
//             </div>
//           </div>
          
//           {/* Green Light - Approved */}
//           <div className={`relative w-20 h-20 rounded-full transition-all duration-1000 ${approved > 0 ? 'bg-green-500 shadow-green-500/50 shadow-lg animate-pulse' : 'bg-green-200'}`}>
//             <div className="absolute inset-2 rounded-full bg-gradient-to-br from-green-300 to-green-600"></div>
//             <div className="absolute inset-4 rounded-full bg-green-400 flex items-center justify-center">
//               <span className="text-white font-bold text-sm">✅</span>
//             </div>
//           </div>
//         </div>
        
//         {/* Stats Display */}
//         <div className="absolute -right-24 top-0 space-y-4">
//           <div className="bg-white rounded-lg p-3 shadow-md transform hover:scale-105 transition-transform duration-300">
//             <div className="text-red-600 font-bold text-lg">{rejected}</div>
//             <div className="text-red-800 text-xs font-medium">Rejected</div>
//             <div className="text-red-600 text-xs">{total > 0 ? ((rejected/total) * 100).toFixed(1) : 0}%</div>
//           </div>
//           <div className="bg-white rounded-lg p-3 shadow-md transform hover:scale-105 transition-transform duration-300">
//             <div className="text-yellow-600 font-bold text-lg">{pending}</div>
//             <div className="text-yellow-800 text-xs font-medium">Pending</div>
//             <div className="text-yellow-600 text-xs">{total > 0 ? ((pending/total) * 100).toFixed(1) : 0}%</div>
//           </div>
//           <div className="bg-white rounded-lg p-3 shadow-md transform hover:scale-105 transition-transform duration-300">
//             <div className="text-green-600 font-bold text-lg">{approved}</div>
//             <div className="text-green-800 text-xs font-medium">Approved</div>
//             <div className="text-green-600 text-xs">{total > 0 ? ((approved/total) * 100).toFixed(1) : 0}%</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// Progress Ring Component for Status
const StatusProgressRings = ({ statusData }) => {
  const completed = statusData.find(s => s.name.toLowerCase() === 'completed')?.value || 0;
  const inProgress = statusData.find(s => s.name.toLowerCase() === 'in progress')?.value || 0;
  const notJudged = statusData.find(s => s.name.toLowerCase() === 'not judged')?.value || 0;
  const total = completed + inProgress + notJudged;
  
  const completedPerc = total > 0 ? (completed / total) * 100 : 0;
  const inProgressPerc = total > 0 ? (inProgress / total) * 100 : 0;
  const notJudgedPerc = total > 0 ? (notJudged / total) * 100 : 0;
  
  const circumference = 2 * Math.PI * 45; // radius = 45
  
  return (
    <div className="h-80 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 flex items-center justify-center">
      <div className="relative">
        {/* Completed Ring */}
        <div className="relative w-40 h-40">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#E5E7EB"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#10B981"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (completedPerc / 100) * circumference}
              className="transition-all duration-2000 ease-out"
              style={{ animationDelay: '0.5s' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-2xl">✅</div>
            <div className="text-green-700 font-bold text-lg">{completed}</div>
            <div className="text-green-600 text-xs">Completed</div>
            <div className="text-green-500 text-xs">{completedPerc.toFixed(1)}%</div>
          </div>
        </div>
        
        {/* In Progress Ring */}
        <div className="absolute -right-12 -top-6 w-32 h-32">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#FEF3C7"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#F59E0B"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 40}
              strokeDashoffset={2 * Math.PI * 40 - (inProgressPerc / 100) * 2 * Math.PI * 40}
              className="transition-all duration-2000 ease-out"
              style={{ animationDelay: '1s' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-lg">⏳</div>
            <div className="text-yellow-700 font-bold">{inProgress}</div>
            <div className="text-yellow-600 text-xs text-center">In Progress</div>
          </div>
        </div>
        
        {/* Not Judged Ring */}
        <div className="absolute -right-8 top-20 w-28 h-28">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="35"
              stroke="#FEE2E2"
              strokeWidth="5"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="35"
              stroke="#EF4444"
              strokeWidth="5"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 35}
              strokeDashoffset={2 * Math.PI * 35 - (notJudgedPerc / 100) * 2 * Math.PI * 35}
              className="transition-all duration-2000 ease-out"
              style={{ animationDelay: '1.5s' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-sm">⌛</div>
            <div className="text-red-700 font-bold text-sm">{notJudged}</div>
            <div className="text-red-600 text-xs text-center">Not Judged</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EventProjectsStats = () => {
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: "all",
        status: "all",
        badge: "all",
        ethicalStatus: "all",
        event: "all",
        eventtype:"all",
        timeRange: "all"
    });

    // Enhanced color schemes
    const categoryColors = ["#3B82F6", "#6366F1", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981", "#0EA5E9", "#84CC16"];

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [projects, filters]);

    const fetchProjects = async () => {
        try {
            setLoading(true);
           
            const response = await fetch('/api/projects/');
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setProjects(data || []);
            } else {
                console.error("Failed to fetch projects");
                // Fallback with sample data 
                setSampleData();
            }
        } catch (error) {
            console.error("Error fetching projects:", error);
            setSampleData();
        } finally {
            setLoading(false);
        }
    };

    // Sample data for testing
    const setSampleData = () => {
        const sampleProjects = Array.from({ length: 150 }, (_, i) => ({
            projectid: i + 1,
            projectname: `Project ${i + 1}`,
            category: ['agricultural sciences', 'biological sciences', 'chemistry', 'computer science', 'earth sciences', 'engineering', 'mathematics', 'physics'][Math.floor(Math.random() * 8)],
            badge: ['Gold', 'Silver', 'Bronze', 'Certificate', 'None'][Math.floor(Math.random() * 5)],
            status: ['Not Judged', 'In Progress', 'Completed'][Math.floor(Math.random() * 3)],
            ethicalstatus: ['Pending', 'Approved', 'Rejected'][Math.floor(Math.random() * 3)],
            standnumber: 100 + i,
            timeregistered: `${String(Math.floor(Math.random() * 12)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
            eventid: 41,
            learnerid: 800 + i,
            schoolid: 30 + Math.floor(Math.random() * 10)
        }));
        setProjects(sampleProjects);
    };

    const applyFilters = () => {
        let filtered = [...projects];
        
        // Filter by event creation time range (event_timeregistered from events table)
        if (filters.timeRange !== "all") {
            const now = new Date();
            filtered = filtered.filter(project => {
                // event_timeregistered comes from events.timeregistered (when event was created)
                if (!project.event_timeregistered) return false;
                
                const eventCreationDate = new Date(project.event_timeregistered);
                if (isNaN(eventCreationDate.getTime())) return false; // Invalid date check
                
                // Calculate months difference based on calendar months
                const yearsDiff = now.getFullYear() - eventCreationDate.getFullYear();
                const monthsDiff = yearsDiff * 12 + (now.getMonth() - eventCreationDate.getMonth());
                
                switch(filters.timeRange) {
                    case "0-3":
                        return monthsDiff <= 3;
                    case "6":
                        return monthsDiff <= 6;
                    case "6+":
                        return monthsDiff > 6 && monthsDiff <= 12;
                    case "12+":
                        return monthsDiff > 12;
                    default:
                        return true;
                }
            });
        }

        if (filters.category !== "all") {
            filtered = filtered.filter(project => 
                project.category?.toLowerCase() === filters.category.toLowerCase()
            );
        }

        if (filters.status !== "all") {
            filtered = filtered.filter(project => 
                project.status?.toLowerCase() === filters.status.toLowerCase()
            );
        }

        if (filters.badge !== "all") {
            filtered = filtered.filter(project => 
                project.badge?.toLowerCase() === filters.badge.toLowerCase()
            );
        }

        if (filters.ethicalStatus !== "all") {
            filtered = filtered.filter(project => 
                project.ethicalstatus?.toLowerCase() === filters.ethicalStatus.toLowerCase()
            );
        }

        if (filters.event !== "all") {
            filtered = filtered.filter(project => 
                project.eventid?.toString().toLowerCase() === filters.event.toString().toLowerCase()
            );
        }
        if (filters.eventtype !== "all") {
            filtered = filtered.filter(project => 
                project.event_type?.toLowerCase() === filters.eventtype.toLowerCase()
            );
        }
        setFilteredProjects(filtered);
    };

    const getBadgeStats = () => {
        const badgeCount = filteredProjects.reduce((acc, project) => {
            const badge = project.badge?.toLowerCase() || "none";
            acc[badge] = (acc[badge] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(badgeCount).map(([badge, count]) => ({
            name: badge.charAt(0).toUpperCase() + badge.slice(1),
            value: count,
            percentage: ((count / filteredProjects.length) * 100).toFixed(1)
        }));
    };

    const getStatusStats = () => {
        const statusCount = filteredProjects.reduce((acc, project) => {
            const status = project.status?.toLowerCase() || "unknown";
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(statusCount).map(([status, count]) => ({
            name: status.charAt(0).toUpperCase() + status.slice(1),
            value: count,
            percentage: ((count / filteredProjects.length) * 100).toFixed(1)
        }));
    };

    const getCategoryStats = () => {
        const categoryCount = filteredProjects.reduce((acc, project) => {
            const category = project.category?.toLowerCase() || "unknown";
            const formattedCategory = category.split(' ').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
            acc[formattedCategory] = (acc[formattedCategory] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(categoryCount)
            .map(([category, count]) => ({
                name: category,
                value: count,
                percentage: ((count / filteredProjects.length) * 100).toFixed(1)
            }))
            .sort((a, b) => b.value - a.value);
    };

    const getEthicalStatusStats = () => {
        const ethicalCount = filteredProjects.reduce((acc, project) => {
            const status = project.ethicalstatus?.toLowerCase() || "unknown";
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(ethicalCount).map(([status, count]) => ({
            name: status.charAt(0).toUpperCase() + status.slice(1),
            value: count,
            percentage: ((count / filteredProjects.length) * 100).toFixed(1)
        }));
    };

    const getBadgesByCategory = () => {
        const badgeTypes = ['Gold', 'Silver', 'Bronze'];
        const categoryBadgeData = {};

        const categories = [...new Set(filteredProjects.map(p => {
            const category = p.category?.toLowerCase() || "unknown";
            return category.split(' ').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
        }))];

        categories.forEach(category => {
            categoryBadgeData[category] = {
                category: category,
                Gold: 0,
                Silver: 0,
                Bronze: 0,
                total: 0
            };
        });

        filteredProjects.forEach(project => {
            const category = project.category?.toLowerCase() || "unknown";
            const formattedCategory = category.split(' ').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
            
            const badge = project.badge?.toLowerCase();
            const normalizedBadge = badge?.charAt(0).toUpperCase() + badge?.slice(1);
            if (badgeTypes.includes(normalizedBadge)) {
                categoryBadgeData[formattedCategory][normalizedBadge]++;
                categoryBadgeData[formattedCategory].total++;
            }
        });

        return Object.values(categoryBadgeData)
            .filter(item => item.total > 0)
            .sort((a, b) => b.total - a.total);
    };

   const getUniqueEvents = () => {
    const eventMap = new Map();

    // Filter projects by time range first if a time range is selected
    let projectsToUse = projects;
    
    if (filters.timeRange !== "all") {
        const now = new Date();
        projectsToUse = projects.filter(project => {
            if (!project.event_timeregistered) return false;
            
            const projectDate = new Date(project.event_timeregistered);
            const monthsDiff = (now - projectDate) / (1000 * 60 * 60 * 24 * 30.44);
            
            switch(filters.timeRange) {
                case "0-3":
                    return monthsDiff <= 3;
                case "6":
                    return monthsDiff <= 6;
                case "6+":
                    return monthsDiff > 6 && monthsDiff <= 12;
                case "12+":
                    return monthsDiff > 12;
                default:
                    return true;
            }
        });
    }

    projectsToUse.forEach(project => {
        if (project.event_name) {
            eventMap.set(project.event_name, {
                id: project.eventid,
                name: project.event_name
            });
        }
    });

    return Array.from(eventMap.values())
        .sort((a, b) => a.name.localeCompare(b.name));
};

    const getUniqueEventTypes = () => {
        const uniqueEventTypes = [...new Set(projects.map(project => project.event_type)
            .filter(type => type))]
            .sort((a, b) => a.localeCompare(b));
        
        return uniqueEventTypes;
    };

    const getEventsByType = (type) => {
        const eventMap = new Map();

        projects
            .filter(project => type === "all" || project.event_type === type)
            .forEach(project => {
                if (project.event_name) {
                    eventMap.set(project.event_name, {
                        id: project.eventid,
                        name: project.event_name
                    });
                }
            });

        return Array.from(eventMap.values())
            .sort((a, b) => a.name.localeCompare(b.name));
    };

    const getAwardRate = () => {
        const awarded = filteredProjects.filter(p => 
            p.badge && p.badge !== 'None' && p.badge !== 'Certificate'
        ).length;
        const total = filteredProjects.length;
        return total > 0 ? ((awarded / total) * 100).toFixed(1) : 0;
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-3 border border-blue-200 rounded-lg shadow-lg transform scale-105 transition-transform">
                    <p className="text-blue-800 font-semibold">{`${data.name || label}: ${data.value}`}</p>
                    {data.percentage && (
                        <p className="text-blue-600">{`${data.percentage}%`}</p>
                    )}
                </div>
            );
        }
        return null;
    };

    const BadgeCategoryTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-blue-200 rounded-lg shadow-lg transform scale-105 transition-transform">
                    <p className="text-blue-800 font-semibold mb-2">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }} className="font-medium">
                            {`${entry.dataKey}: ${entry.value}`}
                        </p>
                    ))}
                    <p className="text-blue-600 font-semibold mt-1">
                        Total Badges: {payload.reduce((sum, entry) => sum + entry.value, 0)}
                    </p>
                </div>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-blue-600 mx-auto"></div>
                        <div className="animate-ping absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-600 rounded-full"></div>
                    </div>
                    <Typography className="mt-4 text-blue-600 animate-pulse">Loading project statistics...</Typography>
                </div>
            </div>
        );
    }

    const badgeData = getBadgeStats();
    const statusData = getStatusStats();
    const categoryData = getCategoryStats();
    const ethicalData = getEthicalStatusStats();
    const badgesByCategoryData = getBadgesByCategory();

    return (
        <div className="mt-12 mb-8 flex flex-col gap-6">
            <style jsx>{`
                @keyframes slideInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slideInUp { animation: slideInUp 0.8s ease-out forwards; }
                .animate-slideUp { animation: slideUp 1s ease-out forwards; }
            `}</style>

            {/* Header and Filters */}
            <Card className="bg-white border border-indigo-200 rounded-xl shadow-xl animate-slideInUp" delay={100}>
                <CardHeader className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-indigo-200 rounded-t-xl">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                        <Typography variant="h4" className="text-indigo-800 font-bold flex-grow">
                            🔬 Event Projects Statistics
                        </Typography>
                        
                        {/* Filters */}
                        <div className="flex flex-wrap gap-4">
                               <div className="w-48">
                                <Select
                                    label="Filter by Time Range"
                                    value={filters.timeRange}
                                    onChange={(value) => setFilters(prev => ({ ...prev, timeRange: value }))}
                                    className="bg-white"
                                >
                                    <Option value="all">All Time</Option>
                                    <Option value="0-3">0-3 Months</Option>
                                    <Option value="6">Up to 6 Months</Option>
                                    <Option value="6+">6-12 Months</Option>
                                    <Option value="12+">12+ Months</Option>
                                </Select>
                            </div>
                            <div className="w-48">
                                <Select
                                    label="Filter by Event"
                                    value={filters.event}
                                    onChange={(value) => setFilters(prev => ({ ...prev, event: value }))}
                                    className="bg-white"
                                >
                                    <Option value="all">All Events</Option>
                                    {getUniqueEvents().map((event) => (
                                        <Option key={event.id} value={event.id.toString()}>
                                            {event.name}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                            <div className="w-48">
                                <Select
                                    label="Filter by Event Type"
                                    value={filters.eventtype}
                                    onChange={(value) => setFilters(prev => ({ ...prev, eventtype: value }))}
                                    className="bg-white"
                                >
                                    <Option value="all">All Event Types</Option>
                                    {getUniqueEventTypes().map((eventType) => (
                                        <Option key={eventType} value={eventType}>
                                            {eventType}
                                        </Option>
                                    ))}
                                </Select>
                            </div>

                            <div className="w-48">
                                <Select
                                    label="Filter by Category"
                                    value={filters.category}
                                    onChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
                                    className="bg-white"
                                >
                                    <Option value="all">All Categories</Option>
                                    <Option value="agricultural sciences">Agricultural Sciences</Option>
                                    <Option value="biological sciences">Biological Sciences</Option>
                                    <Option value="chemistry">Chemistry</Option>
                                    <Option value="computer science">Computer Science</Option>
                                    <Option value="earth sciences">Earth Sciences</Option>
                                    <Option value="engineering">Engineering</Option>
                                    <Option value="mathematics">Mathematics</Option>
                                    <Option value="physics">Physics</Option>
                                </Select>
                            </div>
                            
                            <div className="w-48">
                                <Select
                                    label="Filter by Status"
                                    value={filters.status}
                                    onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                                    className="bg-white"
                                >
                                    <Option value="all">All Status</Option>
                                    <Option value="not judged">Not Judged</Option>
                                    <Option value="in progress">In Progress</Option>
                                    <Option value="completed">Completed</Option>
                                </Select>
                            </div>
                            
                            <div className="w-48">
                                <Select
                                    label="Filter by Badge"
                                    value={filters.badge}
                                    onChange={(value) => setFilters(prev => ({ ...prev, badge: value }))}
                                    className="bg-white"
                                >
                                    <Option value="all">All Badges</Option>
                                    <Option value="gold">Gold</Option>
                                    <Option value="silver">Silver</Option>
                                    <Option value="bronze">Bronze</Option>
                                    <Option value="certificate">Certificate</Option>
                                    <Option value="none">None</Option>
                                </Select>
                            </div>

                            <div className="w-48">
                                <Select
                                    label="Filter by Ethical Status"
                                    value={filters.ethicalStatus}
                                    onChange={(value) => setFilters(prev => ({ ...prev, ethicalStatus: value }))}
                                    className="bg-white"
                                >
                                    <Option value="all">All Ethical Status</Option>
                                    <Option value="pending">Pending</Option>
                                    <Option value="approved">Approved</Option>
                                    <Option value="rejected">Rejected</Option>
                                </Select>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-lg p-4 border border-indigo-300 transform hover:scale-105 transition-transform duration-300">
                            <Typography className="text-indigo-700 font-semibold">
                                📊 Total Projects: <span className="text-blue-600 font-bold text-lg animate-pulse">{filteredProjects.length}</span>
                            </Typography>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-yellow-300 transform hover:scale-105 transition-transform duration-300">
                            <Typography className="text-yellow-700 font-semibold">
                                🏆 Award Rate: <span className="text-yellow-600 font-bold text-lg animate-pulse">{getAwardRate()}%</span>
                            </Typography>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-purple-300 transform hover:scale-105 transition-transform duration-300">
                            <Typography className="text-purple-700 font-semibold">
                                🎯 Events: <span className="text-purple-600 font-bold text-lg animate-pulse">{getEventsByType(filters.eventtype).length}</span>
                                {filters.event !== "all" && (
                                    <>
                                        {" • Event: "}
                                        <span className="text-purple-600 font-bold text-sm">
                                            {getEventsByType(filters.eventtype).find(
                                                (e) => e.id.toString() === filters.event
                                            )?.name || "Selected Event"}
                                        </span>
                                    </>
                                )}
                                {filters.eventtype !== "all" && (
                                    <>
                                        {" • Type: "}
                                        <span className="text-purple-600 font-bold text-sm">
                                            {filters.eventtype}
                                        </span>
                                    </>
                                )}
                            </Typography>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Statistics Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Status Progress Rings */}
                <Card className="bg-white border border-blue-200 rounded-xl shadow-lg animate-slideInUp" delay={300}>
                    <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl border-b border-blue-200">
                        <Typography variant="h5" className="text-blue-800 font-bold text-center">
                            ⚡ Judging Progress
                        </Typography>
                        <Typography variant="small" className="text-blue-600 text-center mt-1">
                            Current status of project evaluations
                        </Typography>
                    </CardHeader>
                    <CardBody className="pt-4">
                        <StatusProgressRings statusData={statusData} />
                    </CardBody>
                </Card>

                {/* Category Distribution with Enhanced Animation */}
                <Card className="bg-white border border-blue-200 rounded-xl shadow-lg animate-slideInUp" delay={400}>
                    <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-xl border-b border-blue-200">
                        <Typography variant="h5" className="text-blue-800 font-bold text-center">
                            🧬 Category Distribution
                        </Typography>
                        <Typography variant="small" className="text-blue-600 text-center mt-1">
                            Number of projects by scientific category
                        </Typography>
                    </CardHeader>
                    <CardBody className="pt-4">
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E0E7FF" />
                                    <XAxis 
                                        dataKey="name" 
                                        angle={-45}
                                        textAnchor="end"
                                        height={100}
                                        tick={{ fontSize: 10, fill: '#4338CA' }}
                                        label={{ value: 'Scientific Categories', position: 'insideBottom', offset: -10, style: { textAnchor: 'middle', fill: '#4338CA', fontSize: '12px', fontWeight: 'bold' } }}
                                    />
                                    <YAxis 
                                        tick={{ fontSize: 12, fill: '#4338CA' }} 
                                        label={{ value: 'Number of Projects', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#4338CA', fontSize: '12px', fontWeight: 'bold' } }}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar 
                                        dataKey="value" 
                                        fill="#3B82F6" 
                                        radius={[4, 4, 0, 0]}
                                        animationBegin={800}
                                        animationDuration={1500}
                                        className="hover:opacity-80 transition-opacity duration-300"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardBody>
                </Card>

                {/* Ethical Traffic Light */}
                {/* <Card className="bg-white border border-gray-200 rounded-xl shadow-lg animate-slideInUp" delay={500}>
                    <CardHeader className="pb-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-t-xl border-b border-gray-200">
                        <Typography variant="h5" className="text-gray-800 font-bold text-center">
                            🚦 Ethical Review Status
                        </Typography>
                        <Typography variant="small" className="text-gray-600 text-center mt-1">
                            Status of ethical approval process
                        </Typography>
                    </CardHeader>
                    {/* <CardBody className="pt-4">
                        <EthicalTrafficLight ethicalData={ethicalData} />
                    </CardBody> 
                </Card> */}
            </div>

            {/* Badge Distribution by Category */}
            <Card className="bg-white border border-yellow-200 rounded-xl shadow-lg animate-slideInUp" delay={600}>
                <CardHeader className="pb-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-t-xl border-b border-yellow-200">
                    <Typography variant="h5" className="text-yellow-800 font-bold text-center">
                        🎖️ Badge Awards by Category
                    </Typography>
                    <Typography variant="small" className="text-yellow-600 text-center mt-1">
                        Distribution of Gold, Silver, and Bronze awards across scientific categories
                    </Typography>
                </CardHeader>
                <CardBody className="pt-4">
                    <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart 
                                data={badgesByCategoryData} 
                                margin={{ top: 40, right: 30, left: 20, bottom: 80 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#FEF3C7" />
                                <XAxis 
                                    dataKey="category" 
                                    angle={-45}
                                    textAnchor="end"
                                    height={120}
                                    tick={{ fontSize: 11, fill: '#92400E' }}
                                    label={{ 
                                        value: 'Categories', 
                                        position: 'insideBottom', 
                                        offset: -5, 
                                        style: { 
                                            textAnchor: 'middle', 
                                            fill: '#92400E', 
                                            fontSize: '12px', 
                                            fontWeight: 'bold' 
                                        } 
                                    }}
                                />
                                <YAxis 
                                    tick={{ fontSize: 12, fill: '#92400E' }} 
                                    label={{ 
                                        value: 'Number of Awards', 
                                        angle: -90, 
                                        position: 'insideLeft', 
                                        style: { 
                                            textAnchor: 'middle', 
                                            fill: '#92400E', 
                                            fontSize: '12px', 
                                            fontWeight: 'bold' 
                                        } 
                                    }}
                                />
                                <Tooltip content={<BadgeCategoryTooltip />} />
                                <Legend 
                                    verticalAlign="top" 
                                    height={36}
                                    iconType="rect"
                                    wrapperStyle={{
                                        paddingBottom: '20px'
                                    }}
                                />
                                <Bar 
                                    dataKey="Gold" 
                                    stackId="a" 
                                    fill="#FFD700" 
                                    radius={[0, 0, 0, 0]}
                                    animationBegin={1200}
                                    animationDuration={1500}
                                />
                                <Bar 
                                    dataKey="Silver" 
                                    stackId="a" 
                                    fill="#C0C0C0" 
                                    radius={[0, 0, 0, 0]}
                                    animationBegin={1300}
                                    animationDuration={1500}
                                />
                                <Bar 
                                    dataKey="Bronze" 
                                    stackId="a" 
                                    fill="#CD7F32" 
                                    radius={[4, 4, 0, 0]}
                                    animationBegin={1400}
                                    animationDuration={1500}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

export default EventProjectsStats;