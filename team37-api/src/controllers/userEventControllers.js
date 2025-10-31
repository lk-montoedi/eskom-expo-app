import { sql } from "../config/db.js";

// Get the eventId(s) for a given userId
export const getUserEventId = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await sql`
      SELECT eventid
      FROM userEvents
      WHERE userid = ${userId}
    `;

    if (result.length === 0) {
      return res.status(404).json({ message: "No event found for this user" });
    }

    // If user is only part of one event, return the first one
    return res.status(200).json({ eventId: result[0].eventid });
  } catch (err) {
    console.error("Error fetching eventId:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
