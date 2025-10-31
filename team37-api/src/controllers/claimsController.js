import { sql } from "../config/db.js";

// Create a new claim
export const createClaim = async (req, res) => {
  try {
    const { userId, item } = req.body;

    if (!userId || !item) {
      return res.status(400).json({ message: "User ID and item are required." });
    }

    const validItems = ['flask', 'mug', 'notebook', 'tie', 'umbrella', 'watch'];
    if (!validItems.includes(item.toLowerCase())) {
        return res.status(400).json({ message: "Invalid item specified." });
    }

    const newClaim = await sql`
      INSERT INTO claims (userid, item, status)
      VALUES (${userId}, ${item}, 'pending')
      RETURNING *
    `;

    res.status(201).json({ message: "Claim created successfully.", claim: newClaim[0] });
  } catch (error) {
    console.error("Error creating claim:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Approve a claim
export const approveClaim = async (req, res) => {
  try {
    const { claimId } = req.params;

    const updatedClaim = await sql`
      UPDATE claims
      SET status = 'approved'
      WHERE id = ${claimId}
      RETURNING *
    `;

    if (updatedClaim.length === 0) {
      return res.status(404).json({ message: "Claim not found." });
    }

    res.status(200).json({ message: "Claim approved successfully.", claim: updatedClaim[0] });
  } catch (error) {
    console.error("Error approving claim:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Get all claims for a specific judge
export const getJudgeClaims = async (req, res) => {
  try {
    const { userId } = req.params;

    const claims = await sql`
      SELECT * FROM claims WHERE userid = ${userId} ORDER BY date DESC
    `;

    res.status(200).json({ claims });
  } catch (error) {
    console.error("Error fetching judge claims:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
