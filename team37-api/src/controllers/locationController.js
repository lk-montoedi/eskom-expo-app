import { sql } from "../config/db.js";
import wsServer from "../utils/WebSocketContext.js";

/**
 * Save judge location (REST fallback, e.g. if WS fails)
 */
export async function saveLocation(req, res) {
  try {
    const { judgeid, latitude, longitude, accuracy } = req.body;

    if (!judgeid || !latitude || !longitude) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const timestamp = new Date().toISOString();

    const result = await sql.query(
      `INSERT INTO judgeslocations (judgeid, latitude, longitude, accuracy, timestamp)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [judgeid, latitude, longitude, accuracy, timestamp]
    );

    const locationData = result.rows[0];

    // Store in memory
    wsServer.locations.set(judgeid, locationData);

    // Broadcast to connected conveners + co-judges
    wsServer.broadcast({
      type: "locationUpdate",
      ...locationData,
    });

    res.status(201).json(locationData);
  } catch (err) {
    console.error("Error saving location:", err);
    res.status(500).json({ error: "Failed to save location" });
  }
}

/**
 * Get latest location of one judge
 */
export async function getJudgeLocation(req, res) {
  try {
    const { judgeid } = req.params;

    const result = await sql.query(
      `SELECT * FROM judgeslocations
       WHERE judgeid = $1
       ORDER BY timestamp DESC
       LIMIT 1`,
      [judgeid]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No location found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching judge location:", err);
    res.status(500).json({ error: "Failed to fetch judge location" });
  }
}

/**
 * Get latest location of ALL judges
 */
export async function getAllLatestLocations(req, res) {
  try {
    const result = await sql.query(`
      SELECT DISTINCT ON (judgeid) *
      FROM judgeslocations
      ORDER BY judgeid, timestamp DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching all locations:", err);
    res.status(500).json({ error: "Failed to fetch locations" });
  }
}
