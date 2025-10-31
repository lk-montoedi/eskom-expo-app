import React, { useEffect, useState } from 'react';
import { ArrowLeft, FileText, Upload, Zap, User, School, Beaker, Trash2 } from 'lucide-react';

function ProjectManagementCard({ event, onClose }) {
  const [learnerId, setLearnerId] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [eventId, setEventId] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  const [schoolName, setSchoolName] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [projectCategory, setProjectCategory] = useState('');
  const [description, setDescription] = useState('');
  const [electricityRequired, setElectricityRequired] = useState(null);
  const [supportingDocument, setSupportingDocument] = useState(null);
  const [profile, setProfile] = useState(null);

  const [documentLoading, setDocumentLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [initialProjectData, setInitialProjectData] = useState(null);

  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const uploadToSupabase = async (base64, fileNamePrefix) => {
    try {
      const response = await fetch("/api/upload-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ base64, fileNamePrefix }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data.publicUrl;
    } catch (err) {
      console.error("Supabase upload failed:", err);
      alert("Failed to upload document.");
      return null;
    }
  };

  const handleDocumentUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setDocumentLoading(true);
      try {
        const base64 = await toBase64(file);
        const publicUrl = await uploadToSupabase(base64, "project-documents");
        if (publicUrl) setSupportingDocument(publicUrl);
      } catch (err) {
        console.error("Error uploading project document:", err);
      } finally {
        setDocumentLoading(false);
      }
    }
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    
    const payload = {
      schoolid: schoolId,
      learnerid: learnerId,
      projectname: projectTitle,
      description,
      supportingdocument: supportingDocument,
      category: projectCategory,
      status: "Not Judged",
      badge: "none",
      ethicalstatus: electricityRequired ? "yes" : "no",
      timeregistered: new Date().toISOString().split("T")[1].split(".")[0],
      eventid: eventId,
    };

    try {
      const { projectId } = event || {};
      let response;
      if (projectId) {
        response = await fetch(`/api/projects/update/project/${projectId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
      } else {
        response = await fetch("/api/projects/create/project", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
      }

      const result = await response.json();

      if (!response.ok) throw new Error(result.message);

      await fetch("/api/email/send-project-registration-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: profile.email,
          projectData: payload,
        }),
      });

      triggerConfetti();
      alert("Project submitted successfully!");
      window.location.reload();
    } catch (err) {
      console.error("Project submission error:", err);
      alert("Error submitting project.");
    } finally {
      setSubmitLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { eventId, projectId } = event || {};
        if (!eventId) {
            alert("No event specified.");
            onClose();
            return;
        }
        setEventId(eventId);

        const loggedInUserId = localStorage.getItem("userId");
        if (!loggedInUserId) return alert("Please log in first");
        
        const resUser = await fetch(`/api/user/get/userProfile/${loggedInUserId}`);
        const { profile } = await resUser.json();
        setProfile(profile)

        const targetUserId =
          profile.role === "teacher"
            ? localStorage.getItem("learnerId")
            : loggedInUserId;

        if (!targetUserId) return alert("Learner not selected or user ID missing");

        const resLearner = await fetch(`/api/learners/get/user/${targetUserId}`);
        const data = await resLearner.json();

        if (!resLearner.ok) {
          throw new Error(data.message || "Failed to fetch data.");
        }

        setSchoolName(data.schoolname);
        setLearnerId(data.learnerid);
        setSchoolId(data.schoolid);

        if (projectId) {
          const resProject = await fetch(`/api/projects/get-for-edit/${projectId}`);
          if (resProject.ok) {
            const projectData = await resProject.json();
            setProjectTitle(projectData.projectname);
            setProjectCategory(projectData.category);
            setDescription(projectData.description);
            setElectricityRequired(projectData.ethicalstatus === 'yes');
            setSupportingDocument(projectData.supportingdocument);
            setInitialProjectData(projectData);
          } else {
            console.error("Failed to load project data.");
          }
        }

      } catch (err) {
        console.error("Failed to fetch user data:", err);
        alert("Unable to fetch user details.");
      }
    };

    fetchUserData();
  }, [event, onClose]);

  const isDirty = () => {
    if (!initialProjectData) {
      return true; // Always enabled for new projects
    }
    return (
      projectTitle !== initialProjectData.projectname ||
      projectCategory !== initialProjectData.category ||
      description !== initialProjectData.description ||
      electricityRequired !== (initialProjectData.ethicalstatus === 'yes') ||
      supportingDocument !== initialProjectData.supportingdocument
    );
  };

  return (
    <>
      {/*<ScienceConfetti isActive={showConfetti} onComplete={() => setShowConfetti(false)} />*/}
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-indigo-200/40 shadow-xl shadow-indigo-100/30 mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm border border-white/20">
                    <Beaker className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      Project Submission
                    </h3>
                    <p className="text-blue-100 text-sm font-medium">
                      Project by: TT TE | Progress: No Submission Made
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="bg-white/20 hover:bg-white/30 p-3 rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/20 hover:border-white/30 flex items-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Go Back
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-indigo-100 shadow-2xl shadow-indigo-100/40 rounded-2xl overflow-hidden">
            <form onSubmit={handleProjectSubmit} className="p-8 space-y-8">
              
              <div className="flex items-center gap-3 pb-4 border-b border-indigo-100">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-xl">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-indigo-900">Project Information</h4>
                  <p className="text-indigo-600 text-sm font-medium">Basic project details</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-xl border border-indigo-200/40">
                  <label className="block text-sm font-semibold text-indigo-700 mb-2">Project System ID</label>
                  <div className="bg-white/70 backdrop-blur-sm border border-indigo-200 rounded-xl px-4 py-3 text-indigo-900 font-bold">
                    {event?.projectId || 'N/A'}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-xl border border-indigo-200/40">
                  <label className="block text-sm font-semibold text-indigo-700 mb-2 flex items-center gap-2">
                    <School size={16} />
                    School
                  </label>
                  <select 
                    disabled 
                    value={schoolName} 
                    className="w-full bg-white/70 backdrop-blur-sm border border-indigo-200 rounded-xl px-4 py-3 text-indigo-900 font-medium"
                  >
                    <option value="schoolName">{schoolName}</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-8 pb-4 border-b border-indigo-100">
                <div className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-emerald-700 p-3 rounded-xl">
                  <Beaker className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-indigo-900">Project Step I</h4>
                  <p className="text-indigo-600 text-sm font-medium">Define your research project</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-200/40">
                  <label className="block text-sm font-semibold text-indigo-700 mb-3">Project Title</label>
                  <input
                    type="text"
                    placeholder="Enter your project title"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    className="w-full bg-white/80 backdrop-blur-sm border border-indigo-200 rounded-xl px-4 py-3 text-indigo-900 placeholder-indigo-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-200/40">
                  <label className="block text-sm font-semibold text-indigo-700 mb-3">Project Category</label>
                  <select
                    value={projectCategory}
                    onChange={(e) => setProjectCategory(e.target.value)}
                    className="w-full bg-white/80 backdrop-blur-sm border border-indigo-200 rounded-xl px-4 py-3 text-indigo-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    size="1"
                    style={{ maxHeight: '200px', overflowY: 'auto' }}
                  >
                    <option value="">Select category</option>
                    <option value="agricultural sciences" className="text-indigo-800 py-2">Agricultural Sciences</option>
                    <option value="animal sciences" className="text-indigo-800 py-2">Animal Sciences</option>
                    <option value="biomedical and medical sciences" className="text-indigo-800 py-2">Biomedical And Medical Sciences</option>
                    <option value="chemistry and biochemistry" className="text-indigo-800 py-2">Chemistry and Biochemistry</option>
                    <option value="computer sciences" className="text-indigo-800 py-2">Computer Sciences</option>
                    <option value="earth sciences" className="text-indigo-800 py-2">Earth Sciences</option>
                    <option value="energy" className="text-indigo-800 py-2">Energy</option>
                    <option value="engineering" className="text-indigo-800 py-2">Engineering</option>
                    <option value="environmental studies" className="text-indigo-800 py-2">Environmental Studies</option>
                    <option value="mathematics" className="text-indigo-800 py-2">Mathematics</option>
                    <option value="plant sciences" className="text-indigo-800 py-2">Plant Sciences</option>
                    <option value="physics, astronomy & space science" className="text-indigo-800 py-2">Physics</option>
                    <option value="social sciences" className="text-indigo-800 py-2">Social Sciences</option>
                  </select>
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-200/40">
                  <label className="block text-sm font-semibold text-indigo-700 mb-3">Project Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-white/80 backdrop-blur-sm border border-indigo-200 rounded-xl px-4 py-3 text-indigo-900 placeholder-indigo-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
                    placeholder="Describe your project in detail..."
                    rows={4}
                  />
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-200/40">
                  <label className="block text-sm font-semibold text-indigo-700 mb-4 flex items-center gap-2">
                    <Zap size={16} />
                    Does the project need electricity?
                  </label>
                  <div className="flex items-center space-x-6">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="electricity"
                        value="yes"
                        checked={electricityRequired === true}
                        onChange={() => setElectricityRequired(true)}
                        className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-indigo-800 font-medium">Yes</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="electricity"
                        value="no"
                        checked={electricityRequired === false}
                        onChange={() => setElectricityRequired(false)}
                        className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-indigo-800 font-medium">No</span>
                    </label>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-200/40">
                  <label className="block text-sm font-semibold text-indigo-700 mb-4 flex items-center gap-2">
                    <Upload size={16} />
                    Submit your research plan (PDF only)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleDocumentUpload}
                      disabled={documentLoading}
                      className="block w-full text-sm text-indigo-700 bg-white/80 backdrop-blur-sm border border-indigo-200 rounded-xl p-3 
                                file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold 
                                file:bg-gradient-to-r file:from-blue-500 file:to-indigo-500 file:text-white 
                                hover:file:from-blue-600 hover:file:to-indigo-600 file:transition-all file:duration-200
                                disabled:opacity-50"
                    />
                    {documentLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/50">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                        </div>
                    )}
                    {supportingDocument && !documentLoading && (
                      <div className="mt-3 flex items-center gap-2 text-green-600">
                        <div className="bg-green-100 p-1 rounded-full">
                          <FileText size={16} className="text-green-600" />
                        </div>
                        <p className="text-sm font-semibold">Document uploaded successfully</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end items-center gap-4 pt-6 border-t border-indigo-100">
                {event?.projectId && (
                  <button
                    type="button"
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-bold text-lg flex items-center gap-3"
                  >
                    <Trash2 size={20} />
                    Delete Project
                  </button>
                )}
                <button
                  type="submit"
                  disabled={submitLoading || (event?.projectId && !isDirty())}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl font-bold text-lg flex items-center gap-3 disabled:opacity-75"
                >
                  {submitLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Beaker size={20} />
                      {event?.projectId ? "Submit Changes" : "Launch Project"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProjectManagementCard;
