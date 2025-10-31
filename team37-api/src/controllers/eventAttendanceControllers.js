import { sql } from "../config/db.js";

// Mark a user as attended for an event
export const attendEvent = async (req, res) => {
  const { eventId, userId } = req.body;
  if (!eventId || !userId) {
    return res.status(400).json({ message: "eventId and userId are required" });
  }
  try {
    // Upsert attendance (insert or update if exists)
    const result = await sql`
      INSERT INTO userEvents (eventId, userId, attended)
      VALUES (${eventId}, ${userId}, true)
      ON CONFLICT (eventId, userId)
      DO UPDATE SET attended = true
      RETURNING *
    `;
    
    // Increment numEventJudged in judges table for this user
    await sql`
      UPDATE judges
      SET timesjudged = timesjudged + 1
      WHERE userId = ${userId}
    `;

    res
      .status(200)
      .json({ message: "Attendance marked", attendance: result[0] });
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ message: "Failed to mark attendance." });
  }
};

// Get all attendees for an event and return their categories, names, and emails
export const getEventAttendees = async (req, res) => {
  const { eventId } = req.params;
  try {
    const attendees = await sql`
      SELECT * FROM userevents WHERE eventid = ${eventId} AND attended = true
    `;
    console.log(
      `[EventAttendanceController] getEventAttendees called for eventId: ${eventId}`
    );
    console.log("Attendees:", attendees);
    res.status(200).json(attendees);
  } catch (error) {
    console.error("Error fetching attendees:", error);
    res.status(500).json({ message: "Failed to fetch attendees." });
  }
};
