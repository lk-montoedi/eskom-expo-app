import { sql } from "../config/db.js";

// Create a project
export const createProject = async (req, res) => {
  const {
    schoolid,
    learnerid,
    projectname,
    description,
    supportingdocument,
    category,
    status,
    badge,
    ethicalstatus,
    timeregistered,
    eventid,
  } = req.body;

  console.log("[ProjectController] createProject called with:", req.body);

  try {
    const result = await sql`
      INSERT INTO projects (
        schoolid, learnerid, projectname, description, supportingdocument, category, status, badge, ethicalstatus, timeregistered, eventid
      ) VALUES (
        ${schoolid}, ${learnerid}, ${projectname}, ${description}, ${supportingdocument}, ${category}, ${status}, ${badge}, ${ethicalstatus}, ${timeregistered}, ${eventid}
      ) RETURNING *
    `;
    if (!result.length) {
      return res.status(400).json({ message: "Failed to create project." });
    }
    res
      .status(201)
      .json({ message: "Project created successfully", project: result[0] });
  } catch (error) {
    console.error("Project creation error:", error);
    res.status(500).json({ message: "Server error during project creation" });
  }
};

export const getLearnersInProjects = async (req, res) => {
  try {
    const { projectId } = req.params;

    const result = await sql`
      SELECT u.email, u.name, u.surname
      FROM learners l
      JOIN users u ON l.userid = u.userid
      JOIN schools s ON l.schoolid = s.schoolid
      JOIN projects p ON s.schoolid = p.schoolid
      WHERE p.projectid = ${projectId}
    `;

    console.log("Learners in project:", result);

    if (!result.length) {
      return res
        .status(404)
        .json({ message: "No learners found for this project." });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching learners in project:", error);
    res.status(500).json({ message: "Failed to fetch learners in project." });
  }
};

// Get all projects with event type (district/regional/international)
export const getAllProjects = async (req, res) => {
  try {
    const {
      schoolid,
      learnerid,
      category,
      status,
      badge,
      eventid,
      type,
      region,
    } = req.query;

    let query = `
      SELECT p.*, e.type AS event_type, e.region AS event_region, e.name AS event_name, e.timeregistered AS event_timeregistered
      FROM projects p
      INNER JOIN events e ON p.eventid = e.eventid
      WHERE 1=1
    `;

    const params = [];

    if (schoolid) {
      query += ` AND p.schoolid = ${params.length + 1}`;
      params.push(schoolid);
    }
    if (learnerid) {
      query += ` AND p.learnerid = ${params.length + 1}`;
      params.push(learnerid);
    }
    if (category) {
      query += ` AND p.category = ${params.length + 1}`;
      params.push(category);
    }
    if (status) {
      query += ` AND p.status = ${params.length + 1}`;
      params.push(status);
    }
    if (badge) {
      query += ` AND p.badge = ${params.length + 1}`;
      params.push(badge);
    }
    if (eventid) {
      query += ` AND p.eventid = ${params.length + 1}`;
      params.push(eventid);
    }
    if (type) {
      query += ` AND e.type = ${params.length + 1}`;
      params.push(type);
    }
    if (region) {
      query += ` AND e.region = ${params.length + 1}`;
      params.push(region);
    }

    query += " ORDER BY p.timeregistered DESC";

    const result = await sql.query(query, params);
    if (!result.length) {
      return res.status(404).json({ message: "No projects found" });
    }
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Failed to fetch projects." });
  }
};

// Get a single project by ID
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`[ProjectController] getProjectById called with id: ${id}`);

    const project = await sql`
      SELECT 
        p.*, 
        p.assignedmarksheetid, 
        m.type AS assignedmarksheettype,
        m.ethicsmarksheetid,
        e.eventid,
        e.name,
        e.region,
        e.type,
        e.venue,
        e.event_status
      FROM projects p
      LEFT JOIN marksheets m ON p.assignedmarksheetid = m.marksheetid
      LEFT JOIN events e ON p.eventid = e.eventid
      WHERE p.projectid = ${id}
    `;

    if (!project.length) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(project[0]);
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ message: "Failed to fetch project." });
  }
};

export const getProjectWithMarksheets = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await sql`
      SELECT p.*
      FROM projects p
      WHERE p.projectid = ${id}
    `;

    if (!project.length) {
      return res.status(404).json({ message: "Project not found" });
    }

    const marksheets = await sql`
      SELECT m.*
      FROM marksheets m
      WHERE m.projectid = ${id}
    `;

    // get conflicts if any
    const conflicts = await sql`
      SELECT c.*
      FROM conflicts c
      WHERE c.projectid = ${id}
    `;

    res.status(200).json({ project: project[0], marksheets, conflicts });
  } catch (error) {
    console.error("Error fetching project with marksheets:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch project with marksheets." });
  }
};

