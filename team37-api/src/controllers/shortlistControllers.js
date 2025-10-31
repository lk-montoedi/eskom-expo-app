import { sql } from "../config/db.js";

// Get all shortlists
export const getAllShortlists = async (req, res) => {
  const { eventid } = req.params;
  try {
    let result;
    if (eventid) {
      result =
        await sql`SELECT * FROM shortlists WHERE eventid = ${eventid} ORDER BY shortlistid`;
    } else {
      result = await sql`SELECT * FROM shortlists ORDER BY shortlistid`;
    }
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching shortlists:", error);
    res.status(500).json({ message: "Failed to fetch shortlists." });
  }
};

// Get a single shortlist by ID
export const getShortlistById = async (req, res) => {
  try {
    const { id } = req.params;
    const result =
      await sql`SELECT * FROM shortlists WHERE shortlistid = ${id}`;
    if (!result.length) {
      return res.status(404).json({ message: "Shortlist not found" });
    }
    res.status(200).json(result[0]);
  } catch (error) {
    console.error("Error fetching shortlist:", error);
    res.status(500).json({ message: "Failed to fetch shortlist." });
  }
};

// Create a shortlist
export const createShortlist = async (req, res) => {
  const { projectid, eventid, status } = req.body;
  if (!projectid || !eventid) {
    return res
      .status(400)
      .json({ message: "projectid and eventid are required" });
  }
  try {
    const result = await sql`
      INSERT INTO shortlists (projectid, eventid, status)
      VALUES (${projectid}, ${eventid}, ${status})
      RETURNING *
    `;
    res.status(201).json({
      message: "Shortlist created successfully",
      shortlist: result[0],
    });
  } catch (error) {
    console.error("Error creating shortlist:", error);
    res.status(500).json({ message: "Failed to create shortlist." });
  }
};

// Update a shortlist by ID
export const updateShortlist = async (req, res) => {
  const { id } = req.params;
  const { projectid, eventid } = req.body;
  if (!projectid || !eventid) {
    return res
      .status(400)
      .json({ message: "projectid and eventid are required" });
  }
  try {
    const result = await sql`
      UPDATE shortlists SET projectid = ${projectid}, eventid = ${eventid}
      WHERE shortlistid = ${id} RETURNING *
    `;
    if (!result.length) {
      return res
        .status(404)
        .json({ message: "Shortlist not found or not updated" });
    }
    res.status(200).json({
      message: "Shortlist updated successfully",
      shortlist: result[0],
    });
  } catch (error) {
    console.error("Error updating shortlist:", error);
    res.status(500).json({ message: "Failed to update shortlist." });
  }
};

// Delete a shortlist by ID
export const deleteShortlist = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await sql`
      DELETE FROM shortlists WHERE shortlistid = ${id} RETURNING *
    `;
    if (!result.length) {
      return res
        .status(404)
        .json({ message: "Shortlist not found or already deleted" });
    }
    res.status(200).json({ message: "Shortlist deleted successfully" });
  } catch (error) {
    console.error("Error deleting shortlist:", error);
    res.status(500).json({ message: "Failed to delete shortlist." });
  }
};
