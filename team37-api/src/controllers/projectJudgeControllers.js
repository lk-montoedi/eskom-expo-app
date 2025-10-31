import { sql } from "../config/db.js";

export const getProjectsByJudgeCategory = async (req, res) => {
  try {
    const { judgeId } = req.params;

    // Fetch the primary category of the judge from the 'judges' table.
    const judges = await sql`
      SELECT firstCategory
      FROM judges
      WHERE userId = ${judgeId}
    `;

    // If no judge is found with the given userId, return a 404.
    if (judges.length === 0) {
      return res.status(404).json({ message: "Judge not found." });

    };

    


    // Extract the firstCategory from the returned judge object.
    const { firstCategory } = judges[0];

    // Fetch all projects that belong to the judge's firstCategory.
    const projects = await sql`
      SELECT *
      FROM projects
      WHERE category = ${firstCategory}
    `;

    // Return the found projects with a 200 OK status.
    res.status(200).json(projects);
  } catch (error) {
    // Log the error and return a 500 server error message.
    console.error("Error fetching judge projects:", error);
    res
      .status(500)
      .json({ message: "Server error fetching judge's projects." });
  }
};

export const getAllProjectsForJudges = async (req, res) => {
  // Fetch projects allocated to a specific judge if judgeId is provided as a query param.
  try {
    const { judgeId } = req.query;
    let projects;
    if (!judgeId || judgeId.trim() === "") {
      // If judgeId is not provided, return 400 Bad Request.
      console.warn(
        "[ProjectJudgeController] getAllProjectsForJudges: judgeId query param missing or empty"
      );
      return res
        .status(400)
        .json({ message: "Missing or empty judgeId query parameter." });
    }

    // judge with user details
    const judge = await sql`
      SELECT j.*, u.name, u.surname, u.role, c.eventid
      FROM judges j
      JOIN users u ON j.userId = u.userId
      JOIN conveners c ON j.userid = c.userid
      WHERE j.userId = ${judgeId}
    `;

    // Fetch projects where the judge is allocated (exists in projectJudges)
    projects = await sql`
      SELECT
        p.*,
        ARRAY_AGG(pj.judgeId) AS judgeIds,
        m.type AS assignedmarksheettype,
        u.name AS learnerName,
        l.grade AS learnerGrade
      FROM projects p
      INNER JOIN learners l ON p.learnerid = l.userId
      INNER JOIN users u ON l.userId = u.userId
      INNER JOIN projectJudges pj ON pj.projectId = p.projectid
      JOIN marksheets m ON p.projectid = m.projectid
      WHERE pj.judgeId = ${judgeId} AND m.judgeid = ${judgeId}
      GROUP BY p.projectId, p.learnerId, p.assignedMarksheetId, m.marksheetId, m.type, u.userId, u.name, l.userId, l.grade
      ORDER BY p.timeregistered DESC;
    `;

    if (judge.length !== 0) {
      if (judge[0].role === "convener") {
        // If the judge is a convener, fetch all projects regardless of allocation with category of firstcategory
        projects = await sql`
          SELECT
            p.*,
            m.type AS assignedmarksheettype
          FROM projects p
          INNER JOIN marksheets m ON p.projectid = m.projectid
          WHERE p.category = ${judge[0].firstcategory} AND p.eventid = ${judge[0].eventid}
        `;
      }
    }


    // Log the number of projects returned for debugging.
    console.log(
      `[ProjectJudgeController] getAllProjectsForJudges for judgeId=${judgeId} returning ${projects.length} projects`
    );
    // Log the full project details for debugging.
    //console.log("Projects with details from database:", projects);

    // If no projects are found, return a 404.
    if (!projects.length) {
      return res
        .status(404)
        .json({ message: "No projects found for this judge" });
    }

    // Return the found projects with a 200 OK status.
    res.status(200).json(projects);
  } catch (error) {
    // Log the error and return a 500 server error message.
    console.error("Error fetching projects for judge:", error);
    res.status(500).json({ message: "Failed to fetch projects for judge." });
  }
};

export const getProjectsWithDetailsForJudging = async (req, res) => {
  // Fetch projects with specific details including project ID, title, marksheet info, learner details, stand number, category, and status.
  try {
    const projectsWithDetails = await sql`
      SELECT
        p.projectid AS projectId, 
        p.projectname AS projectTitle,
        p.assignedmarksheetid,
        ms.type AS assignedmarksheettype, 
        l_user.name AS learnerName, 
        l.grade AS learnerGrade, 
        p.standnumber,
        p.category,
        p.status
      FROM projects AS p
      INNER JOIN learners AS l ON p.learnerid = l.userId 
      INNER JOIN users AS l_user ON l.userId = l_user.userId 
      LEFT JOIN marksheets AS ms ON p.assignedmarksheetid = ms.marksheetId; 
    `;

    // Log the full project details for debugging.
    console.log("Projects with details from database:", projectsWithDetails);

    // If projects are found, return them with a 200 OK status.
    if (projectsWithDetails.length > 0) {
      res.status(200).json(projectsWithDetails);
    } else {
      // If no projects are found, return a 404.
      res.status(404).json({ message: "No projects found." });
    }
  } catch (error) {
    // Log the error and return a 500 server error message.
    console.error(
      "Error fetching projects with learner details for judging:",
      error
    );
    res.status(500).json({ message: "Failed to fetch projects with details." });
  }
};

export const getProjectDetailsFromJudges = async (req, res) => {
  // Fetch project details for a specific project ID, including learner and judge information.
  try {
    const { projectId } = req.params;
    const projectDetails = await sql`
      SELECT 
      pj.projectid,
      u.name AS judgename,
      u.surname AS judgesurname,
      j.title,
      m.totalScore AS mark
      FROM projectJudges pj
      JOIN judges j ON pj.judgeid = j.userid
      JOIN users u ON j.userid = u.userid
      LEFT JOIN marksheets m ON m.judgeid = j.userid AND m.projectid = pj.projectid
      WHERE pj.projectid = ${projectId}
      `;

    /* if (projectDetails.length === 0) {
      return res.status(404).json({ message: "Project not found.", });
    } */

    res.status(200).json({ judges: projectDetails });
  } catch (error) {
    console.error("Error fetching project details for judges:", error);
    res.status(500).json({ message: "Failed to fetch project details." });
  }
};
