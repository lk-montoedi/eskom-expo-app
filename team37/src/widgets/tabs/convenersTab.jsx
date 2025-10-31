import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
  Card,
  CardBody,
  Typography,
  Button,
  IconButton,
  Input,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Select,
  Option,
} from "@material-tailwind/react";
import { TrashIcon, PencilIcon, PlusIcon } from "@heroicons/react/24/outline";

const API_BASE = "/api/conveners";

const CATEGORIES = [
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

export default function ConvenersTab({ eventid }) {
  const [convenersByCategory, setConvenersByCategory] = useState({});
  const [openCategory, setOpenCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [judges, setJudges] = useState([]);
  const [dialogData, setDialogData] = useState({ open: false });

  // Fetch conveners
  useEffect(() => {
    fetchConveners();
    fetchJudges();
  }, [eventid]);

  const fetchConveners = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/event/${eventid}`);
      const data = await res.json();
      setConvenersByCategory(data); // Expecting format { category1: [judges], ... }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchJudges = async () => {
    try {
      const res = await fetch(`/api/judges/event/${eventid}`);
      const data = await res.json();
      setJudges(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAccordionToggle = (category) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  const handleRemove = async (userid, category) => {
    try {
      await fetch(`${API_BASE}/remove`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventid, userid, category }),
      });
      fetchConveners();
    } catch (err) {
      alert("Failed to remove convener");
    }
  };

  const handleUpdate = (category, oldJudgeId) => {
    setDialogData({
      open: true,
      type: "update",
      category,
      oldJudgeId,
    });
  };

  const handleAdd = (category) => {
    setDialogData({
      open: true,
      type: "add",
      category,
    });
  };

  const handleDialogClose = () => setDialogData({ open: false });

  const handleDialogSubmit = async () => {
    const { type, newJudgeId, oldJudgeId, category } = dialogData;
    if (!newJudgeId) return;

    const endpoint = type === "update" ? "update" : "add";
    const payload =
      type === "update"
        ? { eventid, oldjudgeid: oldJudgeId, newjudgeid: newJudgeId, category }
        : { eventid, judgeid: newJudgeId, category };

    try {
      await fetch(`${API_BASE}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      handleDialogClose();
      fetchConveners();
    } catch (err) {
      alert("Failed to update/add convener");
    }
  };

  return (
    <div className="space-y-4">
      {loading ? (
        <Typography>Loading conveners...</Typography>
      ) : (
        CATEGORIES.map((category) => (
          <Accordion
            key={category}
            open={openCategory === category}
            icon={<PlusIcon className="h-5 w-5" />}
          >
            <AccordionHeader onClick={() => handleAccordionToggle(category)}>
              {category}
            </AccordionHeader>
            <AccordionBody>
              <Card className="mb-4">
                <CardBody>
                  <div className="flex justify-between items-center mb-4">
                    <Typography variant="h6">
                      {convenersByCategory[category]?.length || 0} conveners
                    </Typography>
                    <Button
                      color="green"
                      size="sm"
                      onClick={() => handleAdd(category)}
                    >
                      + Add
                    </Button>
                  </div>
                  <ul className="space-y-2">
                    {(convenersByCategory[category] || []).map((convener) => (
                      <li
                        key={convener.userid}
                        className="flex justify-between items-center p-2 bg-blue-50 rounded-md"
                      >
                        <div>
                          <Typography className="font-semibold">
                            {convener.firstname} {convener.lastname}
                          </Typography>
                          <Typography variant="small" color="gray">
                            {convener.email}
                          </Typography>
                        </div>
                        <div className="flex gap-2">
                          <IconButton
                            variant="text"
                            color="blue"
                            onClick={() =>
                              handleUpdate(category, convener.userid)
                            }
                          >
                            <PencilIcon className="h-5 w-5" />
                          </IconButton>
                          <IconButton
                            variant="text"
                            color="red"
                            onClick={() =>
                              handleRemove(convener.userid, category)
                            }
                          >
                            <TrashIcon className="h-5 w-5" />
                          </IconButton>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardBody>
              </Card>
            </AccordionBody>
          </Accordion>
        ))
      )}

      {/* Dialog for Add/Update */}
      <Dialog open={dialogData.open} handler={handleDialogClose}>
        <DialogHeader>
          {dialogData.type === "update" ? "Update Convener" : "Add Convener"}
        </DialogHeader>
        <DialogBody>
          <Select
            label="Select Judge"
            onChange={(val) => setDialogData({ ...dialogData, newJudgeId: val })}
          >
            {judges.map((j) => (
              <Option key={j.userid} value={j.userid}>
                {j.firstname} {j.lastname} ({j.email})
              </Option>
            ))}
          </Select>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" onClick={handleDialogClose}>
            Cancel
          </Button>
          <Button color="blue" onClick={handleDialogSubmit}>
            Confirm
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
