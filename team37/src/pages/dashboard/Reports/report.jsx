import React, { useState } from "react";
import EventParticipationStats from "./eventParticipation";
import EventProjectsStats from "./eventProjectsStats";
import ConflictMarksReport from "./eventConflicts";
import JudgeStats from "./eventJudgesStat";
import ISFJudgeStats from "./isfJudges";

function ProjectStats() {
  return (
    <div className="p-6 text-center text-blue-700 font-semibold">
      <EventProjectsStats/>
    </div>
  );
}

function JudgesStats() {
  return (
    <div className="p-6 text-center text-blue-700 font-semibold">
      <JudgeStats/>
    </div>
  );
}

function ISFJudgesStats() {
  return (
    <div className="p-6 text-center text-blue-700 font-semibold">
      <ISFJudgeStats/>
    </div>
  );
}

function MarksStats() {
  return (
    <div className="p-6 text-center text-blue-700 font-semibold">
      <ConflictMarksReport/>
    </div>
  );
}

export function Reports() {
  const [activeTab, setActiveTab] = useState("event");

  const tabs = [
      { id: "event", label: "Event Participant Statistics", icon: "👥" },
    { id: "project", label: "Project Statistics", icon: "📊" },
    { id: "marks", label: "Conflicts Statistics", icon: "⚠️" },
    { id: "judges", label: "Judges Statistics", icon: "👨‍⚖️" },
    { id: "isfjudges", label: "ISF Judges Statistics", icon: "👨‍⚖️" }
  
  ];

  return (
    <div className="w-full bg-gradient-to-br from-blue-50 to-white min-h-screen">
      {/* Header Section */}
      <div className="bg-white border border-indigo-200 rounded-xl shadow-xl mx-6 mt-6">
        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-indigo-200 rounded-t-xl">
          <h1 className="text-indigo-800 font-bold text-2xl text-center">
            Eskom Expo Analytics Dashboard
          </h1>
          <p className="text-indigo-600 text-center mt-2">
            Comprehensive reporting and statistics for events management
          </p>
        </div>
        
        {/* Navigation Bar */}
        <nav className="p-6">
          <div className="flex flex-wrap justify-center gap-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-md
                  ${activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg border-2 border-blue-500"
                    : "bg-gradient-to-r from-white to-blue-50 text-blue-700 border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg"
                  }
                `}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                </div>
              </button>
            ))}
          </div>
          
          {/* Active Tab Indicator */}
          <div className="mt-4 text-center">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-2 rounded-lg border border-blue-200">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse"></div>
              <span className="text-blue-800 font-medium">
                {tabs.find(tab => tab.id === activeTab)?.label}
              </span>
            </div>
          </div>
        </nav>
      </div>

      {/* Content Section */}
      <div className="px-6 pb-6">
        <div className="mt-6 transition-all duration-500 ease-in-out">
          {activeTab === "event" && (
            <div className="animate-fadeIn">
              <EventParticipationStats />
            </div>
          )}
          {activeTab === "project" && (
            <div className="animate-fadeIn">
              <ProjectStats />
            </div>
          )}
          {activeTab === "marks" && (
            <div className="animate-fadeIn">
              <MarksStats />
            </div>
          )}
          {activeTab === "judges" && (
            <div className="animate-fadeIn">
              <JudgesStats />
            </div>
          )}
          {activeTab === "isfjudges" && (
            <div className="animate-fadeIn">
              <ISFJudgesStats />
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}

export default Reports;