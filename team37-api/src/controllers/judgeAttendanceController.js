import { sql } from "../config/db.js";

/**
 * Mark a judge as present when they scan the QR code
 */
export async function checkInJudge(req, res) {
  try {
    const { judgeid, eventid } = req.body;

    if (!judgeid || !eventid) {
      return res
        .status(400)
        .json({ error: "judgeid and eventid are required" });
    }

    const arrivalTime = new Date().toISOString();

    // Check if attendance exists
    const existingResult = await sql.query(
      `SELECT * FROM judgeattendance WHERE judgeid = $1 AND eventid = $2`,
      [judgeid, eventid]
    );

    // Safely get rows (some libraries return array directly)
    const existing = existingResult?.rows || existingResult || [];

    let attendance;

    if (existing.length > 0) {
      //Update existing record
      const updateResult = await sql.query(
        `UPDATE judgeattendance
         SET status = 'present', arrivaltime = $3
         WHERE judgeid = $1 AND eventid = $2
         RETURNING *`,
        [judgeid, eventid, arrivalTime]
      );
      attendance = updateResult?.rows?.[0] || updateResult?.[0];
    } else {
      // Insert new record
      const insertResult = await sql.query(
        `INSERT INTO judgeattendance (judgeid, eventid, status, arrivaltime)
         VALUES ($1, $2, 'present', $3)
         RETURNING *`,
        [judgeid, eventid, arrivalTime]
      );
      attendance = insertResult?.rows?.[0] || insertResult?.[0];
    }

    // add 5 points for checking in
    await sql`
      UPDATE judges
      SET points = points + 5
      WHERE userId = ${judgeid}
    `;

    res.status(201).json({
      message: "Check-in successful",
      attendance,
    });
  } catch (err) {
    console.error("Error checking in judge:", err);
    res.status(500).json({ error: "Failed to check-in judge" });
  }
}
/**
 * Get attendance of a specific judge for an event
 */
export async function getJudgeAttendance(req, res) {
  try {
    const { judgeid, eventid } = req.params;

    if (!judgeid || !eventid) {
      return res
        .status(400)
        .json({ error: "judgeid and eventid are required" });
    }

    const result = await sql.query(
      `SELECT * FROM judgeattendance WHERE judgeid = $1 AND eventid = $2`,
      [judgeid, eventid]
    );

    // Safely get rows (some clients return array directly)
    const rows = result?.rows || result || [];

    if (rows.length === 0) {
      return res.status(404).json({ error: "Attendance not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching judge attendance:", err);
    res.status(500).json({ error: "Failed to fetch judge attendance" });
  }
}
/**
 * Get latest attendance of all judges for an event
 */
export async function getAllAttendance(req, res) {
  try {
    const { eventid } = req.params;

    if (!eventid) {
      return res.status(400).json({ error: "eventid must be a number" });
    }

    const result = await sql.query(
      `SELECT u.userid, u.name, u.surname, u.email, a.status, a.arrivaltime, a.category
       FROM judgeattendance a
       JOIN users u ON a.judgeid = u.userid
       WHERE a.eventid = $1
       ORDER BY u.userid`,
      [eventid]
    );

    const rows = result?.rows || result || [];
    res.json(rows);
  } catch (err) {
    console.error("Error fetching present judges:", err);
    res.status(500).json({ error: "Failed to fetch attendance" });
  }
}

export async function checkIfLate(req, res) {
  try {
    const { judgeid, eventid } = req.params;
    if (!judgeid || !eventid) {
      return res
        .status(400)
        .json({ error: "judgeid and eventid are required" });
    }
    // Get from latejudge table
    const lateResult = await sql`
      SELECT * FROM latejudges WHERE judgeid = ${judgeid} AND eventid = ${eventid}
    `;
    const lateRows = lateResult?.rows || lateResult || [];
    if (lateRows.length === 0) {
      return res.json({ isLate: false });
    } else {
      return res.json({ isLate: true });
    }
  } catch (err) {
    console.error("Error checking if judge is late:", err);
    res.status(500).json({ error: "Failed to check if judge is late" });
  }
}

