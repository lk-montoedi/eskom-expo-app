import { sql } from "../config/db.js";

export const getLearnersFromSchool = async (req, res) => {
  const { id } = req.params;
  try {
    // Get the teacher's school ID
    const teacherSchoolId = await sql`
    SELECT schoolid FROM teachers WHERE userid = ${id}`;

    if (!teacherSchoolId || teacherSchoolId.length === 0) {
      return res.status(404).json({ error: `Teacher is not found ${id}` });
    }
     

    const schoolId = teacherSchoolId[0].schoolid;
    // Getting learners from the same school
    const learners = await sql`
    SELECT 
      learners.userid,
      users.name,
      users.surname,
      users.email,
      users.gender,
      users.race,
      users.birthdate,
      users.profilePicture,
      learners.grade,
      learners.disability,
      learners.disabilityinfo,
      learners.schoolid
    FROM learners
    JOIN users ON learners.userid = users.userid
    WHERE learners.schoolid = ${schoolId}
  `;

    res.json({ learners }); // <- return it in an object if frontend expects .learners
  } catch (error) {
    console.error("Error fetching learners by teacher:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const attendEvent = async (req, res) => {
  const { teacherId } = req.params;


  const { eventId } = req.body; // <-- Add this line to get eventId from the request body

  if (!eventId) {
    return res
      .status(400)
      .json({ message: "Missing eventId in request body." });
  }


  try {
    // Check if the user is a teacher
    const teacherCheck = await sql`
      SELECT * FROM teachers WHERE userid = ${teacherId}
    `;

    if (teacherCheck.length === 0) {
      return res.status(403).json({ message: "User is not a teacher." });
    }

    const schoolId = teacherCheck[0].schoolid;
    const learners = await sql`
      SELECT * FROM learners WHERE schoolid = ${schoolId}
    `;
    // Insert the attendance record
    await sql`
      INSERT INTO userevents (eventid, userid, attended)
      VALUES (${eventId}, ${teacherId}, false)
    `;

    if (learners.length === 0) {
      return res
        .status(200)
        .json({ message: "No learners found for this teacher." });
    }

    for (const learner of learners) {
      await sql`
        INSERT INTO userevents (eventid, userid, attended)
        VALUES (${eventId}, ${learner.userid}, false)
      `;
    }

    res.status(200).json({ message: "Attendance recorded successfully." });
  } catch (error) {
    console.error("Error recording attendance:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
