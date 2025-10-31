import { useEffect, useState } from "react";

export default function SchoolSelect({ level, ownership, value, onChange }) {
  const [schools, setSchools] = useState([]);
  const [newSchool, setNewSchool] = useState("");

  useEffect(() => {
    if (level && ownership) {
      fetch(`/api/schools?level=${level}&ownership=${ownership}`)
        .then(res => res.json())
        .then(data => {
          const schoolNames = new Map(data.map(s => [s.schoolname, s]));
          const uniqueSchools = Array.from(schoolNames.values());
          setSchools(uniqueSchools);
        })
        .catch(err => console.error("Failed to load schools:", err));
    }
  }, [level, ownership]);
  console.log("Here are the schools", schools);

  return (
    <div>
      <label className="text-blue-900 font-medium block mb-2">
        School Name*
      </label>
      {schools.length > 0 && (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-3 border border-blue-200 rounded-lg"
        >
          <option value="">Select a school</option>
          {schools.map((s) => (
            <option key={s.schoolid} value={s.schoolname}>
              {s.schoolname}
            </option>
          ))}
          <option value="other">Other (Not listed)</option>
        </select>
      )}

      {value === "other" && (
        <input
          type="text"
          value={newSchool}
          onChange={(e) => {
            setNewSchool(e.target.value);
            onChange(e.target.value);
          }}
          placeholder="Enter your school name"
          className="mt-2 w-full p-3 border border-blue-200 rounded-lg"
        />
      )}
    </div>
  );
}
