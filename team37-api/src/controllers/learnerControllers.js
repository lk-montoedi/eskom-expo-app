import { sql } from "../config/db.js";

// Get all learners (full objects)
export const getLearners = async (req, res) => {
  try {
    const result = await sql`
      SELECT l.*, u.*
      FROM learners l
      JOIN users u ON l.userid = u.userid
      ORDER BY l.userid
    `;
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching learners:", error);
    res.status(500).json({ message: "Failed to fetch learners." });
  }
};

// Get a single learner by ID
export const getLearnerById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await sql`
      SELECT l.*, u.*, s.*
      FROM learners l
      JOIN users u ON l.userid = u.userid
      JOIN schools s ON l.schoolid = s.schoolid
      WHERE l.userid = ${id}
    `;
    console.log("Single learner result:", result);
    if (!result.length) {
      return res.status(404).json({ message: "Learner not found" });
    }
    res.status(200).json(result[0]);
  } catch (error) {
    console.error("Error fetching learner:", error);
    res.status(500).json({ message: "Failed to fetch learner." });
  }
};

// Create a learner
export const createLearner = async (req, res) => {
  const { userid, grade, disability, disabilityinfo, schoolid } = req.body;
  if (!userid || !grade || !schoolid) {
    return res
      .status(400)
      .json({ message: "userid, grade, and schoolid are required" });
  }
  try {
    const result = await sql`
      INSERT INTO learners (userid, grade, disability, disabilityinfo, schoolid)
      VALUES (${userid}, ${grade}, ${disability}, ${disabilityinfo}, ${schoolid})
      RETURNING *
    `;
    res
      .status(201)
      .json({ message: "Learner created successfully", learner: result[0] });
  } catch (error) {
    console.error("Error creating learner:", error);
    res.status(500).json({ message: "Failed to create learner." });
  }
};

// Update a learner by ID
export const updateLearner = async (req, res) => {
  const { id } = req.params;
  const { grade, disability, disabilityinfo, schoolid } = req.body;
  if (!grade || !schoolid) {
    return res.status(400).json({ message: "grade and schoolid are required" });
  }
  try {
    const result = await sql`
      UPDATE learners SET grade = ${grade}, disability = ${disability}, disabilityinfo = ${disabilityinfo}, schoolid = ${schoolid}
      WHERE userid = ${id} RETURNING *
    `;
    if (!result.length) {
      return res
        .status(404)
        .json({ message: "Learner not found or not updated" });
    }
    res
      .status(200)
      .json({ message: "Learner updated successfully", learner: result[0] });
  } catch (error) {
    console.error("Error updating learner:", error);
    res.status(500).json({ message: "Failed to update learner." });
  }
};

// Delete a learner by ID
export const deleteLearner = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await sql`
      DELETE FROM learners WHERE userid = ${id} RETURNING *
    `;
    if (!result.length) {
      return res
        .status(404)
        .json({ message: "Learner not found or already deleted" });
    }
    res.status(200).json({ message: "Learner deleted successfully" });
  } catch (error) {
    console.error("Error deleting learner:", error);
    res.status(500).json({ message: "Failed to delete learner." });
  }
};

export const getLearnerInfo = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await sql`
      SELECT l.userId AS learnerId, l.schoolId, s.schoolName
      FROM learners l
      JOIN schools s ON s.schoolId = l.schoolId
      WHERE l.userId = ${userId};
    `;
    if (result.length === 0) {
      return res.status(404).json({ message: "Learner not found" });
    }
    res.json(result[0]);
  } catch (err) {
    console.error("Error fetching learner info:", err);
    res.status(500).json({ message: "Server error" });
  }
};
