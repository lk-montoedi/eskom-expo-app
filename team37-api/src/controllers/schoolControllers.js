import { sql } from "../config/db.js";

// Get all schools (names only)
export const getAllSchools = async (req, res) => {
  try {
    const result =
      await sql`SELECT schoolname FROM schools ORDER BY schoolname`;
    const schoolNames = result.map((row) => row.schoolname);
    res.json(schoolNames);
  } catch (error) {
    console.error("Error fetching schools:", error);
    res.status(500).json({ message: "Failed to load school list." });
  }
};

// Get all schools (full objects)
export const getSchools = async (req, res) => {
  try {
    const result = await sql`SELECT * FROM schools ORDER BY schoolname`;
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching schools:", error);
    res.status(500).json({ message: "Failed to fetch schools." });
  }
};

// Get a single school by ID
export const getSchoolById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await sql`SELECT * FROM schools WHERE schoolid = ${id}`;
    if (!result.length) {
      return res.status(404).json({ message: "School not found" });
    }
    res.status(200).json(result[0]);
  } catch (error) {
    console.error("Error fetching school:", error);
    res.status(500).json({ message: "Failed to fetch school." });
  }
};

// Create a school
export const createSchool = async (req, res) => {
  const { schoolname, region, district, province } = req.body;
  if (!schoolname) {
    return res.status(400).json({ message: "schoolname is required" });
  }
  try {
    const result = await sql`
      INSERT INTO schools (schoolname, region, district, province)
      VALUES (${schoolname}, ${region}, ${district}, ${province})
      RETURNING *
    `;
    res
      .status(201)
      .json({ message: "School created successfully", school: result[0] });
  } catch (error) {
    console.error("Error creating school:", error);
    res.status(500).json({ message: "Failed to create school." });
  }
};

// Update a school by ID
export const updateSchool = async (req, res) => {
  const { id } = req.params;
  const { schoolname, region, district, province } = req.body;
  if (!schoolname) {
    return res.status(400).json({ message: "schoolname is required" });
  }
  try {
    const result = await sql`
      UPDATE schools SET schoolname = ${schoolname}, region = ${region}, district = ${district}, province = ${province}
      WHERE schoolid = ${id} RETURNING *
    `;
    if (!result.length) {
      return res
        .status(404)
        .json({ message: "School not found or not updated" });
    }
    res
      .status(200)
      .json({ message: "School updated successfully", school: result[0] });
  } catch (error) {
    console.error("Error updating school:", error);
    res.status(500).json({ message: "Failed to update school." });
  }
};

// Delete a school by ID
export const deleteSchool = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await sql`
      DELETE FROM schools WHERE schoolid = ${id} RETURNING *
    `;
    if (!result.length) {
      return res
        .status(404)
        .json({ message: "School not found or already deleted" });
    }
    res.status(200).json({ message: "School deleted successfully" });
  } catch (error) {
    console.error("Error deleting school:", error);
    res.status(500).json({ message: "Failed to delete school." });
  }
};
