import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

//  Card Components with science theme
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

// Creative Conflict Status Laboratory Beakers
const ConflictStatusLab = ({ statusData }) => {
  const pending = statusData.find(s => s.name.toLowerCase() === 'pending')?.value || 0;
  const inReview = statusData.find(s => s.name.toLowerCase() === 'in review')?.value || 0;
  const resolved = statusData.find(s => s.name.toLowerCase() === 'resolved')?.value || 0;
  //const escalated = statusData.find(s => s.name.toLowerCase() === 'escalated')?.value || 0;
  const total = pending + inReview + resolved;// + escalated;
  
  const getPercentage = (value) => total > 0 ? ((value / total) * 100).toFixed(1) : 0;
  
  return (
    <div className="h-80 bg-gradient-to-br from-red-50 to-pink-50 rounded-lg p-6 flex items-end justify-center gap-6">
      {/* Pending Beaker - Red/Orange */}
      <div className="flex flex-col items-center animate-slideUp" style={{ animationDelay: '0.2s' }}>
        <div className="text-2xl mb-2 animate-bounce" style={{ animationDelay: '2s' }}>
          ⚠️
        </div>
        <div className="text-lg font-bold text-red-700">{pending}</div>
        <div className="text-sm font-bold text-red-600 mb-2">{getPercentage(pending)}%</div>
        <div className="relative">
          {/* Beaker */}
          <div className="w-16 h-24 bg-gradient-to-t from-red-400 to-red-200 rounded-b-full border-4 border-gray-300 shadow-lg relative overflow-hidden">
            {/* Bubbling animation */}
            <div className="absolute bottom-2 left-2 w-2 h-2 bg-white rounded-full animate-ping opacity-70"></div>
            <div className="absolute bottom-3 right-2 w-1 h-1 bg-white rounded-full animate-ping opacity-50" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute bottom-4 left-1/2 w-1.5 h-1.5 bg-white rounded-full animate-ping opacity-60" style={{ animationDelay: '1s' }}></div>
          </div>
          {/* Beaker neck */}
          <div className="w-8 h-6 bg-gray-200 border-2 border-gray-300 mx-auto -mt-1 rounded-t"></div>
        </div>
        <div className="mt-2 text-center">
          <div className="text-red-600 text-xs font-medium">Pending</div>
        </div>
      </div>
      
      {/* In Review Beaker - Yellow */}
      <div className="flex flex-col items-center animate-slideUp" style={{ animationDelay: '0.4s' }}>
        <div className="text-2xl mb-2 animate-bounce" style={{ animationDelay: '2.2s' }}>
          🔬
        </div>
        <div className="text-lg font-bold text-yellow-700">{inReview}</div>
        <div className="text-sm font-bold text-yellow-600 mb-2">{getPercentage(inReview)}%</div>
        <div className="relative">
          <div className="w-16 h-24 bg-gradient-to-t from-yellow-400 to-yellow-200 rounded-b-full border-4 border-gray-300 shadow-lg relative overflow-hidden">
            <div className="absolute bottom-2 left-3 w-2 h-2 bg-white rounded-full animate-ping opacity-70"></div>
            <div className="absolute bottom-5 right-1 w-1 h-1 bg-white rounded-full animate-ping opacity-50" style={{ animationDelay: '0.3s' }}></div>
          </div>
          <div className="w-8 h-6 bg-gray-200 border-2 border-gray-300 mx-auto -mt-1 rounded-t"></div>
        </div>
        <div className="mt-2 text-center">
          <div className="text-yellow-600 text-xs font-medium">In Review</div>
        </div>
      </div>
      
      {/* Resolved Beaker - Green */}
      <div className="flex flex-col items-center animate-slideUp" style={{ animationDelay: '0.6s' }}>
        <div className="text-2xl mb-2 animate-bounce" style={{ animationDelay: '2.4s' }}>
          ✅
        </div>
        <div className="text-lg font-bold text-green-700">{resolved}</div>
        <div className="text-sm font-bold text-green-600 mb-2">{getPercentage(resolved)}%</div>
        <div className="relative">
          <div className="w-16 h-24 bg-gradient-to-t from-green-400 to-green-200 rounded-b-full border-4 border-gray-300 shadow-lg relative overflow-hidden">
            <div className="absolute bottom-3 left-2 w-1.5 h-1.5 bg-white rounded-full animate-pulse opacity-80"></div>
            <div className="absolute bottom-6 right-2 w-1 h-1 bg-white rounded-full animate-pulse opacity-60" style={{ animationDelay: '0.7s' }}></div>
          </div>
          <div className="w-8 h-6 bg-gray-200 border-2 border-gray-300 mx-auto -mt-1 rounded-t"></div>
        </div>
        <div className="mt-2 text-center">
          <div className="text-green-600 text-xs font-medium">Resolved</div>
        </div>
      </div>
      
      {/* Escalated Beaker - Purple 
      <div className="flex flex-col items-center animate-slideUp" style={{ animationDelay: '0.8s' }}>
        <div className="text-2xl mb-2 animate-bounce" style={{ animationDelay: '2.6s' }}>
          🚨
        </div>
        <div className="text-lg font-bold text-purple-700">{escalated}</div>
        <div className="text-sm font-bold text-purple-600 mb-2">{getPercentage(escalated)}%</div>
        <div className="relative">
          <div className="w-16 h-24 bg-gradient-to-t from-purple-500 to-purple-300 rounded-b-full border-4 border-gray-300 shadow-lg relative overflow-hidden">
            <div className="absolute bottom-1 left-1 w-2 h-2 bg-white rounded-full animate-ping opacity-90"></div>
            <div className="absolute bottom-3 right-1 w-1.5 h-1.5 bg-white rounded-full animate-ping opacity-70" style={{ animationDelay: '0.2s' }}></div>
            <div className="absolute bottom-5 left-1/2 w-1 h-1 bg-white rounded-full animate-ping opacity-50" style={{ animationDelay: '0.8s' }}></div>
          </div>
          <div className="w-8 h-6 bg-gray-200 border-2 border-gray-300 mx-auto -mt-1 rounded-t"></div>
        </div>
        <div className="mt-2 text-center">
          <div className="text-purple-600 text-xs font-medium">Escalated</div>
        </div>
      </div>*/}
    </div>
  );
};

