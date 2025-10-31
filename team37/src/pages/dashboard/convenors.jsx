import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Button,
  Select,
  Option,
  Input,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Spinner,
} from "@material-tailwind/react";

export function Convenors({ eventId }) {
  const [conveners, setConveners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [oldJudgeId, setOldJudgeId] = useState("");
  const [newJudgeId, setNewJudgeId] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const categoryList = [
    "agricultural sciences",
    "animal sciences",
    "biomedical and medical sciences",
    "chemistry and biochemistry",
    "computer sciences and software development",
    "earth sciences",
    "energy",
    "engineering",
    "environmental studies",
    "mathematics",
    "plant sciences",
    "physics, astronomy & space sciences",
    "social sciences",
  ];

  useEffect(() => {
    fetchConveners();
  }, []);

  const fetchConveners = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/conveners/${eventId}`);
      const data = await res.json();
      setConveners(data.conveners || []);
      const unique = [...new Set(data.conveners.map((c) => c.category))];
      setCategories(unique);
    } catch (err) {
      console.error("Failed to load conveners", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoAppoint = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/conveners/auto/${eventId}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert("Conveners appointed automatically.");
      fetchConveners();
    } catch (err) {
      alert("Failed to appoint conveners: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`/api/conveners/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventid: eventId,
          oldjudgeid: oldJudgeId,
          newjudgeid: newJudgeId,
          category: selectedCategory,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert("Convener updated.");
      fetchConveners();
      setDialogOpen(false);
    } catch (err) {
      alert("Failed to update convener: " + err.message);
    }
  };

  const handleDelete = async (userId) => {
    try {
      const res = await fetch(`/api/conveners/${eventId}/${userId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert("Convener removed.");
      fetchConveners();
    } catch (err) {
      alert("Failed to delete convener: " + err.message);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <Typography variant="h4">Conveners Management</Typography>
        <Button onClick={handleAutoAppoint}>Auto-Assign Conveners</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner className="h-10 w-10 text-blue-500" />
        </div>
      ) : (
        categories.map((cat) => (
          <Card key={cat} className="p-4 mb-6 shadow-md">
            <div className="flex justify-between items-center mb-4">
              <Typography variant="h6" className="capitalize">{cat}</Typography>
              <Button size="sm" variant="outlined" onClick={() => {
                setSelectedCategory(cat);
                setDialogOpen(true);
              }}>
                Replace Convener
              </Button>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="text-sm text-blue-gray-400 border-b">
                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">User ID</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {conveners
                  .filter((c) => c.category === cat)
                  .map((c) => (
                    <tr key={c.userid} className="text-sm border-b">
                      <td className="p-2">{c.name} {c.surname}</td>
                      <td className="p-2">{c.email}</td>
                      <td className="p-2">{c.userid}</td>
                      <td className="p-2">
                        <Button
                          size="sm"
                          variant="text"
                          color="red"
                          onClick={() => handleDelete(c.userid)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </Card>
        ))
      )}

      {/* Update Dialog */}
      <Dialog open={dialogOpen} handler={setDialogOpen}>
        <DialogHeader>Update Convener for "{selectedCategory}"</DialogHeader>
        <DialogBody className="space-y-4">
          <Input
            label="Old Judge ID"
            value={oldJudgeId}
            onChange={(e) => setOldJudgeId(e.target.value)}
          />
          <Input
            label="New Judge ID"
            value={newJudgeId}
            onChange={(e) => setNewJudgeId(e.target.value)}
          />
        </DialogBody>
        <DialogFooter>
          <Button variant="text" onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpdate}>Update</Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
