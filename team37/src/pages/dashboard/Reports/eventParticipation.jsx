import React, { useState, useEffect, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

// Enhanced Card Components with animations
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
    h5: "text-xl"
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
      className={`w-full p-3 border-2 border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all hover:border-blue-400 font-semibold text-blue-700 ${className}`}
    >
      {children}
    </select>
    <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-blue-700 font-bold">{label}</label>
  </div>
);

const Option = ({ children, value }) => (
  <option value={value}>{children}</option>
);

// Enhanced spinner with pulsing effect
const Spinner = () => (
  <div className="relative">
    <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-blue-600 mx-auto"></div>
    <div className="animate-ping absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-600 rounded-full"></div>
  </div>
);

// Gender Balance Scale Component
const GenderBalance = ({ maleCount, femaleCount, totalCount }) => {
  const malePercentage = totalCount > 0 ? (maleCount / totalCount) * 100 : 50;
  const femalePercentage = totalCount > 0 ? (femaleCount / totalCount) * 100 : 50;
  
  // Calculate tilt angle based on difference
  const difference = malePercentage - femalePercentage;
  const tiltAngle = Math.max(-15, Math.min(15, difference * 0.3));
  
  return (
    <div className="flex flex-col items-center justify-center h-80 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
      {/* Scale Base */}
      <div className="relative">
        {/* Fulcrum */}
        <div className="w-4 h-16 bg-gradient-to-b from-gray-600 to-gray-800 rounded-t-lg mx-auto mb-2 shadow-lg"></div>
        
        {/* Balance Beam */}
        <div 
          className="w-64 h-4 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full relative transition-transform duration-1000 ease-out shadow-lg"
          style={{ transform: `rotate(${tiltAngle}deg)` }}
        >
          {/* Male Side (Left) */}
          <div className="absolute -left-2 -top-8 flex flex-col items-center">
            <div 
              className="w-16 h-12 bg-gradient-to-b from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg transform transition-all duration-1000"
              style={{ 
                transform: `translateY(${(femalePercentage - 50) * 0.1}px)`,
                animation: 'bounce 2s infinite'
              }}
            >
              <div className="text-white font-bold text-xs">♂</div>
            </div>
            <div className="mt-2 text-center">
              <div className="text-blue-700 font-bold text-lg">{maleCount}</div>
              <div className="text-blue-600 text-sm">{malePercentage.toFixed(1)}%</div>
              <div className="text-blue-800 font-medium text-sm">Male</div>
            </div>
          </div>
          
          {/* Female Side (Right) */}
          <div className="absolute -right-2 -top-8 flex flex-col items-center">
            <div 
              className="w-16 h-12 bg-gradient-to-b from-pink-400 to-pink-600 rounded-lg flex items-center justify-center shadow-lg transform transition-all duration-1000"
              style={{ 
                transform: `translateY(${(malePercentage - 50) * 0.1}px)`,
                animation: 'bounce 2s infinite 0.5s'
              }}
            >
              <div className="text-white font-bold text-xs">♀</div>
            </div>
            <div className="mt-2 text-center">
              <div className="text-pink-700 font-bold text-lg">{femaleCount}</div>
              <div className="text-pink-600 text-sm">{femalePercentage.toFixed(1)}%</div>
              <div className="text-pink-800 font-medium text-sm">Female</div>
            </div>
          </div>
          
          {/* Center Point */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gray-800 rounded-full shadow-md"></div>
        </div>
        
        {/* Balance Status */}
        <div className="text-center mt-6">
          <div className="text-gray-700 font-semibold">
            {Math.abs(difference) < 5 ? "⚖️ Balanced" : 
             malePercentage > femalePercentage ? "↗️ Male Dominant" : "↖️ Female Dominant"}
          </div>
          <div className="text-gray-600 text-sm mt-1">
            Difference: {Math.abs(difference).toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Disability Visualization
const DisabilityVisualization = ({ disabilityData }) => {
  const hasDisability = disabilityData.find(d => d.name === 'Has Disability')?.value || 0;
  const noDisability = disabilityData.find(d => d.name === 'No Disability')?.value || 0;
  const total = hasDisability + noDisability;
  
  const disabilityPercentage = total > 0 ? (hasDisability / total) * 100 : 0;
  
  return (
    <div className="h-80 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 flex flex-col items-center justify-center">
      {/* Accessibility Symbol with Animation */}
      <div className="relative mb-6">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
          {/* Wheelchair Symbol */}
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-600 rounded-full relative">
              {/* Wheel */}
              <div className="absolute inset-2 border-2 border-blue-400 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
              {/* Spokes */}
              <div className="absolute top-1/2 left-1/2 w-4 h-0.5 bg-blue-500 transform -translate-x-1/2 -translate-y-1/2 rotate-0"></div>
              <div className="absolute top-1/2 left-1/2 w-4 h-0.5 bg-blue-500 transform -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
              <div className="absolute top-1/2 left-1/2 w-4 h-0.5 bg-blue-500 transform -translate-x-1/2 -translate-y-1/2 rotate-90"></div>
              <div className="absolute top-1/2 left-1/2 w-4 h-0.5 bg-blue-500 transform -translate-x-1/2 -translate-y-1/2 rotate-135"></div>
            </div>
            {/* Backrest */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-8 h-8 border-4 border-blue-600 rounded-t-full border-b-0"></div>
            {/* Armrest */}
            <div className="absolute -top-4 -left-2 w-6 h-2 bg-blue-600 rounded-full"></div>
          </div>
        </div>
      </div>
      
      {/* Statistics Display */}
      <div className="grid grid-cols-2 gap-6 w-full max-w-md">
        <div className="text-center bg-white rounded-lg p-4 shadow-md transform hover:scale-105 transition-transform duration-300">
          <div className="text-green-600 text-2xl font-bold animate-pulse">{hasDisability}</div>
          <div className="text-green-700 font-semibold">With Disability</div>
          <div className="text-green-600 text-sm">{disabilityPercentage.toFixed(1)}%</div>
        </div>
        <div className="text-center bg-white rounded-lg p-4 shadow-md transform hover:scale-105 transition-transform duration-300">
          <div className="text-blue-600 text-2xl font-bold animate-pulse" style={{ animationDelay: '0.5s' }}>{noDisability}</div>
          <div className="text-blue-700 font-semibold">No Disability</div>
          <div className="text-blue-600 text-sm">{(100 - disabilityPercentage).toFixed(1)}%</div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full max-w-md mt-6">
        <div className="bg-gray-200 rounded-full h-4 shadow-inner">
          <div 
            className="bg-gradient-to-r from-green-500 to-emerald-600 h-4 rounded-full transition-all duration-2000 ease-out shadow-sm"
            style={{ width: `${disabilityPercentage}%`, animationDelay: '1s' }}
          ></div>
        </div>
        <div className="text-center mt-2 text-gray-700 font-medium">
          Accessibility Representation
        </div>
      </div>
    </div>
  );
};

const EventParticipationStats = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    role: "all",
    level: "all",
    province: "all"
  });

  // Enhanced color schemes
  const roleColors = ["#3B82F6", "#6366F1", "#8B5CF6", "#EC4899"];
  const provinceColors = ["#3B82F6", "#6366F1", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981", "#0EA5E9", "#84CC16"];

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [allUsers, filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/userprofile');
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      console.log("User data: ", data);
      setAllUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setAllUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allUsers];

    if (filters.role !== "all") {
      filtered = filtered.filter(user => user.role?.toLowerCase() === filters.role.toLowerCase());
    }

    if (filters.province !== "all") {
      filtered = filtered.filter(user => user.province?.toLowerCase() === filters.province.toLowerCase());
    }

    if (filters.level !== "all") {
      filtered = filtered.filter(user => {
        if (filters.level === "regional") return user.region;
        if (filters.level === "district") return !user.region;
        if (filters.level === "international") return user.province?.toLowerCase() === "international";
        return true;
      });
    }

    setFilteredUsers(filtered);
  };

  // Memoized statistical data
  const genderData = useMemo(() => {
    if (filteredUsers.length === 0) return [];
    const genderCount = filteredUsers.reduce((acc, user) => {
      const gender = user.gender?.toLowerCase() || "unknown";
      acc[gender] = (acc[gender] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(genderCount).map(([gender, count]) => ({
      name: gender.charAt(0).toUpperCase() + gender.slice(1),
      value: count,
      percentage: ((count / filteredUsers.length) * 100).toFixed(1)
    }));
  }, [filteredUsers]);

  const disabilityData = useMemo(() => {
    if (filteredUsers.length === 0) return [];
    const disabilityCount = filteredUsers.reduce((acc, user) => {
      const hasDisability = user.disability === "yes" || user.disability === true;
      const key = hasDisability ? "Has Disability" : "No Disability";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(disabilityCount).map(([status, count]) => ({
      name: status,
      value: count,
      percentage: ((count / filteredUsers.length) * 100).toFixed(1)
    }));
  }, [filteredUsers]);

  const roleData = useMemo(() => {
    if (filteredUsers.length === 0) return [];
    const roleCount = filteredUsers.reduce((acc, user) => {
      const role = user.role || "Unknown";
      if (role.toLowerCase() !== "admin") {
        acc[role] = (acc[role] || 0) + 1;
      }
      return acc;
    }, {});

    return Object.entries(roleCount).map(([role, count]) => ({
      name: role.charAt(0).toUpperCase() + role.slice(1),
      value: count,
      percentage: ((count / filteredUsers.length) * 100).toFixed(1)
    }));
  }, [filteredUsers]);
  
  const provinceData = useMemo(() => {
    if (filteredUsers.length === 0) return [];
    const provinceCount = filteredUsers.reduce((acc, user) => {
      const province = user.province || "Unknown";
      const formattedProvince = province.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      acc[formattedProvince] = (acc[formattedProvince] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(provinceCount)
      .map(([province, count]) => ({
        name: province,
        value: count
      }))
      .sort((a, b) => b.value - a.value);
  }, [filteredUsers]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-blue-200 rounded-lg shadow-lg transform scale-105 transition-transform">
          <p className="text-blue-800 font-semibold">{`${data.name}: ${data.value}`}</p>
          {data.percentage && (
            <p className="text-blue-600">{`${data.percentage}%`}</p>
          )}
        </div>
      );
    }
    return null;
  };

  // Get gender counts for balance scale
  const getMaleCount = () => genderData.find(g => g.name.toLowerCase() === 'male')?.value || 0;
  const getFemaleCount = () => genderData.find(g => g.name.toLowerCase() === 'female')?.value || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 flex items-center justify-center">
        <div className="text-center">
          <Spinner />
          <Typography className="mt-4 text-blue-600 animate-pulse">Loading participation statistics...</Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12 mb-8 flex flex-col gap-6">
      <style jsx>{`
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
          40%, 43% { transform: translateY(-10px); }
          70% { transform: translateY(-5px); }
          90% { transform: translateY(-2px); }
        }
        .animate-slideInUp { animation: slideInUp 0.8s ease-out forwards; }
      `}</style>

      {/* Header and Filters */}
      <Card className="bg-white border border-indigo-200 rounded-xl shadow-xl animate-slideInUp" delay={100}>
        <CardHeader className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-indigo-200 rounded-t-xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
            <Typography variant="h4" className="text-indigo-800 font-bold flex-grow">
              🧬 Event Participation Statistics
            </Typography>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <div className="w-48">
                <Select
                  label="Filter by Role"
                  value={filters.role}
                  onChange={(value) => setFilters(prev => ({ ...prev, role: value }))}
                  className="bg-white"
                >
                  <Option value="all">All Roles</Option>
                  <Option value="learner">Learner</Option>
                  <Option value="teacher">Teacher</Option>
                  <Option value="judge">Judge</Option>
                </Select>
              </div>
              
              <div className="w-48">
                <Select
                  label="Filter by Province"
                  value={filters.province}
                  onChange={(value) => setFilters(prev => ({ ...prev, province: value }))}
                  className="bg-white"
                 
                >
                  <Option value="all">All Provinces</Option>
                  <Option value="gauteng">Gauteng</Option>
                  <Option value="western cape">Western Cape</Option>
                  <Option value="kwazulu-natal">KwaZulu-Natal</Option>
                  <Option value="eastern cape">Eastern Cape</Option>
                  <Option value="limpopo">Limpopo</Option>
                  <Option value="mpumalanga">Mpumalanga</Option>
                  <Option value="north west">North West</Option>
                  <Option value="northern cape">Northern Cape</Option>
                  <Option value="free state">Free State</Option>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-indigo-300 transform hover:scale-105 transition-transform duration-300">
              <Typography className="text-indigo-700 font-semibold">
                👥 Total Participants: <span className="text-blue-600 font-bold text-lg animate-pulse">{filteredUsers.length}</span>
              </Typography>
            </div>
            <div className="bg-white rounded-lg p-4 border border-purple-300 transform hover:scale-105 transition-transform duration-300">
              <Typography className="text-purple-700 font-semibold">
                📍 Provinces: <span className="text-purple-600 font-bold text-lg animate-pulse">{provinceData.length}</span>
              </Typography>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gender Balance Scale */}
        <Card className="bg-white border border-blue-200 rounded-xl shadow-lg animate-slideInUp" delay={200}>
          <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl border-b border-blue-200">
            <Typography variant="h5" className="text-blue-800 font-bold text-center">
              ⚖️ Gender Distribution Balance
            </Typography>
          </CardHeader>
          <CardBody className="pt-4">
            <GenderBalance 
              maleCount={getMaleCount()} 
              femaleCount={getFemaleCount()} 
              totalCount={filteredUsers.length} 
            />
          </CardBody>
        </Card>

        {/* Enhanced Disability Status */}
        <Card className="bg-white border border-indigo-200 rounded-xl shadow-lg animate-slideInUp" delay={300}>
          <CardHeader className="pb-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-xl border-b border-indigo-200">
            <Typography variant="h5" className="text-indigo-800 font-bold text-center">
              ♿ Accessibility & Inclusion
            </Typography>
          </CardHeader>
          <CardBody className="pt-4">
            <DisabilityVisualization disabilityData={disabilityData} />
          </CardBody>
        </Card>

        {/* Role Distribution with Enhanced Animation */}
        <Card className="bg-white border border-blue-200 rounded-xl shadow-lg animate-slideInUp" delay={400}>
          <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-xl border-b border-blue-200">
            <Typography variant="h5" className="text-blue-800 font-bold text-center">
              👨‍🎓 Role Distribution
            </Typography>
          </CardHeader>
          <CardBody className="pt-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roleData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} (${percentage}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    animationBegin={500}
                    animationDuration={1500}
                  >
                    {roleData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={roleColors[index % roleColors.length]}
                        className="hover:opacity-80 transition-opacity duration-300"
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        {/* Province Distribution with Enhanced Bars */}
        <Card className="bg-white border border-indigo-200 rounded-xl shadow-lg animate-slideInUp" delay={500}>
          <CardHeader className="pb-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-t-xl border-b border-indigo-200">
            <Typography variant="h5" className="text-indigo-800 font-bold text-center">
              🗺️ Province Distribution
            </Typography>
          </CardHeader>
          <CardBody className="pt-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={provinceData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0E7FF" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    tick={{ fontSize: 10, fill: '#4338CA' }}
                    label={{ 
                      value: 'Provinces', 
                      position: 'insideBottom', 
                      offset: -10, 
                      style: { textAnchor: 'middle', fill: '#4338CA', fontSize: '14px', fontWeight: 'bold' } 
                    }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#4338CA' }} 
                    label={{ 
                      value: 'Number of Participants', 
                      angle: -90, 
                      position: 'insideLeft', 
                      style: { textAnchor: 'middle', fill: '#4338CA', fontSize: '14px', fontWeight: 'bold' } 
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #C7D2FE',
                      borderRadius: '8px'
                    }}
                  />
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

export default EventParticipationStats;