// Get a single project for editing
export const getProjectForEdit = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await sql`
      SELECT * FROM projects WHERE projectid = ${id}
    `;

    if (!project.length) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(project[0]);
  } catch (error) {
    console.error("Error fetching project for edit:", error);
    res.status(500).json({ message: "Failed to fetch project." });
  }
};

// Update a project by ID
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(
      `[ProjectController] updateProject called with id: ${id}, body:`,
      req.body
    );
    const {
      schoolid,
      learnerid,
      projectname,
      description,
      supportingdocument,
      category,
      standnumber,
      status,
      badge,
      ethicalstatus,
      timeregistered,
      eventid,
    } = req.body;

    let query = "UPDATE projects SET";
    const updates = [];
    const params = [];
    if (schoolid) {
      updates.push(` schoolid = ${params.length + 1}`);
      params.push(schoolid);
    }
    if (learnerid) {
      updates.push(` learnerid = ${params.length + 1}`);
      params.push(learnerid);
    }
    if (projectname) {
      updates.push(` projectname = ${params.length + 1}`);
      params.push(projectname);
    }
    if (description) {
      updates.push(` description = ${params.length + 1}`);
      params.push(description);
    }
    if (supportingdocument) {
      updates.push(` supportingdocument = ${params.length + 1}`);
      params.push(supportingdocument);
    }
    if (category) {
      updates.push(` category = ${params.length + 1}`);
      params.push(category);
    }
    if (standnumber) {
      updates.push(` standnumber = ${params.length + 1}`);
      params.push(standnumber);
    }
    if (status) {
      updates.push(` status = ${params.length + 1}`);
      params.push(status);
    }
    if (badge) {
      updates.push(` badge = ${params.length + 1}`);
      params.push(badge);
    }
    if (ethicalstatus) {
      updates.push(` ethicalstatus = ${params.length + 1}`);
      params.push(ethicalstatus);
    }
    if (timeregistered) {
      updates.push(` timeregistered = ${params.length + 1}`);
      params.push(timeregistered);
    }
    if (eventid) {
      updates.push(` eventid = ${params.length + 1}`);
      params.push(eventid);
    }
    if (updates.length === 0) {
      return res
        .status(400)
        .json({ message: "No valid fields provided for update." });
    }
    query += updates.join(",");
    query += ` WHERE projectid = ${params.length + 1} RETURNING *`;
    params.push(id);
    const result = await sql.query(query, params);
    console.log(`[ProjectController] updateProject result:`, result);
    if (!result.length) {
      return res
        .status(404)
        .json({ message: "Project not found or not updated" });
    }
    res
      .status(200)
      .json({ message: "Project updated successfully", project: result[0] });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ message: "Failed to update project." });
  }
};

// Delete a project by ID
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`[ProjectController] deleteProject called with id: ${id}`);
    const result =
      await sql`DELETE FROM projects WHERE projectid = ${id} RETURNING *`;
    if (!result.length) {
      return res
        .status(404)
        .json({ message: "Project not found or already deleted" });
    }
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ message: "Failed to delete project." });
  }
};

// Get all projects by learner ID
export const getProjectsByLearnerId = async (req, res) => {
  const { learnerid } = req.params;
  try {
    const result = await sql`
      SELECT * FROM projects WHERE learnerid = ${learnerid}
    `;

    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "No projects found for this learner" });
    }

    return res.status(200).json({ projects: result });
  } catch (err) {
    console.error("Error fetching learner projects:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get Projects by Event ID
export const getProjectsByEvent = async (req, res) => {
  const { eventid } = req.params;

  try {
    const projects = await sql`
      SELECT
        p.projectid,
        p.projectname,
        p.description,
        p.supportingdocument,
        p.category,
        p.standnumber,
        p.totalscore,
        p.status,
        p.badge,
        p.ethicalstatus,
        p.timeregistered,
        u.name AS learnerName,
        u.surname AS learnerSurname,
        l.grade,
        s.schoolName
      FROM projects AS p
      JOIN users AS u ON p.learnerid = u.userId
      JOIN learners AS l ON p.learnerid = l.userId
      JOIN schools AS s ON p.schoolid = s.schoolId
      WHERE p.eventid = ${eventid}
    `;

    res.status(200).json({ projects });
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
};
