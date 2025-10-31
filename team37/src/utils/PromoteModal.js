import React from "react";
import { X } from "lucide-react";
import { Spinner } from "./ProjectsPage"; // Assuming Spinner is exported from your projects page

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

export default PromoteModal;