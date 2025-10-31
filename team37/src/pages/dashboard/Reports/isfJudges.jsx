import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ScatterChart, Scatter, ZAxis } from "recharts";

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

const Select = ({ label, value, onChange, className, children }) => (
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

const Spinner = () => (
  <div className="relative">
    <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-blue-600 mx-auto"></div>
    <div className="animate-ping absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-600 rounded-full"></div>
  </div>
);

const ISFPodium = ({ topJudges }) => {
  if (!topJudges || topJudges.length === 0) {
    return (
      <div className="h-96 bg-gradient-to-br from-indigo-50 to-purple-100 rounded-lg p-6 flex items-center justify-center">
        <p className="text-gray-600 text-center font-semibold">No judges data available for podium display</p>
      </div>
    );
  }

  const positions = [
    { rank: 2, height: 120, color: 'from-gray-300 to-gray-400', medal: '🥈', top: 30, width: 'w-40' },
    { rank: 1, height: 150, color: 'from-yellow-400 to-yellow-500', medal: '🥇', top: 0, width: 'w-44' },
    { rank: 3, height: 100, color: 'from-orange-400 to-orange-500', medal: '🥉', top: 50, width: 'w-36' }
  ];

  const orderedJudges = [topJudges[1], topJudges[0], topJudges[2]].filter(Boolean);

  return (
    <div className="h-[380px] bg-gradient-to-br from-indigo-50 to-purple-100 rounded-lg p-4 flex items-end justify-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-yellow-400 rounded-full animate-twinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="flex items-end gap-6 relative z-10">
        {positions.map((pos, index) => {
          const judge = orderedJudges[index];
          if (!judge) return null;

          return (
            <div key={pos.rank} className="flex flex-col items-center group" style={{ marginTop: `${pos.top}px` }}>
              <div className="mb-3 text-center bg-white rounded-xl p-4 shadow-lg animate-fadeIn border-2 border-indigo-200 hover:scale-105 transition-transform duration-300" style={{animationDelay: `${index * 300}ms`}}>
                <div className="text-4xl mb-2 animate-bounce" style={{animationDelay: `${index * 300 + 500}ms`}}>{pos.medal}</div>
                <div className="text-sm font-bold text-indigo-800">{judge.firstname} {judge.lastname}</div>
                <div className="text-xs text-indigo-500 mt-1">ID: {judge.userid}</div>
                <div className="text-sm text-indigo-600 mt-2 font-semibold">Score: {judge.isf_score.toFixed(1)}</div>
                <div className="text-sm text-gray-600 mt-1">⭐ {judge.rating.toFixed(1)}</div>
                <div className="text-sm text-gray-600">📅 {judge.timesjudged} events</div>
                <div className="text-sm text-gray-600">🎓 {judge.yearsjudged}y exp</div>
              </div>

              <div 
                className={`${pos.width} bg-gradient-to-t ${pos.color} rounded-t-lg shadow-xl transition-all duration-1000 ease-out transform hover:scale-105 animate-growUp relative`}
                style={{ 
                  height: `${pos.height}px`,
                  animationDelay: `${index * 200}ms`
                }}
              >
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white font-bold text-4xl opacity-30">
                  {pos.rank}
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-20 rounded-t-lg"></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg animate-pulse">
        <div className="text-xl">🌍</div>
      </div>
    </div>
  );
};

const QualificationRadar = ({ judge }) => {
  if (!judge) return (
    <div className="h-64 flex items-center justify-center">
      <p className="text-gray-500">Select a judge to view their profile</p>
    </div>
  );

  const maxRating = 5;
  const maxEvents = 50;
  const maxExperience = 20;

  const data = [
    {
      criteria: 'Rating',
      value: (judge.rating / maxRating) * 100,
      fullMark: 100
    },
    {
      criteria: 'Events',
      value: (judge.timesjudged / maxEvents) * 100,
      fullMark: 100
    },
    {
      criteria: 'Experience',
      value: (judge.yearsjudged / maxExperience) * 100,
      fullMark: 100
    }
  ];

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid stroke="#C7D2FE" />
          <PolarAngleAxis dataKey="criteria" tick={{ fill: '#3730A3', fontSize: 12, fontWeight: 'bold' }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#6366F1' }} />
          <Radar name={`${judge.firstname} ${judge.lastname}`} dataKey="value" stroke="#6366F1" fill="#6366F1" fillOpacity={0.6} animationBegin={400} animationDuration={1500} animationEasing="ease-out" />
          <Legend />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #A5B4FC',
              borderRadius: '8px'
            }}
            formatter={(value) => `${value.toFixed(1)}%`}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

const ISFScoreScatter = ({ judges }) => {
  if (!judges || judges.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center">
        <p className="text-gray-500">No data available for scatter plot</p>
      </div>
    );
  }

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 30, bottom: 60, left: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#DDD6FE" />
          <XAxis 
            type="number" 
            dataKey="timesjudged" 
            name="Events Attended"
            tick={{ fontSize: 12, fill: '#5B21B6' }}
            label={{ 
              value: 'Number of Events Attended', 
              position: 'insideBottom', 
              offset: -10, 
              style: { textAnchor: 'middle', fill: '#5B21B6', fontWeight: 'bold' } 
            }}
          />
          <YAxis 
            type="number" 
            dataKey="rating" 
            name="Average Rating"
            domain={[0, 5]}
            tick={{ fontSize: 12, fill: '#5B21B6' }}
            label={{ 
              value: 'Average Rating (★)', 
              angle: -90, 
              position: 'insideLeft', 
              style: { textAnchor: 'middle', fill: '#5B21B6', fontWeight: 'bold' } 
            }}
          />
          <ZAxis type="number" dataKey="yearsjudged" range={[50, 400]} name="Years Experience" />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-4 border-2 border-indigo-300 rounded-lg shadow-xl">
                    <p className="text-indigo-800 font-bold text-lg">{data.firstname} {data.lastname}</p>
                    <p className="text-indigo-500 text-sm">ID: {data.userid}</p>
                    <p className="text-indigo-600 font-semibold">⭐ Rating: {data.rating.toFixed(2)}</p>
                    <p className="text-indigo-600 font-semibold">📅 Events: {data.timesjudged}</p>
                    <p className="text-indigo-600 font-semibold">🎓 Experience: {data.yearsjudged} years</p>
                    <p className="text-purple-700 font-bold mt-2">ISF Score: {data.isf_score.toFixed(2)}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Scatter 
            data={judges} 
            fill="#8B5CF6"
            animationBegin={600}
            animationDuration={2000}
            animationEasing="ease-out"
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

const ISFJudgesStats = () => {
  const [judges, setJudges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState("all");
  const [topJudges, setTopJudges] = useState([]);
  const [selectedJudge, setSelectedJudge] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    fetchJudges();
  }, []);

  useEffect(() => {
    calculateTopJudges();
  }, [judges, selectedEvent]);

  const fetchJudges = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/getAllJudges');
      if (!response.ok) {
        throw new Error(`Failed to fetch judges: ${response.status}`);
      }
      
      const data = await response.json();
      if (!data.judges || !Array.isArray(data.judges)) {
        throw new Error("Invalid data format received");
      }
      
      const judgesWithScores = await Promise.all(
        data.judges.map(async (judge) => {
          try {
            const ratingsResponse = await fetch(`/api/ratings/${judge.userid}`);
            let avgRating = 0;
            
            if (ratingsResponse.ok) {
              const ratingsData = await ratingsResponse.json();
              if (ratingsData.length > 0) {
                const totalRating = ratingsData.reduce((sum, r) => sum + r.rating, 0);
                avgRating = totalRating / ratingsData.length;
              }
            }
            
            const ratingScore = (avgRating / 5) * 50;
            const eventsScore = Math.min((judge.timesjudged / 50) * 25, 25);
            const experienceScore = Math.min((judge.yearsjudged / 20) * 25, 25);
            const isf_score = ratingScore + eventsScore + experienceScore;
            
            return {
              ...judge,
              rating: avgRating,
              isf_score: isf_score
            };
          } catch (error) {
            console.error(`Error fetching ratings for judge ${judge.userid}:`, error);
            return {
              ...judge,
              rating: 0,
              isf_score: 0
            };
          }
        })
      );
      
      setJudges(judgesWithScores);
    } catch (error) {
      console.error("Error fetching judges:", error);
      setError(error.message);
      setJudges([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateTopJudges = () => {
    let filteredJudges = [...judges];

    if (selectedEvent !== "all") {
      const uniqueJudgeIds = new Set();
      filteredJudges = judges.filter(judge => {
        if (judge.eventid?.toString() === selectedEvent.toString()) {
          if (!uniqueJudgeIds.has(judge.userid)) {
            uniqueJudgeIds.add(judge.userid);
            return true;
          }
        }
        return false;
      });
    } else {
      const uniqueJudgeIds = new Set();
      filteredJudges = judges.filter(judge => {
        if (!uniqueJudgeIds.has(judge.userid)) {
          uniqueJudgeIds.add(judge.userid);
          return true;
        }
        return false;
      });
    }

    const sorted = filteredJudges
      .filter(judge => judge.isf_score !== undefined && judge.isf_score !== null)
      .sort((a, b) => b.isf_score - a.isf_score)
      .slice(0, 10);

    setTopJudges(sorted);
    if (sorted.length > 0) {
      setSelectedJudge(sorted[0]);
    }
  };

  const getUniqueEvents = () => {
    const eventMap = new Map();
    judges.forEach(judge => {
      if (judge.event_name && judge.eventid) {
        eventMap.set(judge.event_name, {
          id: judge.eventid,
          name: judge.event_name
        });
      }
    });
    return Array.from(eventMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  };

  const getUniqueCategories = () => {
    const categories = new Set();
    judges.forEach(judge => {
      if (judge.firstcategory) categories.add(judge.firstcategory);
      if (judge.secondcategory) categories.add(judge.secondcategory);
    });
    return Array.from(categories).sort();
  };

  const getFilteredTopJudges = () => {
    if (categoryFilter === "all") {
      return topJudges;
    }
    return topJudges.filter(judge => 
      judge.firstcategory === categoryFilter || judge.secondcategory === categoryFilter
    );
  };

  const getQualificationThresholds = () => {
    let uniqueJudges = judges;
    
    if (selectedEvent !== "all") {
      const uniqueJudgeIds = new Set();
      uniqueJudges = judges.filter(judge => {
        if (judge.eventid?.toString() === selectedEvent.toString()) {
          if (!uniqueJudgeIds.has(judge.userid)) {
            uniqueJudgeIds.add(judge.userid);
            return true;
          }
        }
        return false;
      });
    } else {
      const uniqueJudgeIds = new Set();
      uniqueJudges = judges.filter(judge => {
        if (!uniqueJudgeIds.has(judge.userid)) {
          uniqueJudgeIds.add(judge.userid);
          return true;
        }
        return false;
      });
    }
    
    const qualified = uniqueJudges.filter(j => j.rating >= 4.5 && j.timesjudged >= 25 && j.yearsjudged >= 5).length;
    const nearQualified = uniqueJudges.filter(j => j.rating >= 4.0 && j.timesjudged >= 15 && j.yearsjudged >= 3 && !(j.rating >= 4.5 && j.timesjudged >= 25 && j.yearsjudged >= 5)).length;
    const developing = uniqueJudges.length - qualified - nearQualified;

    return [
      { name: 'ISF Qualified', value: qualified, color: '#10B981' },
      { name: 'Near Qualified', value: nearQualified, color: '#F59E0B' },
      { name: 'Developing', value: developing, color: '#6B7280' }
    ];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 flex items-center justify-center">
        <div className="text-center">
          <Spinner />
          <Typography className="mt-4 text-blue-600 animate-pulse">Loading ISF qualification data...</Typography>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white p-4 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg border-2 border-red-200">
          <div className="text-6xl mb-4">⚠️</div>
          <Typography className="text-red-600 mb-2">Error Loading Data</Typography>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchJudges}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (judges.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <div className="text-6xl mb-4">📊</div>
          <Typography className="text-gray-600">No judges data available</Typography>
        </div>
      </div>
    );
  }

  const qualificationData = getQualificationThresholds();

  return (
    <div className="mt-12 mb-8 flex flex-col gap-6">
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes growUp {
          from { height: 0; }
          to { height: var(--target-height); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 1s ease-out forwards; }
        .animate-growUp { animation: growUp 1s ease-out forwards; }
        .animate-twinkle { animation: twinkle 2s infinite; }
        .animate-slideInUp { animation: slideInUp 0.8s ease-out forwards; }
      `}</style>

      <Card className="bg-white border border-indigo-200 rounded-xl shadow-xl animate-slideInUp" delay={100}>
        <CardHeader className="mb-6 p-6 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-indigo-200 rounded-t-xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex-grow">
              <Typography variant="h4" className="text-indigo-800 font-bold flex items-center gap-2">
                <span className="text-3xl">🌍</span>
                International Science Fair (ISF) Qualification Dashboard
              </Typography>
              <Typography className="text-indigo-600 mt-2">
                Top judges qualified for international judging based on rating (50%), events attended (25%), and experience (25%)
              </Typography>
            </div>
            
            <div className="w-full lg:w-64">
              <Select
                label="Filter by Event"
                value={selectedEvent}
                onChange={(value) => setSelectedEvent(value)}
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
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-2 border-green-300">
              <Typography className="text-green-700 font-semibold text-sm">
                ISF Qualified
              </Typography>
              <Typography className="text-green-600 font-bold text-2xl mt-1">
                {qualificationData[0].value}
              </Typography>
              <p className="text-xs text-green-600 mt-1">★ ≥4.5 | Events ≥25 | Exp ≥5y</p>
            </div>
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border-2 border-yellow-300">
              <Typography className="text-yellow-700 font-semibold text-sm">
                Near Qualified
              </Typography>
              <Typography className="text-yellow-600 font-bold text-2xl mt-1">
                {qualificationData[1].value}
              </Typography>
              <p className="text-xs text-yellow-600 mt-1">★ ≥4.0 | Events ≥15 | Exp ≥3y</p>
            </div>
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-4 border-2 border-gray-300">
              <Typography className="text-gray-700 font-semibold text-sm">
                Developing
              </Typography>
              <Typography className="text-gray-600 font-bold text-2xl mt-1">
                {qualificationData[2].value}
              </Typography>
              <p className="text-xs text-gray-600 mt-1">Building experience</p>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border-2 border-purple-300">
              <Typography className="text-purple-700 font-semibold text-sm">
                Top 10 Avg Score
              </Typography>
              <Typography className="text-purple-600 font-bold text-2xl mt-1">
                {topJudges.length > 0 ? (topJudges.reduce((sum, j) => sum + j.isf_score, 0) / topJudges.length).toFixed(1) : '0'}
              </Typography>
              <p className="text-xs text-purple-600 mt-1">Out of 100 points</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card className="bg-white border border-indigo-200 rounded-xl shadow-lg">
        <CardHeader className="pb-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-xl border-b border-indigo-200">
          <Typography variant="h5" className="text-indigo-800 font-bold text-center">
            🏆 Top 3 ISF-Qualified Judges
          </Typography>
          <Typography className="text-indigo-600 text-sm text-center mt-2">
            Elite judges ranked by comprehensive ISF qualification score
          </Typography>
        </CardHeader>
        <CardBody className="pt-4">
          <ISFPodium topJudges={topJudges.slice(0, 3)} />
        </CardBody>
      </Card>

      {topJudges.length > 0 && (
        <Card className="bg-white border border-blue-200 rounded-xl shadow-lg">
          <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-xl border-b border-blue-200">
            <Typography variant="h5" className="text-blue-800 font-bold text-center">
              📊 Top 10 ISF-Qualified Judges Ranking
            </Typography>
          </CardHeader>
          <CardBody className="pt-4">
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topJudges} layout="vertical" margin={{ top: 5, right: 30, left: 120, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#BFDBFE" />
                  <XAxis 
                    type="number" 
                    domain={[0, 100]}
                    tick={{ fontSize: 12, fill: '#1E3A8A' }}
                    label={{ 
                      value: 'ISF Qualification Score', 
                      position: 'insideBottom', 
                      style: { textAnchor: 'middle', fill: '#1E3A8A', fontWeight: 'bold' } 
                    }}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="lastname"
                    tick={{ fontSize: 11, fill: '#1E3A8A' }}
                    width={110}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '2px solid #93C5FD',
                      borderRadius: '8px'
                    }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-4 border-2 border-blue-300 rounded-lg shadow-xl">
                            <p className="text-blue-800 font-bold text-lg">{data.firstname} {data.lastname}</p>
                            <p className="text-blue-500 text-sm">Judge ID: {data.userid}</p>
                            <p className="text-blue-600 font-semibold mt-2">ISF Score: {data.isf_score.toFixed(2)}</p>
                            <div className="mt-2 pt-2 border-t border-blue-200">
                              <p className="text-gray-700">⭐ Rating: {data.rating.toFixed(2)}</p>
                              <p className="text-gray-700">📅 Events: {data.timesjudged}</p>
                              <p className="text-gray-700">🎓 Experience: {data.yearsjudged} years</p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar 
                    dataKey="isf_score" 
                    fill="#3B82F6"
                    radius={[0, 4, 4, 0]}
                    animationBegin={300}
                    animationDuration={2000}
                    animationEasing="ease-out"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border border-indigo-200 rounded-xl shadow-lg">
          <CardHeader className="pb-4 bg-gradient-to-r from-indigo-50 to-violet-50 rounded-t-xl border-b border-indigo-200">
            <Typography variant="h5" className="text-indigo-800 font-bold text-center mb-4">
              🎯 Judge Qualification Profile
            </Typography>
            <div className="mb-4 bg-white p-4 rounded-lg border border-indigo-200">
              <Typography className="text-indigo-700 text-sm font-semibold mb-2 text-center">
                Understanding the Criteria
              </Typography>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="text-center">
                  <div className="text-yellow-500 text-2xl mb-1">⭐</div>
                  <div className="font-bold text-indigo-800">Rating</div>
                  <div className="text-gray-600">Peer Reviews</div>
                  <div className="text-indigo-600 font-semibold">50% Weight</div>
                </div>
                <div className="text-center">
                  <div className="text-blue-500 text-2xl mb-1">📅</div>
                  <div className="font-bold text-indigo-800">Events</div>
                  <div className="text-gray-600">Judging History</div>
                  <div className="text-indigo-600 font-semibold">25% Weight</div>
                </div>
                <div className="text-center">
                  <div className="text-purple-500 text-2xl mb-1">🎓</div>
                  <div className="font-bold text-indigo-800">Experience</div>
                  <div className="text-gray-600">Years Active</div>
                  <div className="text-indigo-600 font-semibold">25% Weight</div>
                </div>
              </div>
            </div>
            {topJudges.length > 0 && (
              <Select
                label="Select Judge to Analyze"
                value={selectedJudge?.userid || ""}
                onChange={(value) => {
                  const judge = topJudges.find(j => j.userid.toString() === value);
                  setSelectedJudge(judge);
                }}
                className="bg-white"
              >
                {topJudges.map((judge) => (
                  <Option key={judge.userid} value={judge.userid.toString()}>
                    {judge.firstname} {judge.lastname} (ID: {judge.userid}) - Score: {judge.isf_score.toFixed(1)}
                  </Option>
                ))}
              </Select>
            )}
          </CardHeader>
          <CardBody className="pt-4">
            <QualificationRadar judge={selectedJudge} />
            {selectedJudge && (
              <div className="mt-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border-2 border-indigo-300">
                <Typography className="text-indigo-800 font-bold text-center mb-1">
                  {selectedJudge.firstname} {selectedJudge.lastname}
                </Typography>
                <Typography className="text-indigo-500 text-sm text-center mb-3">
                  Judge ID: {selectedJudge.userid}
                </Typography>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white rounded-lg p-3 border border-yellow-200 text-center">
                    <p className="text-xs text-gray-600 mb-1">Peer Rating</p>
                    <p className="text-2xl font-bold text-yellow-500 mb-1">⭐</p>
                    <p className="text-lg font-bold text-indigo-800">{selectedJudge.rating.toFixed(2)}</p>
                    <div className="mt-2 pt-2 border-t border-yellow-200">
                      <p className="text-xs text-indigo-600 font-semibold">
                        {((selectedJudge.rating / 5) * 50).toFixed(1)} pts
                      </p>
                      <p className="text-xs text-gray-500">of 50 points</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-blue-200 text-center">
                    <p className="text-xs text-gray-600 mb-1">Events Judged</p>
                    <p className="text-2xl font-bold text-blue-500 mb-1">📅</p>
                    <p className="text-lg font-bold text-indigo-800">{selectedJudge.timesjudged}</p>
                    <div className="mt-2 pt-2 border-t border-blue-200">
                      <p className="text-xs text-indigo-600 font-semibold">
                        {Math.min((selectedJudge.timesjudged / 50) * 25, 25).toFixed(1)} pts
                      </p>
                      <p className="text-xs text-gray-500">of 25 points</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-purple-200 text-center">
                    <p className="text-xs text-gray-600 mb-1">Years Active</p>
                    <p className="text-2xl font-bold text-purple-500 mb-1">🎓</p>
                    <p className="text-lg font-bold text-indigo-800">{selectedJudge.yearsjudged}y</p>
                    <div className="mt-2 pt-2 border-t border-purple-200">
                      <p className="text-xs text-indigo-600 font-semibold">
                        {Math.min((selectedJudge.yearsjudged / 20) * 25, 25).toFixed(1)} pts
                      </p>
                      <p className="text-xs text-gray-500">of 25 points</p>
                    </div>
                  </div>
                </div>
                <div className="mt-3 bg-white rounded-lg p-3 border-2 border-indigo-400 text-center">
                  <p className="text-xs text-gray-600 mb-1">Total ISF Score</p>
                  <p className="text-3xl font-bold text-indigo-700">{selectedJudge.isf_score.toFixed(2)}</p>
                  <p className="text-xs text-indigo-600 font-semibold">out of 100 points</p>
                </div>
              </div>
            )}
          </CardBody>
        </Card>

        <Card className="bg-white border border-green-200 rounded-xl shadow-lg">
          <CardHeader className="pb-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-xl border-b border-green-200">
            <Typography variant="h5" className="text-green-800 font-bold text-center">
              📈 Qualification Distribution
            </Typography>
          </CardHeader>
          <CardBody className="pt-4">
            <div className="space-y-4">
              {qualificationData.map((category, index) => {
                const totalJudges = qualificationData.reduce((sum, cat) => sum + cat.value, 0);
                const percentage = totalJudges > 0 ? (category.value / totalJudges) * 100 : 0;
                return (
                  <div key={category.name} className="animate-fadeIn" style={{animationDelay: `${index * 200}ms`}}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold" style={{color: category.color}}>
                        {category.name}
                      </span>
                      <span className="text-sm font-bold" style={{color: category.color}}>
                        {category.value} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-1000 flex items-center justify-end pr-2"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: category.color,
                          animationDelay: `${index * 300}ms`
                        }}
                      >
                        <span className="text-xs font-bold text-white">
                          {percentage > 10 ? `${percentage.toFixed(0)}%` : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <Typography className="text-gray-800 font-bold text-sm mb-2">Qualification Criteria:</Typography>
              <ul className="text-xs text-gray-700 space-y-1">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>ISF Qualified:</strong> Rating ≥4.5★, Events ≥25, Experience ≥5 years</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 font-bold">◐</span>
                  <span><strong>Near Qualified:</strong> Rating ≥4.0★, Events ≥15, Experience ≥3 years</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-600 font-bold">○</span>
                  <span><strong>Developing:</strong> Building towards ISF qualification</span>
                </li>
              </ul>
            </div>
          </CardBody>
        </Card>
      </div>

      {topJudges.length > 0 && (
        <Card className="bg-white border border-purple-200 rounded-xl shadow-lg">
          <CardHeader className="pb-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-xl border-b border-purple-200">
            <Typography variant="h5" className="text-purple-800 font-bold text-center">
              🔬 Multi-Dimensional ISF Qualification Analysis
            </Typography>
            <Typography className="text-purple-600 text-sm text-center mt-2">
              Bubble size represents years of experience | Position shows rating vs events correlation
            </Typography>
          </CardHeader>
          <CardBody className="pt-4">
            <ISFScoreScatter judges={topJudges} />
          </CardBody>
        </Card>
      )}

      {topJudges.length > 0 && (
        <Card className="bg-white border border-indigo-200 rounded-xl shadow-lg">
          <CardHeader className="pb-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-t-xl border-b border-indigo-200">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              <Typography variant="h5" className="text-indigo-800 font-bold">
                📋 Detailed ISF Qualification Rankings
              </Typography>
              <div className="w-full lg:w-64">
                <Select
                  label="Filter by Category"
                  value={categoryFilter}
                  onChange={(value) => setCategoryFilter(value)}
                  className="bg-white"
                >
                  <Option value="all">All Categories</Option>
                  {getUniqueCategories().map((category) => (
                    <Option key={category} value={category}>
                      {category}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardBody className="pt-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-100 to-blue-100 border-b-2 border-indigo-300">
                    <th className="px-4 py-3 text-left text-xs font-bold text-indigo-800 uppercase tracking-wider">Rank</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-indigo-800 uppercase tracking-wider">Judge ID</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-indigo-800 uppercase tracking-wider">Judge Name</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-indigo-800 uppercase tracking-wider">ISF Score</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-indigo-800 uppercase tracking-wider">Rating</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-indigo-800 uppercase tracking-wider">Events</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-indigo-800 uppercase tracking-wider">Experience</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-indigo-800 uppercase tracking-wider">Qualification</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-indigo-800 uppercase tracking-wider">Category</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getFilteredTopJudges().map((judge, index) => {
                    const isQualified = judge.rating >= 4.5 && judge.timesjudged >= 25 && judge.yearsjudged >= 5;
                    const isNearQualified = judge.rating >= 4.0 && judge.timesjudged >= 15 && judge.yearsjudged >= 3 && !isQualified;
                    
                    return (
                      <tr 
                        key={judge.userid} 
                        className={`hover:bg-indigo-50 transition-colors ${index < 3 ? 'bg-yellow-50' : ''}`}
                      >
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className={`text-lg font-bold ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-orange-500' : 'text-indigo-600'}`}>
                              {index < 3 ? ['🥇', '🥈', '🥉'][index] : `#${index + 1}`}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-indigo-600">#{judge.userid}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-gray-900">{judge.firstname} {judge.lastname}</div>
                          <div className="text-xs text-gray-500">{judge.qualification || 'N/A'}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 border border-purple-300">
                            {judge.isf_score.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-1">
                            <span className="text-yellow-400">⭐</span>
                            <span className="text-sm font-semibold text-gray-900">{judge.rating.toFixed(2)}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-1">
                            <span className="text-blue-500">📅</span>
                            <span className="text-sm font-semibold text-gray-900">{judge.timesjudged}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-1">
                            <span className="text-purple-500">🎓</span>
                            <span className="text-sm font-semibold text-gray-900">{judge.yearsjudged}y</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <span className={`inline-flex px-2 py-1 text-xs font-bold rounded-full ${
                            isQualified 
                              ? 'bg-green-100 text-green-800 border border-green-300' 
                              : isNearQualified 
                              ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' 
                              : 'bg-gray-100 text-gray-800 border border-gray-300'
                          }`}>
                            {isQualified ? '✓ Qualified' : isNearQualified ? '◐ Near' : '○ Developing'}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <div className="text-xs text-gray-700">
                            {judge.firstcategory || 'N/A'}
                            {judge.secondcategory && (
                              <div className="text-xs text-gray-500 mt-1">+ {judge.secondcategory}</div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {getFilteredTopJudges().length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No judges found for the selected category
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      )}

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-indigo-300 rounded-xl shadow-lg">
        <CardBody>
          <div className="flex items-start gap-4">
            <div className="text-4xl">ℹ️</div>
            <div className="flex-grow">
              <Typography variant="h5" className="text-indigo-800 font-bold mb-3">
                ISF Qualification Scoring System
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                  <div className="text-2xl mb-2">⭐</div>
                  <Typography className="text-blue-800 font-bold text-sm">Rating (50%)</Typography>
                  <p className="text-xs text-gray-600 mt-2">
                    Average peer rating from co-judges. Each star = 10 points (Max 5 stars = 50 points)
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 border-2 border-green-200">
                  <div className="text-2xl mb-2">📅</div>
                  <Typography className="text-green-800 font-bold text-sm">Events Attended (25%)</Typography>
                  <p className="text-xs text-gray-600 mt-2">
                    Number of events judged. 50+ events = 25 points
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 border-2 border-purple-200">
                  <div className="text-2xl mb-2">🎓</div>
                  <Typography className="text-purple-800 font-bold text-sm">Experience (25%)</Typography>
                  <p className="text-xs text-gray-600 mt-2">
                    Years of judging experience. 20+ years = 25 points
                  </p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-indigo-100 rounded-lg border border-indigo-300">
                <p className="text-sm text-indigo-800">
                  <strong>Total ISF Score = </strong> (Rating/5 × 50) + (Events/50 × 25) + (Years/20 × 25)
                </p>
                <p className="text-xs text-indigo-700 mt-1">
                  Example: A judge with 5★ rating, 40 events, and 15 years = (5/5 × 50) + (40/50 × 25) + (15/20 × 25) = 50 + 20 + 18.75 = 88.75 points
                </p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ISFJudgesStats;