// Creative Severity Meter like a thermometer
const SeverityThermometer = ({ markDifferenceData }) => {
  const low = markDifferenceData.find(d => d.name.includes('Low'))?.value || 0;
  const medium = markDifferenceData.find(d => d.name.includes('Medium'))?.value || 0;
  const high = markDifferenceData.find(d => d.name.includes('High'))?.value || 0;
  const total = low + medium + high;
  
  const lowPerc = total > 0 ? (low / total) * 100 : 0;
  const medPerc = total > 0 ? (medium / total) * 100 : 0;
  const highPerc = total > 0 ? (high / total) * 100 : 0;
  
  return (
    <div className="h-80 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-6 flex items-center justify-center">
      <div className="relative flex items-center gap-12">
        
        {/* Large Thermometer */}
        <div className="relative">
          <div className="w-12 h-64 bg-gray-200 rounded-full shadow-inner border-4 border-gray-300 relative overflow-hidden">
            {/* Mercury sections */}
            <div 
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-500 to-green-400 transition-all duration-2000"
              style={{ height: `${lowPerc}%` }} 
            ></div>
            <div 
              className="absolute left-0 right-0 bg-gradient-to-t from-yellow-500 to-yellow-400 transition-all duration-2000"
              style={{ 
                bottom: `${lowPerc}%`,
                height: `${medPerc}%` 
              }}
            ></div>
            <div 
              className="absolute left-0 right-0 bg-gradient-to-t from-red-600 to-red-500 transition-all duration-2000"
              style={{ 
                bottom: `${lowPerc + medPerc}%`,
                height: `${highPerc}%`
              }}
            ></div>
          </div>
          
          {/* Thermometer bulb */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-red-500 rounded-full border-4 border-gray-300 animate-pulse"></div>
          
          {/* Scale markings */}
          <div className="absolute -right-12 top-0 h-full flex flex-col justify-between text-xs text-gray-600">
            <div>High (21+)</div>
            <div>Medium (10-20)</div>
            <div>Low (0-9)</div>
          </div>
        </div>
        
        {/* Stats Display */}
        <div className="space-y-4 ml-6">
          <div className="bg-white rounded-lg p-4 shadow-md transform hover:scale-105 transition-transform duration-300 text-green-600">
            <div className="font-bold text-2xl">{low}</div>
            <div className="text-sm font-medium">Low Severity</div>
            <div className="text-xs">{lowPerc.toFixed(1)}%</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md transform hover:scale-105 transition-transform duration-300 text-yellow-500">
            <div className="font-bold text-2xl">{medium}</div>
            <div className="text-sm font-medium">Medium Severity</div>
            <div className="text-xs">{medPerc.toFixed(1)}%</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md transform hover:scale-105 transition-transform duration-300 text-red-600">
            <div className="font-bold text-2xl">{high}</div>
            <div className="text-sm font-medium">High Severity</div>
            <div className="text-xs">{highPerc.toFixed(1)}%</div>
          </div>
        </div>
      </div>
    </div>
  );
};




const ConflictMarksReport = () => {
    const [conflicts, setConflicts] = useState([]);
    const [filteredConflicts, setFilteredConflicts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: "all",
        category: "all",
        judge: "all",
        markDifference: "all",
        meetRequested: "all",
        event:"all",
        eventtype:"all",
        timeRange: "all"
    });

    // Color schemes for charts
    const statusColors = ["#EF4444", "#F59E0B", "#10B981", "#8B5CF6"]; 
    const categoryColors = ["#3B82F6", "#6366F1", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981", "#0EA5E9", "#84CC16"];

    useEffect(() => {
        fetchConflicts();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [conflicts, filters]);

    const fetchConflicts = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/conflicts/getAll');
            if (response.ok) {
                const data = await response.json();
                setConflicts(data.conflicts || []);
            } else {
                setSampleData();
            }
        } catch (error) {
            setSampleData();
        } finally {
            setLoading(false);
        }
    };

    const setSampleData = () => {
        const sampleConflicts = Array.from({ length: 85 }, (_, i) => ({
            conflictid: i + 1,
            projectid: 100 + i,
            projectname: `Project ${String.fromCharCode(65 + (i % 26))}${Math.floor(i/26) + 1}`,
            project_category: ['Agricultural Sciences', 'Biological Sciences', 'Chemistry', 'Computer Science', 'Earth Sciences', 'Engineering', 'Mathematics', 'Physics'][Math.floor(Math.random() * 8)],
            status: ['Pending', 'In Review', 'Resolved'][Math.floor(Math.random() * 4)],//, 'Escalated'][Math.floor(Math.random() * 4)],
            judge1mark: Math.floor(Math.random() * 100) + 1,
            judge2mark: Math.floor(Math.random() * 100) + 1,
            agreedmark: Math.floor(Math.random() * 100) + 1,
            meetrequested: Math.random() > 0.7,
            judge1_firstname: ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma', 'Robert', 'Lisa'][Math.floor(Math.random() * 8)],
            judge1_lastname: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'][Math.floor(Math.random() * 8)],
            judge2_firstname: ['Alice', 'Bob', 'Carol', 'Daniel', 'Eve', 'Frank', 'Grace', 'Henry'][Math.floor(Math.random() * 8)],
            judge2_lastname: ['Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris'][Math.floor(Math.random() * 8)],
            judge1_email: `judge${i * 2}@example.com`,
            judge2_email: `judge${i * 2 + 1}@example.com`,
            updatedat: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
        }));
        
        sampleConflicts.forEach(conflict => {
            conflict.markDifference = Math.abs(conflict.judge1mark - conflict.judge2mark);
            conflict.judge1_name = `${conflict.judge1_firstname} ${conflict.judge1_lastname}`;
            conflict.judge2_name = `${conflict.judge2_firstname} ${conflict.judge2_lastname}`;
        });
        
        setConflicts(sampleConflicts);
    };

    const applyFilters = () => {
        let filtered = [...conflicts];

         // Filter by event creation time range (event was created)
    if (filters.timeRange !== "all") {
        const now = new Date();
        filtered = filtered.filter(conflict => {
            //  backend provinding event_timeregistered ld
            const eventCreationDate = conflict.event_timeregistered || conflict.event_created_at;
            if (!eventCreationDate) return false;
            
            const eventDate = new Date(eventCreationDate);
            if (isNaN(eventDate.getTime())) return false; // Invalid date check
            
            // Calculate months difference based on calendar months
            const yearsDiff = now.getFullYear() - eventDate.getFullYear();
            const monthsDiff = yearsDiff * 12 + (now.getMonth() - eventDate.getMonth());
            
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

        if (filters.status !== "all") {
            filtered = filtered.filter(conflict => 
                conflict.status?.toLowerCase() === filters.status.toLowerCase()
            );
        }

        if (filters.category !== "all") {
            filtered = filtered.filter(conflict => 
                conflict.project_category?.toLowerCase() === filters.category.toLowerCase()
            );
        }

        if (filters.judge !== "all") {
            filtered = filtered.filter(conflict => 
                conflict.judge1_name?.toLowerCase().includes(filters.judge.toLowerCase()) ||
                conflict.judge2_name?.toLowerCase().includes(filters.judge.toLowerCase())
            );
        }

        if (filters.markDifference !== "all") {
            filtered = filtered.filter(conflict => {
                const diff = Math.abs(conflict.judge1mark - conflict.judge2mark);
                switch(filters.markDifference) {
                    case "low": return diff < 10;
                    case "medium": return diff >= 10 && diff <= 20;
                    case "high": return diff > 20;
                    default: return true;
                }
            });
        }

        if (filters.meetRequested !== "all") {
            const meetRequested = filters.meetRequested === "true";
            filtered = filtered.filter(conflict => 
                Boolean(conflict.meetrequested) === meetRequested
            );
        }

        if (filters.event !== "all") {
            filtered = filtered.filter(conflict => 
                conflict.eventid?.toString() === filters.event.toString()
            );
        }

        if (filters.eventtype !== "all") {
            filtered = filtered.filter(conflict => 
                conflict.event_type?.toLowerCase() === filters.eventtype.toLowerCase()
            );
        }

        setFilteredConflicts(filtered);
    };

    const getStatusStats = () => {
        const statusCount = filteredConflicts.reduce((acc, conflict) => {
            const status = conflict.status || "Unknown";
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(statusCount).map(([status, count]) => ({
            name: status,
            value: count,
            percentage: ((count / filteredConflicts.length) * 100).toFixed(1)
        }));
    };

    const getMarkDifferenceStats = () => {
        const categories = { "Low (0-9)": 0, "Medium (10-20)": 0, "High (21+)": 0 };
        
        filteredConflicts.forEach(conflict => {
            const diff = Math.abs(conflict.judge1mark - conflict.judge2mark);
            if (diff < 10) categories["Low (0-9)"]++;
            else if (diff <= 20) categories["Medium (10-20)"]++;
            else categories["High (21+)"]++;
        });

        return Object.entries(categories).map(([range, count]) => ({
            name: range,
            value: count,
            percentage: ((count / filteredConflicts.length) * 100).toFixed(1)
        }));
    };

    const getCategoryStats = () => {
        const categoryCount = filteredConflicts.reduce((acc, conflict) => {
            const category = conflict.project_category || "Unknown";
            acc[category] = (acc[category] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(categoryCount)
            .map(([category, count]) => ({
                name: category,
                value: count
            }))
            .sort((a, b) => b.value - a.value);
    };

   const getUniqueEvents = () => {
    const eventMap = new Map();
    
    // Filter conflicts by time range first if selected
    let conflictsToUse = conflicts;
    
    if (filters.timeRange !== "all") {
        const now = new Date();
        conflictsToUse = conflicts.filter(conflict => {
            const eventCreationDate = conflict.event_timeregistered || conflict.event_created_at;
            if (!eventCreationDate) return false;
            
            const eventDate = new Date(eventCreationDate);
            if (isNaN(eventDate.getTime())) return false;
            
            const yearsDiff = now.getFullYear() - eventDate.getFullYear();
            const monthsDiff = yearsDiff * 12 + (now.getMonth() - eventDate.getMonth());
            
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
    
    conflictsToUse.forEach(conflict => {
        if (conflict.event_name) {
            eventMap.set(conflict.event_name, {
                id: conflict.eventid,
                name: conflict.event_name
            });
        }
    });
    
    return Array.from(eventMap.values()).sort((a, b) => a.name.localeCompare(b.name));
};

    const getUniqueEventTypes = () => {
        const uniqueEventTypes = [...new Set(conflicts.map(conflict => conflict.event_type)
            .filter(type => type))]
            .sort((a, b) => a.localeCompare(b));
        return uniqueEventTypes;
    };

    const getJudgeConflictStats = () => {
        const judgeCount = {};
        
        filteredConflicts.forEach(conflict => {
            const judge1 = conflict.judge1_name || "Unknown Judge";
            const judge2 = conflict.judge2_name || "Unknown Judge";
            
            judgeCount[judge1] = (judgeCount[judge1] || 0) + 1;
            judgeCount[judge2] = (judgeCount[judge2] || 0) + 1;
        });

        return Object.entries(judgeCount)
            .map(([judge, count]) => ({
                name: judge,
                value: count
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 8); // Top 8 judges for DNA visualization
    };

    const getResolutionRate = () => {
        const resolved = filteredConflicts.filter(c => c.status === 'Resolved').length;
        const total = filteredConflicts.length;
        return total > 0 ? ((resolved / total) * 100).toFixed(1) : 0;
    };

    const getMeetingRequestRate = () => {
        const meetingsRequested = filteredConflicts.filter(c => c.meetrequested).length;
        const total = filteredConflicts.length;
        return total > 0 ? ((meetingsRequested / total) * 100).toFixed(1) : 0;
    };

    const getAllJudges = () => {
        const judges = new Set();
        conflicts.forEach(conflict => {
            if (conflict.judge1_name) judges.add(conflict.judge1_name);
            if (conflict.judge2_name) judges.add(conflict.judge2_name);
        });
        return Array.from(judges).sort();
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-3 border border-red-200 rounded-lg shadow-lg transform scale-105 transition-transform">
                    <p className="text-red-800 font-semibold">{`${data.name}: ${data.value}`}</p>
                    {data.percentage && (
                        <p className="text-red-600">{`${data.percentage}%`}</p>
                    )}
                </div>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blur-50 to-white p-4 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-blue-600 mx-auto"></div>
                        <div className="animate-ping absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-600 rounded-full"></div>
                    </div>
                    <Typography className="mt-4 text-blue-600 animate-pulse">Analyzing conflict data...</Typography>
                </div>
            </div>
        );
    }

    const statusData = getStatusStats();
    const markDifferenceData = getMarkDifferenceStats();
    const categoryData = getCategoryStats();
    const judgeData = getJudgeConflictStats();

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
            <Card className="bg-white border border-blue-200 rounded-xl shadow-xl animate-slideInUp" delay={100}>
                <CardHeader className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-red-200 rounded-t-xl">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                        <Typography variant="h4" className="text-indigo-800 font-bold flex-grow">
                            🧪 Science Fair Conflict Analysis 
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
                                    label="Filter by Status"
                                    value={filters.status}
                                    onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                                    className="bg-white"
                                >
                                    <Option value="all">All Status</Option>
                                    <Option value="pending">Pending</Option>
                                    <Option value="in review">In Review</Option>
                                    <Option value="resolved">Resolved</Option>
                                   {/*<Option value="escalated">Escalated</Option>*/}
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
                                    label="Mark Difference"
                                    value={filters.markDifference}
                                    onChange={(value) => setFilters(prev => ({ ...prev, markDifference: value }))}
                                    className="bg-white"
                                >
                                    <Option value="all">All Differences</Option>
                                    <Option value="low">Low (0-9)</Option>
                                    <Option value="medium">Medium (10-20)</Option>
                                    <Option value="high">High (21+)</Option>
                                </Select>
                            </div>

                            <div className="w-48">
                                <Select
                                    label="Meeting Requested"
                                    value={filters.meetRequested}
                                    onChange={(value) => setFilters(prev => ({ ...prev, meetRequested: value }))}
                                    className="bg-white"
                                >
                                    <Option value="all">All</Option>
                                    <Option value="true">Yes</Option>
                                    <Option value="false">No</Option>
                                </Select>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-lg p-4 border border-red-300 transform hover:scale-105 transition-transform duration-300">
                            <Typography className="text-red-700 font-semibold">
                                🔬 Total Conflicts: <span className="text-red-600 font-bold text-lg animate-pulse">{filteredConflicts.length}</span>
                            </Typography>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-green-300 transform hover:scale-105 transition-transform duration-300">
                            <Typography className="text-green-700 font-semibold">
                                ✅ Resolution Rate: <span className="text-green-600 font-bold text-lg animate-pulse">{getResolutionRate()}%</span>
                            </Typography>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-yellow-300 transform hover:scale-105 transition-transform duration-300">
                            <Typography className="text-yellow-700 font-semibold">
                                🤝 Meeting Requests: <span className="text-yellow-600 font-bold text-lg animate-pulse">{getMeetingRequestRate()}%</span>
                            </Typography>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Statistics Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Conflict Status Laboratory */}
                <Card className="bg-white border border-red-200 rounded-xl shadow-lg animate-slideInUp" delay={200}>
                    <CardHeader className="pb-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-t-xl border-b border-red-200">
                        <Typography variant="h5" className="text-red-800 font-bold text-center">
                            🧪 Conflict Status 
                        </Typography>
                        <Typography variant="small" className="text-red-600 text-center mt-1">
                            Chemical reactions of conflict resolution
                        </Typography>
                    </CardHeader>
                    <CardBody className="pt-4">
                        <ConflictStatusLab statusData={statusData} />
                    </CardBody>
                </Card>

                {/* Severity Thermometer */}
                <Card className="bg-white border border-orange-200 rounded-xl shadow-lg animate-slideInUp" delay={300}>
                    <CardHeader className="pb-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-t-xl border-b border-orange-200">
                        <Typography variant="h5" className="text-orange-800 font-bold text-center">
                            🌡️ Severity Thermometer
                        </Typography>
                        <Typography variant="small" className="text-orange-600 text-center mt-1">
                            Temperature of mark difference distribution
                        </Typography>
                    </CardHeader>
                    <CardBody className="pt-4">
                        <SeverityThermometer markDifferenceData={markDifferenceData} />
                    </CardBody>
                </Card>

                {/* Category Bar Chart */}
                <Card className="bg-white border border-blue-200 rounded-xl shadow-lg animate-slideInUp" delay={400}>
                    <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-xl border-b border-blue-200">
                        <Typography variant="h5" className="text-blue-800 font-bold text-center">
                            📊 Conflicts by Scientific Category
                        </Typography>
                        <Typography variant="small" className="text-blue-600 text-center mt-1">
                            Distribution across research domains
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
                                        tick={{ fontSize: 10, fill: '#1E40AF' }}
                                        label={{ value: 'Scientific Categories', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle', fill: '#1E40AF', fontSize: '12px', fontWeight: 'bold' } }}
                                    />
                                    <YAxis 
                                        tick={{ fontSize: 12, fill: '#1E40AF' }}
                                        label={{ value: 'Number of Conflicts', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#1E40AF', fontSize: '12px', fontWeight: 'bold' } }}
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

               
            </div>
        </div>
    );
};

export default ConflictMarksReport;