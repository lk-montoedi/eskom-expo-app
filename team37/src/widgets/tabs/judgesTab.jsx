import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Typography,
  Spinner,
} from "@material-tailwind/react";

export default function JudgesTab({ eventid }) {
  const [judges, setJudges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJudges();
  }, [eventid]);

  const fetchJudges = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/judges/event/${eventid}`);
      const data = await res.json();
      setJudges(data);
    } catch (err) {
      console.error("Failed to load judges", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mt-4">
      <CardBody>
        {loading ? (
          <div className="flex justify-center py-10">
            <Spinner color="blue" />
          </div>
        ) : judges.length === 0 ? (
          <Typography>No judges assigned to this event.</Typography>
        ) : (
          <ul className="space-y-3">
            {judges.map((judge) => (
              <li
                key={judge.userid}
                className="flex justify-between items-center bg-blue-50 p-3 rounded-lg"
              >
                <div>
                  <Typography className="font-semibold">
                    {judge.firstname} {judge.lastname}
                  </Typography>
                  <Typography variant="small" color="gray">
                    {judge.email}
                  </Typography>
                </div>
                <div className="text-sm text-blue-800 font-medium">
                  Category: {judge.category}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  );
}
