import React, { useState, useEffect } from "react";
/*import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Select,
    Option,
} from "@material-tailwind/react";*/
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, ScatterChart, Scatter, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, RadialBarChart, RadialBar } from "recharts";


// Custom Components matching Projects page style
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

// Creative Qualification Tree Component
const QualificationTree = ({ qualificationData }) => {
  const maxValue = Math.max(...qualificationData.map(q => q.value));
  
  return (
    <div className="h-80 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-6 flex items-end justify-center relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-20 w-6 h-6 bg-indigo-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-20 w-3 h-3 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="flex items-end gap-3 relative z-10">
        {qualificationData.map((qual, index) => {
          const height = (qual.value / maxValue) * 180 + 40;
          const delay = index * 200;
          
          return (
            <div key={qual.name} className="flex flex-col items-center group">
              {/* Qualification icon and count */}
              <div className="mb-2 text-center animate-fadeIn" style={{animationDelay: `${delay + 1000}ms`}}>
                <div className="text-2xl mb-1">
                  {qual.name === 'PhD' ? '🎓' : 
                   qual.name === 'Masters' ? '📚' :
                   qual.name === 'Honours' ? '🏆' :
                   qual.name === 'Bachelors' ? '📖' :
                   qual.name === 'Professional' ? '💼' : '📜'}
                </div>
                <div className="text-lg font-bold text-indigo-800">{qual.value}</div>
                <div className="text-xs text-indigo-600">{qual.percentage}%</div>
              </div>
              
              {/* Tree trunk */}
              <div 
                className="w-12 bg-gradient-to-t from-amber-700 to-amber-500 rounded-t-lg shadow-lg transition-all duration-1000 ease-out transform hover:scale-105 animate-growUp"
                style={{ 
                  height: `${height}px`,
                  animationDelay: `${delay}ms`
                }}
              >
                {/* Tree rings effect */}
                <div className="w-full h-4 bg-amber-600 rounded-t-lg opacity-60"></div>
                <div className="w-full h-2 bg-amber-800 mt-2 opacity-40"></div>
              </div>
              
              {/* Tree canopy */}
              <div 
                className="relative -mt-6 animate-bounce"
                style={{animationDelay: `${delay + 800}ms`}}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-lg"></div>
                <div className="absolute top-1 left-2 w-12 h-12 bg-gradient-to-br from-green-300 to-green-500 rounded-full opacity-80"></div>
                <div className="absolute top-2 left-4 w-8 h-8 bg-green-200 rounded-full opacity-60"></div>
              </div>
              
              {/* Label */}
              <div className="mt-2 text-center">
                <div className="text-xs font-medium text-indigo-700 transform rotate-45 origin-left">
                  {qual.name}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Gender Balance Scale Component
const GenderBalanceScale = ({ genderData }) => {
  const male = genderData.find(g => g.name.toLowerCase() === 'male')?.value || 0;
  const female = genderData.find(g => g.name.toLowerCase() === 'female')?.value || 0;
  const other = genderData.find(g => g.name.toLowerCase() === 'other')?.value || 0;
  const total = male + female + other;
  
  // Calculate balance tilt
  const malePercent = total > 0 ? (male / total) * 100 : 50;
  const femalePercent = total > 0 ? (female / total) * 100 : 50;
  const tiltAngle = (malePercent - femalePercent) * 0.3; // Max tilt of 30 degrees
  
  return (
    <div className="h-80 bg-gradient-to-br from-pink-50 to-rose-100 rounded-lg p-6 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-pink-200 via-transparent to-blue-200"></div>
      </div>
      
      {/* Scale pivot */}
      <div className="relative mb-8">
        <div className="w-4 h-16 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full mx-auto"></div>
        <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-700 rounded-full absolute -bottom-2 left-1/2 transform -translate-x-1/2"></div>
      </div>
      
      {/* Scale beam */}
      <div 
        className="relative transition-transform duration-2000 ease-out animate-scaleBalance"
        style={{ transform: `rotate(${tiltAngle}deg)` }}
      >
        {/* Scale bar */}
        <div className="w-64 h-3 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full shadow-lg"></div>
        
        {/* Left pan (Male) */}
        <div className="absolute -left-8 -top-8 flex flex-col items-center animate-fadeIn" style={{animationDelay: '500ms'}}>
          <div className="w-20 h-4 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full shadow-lg"></div>
          <div className="w-16 h-1 bg-blue-700 -mt-1"></div>
          <div className="mt-2 text-center">
            <div className="text-3xl mb-1">👨‍🔬</div>
            <div className="text-blue-700 font-bold text-lg">{male}</div>
            <div className="text-blue-600 text-sm">Male</div>
            <div className="text-blue-500 text-xs">{malePercent.toFixed(1)}%</div>
          </div>
        </div>
        
        {/* Right pan (Female) */}
        <div className="absolute -right-8 -top-8 flex flex-col items-center animate-fadeIn" style={{animationDelay: '800ms'}}>
          <div className="w-20 h-4 bg-gradient-to-b from-pink-400 to-pink-600 rounded-full shadow-lg"></div>
          <div className="w-16 h-1 bg-pink-700 -mt-1"></div>
          <div className="mt-2 text-center">
            <div className="text-3xl mb-1">👩‍🔬</div>
            <div className="text-pink-700 font-bold text-lg">{female}</div>
            <div className="text-pink-600 text-sm">Female</div>
            <div className="text-pink-500 text-xs">{femalePercent.toFixed(1)}%</div>
          </div>
        </div>
      </div>
      
      {/* Other category */}
      {other > 0 && (
        <div className="mt-8 text-center animate-fadeIn" style={{animationDelay: '1200ms'}}>
          <div className="bg-purple-200 rounded-full px-4 py-2">
            <div className="text-purple-700 font-bold">Other: {other}</div>
            <div className="text-purple-600 text-xs">{((other/total) * 100).toFixed(1)}%</div>
          </div>
        </div>
      )}
    </div>
  );
};

// Experience Level Speedometer
const ExperienceSpeedometer = ({ experienceData }) => {
  const novice = experienceData.find(e => e.name.includes('Novice'))?.value || 0;
  const experienced = experienceData.find(e => e.name.includes('Experienced'))?.value || 0;
  const veteran = experienceData.find(e => e.name.includes('Veteran'))?.value || 0;
  const total = novice + experienced + veteran;
  
  // Calculate the dominant experience level
  const levels = [
    { name: 'Novice', value: novice, color: '#10B981', angle: 30 },
    { name: 'Experienced', value: experienced, color: '#F59E0B', angle: 90 },
    { name: 'Veteran', value: veteran, color: '#EF4444', angle: 150 }
  ];
  
  const maxLevel = levels.reduce((max, level) => level.value > max.value ? level : max, levels[0]);
  
  return (
    <div className="h-80 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg p-6 flex flex-col items-center justify-center relative">
      {/* Speedometer arc background */}
      <div className="relative">
        <svg width="240" height="140" viewBox="0 0 240 140" className="animate-fadeIn">
          {/* Background arc */}
          <path
            d="M 30 120 A 90 90 0 0 1 210 120"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="20"
            strokeLinecap="round"
          />
          
          {/* Experience level arcs */}
          <path
            d="M 30 120 A 90 90 0 0 0 120 30"
            fill="none"
            stroke="#10B981"
            strokeWidth="16"
            strokeLinecap="round"
            className="animate-drawArc"
            style={{
              strokeDasharray: 141,
              strokeDashoffset: 141 - (novice / total) * 47,
              animationDelay: '500ms'
            }}
          />
          <path
            d="M 120 30 A 90 90 0 0 0 210 120"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="16"
            strokeLinecap="round"
            className="animate-drawArc"
            style={{
              strokeDasharray: 141,
              strokeDashoffset: 141 - (experienced / total) * 47,
              animationDelay: '800ms'
            }}
          />
          <path
            d="M 120 30 A 90 90 0 0 1 210 120"
            fill="none"
            stroke="#EF4444"
            strokeWidth="16"
            strokeLinecap="round"
            className="animate-drawArc"
            style={{
              strokeDasharray: 141,
              strokeDashoffset: 141 - (veteran / total) * 47,
              animationDelay: '1100ms'
            }}
          />
          
          {/* Needle */}
          <g className="animate-swing" style={{transformOrigin: '120px 120px', animationDelay: '1500ms'}}>
            <line
              x1="120"
              y1="120"
              x2={120 + 60 * Math.cos((maxLevel.angle - 90) * Math.PI / 180)}
              y2={120 + 60 * Math.sin((maxLevel.angle - 90) * Math.PI / 180)}
              stroke="#374151"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="120" cy="120" r="8" fill="#374151" />
          </g>
        </svg>
        
        {/* Center display */}
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 text-center">
          <div className="text-gray-800 font-bold text-lg animate-fadeIn" style={{animationDelay: '1800ms'}}>
            {maxLevel.name}
          </div>
          <div className="text-gray-600 text-sm">Dominant Level</div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex gap-6">
        {levels.map((level, index) => (
          <div key={level.name} className="text-center animate-slideUp" style={{animationDelay: `${1200 + index * 200}ms`}}>
            <div className="w-4 h-4 rounded-full mx-auto mb-1" style={{backgroundColor: level.color}}></div>
            <div className="text-xs font-medium text-gray-700">{level.name}</div>
            <div className="text-lg font-bold" style={{color: level.color}}>{level.value}</div>
            <div className="text-xs text-gray-600">{((level.value/total) * 100).toFixed(1)}%</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Creative Race Constellation
const RaceConstellation = ({ raceData }) => {
  const stars = raceData.map((race, index) => ({
    ...race,
    x: 150 + 80 * Math.cos((index * 2 * Math.PI) / raceData.length),
    y: 120 + 60 * Math.sin((index * 2 * Math.PI) / raceData.length),
    size: Math.max(8, (race.value / Math.max(...raceData.map(r => r.value))) * 25),
    color: ['#8B5CF6', '#F59E0B', '#10B981', '#EF4444', '#6366F1', '#84CC16'][index % 6]
  }));
  
  return (
    <div className="h-80 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 rounded-lg p-6 relative overflow-hidden">
      {/* Animated background stars */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-twinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 text-center mb-4">
        <div className="text-purple-200 font-bold text-lg">Race Distribution Constellation</div>
      </div>
      
      <div className="relative flex items-center justify-center h-64">
        <svg width="300" height="240" viewBox="0 0 300 240">
          {/* Connection lines */}
          {stars.map((star, index) => (
            <line
              key={`line-${index}`}
              x1="150"
              y1="120"
              x2={star.x}
              y2={star.y}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1"
              className="animate-drawLine"
              style={{
                strokeDasharray: 100,
                strokeDashoffset: 100,
                animationDelay: `${500 + index * 200}ms`
              }}
            />
          ))}
          
          {/* Center star */}
          <circle
            cx="150"
            cy="120"
            r="8"
            fill="white"
            className="animate-pulse"
          />
          
          {/* Race stars */}
          {stars.map((star, index) => (
            <g key={star.name} className="animate-fadeIn" style={{animationDelay: `${800 + index * 150}ms`}}>
              <circle
                cx={star.x}
                cy={star.y}
                r={star.size}
                fill={star.color}
                className="animate-pulse hover:animate-bounce"
                style={{animationDelay: `${index * 0.5}s`}}
              />
              <text
                x={star.x}
                y={star.y - star.size - 10}
                textAnchor="middle"
                className="text-xs font-bold fill-white"
              >
                {star.name}
              </text>
              <text
                x={star.x}
                y={star.y + 4}
                textAnchor="middle"
                className="text-xs font-bold fill-black"
              >
                {star.value}
              </text>
              <text
                x={star.x}
                y={star.y + star.size + 15}
                textAnchor="middle"
                className="text-xs fill-purple-200"
              >
                {star.percentage}%
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};

const JudgeStats = () => {
    const [judges, setJudges] = useState([]);
    const [filteredJudges, setFilteredJudges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        qualification: "all",
        gender: "all",
        race: "all",
        yearsjudged: "all", // all, novice (0-2), experienced (3-7), veteran (8+)
        timesjudged: "all", // all, low (0-10), medium (11-30), high (31+)
        category: "all",
        event: "all",
        eventtype: "all",
        region: "all",
        timeRange: "all"
    });

    // Color schemes for the  charts
    const qualificationColors = ["#3B82F6", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981", "#EF4444"];
    const genderColors = ["#3B82F6", "#EC4899", "#6B7280"];
    const raceColors = ["#8B5CF6", "#F59E0B", "#10B981", "#EF4444", "#6366F1", "#84CC16"];
    const experienceColors = ["#10B981", "#F59E0B", "#EF4444"];
    const categoryColors = ["#3B82F6", "#6366F1", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981", "#0EA5E9", "#84CC16"];

    useEffect(() => {
        fetchJudges();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [judges, filters]);

    const fetchJudges = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/getAllJudges');
            if (response.ok) {
                const data = await response.json();
                console.log(data.judges);
                setJudges(data.judges || []);
            } else {
                console.error("Failed to fetch judges");
                setSampleData();
            }
        } catch (error) {
            console.error("Error fetching judges:", error);
            setSampleData();
        } finally {
            setLoading(false);
        }
    };

    // Sample data for demonstration / test data
    const setSampleData = () => {
        const qualifications = ['PhD', 'Masters', 'Honours', 'Bachelors', 'Professional', 'Diploma'];
        const genders = ['Male', 'Female', 'Other'];
        const races = ['African', 'White', 'Coloured', 'Indian', 'Asian', 'Other'];
        const categories = ['Agricultural Sciences', 'Biological Sciences', 'Chemistry', 'Computer Science', 'Earth Sciences', 'Engineering', 'Mathematics', 'Physics'];
        const eventTypes = ['Regional', 'Provincial', 'National', 'International'];
        const regions = ['Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape', 'Free State', 'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape'];
        
        const sampleJudges = Array.from({ length: 150 }, (_, i) => ({
            userid: i + 1,
            firstname: ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma', 'Robert', 'Lisa', 'Peter', 'Mary'][Math.floor(Math.random() * 10)],
            lastname: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Wilson', 'Moore'][Math.floor(Math.random() * 10)],
            gender: genders[Math.floor(Math.random() * genders.length)],
            race: races[Math.floor(Math.random() * races.length)],
            qualification: qualifications[Math.floor(Math.random() * qualifications.length)],
            yearsjudged: Math.floor(Math.random() * 15) + 1,
            timesjudged: Math.floor(Math.random() * 50) + 1,
            firstcategory: categories[Math.floor(Math.random() * categories.length)],
            secondcategory: Math.random() > 0.3 ? categories[Math.floor(Math.random() * categories.length)] : null,
            eventid: Math.floor(Math.random() * 20) + 1,
            event_name: `Event ${Math.floor(Math.random() * 20) + 1}`,
            event_type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
            event_region: regions[Math.floor(Math.random() * regions.length)],
            event_status: ['Active', 'Completed', 'Upcoming'][Math.floor(Math.random() * 3)],
            venue: `Venue ${Math.floor(Math.random() * 15) + 1}`
        }));
        
        setJudges(sampleJudges);
    };

    const applyFilters = () => {
        let filtered = [...judges];
         if (filters.timeRange !== "all") {
        const now = new Date();
        filtered = filtered.filter(judge => {
            const eventCreationDate = judge.event_timeregistered;
            if (!eventCreationDate) return false;
            
                const eventDate = new Date(eventCreationDate);
                if (isNaN(eventDate.getTime())) return false;
                
                const yearsDiff = now.getFullYear() - eventDate.getFullYear();
                const monthsDiff = yearsDiff * 12 + (now.getMonth() - eventDate.getMonth());
                
                switch(filters.timeRange) {
                    case "0-3": return monthsDiff <= 3;
                    case "6": return monthsDiff <= 6;
                    case "6+": return monthsDiff > 6 && monthsDiff <= 12;
                    case "12+": return monthsDiff > 12;
                    default: return true;
                }
            });
        }

        if (filters.qualification !== "all") {
            filtered = filtered.filter(judge => 
                judge.qualification?.toLowerCase() === filters.qualification.toLowerCase()
            );
        }

        if (filters.gender !== "all") {
            filtered = filtered.filter(judge => 
                judge.gender?.toLowerCase() === filters.gender.toLowerCase()
            );
        }

        if (filters.race !== "all") {
            filtered = filtered.filter(judge => 
                judge.race?.toLowerCase() === filters.race.toLowerCase()
            );
        }

        if (filters.yearsjudged !== "all") {
            filtered = filtered.filter(judge => {
                const years = judge.yearsjudged || 0;
                switch(filters.yearsjudged) {
                    case "novice": return years <= 2;
                    case "experienced": return years >= 3 && years <= 7;
                    case "veteran": return years >= 8;
                    default: return true;
                }
            });
        }

        if (filters.timesjudged !== "all") {
            filtered = filtered.filter(judge => {
                const times = judge.timesjudged || 0;
                switch(filters.timesjudged) {
                    case "low": return times <= 10;
                    case "medium": return times >= 11 && times <= 30;
                    case "high": return times >= 31;
                    default: return true;
                }
            });
        }

        if (filters.category !== "all") {
            filtered = filtered.filter(judge => 
                judge.firstcategory?.toLowerCase() === filters.category.toLowerCase() ||
                judge.secondcategory?.toLowerCase() === filters.category.toLowerCase()
            );
        }

        if (filters.event !== "all") {
            filtered = filtered.filter(judge => 
                judge.eventid?.toString() === filters.event.toString()
            );
        }

        if (filters.eventtype !== "all") {
            filtered = filtered.filter(judge => 
                judge.event_type?.toLowerCase() === filters.eventtype.toLowerCase()
            );
        }

        if (filters.region !== "all") {
            filtered = filtered.filter(judge => 
                judge.event_region?.toLowerCase() === filters.region.toLowerCase()
            );
        }

        setFilteredJudges(filtered);
    };

    const getQualificationStats = () => {
        const qualCount = filteredJudges.reduce((acc, judge) => {
            const qual = judge.qualification || "Unknown";
            acc[qual] = (acc[qual] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(qualCount).map(([qual, count]) => ({
            name: qual,
            value: count,
            percentage: ((count / filteredJudges.length) * 100).toFixed(1)
        }));
    };

    const getGenderStats = () => {
        const genderCount = filteredJudges.reduce((acc, judge) => {
            const gender = judge.gender?.toLowerCase() || "Unknown";
            acc[gender] = (acc[gender] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(genderCount).map(([gender, count]) => ({
            name: gender,
            value: count,
            percentage: ((count / filteredJudges.length) * 100).toFixed(1)
        }));
    };

    const getRaceStats = () => {
        const raceCount = filteredJudges.reduce((acc, judge) => {
            const race = judge.race?.toLowerCase() || "Unknown";
            acc[race] = (acc[race] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(raceCount).map(([race, count]) => ({
            name: race,
            value: count,
            percentage: ((count / filteredJudges.length) * 100).toFixed(1)
        }));
    };

    const getExperienceStats = () => {
        const categories = { "Novice (0-2 years)": 0, "Experienced (3-7 years)": 0, "Veteran (8+ years)": 0 };
        
        filteredJudges.forEach(judge => {
            const years = judge.yearsjudged || 0;
            if (years <= 2) categories["Novice (0-2 years)"]++;
            else if (years <= 7) categories["Experienced (3-7 years)"]++;
            else categories["Veteran (8+ years)"]++;
        });

        return Object.entries(categories).map(([range, count]) => ({
            name: range,
            value: count,
            percentage: ((count / filteredJudges.length) * 100).toFixed(1)
        }));
    };

    const getTimesJudgedStats = () => {
        const categories = { "Low (1-10)": 0, "Medium (11-30)": 0, "High (31+)": 0 };
        
        filteredJudges.forEach(judge => {
            const times = judge.timesjudged || 0;
            if (times <= 10) categories["Low (1-10)"]++;
            else if (times <= 30) categories["Medium (11-30)"]++;
            else categories["High (31+)"]++;
        });

        return Object.entries(categories).map(([range, count]) => ({
            name: range,
            value: count,
            percentage: ((count / filteredJudges.length) * 100).toFixed(1)
        }));
    };

    const getCategoryStats = () => {
        const categoryCount = {};
        
        filteredJudges.forEach(judge => {
            if (judge.firstcategory) {
                categoryCount[judge.firstcategory] = (categoryCount[judge.firstcategory] || 0) + 1;
            }
            if (judge.secondcategory) {
                categoryCount[judge.secondcategory] = (categoryCount[judge.secondcategory] || 0) + 1;
            }
        });

        return Object.entries(categoryCount)
            .map(([category, count]) => ({
                name: category,
                value: count
            }))
            .sort((a, b) => b.value - a.value);
    };

    const getEventTypeStats = () => {
        const eventTypeCount = filteredJudges.reduce((acc, judge) => {
            const eventType = judge.event_type || "Unknown";
            acc[eventType] = (acc[eventType] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(eventTypeCount).map(([eventType, count]) => ({
            name: eventType,
            value: count
        }));
    };

    const getRegionStats = () => {
        const regionCount = filteredJudges.reduce((acc, judge) => {
            const region = judge.event_region || "Unknown";
            acc[region] = (acc[region] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(regionCount)
            .map(([region, count]) => ({
                name: region,
                value: count
            }))
            .sort((a, b) => b.value - a.value);
    };

    const getExperienceVsTimesData = () => {
        return filteredJudges.map((judge, index) => ({
            id: index + 1,
            yearsjudged: judge.yearsjudged || 0,
            timesjudged: judge.timesjudged || 0,
            name: `${judge.firstname} ${judge.lastname}`,
            qualification: judge.qualification
        }));
    };

    const getUniqueEvents = () => {
    const eventMap = new Map();
    let judgesToUse = judges;
    
    // Filter by time range first if selected
    if (filters.timeRange !== "all") {
        const now = new Date();
        judgesToUse = judges.filter(judge => {
            const eventCreationDate = judge.event_timeregistered;
            if (!eventCreationDate) return false;
            
            const eventDate = new Date(eventCreationDate);
            if (isNaN(eventDate.getTime())) return false;
            
            const yearsDiff = now.getFullYear() - eventDate.getFullYear();
            const monthsDiff = yearsDiff * 12 + (now.getMonth() - eventDate.getMonth());
            
            switch(filters.timeRange) {
                case "0-3": return monthsDiff <= 3;
                case "6": return monthsDiff <= 6;
                case "6+": return monthsDiff > 6 && monthsDiff <= 12;
                case "12+": return monthsDiff > 12;
                default: return true;
            }
        });
    }
    
    judgesToUse.forEach(judge => {
        if (judge.event_name && judge.eventid) {
            eventMap.set(judge.event_name, {
                id: judge.eventid,
                name: judge.event_name
            });
        }
    });
    
    return Array.from(eventMap.values()).sort((a, b) => a.name.localeCompare(b.name));
};

    const getUniqueEventTypes = () => {
        const uniqueEventTypes = [...new Set(judges.map(judge => judge.event_type)
            .filter(type => type))]
            .sort((a, b) => a.localeCompare(b));
        
        return uniqueEventTypes;
    };

    const getUniqueRegions = () => {
        const uniqueRegions = [...new Set(judges.map(judge => judge.event_region)
            .filter(region => region))]
            .sort((a, b) => a.localeCompare(b));
        
        return uniqueRegions;
    };

    const getUniqueQualifications = () => {
        const uniqueQuals = [...new Set(judges.map(judge => judge.qualification)
            .filter(qual => qual))]
            .sort((a, b) => a.localeCompare(b));
        
        return uniqueQuals;
    };

    const getUniqueCategories = () => {
        const categories = new Set();
        judges.forEach(judge => {
            if (judge.firstcategory) categories.add(judge.firstcategory);
            if (judge.secondcategory) categories.add(judge.secondcategory);
        });
        return Array.from(categories).sort();
    };

    const getAverageStats = () => {
        if (filteredJudges.length === 0) return { avgYears: 0, avgTimes: 0 };
        
        const totalYears = filteredJudges.reduce((sum, j) => sum + (j.yearsjudged || 0), 0);
        const totalTimes = filteredJudges.reduce((sum, j) => sum + (j.timesjudged || 0), 0);
        
        return {
            avgYears: (totalYears / filteredJudges.length).toFixed(1),
            avgTimes: (totalTimes / filteredJudges.length).toFixed(1)
        };
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-3 border border-blue-200 rounded-lg shadow-lg">
                    <p className="text-blue-800 font-semibold">{`${data.name}: ${data.value}`}</p>
                    {data.percentage && (
                        <p className="text-blue-600">{`${data.percentage}%`}</p>
                    )}
                </div>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                    <Typography className="mt-4 text-blue-600">Loading judge statistics...</Typography>
                </div>
            </div>
        );
    }

    const qualificationData = getQualificationStats();
    const genderData = getGenderStats();
    const raceData = getRaceStats();
    const experienceData = getExperienceStats();
    const timesJudgedData = getTimesJudgedStats();
    const categoryData = getCategoryStats();
    const eventTypeData = getEventTypeStats();
    const regionData = getRegionStats();
    const experienceVsTimesData = getExperienceVsTimesData();
    const averageStats = getAverageStats();

    return (
        <div className="mt-12 mb-8 flex flex-col gap-6">
            <style jsx>{`
                @keyframes slideInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slideInUp { animation: slideInUp 0.8s ease-out forwards; }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes growUp {
                    from { height: 0; }
                    to { height: var(--target-height); }
                }
                @keyframes scaleBalance {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(var(--rotation)); }
                }
                @keyframes drawArc {
                    from { stroke-dashoffset: 141; }
                    to { stroke-dashoffset: var(--dash-offset); }
                }
                @keyframes swing {
                    0%, 100% { transform: rotate(0deg); }
                    50% { transform: rotate(var(--swing-angle)); }
                }
                @keyframes drawLine {
                    from { stroke-dashoffset: 100; }
                    to { stroke-dashoffset: 0; }
                }
                @keyframes twinkle {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 1; }
                }
                .animate-fadeIn { animation: fadeIn 1s ease-out forwards; }
                .animate-slideUp { animation: slideUp 1s ease-out forwards; }
                .animate-growUp { animation: growUp 1s ease-out forwards; }
                .animate-scaleBalance { animation: scaleBalance 2s ease-out forwards; }
                .animate-drawArc { animation: drawArc 1.5s ease-out forwards; }
                .animate-swing { animation: swing 2s ease-in-out forwards; }
                .animate-drawLine { animation: drawLine 1s ease-out forwards; }
                .animate-twinkle { animation: twinkle 2s infinite; }
            `}</style>

            {/* Header and Filters */}
         <Card className="bg-white border border-indigo-200 rounded-xl shadow-xl animate-slideInUp" delay={100}>
                <CardHeader className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-indigo-200 rounded-t-xl">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                        <Typography variant="h4" className="text-indigo-800 font-bold flex-grow">
                            Judge Statistics Dashboard
                        </Typography>
                        
                        {/* Filters - Scrollable Container */}
                        <div className="w-full lg:w-auto">
                           <div className="flex flex-wrap gap-4">
                                <div className="flex-shrink-0 w-48">
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
                                <div className="flex-shrink-0 w-48">
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
                                
                                <div className="flex-shrink-0 w-48">
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
                                
                                <div className="flex-shrink-0 w-48">
                                    <Select
                                        label="Filter by Region"
                                        value={filters.region}
                                        onChange={(value) => setFilters(prev => ({ ...prev, region: value }))}
                                        className="bg-white"
                                    >
                                        <Option value="all">All Regions</Option>
                                        {getUniqueRegions().map((region) => (
                                            <Option key={region} value={region}>
                                                {region}
                                            </Option>
                                        ))}
                                    </Select>
                                </div>
                                
                                <div className="flex-shrink-0 w-48">
                                    <Select
                                        label="Filter by Qualification"
                                        value={filters.qualification}
                                        onChange={(value) => setFilters(prev => ({ ...prev, qualification: value }))}
                                        className="bg-white"
                                     
                                    >
                                        <Option value="all">All Qualifications</Option>
                                        {getUniqueQualifications().map((qual) => (
                                            <Option key={qual} value={qual}>
                                                {qual}
                                            </Option>
                                        ))}
                                    </Select>
                                </div>
                                
                                <div className="flex-shrink-0 w-48">
                                    <Select
                                        label="Filter by Category"
                                        value={filters.category}
                                        onChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
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
                                
                                <div className="flex-shrink-0 w-48">
                                    <Select
                                        label="Years of Experience"
                                        value={filters.yearsjudged}
                                        onChange={(value) => setFilters(prev => ({ ...prev, yearsjudged: value }))}
                                        className="bg-white"
                                    >
                                        <Option value="all">All Experience</Option>
                                        <Option value="novice">Novice (0-2 years)</Option>
                                        <Option value="experienced">Experienced (3-7 years)</Option>
                                        <Option value="veteran">Veteran (8+ years)</Option>
                                    </Select>
                                </div>
                                
                                <div className="flex-shrink-0 w-48">
                                    <Select
                                        label="Times Judged"
                                        value={filters.timesjudged}
                                        onChange={(value) => setFilters(prev => ({ ...prev, timesjudged: value }))}
                                        className="bg-white"
                                     
                                    >
                                        <Option value="all">All Ranges</Option>
                                        <Option value="low">Low (1-10)</Option>
                                        <Option value="medium">Medium (11-30)</Option>
                                        <Option value="high">High (31+)</Option>
                                    </Select>
                                </div>
                                
                                <div className="flex-shrink-0 w-48">
                                    <Select
                                        label="Filter by Gender"
                                        value={filters.gender}
                                        onChange={(value) => setFilters(prev => ({ ...prev, gender: value }))}
                                        className="bg-white"
                                    >
                                        <Option value="all">All Genders</Option>
                                        <Option value="male">Male</Option>
                                        <Option value="female">Female</Option>
                                        <Option value="other">Other</Option>
                                    </Select>
                                </div>
                                
                                <div className="flex-shrink-0 w-48">
                                    <Select
                                        label="Filter by Race"
                                        value={filters.race}
                                        onChange={(value) => setFilters(prev => ({ ...prev, race: value }))}
                                        className="bg-white"
                                   
                                    >
                                        <Option value="all">All Races</Option>
                                        <Option value="african">African</Option>
                                        <Option value="white">White</Option>
                                        <Option value="coloured">Coloured</Option>
                                        <Option value="indian">Indian</Option>
                                        <Option value="asian">Asian</Option>
                                        <Option value="other">Other</Option>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Summary Cards */}
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-lg p-4 border border-indigo-300">
                            <Typography className="text-indigo-700 font-semibold">
                                Total Judges: <span className="text-blue-600 font-bold text-lg">{filteredJudges.length}</span>
                            </Typography>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-green-300">
                            <Typography className="text-green-700 font-semibold">
                                Avg Years Experience: <span className="text-green-600 font-bold text-lg">{averageStats.avgYears}</span>
                            </Typography>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-yellow-300">
                            <Typography className="text-yellow-700 font-semibold">
                                Avg Times Judged: <span className="text-yellow-600 font-bold text-lg">{averageStats.avgTimes}</span>
                            </Typography>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Statistics Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Qualification Tree */}
                <Card className="bg-white border border-blue-200 rounded-xl shadow-lg">
                    <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl border-b border-blue-200">
                        <Typography variant="h5" className="text-blue-800 font-bold text-center">
                            Qualification Forest
                        </Typography>
                        <Typography className="text-blue-600 text-sm text-center mt-2">
                            Academic qualifications represented as growing trees
                        </Typography>
                    </CardHeader>
                    <CardBody className="pt-4">
                        <QualificationTree qualificationData={qualificationData} />
                    </CardBody>
                </Card>

                {/* Experience Speedometer */}
                <Card className="bg-white border border-green-200 rounded-xl shadow-lg">
                    <CardHeader className="pb-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-xl border-b border-green-200">
                        <Typography variant="h5" className="text-green-800 font-bold text-center">
                            Experience Level Gauge
                        </Typography>
                        <Typography className="text-green-600 text-sm text-center mt-2">
                            Distribution of judging experience levels
                        </Typography>
                    </CardHeader>
                    <CardBody className="pt-4">
                        <ExperienceSpeedometer experienceData={experienceData} />
                    </CardBody>
                </Card>

                {/* Times Judged Bar Chart */}
                <Card className="bg-white border border-orange-200 rounded-xl shadow-lg">
                    <CardHeader className="pb-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-t-xl border-b border-orange-200">
                        <Typography variant="h5" className="text-orange-800 font-bold text-center">
                            Times Judged Distribution
                        </Typography>
                    </CardHeader>
                    <CardBody className="pt-4">
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={timesJudgedData} margin={{ top: 20, right: 30, left: 40, bottom: 60 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#FED7AA" />
                                    <XAxis 
                                        dataKey="name" 
                                        tick={{ fontSize: 12, fill: '#9A3412' }}
                                        label={{ 
                                            value: 'Number of Times Judged (Range)', 
                                            position: 'insideBottom', 
                                            offset: -5,
                                            style: { textAnchor: 'middle', fill: '#9A3412', fontWeight: 'bold' }
                                        }}
                                    />
                                    <YAxis 
                                        tick={{ fontSize: 12, fill: '#9A3412' }}
                                        label={{ 
                                            value: 'Number of Judges', 
                                            angle: -90, 
                                            position: 'insideLeft',
                                            style: { textAnchor: 'middle', fill: '#9A3412', fontWeight: 'bold' }
                                        }}
                                    />
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: 'white', 
                                            border: '1px solid #FDBA74',
                                            borderRadius: '8px'
                                        }}
                                        formatter={(value, name) => [value, 'Number of Judges']}
                                        labelFormatter={(label) => `Range: ${label}`}
                                    />
                                    <Bar 
                                        dataKey="value" 
                                        fill="#F97316" 
                                        radius={[4, 4, 0, 0]}
                                        animationBegin={500}
                                        animationDuration={1500}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardBody>
                </Card>

                {/* Gender Balance Scale */}
                <Card className="bg-white border border-pink-200 rounded-xl shadow-lg">
                    <CardHeader className="pb-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-t-xl border-b border-pink-200">
                        <Typography variant="h5" className="text-pink-800 font-bold text-center">
                            Gender Balance Scale
                        </Typography>
                        <Typography className="text-pink-600 text-sm text-center mt-2">
                            Visual representation of gender distribution
                        </Typography>
                    </CardHeader>
                    <CardBody className="pt-4">
                        <GenderBalanceScale genderData={genderData} />
                    </CardBody>
                </Card>

                {/* Race Constellation */}
                <Card className="bg-white border border-purple-200 rounded-xl shadow-lg">
                    <CardHeader className="pb-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-t-xl border-b border-purple-200">
                        <Typography variant="h5" className="text-purple-800 font-bold text-center">
                            Diversity Constellation
                        </Typography>
                        <Typography className="text-purple-600 text-sm text-center mt-2">
                            Race distribution mapped as stars in the sky
                        </Typography>
                    </CardHeader>
                    <CardBody className="pt-4">
                        <RaceConstellation raceData={raceData} />
                    </CardBody>
                </Card>

                {/* Category Distribution Bar Chart */}
                <Card className="bg-white border border-teal-200 rounded-xl shadow-lg">
                    <CardHeader className="pb-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-t-xl border-b border-teal-200">
                        <Typography variant="h5" className="text-teal-800 font-bold text-center">
                            Category Distribution
                        </Typography>
                    </CardHeader>
                    <CardBody className="pt-4">
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={categoryData} margin={{ top: 40, right: 30, left: 60, bottom: 120 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#A7F3D0" />
                                    <XAxis 
                                        dataKey="name" 
                                        tick={{ fontSize: 10, fill: '#134E4A' }}
                                        angle={-45}
                                        textAnchor="end"
                                        height={100}
                                        label={{ 
                                            value: 'Categories', 
                                            position: 'insideBottom', 
                                            offset: -100,
                                            style: { textAnchor: 'middle', fill: '#134E4A', fontWeight: 'bold' }
                                        }}
                                    />
                                    <YAxis 
                                        tick={{ fontSize: 12, fill: '#134E4A' }}
                                        label={{ 
                                            value: 'Number of Judges', 
                                            angle: -90, 
                                            position: 'insideLeft',
                                            style: { textAnchor: 'middle', fill: '#134E4A', fontWeight: 'bold' }
                                        }}
                                    />
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: 'white', 
                                            border: '1px solid #5EEAD4',
                                            borderRadius: '8px'
                                        }}
                                        formatter={(value, name) => [value, 'Number of Judges']}
                                        labelFormatter={(label) => `Category: ${label}`}
                                    />
                                    <Bar 
                                        dataKey="value" 
                                        fill="#14B8A6" 
                                        radius={[4, 4, 0, 0]}
                                        animationBegin={800}
                                        animationDuration={1500}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardBody>
                </Card>

                {/* Event Type Bar Chart */}
                <Card className="bg-white border border-indigo-200 rounded-xl shadow-lg">
                    <CardHeader className="pb-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-t-xl border-b border-indigo-200">
                        <Typography variant="h5" className="text-indigo-800 font-bold text-center">
                            Event Type Distribution
                        </Typography>
                    </CardHeader>
                    <CardBody className="pt-4">
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={eventTypeData} margin={{ top: 20, right: 30, left: 40, bottom: 60 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#C7D2FE" />
                                    <XAxis 
                                        dataKey="name" 
                                        tick={{ fontSize: 12, fill: '#3730A3' }}
                                        label={{ 
                                            value: 'Event Types', 
                                            position: 'insideBottom', 
                                            offset: -5,
                                            style: { textAnchor: 'middle', fill: '#3730A3', fontWeight: 'bold' }
                                        }}
                                    />
                                    <YAxis 
                                        tick={{ fontSize: 12, fill: '#3730A3' }}
                                        label={{ 
                                            value: 'Number of Judges', 
                                            angle: -90, 
                                            position: 'insideLeft',
                                            style: { textAnchor: 'middle', fill: '#3730A3', fontWeight: 'bold' }
                                        }}
                                    />
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: 'white', 
                                            border: '1px solid #A5B4FC',
                                            borderRadius: '8px'
                                        }}
                                        formatter={(value, name) => [value, 'Number of Judges']}
                                        labelFormatter={(label) => `Event Type: ${label}`}
                                    />
                                    <Bar 
                                        dataKey="value" 
                                        fill="#6366F1" 
                                        radius={[4, 4, 0, 0]}
                                        animationBegin={1000}
                                        animationDuration={1500}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardBody>
                </Card>

                {/* Experience vs Times Judged Scatter Plot */}
                <Card className="bg-white border border-yellow-200 rounded-xl shadow-lg lg:col-span-2">
                    <CardHeader className="pb-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-t-xl border-b border-yellow-200">
                        <Typography variant="h5" className="text-yellow-800 font-bold text-center">
                            Judge Experience vs Judging Frequency Analysis
                        </Typography>
                        <Typography className="text-yellow-600 text-sm text-center mt-2">
                            Correlation between years of experience and number of times judged
                        </Typography>
                    </CardHeader>
                    <CardBody className="pt-4">
                        <div className="h-96">
                            <ResponsiveContainer width="100%" height="100%">
                                <ScatterChart margin={{ top: 20, right: 30, bottom: 60, left: 60 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#FDE68A" />
                                    <XAxis 
                                        type="number" 
                                        dataKey="yearsjudged" 
                                        name="Years of Experience"
                                        tick={{ fontSize: 12, fill: '#92400E' }}
                                        label={{ 
                                            value: 'Years of Judging Experience', 
                                            position: 'insideBottom', 
                                            offset: -10, 
                                            style: { textAnchor: 'middle', fill: '#92400E', fontWeight: 'bold' } 
                                        }}
                                    />
                                    <YAxis 
                                        type="number" 
                                        dataKey="timesjudged" 
                                        name="Number of Times Judged"
                                        tick={{ fontSize: 12, fill: '#92400E' }}
                                        label={{ 
                                            value: 'Total Times Judged', 
                                            angle: -90, 
                                            position: 'insideLeft', 
                                            style: { textAnchor: 'middle', fill: '#92400E', fontWeight: 'bold' } 
                                        }}
                                    />
                                    <Tooltip 
                                        cursor={{ strokeDasharray: '3 3' }}
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                const data = payload[0].payload;
                                                return (
                                                    <div className="bg-white p-4 border border-yellow-300 rounded-lg shadow-lg">
                                                        <p className="text-yellow-800 font-bold text-lg">{data.name}</p>
                                                        <p className="text-yellow-600 font-semibold">{`Experience: ${data.yearsjudged} years`}</p>
                                                        <p className="text-yellow-600 font-semibold">{`Times Judged: ${data.timesjudged}`}</p>
                                                        <p className="text-yellow-600">{`Qualification: ${data.qualification}`}</p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Scatter 
                                        data={experienceVsTimesData} 
                                        fill="#F59E0B"
                                        animationBegin={1200}
                                        animationDuration={2000}
                                    />
                                </ScatterChart>
                            </ResponsiveContainer>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default JudgeStats;