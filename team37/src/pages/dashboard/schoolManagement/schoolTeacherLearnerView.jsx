import React, { useEffect, useState } from "react";
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
import { Link, useLocation } from "react-router-dom";
import { DashboardNavbar } from "@/widgets/layout";

const SchoolTeacherLearnerView = () => {
  const { state } = useLocation();
  const learner = state?.learner;

  const userName = localStorage.getItem("userName");
  const userRole = localStorage.getItem("userRole");

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editProject, setEditProject] = useState(null);

  if (!learner) {
    return (
      <div className="text-center mt-10 text-red-600">
        No learner data provided.
      </div>
    );
  }

  const fetchLearnerProjects = async (userId) => {
    try {
      const response = await fetch(`/api/projects/learner/project/${userId}`);
      const data = await response.json();

      if (response.ok) {
        setProjects(data.projects);
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
    if (learner?.userid) {
      fetchLearnerProjects(learner.userid);
    }
  }, [learner?.userid]);

  const handleEditClick = (project) => {
    setEditProject(project);
    setOpen(true);
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(
        `/api/projects/update/${editProject.projectid}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editProject),
        }
      );

      if (response.ok) {
        setOpen(false);
        fetchLearnerProjects(learner.userid);
      } else {
        const error = await response.json();
        console.error("Failed to update project:", error.message);
      }
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const handleChange = (field, value) => {
    setEditProject((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-white text-blue-900">
      <div className="m-4">
        <DashboardNavbar name={userName} role={userRole}/>
      </div>

      <main className="container mx-auto px-4 py-6">
        <div className="bg-white border border-blue-100 rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Learner Overview</h2>
          <div className="flex items-start gap-6">
            <img
              src={learner.profilepicture || "/default-avatar.png"}
              alt={learner.name}
              className="w-32 h-32 rounded-full border border-blue-300 object-cover"
            />
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{learner.name}</h3>
              <p><span className="font-medium">Email:</span> {learner.email}</p>
              
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="p-6 space-y-6 bg-white border border-blue-100 rounded-xl shadow-md">
          <div className="flex justify-between items-center">
            <Input
              type="text"
              placeholder="Search Projects by ID, Creator..."
              className="max-w-md border-blue-400 focus:border-blue-600"
            />
            <Link to="/learner/projects/addProject">
              <Button className="bg-blue-600 hover:bg-blue-700">
                + Create Project
              </Button>
            </Link>
          </div>

          <Card className="p-6 border border-blue-100 shadow-blue-100">
            <h2 className="text-lg font-semibold text-blue-700 mb-2">
              Projects for 2025
            </h2>
            <p className="text-sm text-blue-500 mb-4">
              Showing {projects.length} project
              {projects.length !== 1 && "s"}
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="text-sm text-blue-500 border-b border-blue-100">
                  <tr>
                    <th className="py-2">ID</th>
                    <th className="py-2">Stand Number</th>
                    <th className="py-2">Learner ID</th>
                    <th className="py-2">Project Status</th>
                    <th className="py-2">Registered Time</th>
                    <th className="py-2">Category</th>
                    <th className="py-2">Badge</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="text-center py-10">
                        Loading...
                      </td>
                    </tr>
                  ) : projects.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-10 text-blue-500">
                        <div className="flex flex-col items-center">
                          <FolderIcon className="w-10 h-10 mb-3" />
                          <p className="font-medium">No projects found for 2025</p>
                          <p className="text-sm">
                            No projects have been created for this year yet.
                          </p>
                          <Link to="/learner/projects/addProject">
                            <Button className="mt-4 bg-blue-600">
                              + Create First Project
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    projects.map((project) => (
                      <tr key={project.projectid} className="border-b text-sm">
                        <td className="py-2">{project.projectid}</td>
                        <td className="py-2">{project.standnumber || "—"}</td>
                        <td className="py-2">{project.learnerid}</td>
                        <td className="py-2">{project.status}</td>
                        <td className="py-2">{project.timeregistered}</td>
                        <td className="py-2">{project.category}</td>
                        <td className="py-2">{project.badge || "—"}</td>
                        <td className="py-2">
                          <Button
                            className="bg-black text-white"
                            size="sm"
                            variant="outlined"
                            onClick={() => handleEditClick(project)}
                          >
                            Edit
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>

      {/* Edit Project Dialog */}
      <Dialog open={open} handler={() => setOpen(false)}>
        <DialogHeader>Edit Project</DialogHeader>
        <DialogBody>
          {editProject && (
            <div className="space-y-4">
              <Input
                label="Project Title"
                value={editProject.projectname || ""}
                onChange={(e) => handleChange("projectname", e.target.value)}
              />
              <Input
                label="Category"
                value={editProject.category || ""}
                onChange={(e) => handleChange("category", e.target.value)}
              />
            </div>
          )}
        </DialogBody>
        <DialogFooter>
          <Button variant="text" onClick={() => setOpen(false)} className="mr-1">
            Cancel
          </Button>
          <Button className="bg-blue-600" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default SchoolTeacherLearnerView;
