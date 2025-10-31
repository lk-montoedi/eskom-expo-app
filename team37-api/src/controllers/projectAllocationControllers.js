import { sql } from "../config/db.js";
import axios from "axios";
import appEmitter from "../utils/eventEmitter.js";


// automate allocation of projects to judges
export const automateProjectAllocation = async (req, res) => {
  const { eventid } = req.params;

  if (!eventid) {
    return res.status(400).json({ message: "Event ID is required" });
  }

  const categories = [
    "agricultural sciences",
    "animal sciences",
    "biomedical and medical sciences",
    "chemistry and biochemistry",
    "computer sciences and software development",
    "earth sciences",
    "energy",
    "engineering",
    "environmental studies",
    "mathematics",
    "plant sciences",
    "physics, astronomy & space sciences",
    "social sciences",
  ];

  try {
    console.log(`[ProjectAllocation] Starting for event ${eventid}`);

    // Clear previous allocations using projectJudges table
    await sql`
      DELETE FROM projectJudges
      WHERE projectId IN (
        SELECT projectid FROM projects WHERE eventid = ${eventid}
      )
    `;
    await sql`
      DELETE FROM marksheets
      WHERE projectid IN (
        SELECT projectid FROM projects WHERE eventid = ${eventid}
      )
    `;
    await sql`
      DELETE FROM ethicsMarksheets
      WHERE projectid IN (
        SELECT projectid FROM projects WHERE eventid = ${eventid}
      )
    `;

    let allAssignments = [];

    for (const category of categories) {
      console.log(`\n[${category}] Processing category`);

      // Get projects and eligible judges for this category
      const [projects, judges] = await Promise.all([
        sql`
          SELECT projectid FROM projects
          WHERE eventid = ${eventid} AND category = ${category}
        `,
        // Only include judges who are in judgeattendance
        sql`
          SELECT u.userid
          FROM judges u
          JOIN users j ON u.userid = j.userid
          JOIN judgeattendance ja ON u.userid = ja.judgeId AND ja.eventId = ${eventid}
          WHERE u.firstcategory = ${category}
            AND j.role = 'judge'
        `,
      ]);

      if (projects.length === 0) {
        console.warn(
          `[${category}] Skipped: no projects or not enough judges.`
        );
        continue;
      }

      const judgeIds = judges.map((j) => j.userid);
      // Shuffle judges for random assignment
      for (let i = judgeIds.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [judgeIds[i], judgeIds[j]] = [judgeIds[j], judgeIds[i]];
      }

      // Assign 2 judges per project
      let judgeIndex = 0;
      for (const project of projects) {
        const assigned = [];
        assigned.push(judgeIds[judgeIndex++ % judgeIds.length]);
        assigned.push(judgeIds[judgeIndex++ % judgeIds.length]);

        for (const judgeId of assigned) {
          allAssignments.push({
            judgeid: judgeId,
            projectid: project.projectid,
            eventid: eventid,
          });
        }
      }

      console.log(`[${category}] Allocated ${projects.length} projects.`);
    }

    // Bulk insert all assignments into projectJudges table
    if (allAssignments.length > 0) {
      const values = allAssignments.flatMap((a) => [
        a.judgeid,
        a.projectid,
        a.eventid,
      ]);
      const placeholders = allAssignments
        .map((_, i) => {
          const base = i * 3;
          return `($${base + 1}, $${base + 2}, $${base + 3})`;
        })
        .join(", ");

      await sql.query(
        `INSERT INTO projectJudges (judgeId, projectId, eventId) VALUES ${placeholders}`,
        values
      );

      console.log(
        `[Allocation] Inserted ${allAssignments.length} projectJudges`
      );

      // Create marksheets for each assignment
      await Promise.all(
        allAssignments.map((a) =>
          axios.post(`http://localhost:3001/api/marksheets/create-and-assign`, {
            projectId: a.projectid,
            type: "none",
            judgeid: a.judgeid,
          })
        )
      );

      console.log(`[Marksheets] Triggered creation for all assignments.`);
    }

    console.log(`[CONTROLLER] Emitting 'project-reallocated' for event ${eventid}`);
    appEmitter.emit('project-reallocated', {
        eventId: eventid,
        message: 'Projects have been automatically allocated to judges.'
    });

    return res.status(200).json({
      message: `Auto-allocation complete: ${allAssignments.length} assignments made.`,
    });
  } catch (error) {
    console.error("Error in allocation:", error.message);
    return res.status(500).json({ message: "Project allocation failed." });
  }
};

export const handleLateJudgeAllocation = async (req, res) => {
  const { judgeId, eventId } = req.params;
  const JUDGES_PER_PROJECT = 2;

  try {
    // --- Step 1: Get Judge's Details ---

    const [lateJudge] =
      await sql`SELECT firstcategory, secondcategory FROM judges WHERE userid = ${judgeId}`;
    if (!lateJudge)
      return res.status(404).json({ message: "Judge profile not found." });

    const judgeCategories = [
      lateJudge.firstcategory,
      lateJudge.secondcategory,
    ].filter(Boolean);
    if (judgeCategories.length === 0) {
      return res
        .status(200)
        .json({ message: "Judge is present, but has no categories assigned." });
    }

    // --- Step 2: Calculate the "Fair Share" Quota ---
    // (This logic remains the same)
    const attendingJudges = await sql`
      SELECT u.userid FROM users u
      JOIN judges j ON u.userid = j.userid
      JOIN judgeattendance ja ON u.userid = ja.judgeId AND ja.eventId = ${eventId}
      WHERE ja.status = 'present'
        AND (j.firstcategory = ANY(${judgeCategories}) OR j.secondcategory = ANY(${judgeCategories}))
    `;
    const allProjects = await sql`
      SELECT projectid FROM projects WHERE eventid = ${eventId} AND category = ANY(${judgeCategories})
    `;

    if (attendingJudges.length <= JUDGES_PER_PROJECT) {
      // Not enough judges to rebalance.
      return res.status(200).json({
        message: "Welcome! All projects in your category are already balanced.",
      });
    }

    const totalJudgingSlots = allProjects.length * JUDGES_PER_PROJECT;
    const fairShareQuota = Math.floor(
      totalJudgingSlots / attendingJudges.length
    );

    // --- The rest of the function (Steps 3, 4, 5) to rebalance projects remains exactly the same ---
    const workloads = await sql`
      SELECT judgeid, COUNT(projectid) as project_count
      FROM projectjudges
      WHERE eventid = ${eventId} AND judgeid != ${judgeId}
      GROUP BY judgeid
    `;

    const projectsToReassign = [];
    let neededByLateJudge = fairShareQuota;
    const overloadedJudges = workloads.filter(
      (w) => w.project_count > fairShareQuota
    );

    if (overloadedJudges.length > 0) {
      const judgeIdArray = overloadedJudges.map((j) => Number(j.judgeid));
      const stealablePool = await sql`
        SELECT pj.projectid, pj.judgeid as original_judge_id
        FROM projectjudges pj
        JOIN projects p ON p.projectid = pj.projectid
        WHERE pj.eventid = ${eventId}
          AND p.status = 'Not Judged'
          AND pj.judgeid = ANY(${judgeIdArray})
      `;

      for (const donor of overloadedJudges) {
        if (neededByLateJudge <= 0) break;
        const surplusCount = donor.project_count - fairShareQuota;
        const projectsFromThisDonor = stealablePool.filter(
          (p) => p.original_judge_id === donor.judgeid
        );
        const takeCount = Math.min(
          surplusCount,
          projectsFromThisDonor.length,
          neededByLateJudge
        );

        for (let i = 0; i < takeCount; i++) {
          projectsToReassign.push(projectsFromThisDonor[i]);
          neededByLateJudge--;
        }
      }
    }

    if (projectsToReassign.length > 0) {
      for (const project of projectsToReassign) {
        await sql`DELETE FROM projectjudges WHERE judgeid = ${project.original_judge_id} AND projectid = ${project.projectid}`;
        await sql`DELETE FROM marksheets WHERE judgeid = ${project.original_judge_id} AND projectid = ${project.projectid}`;
        await sql`INSERT INTO projectjudges (judgeId, projectId, eventId) VALUES (${judgeId}, ${project.projectid}, ${eventId})`;
        await axios.post(
          `http://localhost:3001/api/marksheets/create-and-assign`,
          { projectId: project.projectid, type: "none", judgeid: judgeId }
        );
      }
    }

    console.log(`[CONTROLLER] Emitting 'project-reallocated' for event ${eventId}`);
    appEmitter.emit('project-reallocated', {
        eventId: eventId,
        message: `Projects were rebalanced for late judge ${judgeId}.`
    });

    return res.status(200).json({
      message: `Welcome! ${projectsToReassign.length} projects have been reallocated to you to balance the workload.`,
    });
  } catch (error) {
    console.error("Error in late judge allocation:", error);
    return res
      .status(500)
      .json({ message: "Failed to reallocate projects for late arrival." });
  }
};

// get all projects allocated to a specific judge, optionally filtered by category
export const getAllocatedProjects = async (req, res) => {
  const { judgeid } = req.params;
  const { category, eventId } = req.query;

  if (!judgeid) {
    return res.status(400).json({ message: "Judge ID is required" });
  }

  try {
    let result;
    if (eventId) {
      // this checks if event is started
      const event = await sql`
        SELECT * FROM events WHERE eventid = ${eventId}
      `;

      // this check is to return projects from pool because record has been deleted from projectjudges
      // when event was started and judge is absent
      if (event.length && event[0].progress_state === "In Progress") {
        // check if judge is in attendance
        const attendance = await sql`
          SELECT * FROM judgeattendance WHERE judgeid = ${judgeid} AND eventid = ${eventId}
        `;
        if (!attendance.length) {
          return res
            .status(400)
            .json({ message: "Judge is not attending event" });
        } else if (attendance[0].status !== "present") {
          // retrieve projects from lateprojects pool
          const lateProjects = await sql`
            SELECT * FROM lateprojectspool WHERE judgeid = ${judgeid} AND eventid = ${eventId}
          `;
          let result = [];
          if (lateProjects.length) {
            for (const project of lateProjects) {
              // get project details
              const projectDetails = await sql`
                SELECT p.* FROM projects p WHERE p.projectid = ${project.projectid}
              `;
              // get marksheet details
              const marksheetDetails = await sql`
                SELECT m.* FROM marksheets m WHERE m.projectid = ${project.projectid}
              `;
              if (projectDetails.length) {
                result.push({
                  project: projectDetails[0],
                  marksheets: marksheetDetails.length ? marksheetDetails : null
                });
              }
            }
            return res.status(200).json(result);
          } else {
            // If no late projects found, return an empty array
            return res.status(200).json([]);
          }
        }
      }

      result = await sql`
        SELECT 
          p.projectid,
          p.projectname,
          p.category,
          ms.marksheetid,
          ms.type AS marksheettype,
          ms.totalscore AS score
        FROM projects p
        JOIN projectjudges pj ON p.projectid = pj.projectid
        LEFT JOIN marksheets ms ON ms.projectid = p.projectid AND ms.judgeid = ${judgeid}
        WHERE pj.judgeid = ${judgeid} AND p.eventid = ${eventId}
      `;
    } else {
      result = await sql`
      SELECT 
        p.projectid, 
        p.projectname, 
        p.category, 
        ms.marksheetid, 
        ms.type AS marksheettype,
        ms.totalscore AS score
      FROM projects p
      JOIN projectjudges pj ON p.projectid = pj.projectid
      LEFT JOIN marksheets ms ON ms.projectid = p.projectid AND ms.judgeid = ${judgeid}
      WHERE pj.judgeid = ${judgeid}
    `;
    }

    // get score from marksheets
    const score = await sql`
      SELECT p.*, m.type, m.totalscore AS totalScore, m.marksheetid
      FROM projects p
      JOIN marksheets m ON p.projectid = m.projectid
      WHERE m.judgeid = ${judgeid}
    `;

    console.log(
      `[ProjectAllocation] Scores retrieved for judge ${judgeid} are ${JSON.stringify(score[0])}`
    );

    if (!result.length) {
      return res
        .status(404)
        .json({ message: "No projects found for this judge" });
    }

    res.status(200).json({
      projects: result || [],
      score: score || [],
      message: !result.length
        ? "No projects found for this judge."
        : "Projects retrieved successfully.",
    });
  } catch (error) {
    console.error("Error retrieving projects:", error);
    res.status(500).json({ message: "Failed to retrieve projects." });
  }
};


export const updateRecommendationStatus = async (req, res) => {
  try {
    const { recommendationId } = req.params;
    const { status } = req.body; // Expecting 'approved' or 'rejected'

    if (!status || !['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: "Invalid status provided." });
    }

    // Use a transaction to ensure atomicity
    const result = await sql.begin(async sql => {
        // Update the recommendation status
        const updatedRecommendation = await sql`
            UPDATE recommendations
            SET status = ${status}
            WHERE recommendationId = ${recommendationId}
            RETURNING *
        `;

        if (updatedRecommendation.length === 0) {
            throw new Error("Recommendation not found.");
        }

        // If approved, add the project to the official shortlists table
        if (status === 'approved') {
            const { projectid: projectId, eventid: eventId } = updatedRecommendation[0];
            await sql`
                INSERT INTO shortlists (projectId, eventId)
                VALUES (${projectId}, ${eventId})
                ON CONFLICT (projectId, eventId) DO NOTHING
            `;
        }

        return updatedRecommendation[0];
    });
    appEmitter.emit('recommendation-updated', {
      eventId: result.eventid,
      message: `Recommendation ${recommendationId} was ${status}.`  
    }); 

    res.status(200).json(result);
  } catch (error) {
    console.error("Error updating recommendation:", error);
    res.status(500).json({ message: error.message || "Server error while updating recommendation." });
  }
};

export const shortlistProject = async (req, res) => {
  try {
    const { projectId, eventId } = req.body;

    if (!projectId || !eventId) {
      return res.status(400).json({ message: "Project ID and Event ID are required." });
    }

    // MODIFIED: Manually handling the transaction with BEGIN/COMMIT/ROLLBACK
    let result;
    try {
      await sql`BEGIN`; // Start the transaction

      await sql`
        INSERT INTO shortlists (projectId, eventId)
        VALUES (${projectId}, ${eventId})
        ON CONFLICT (projectId, eventId) DO NOTHING
      `;

      const projectDetails = await sql`
        SELECT * FROM projects WHERE projectid = ${projectId}
      `;
      
      await sql`COMMIT`; // Commit the transaction if all queries succeed
      result = projectDetails[0];

    } catch (transactionError) {
      await sql`ROLLBACK`; // If any query fails, roll back all changes
      throw transactionError; // Pass the error to the outer catch block
    }

    if (result) {
        appEmitter.emit('project-shortlisted', {
          eventId: eventId,
          project: result 
      });
    }
    
    res.status(201).json({ message: "Project shortlisted successfully.", project: result });

  } catch (error) {
    console.error("Error shortlisting project:", error);
    res.status(500).json({ message: "Server error while shortlisting project." });
  }
};

export const removeShortlist = async (req, res) => {
  try {
    const { projectId, eventId } = req.body;

    if (!projectId || !eventId) {
      return res.status(400).json({ message: "Project ID and Event ID are required." });
    }

    const deleted = await sql`
      DELETE FROM shortlists 
      WHERE projectId = ${projectId} AND eventId = ${eventId}
      RETURNING *
    `;

    if (deleted.length > 0) {
      // Broadcast the removal event
      appEmitter.emit('project-removed-from-shortlist', {
        eventId: eventId,
        projectId: projectId
      });
    }

    res.status(200).json({ message: "Project removed from shortlist." });

  } catch (error) {
    console.error("Error removing from shortlist:", error);
    res.status(500).json({ message: "Server error while removing from shortlist." });
  }
};

export const getShortlistByEvent = async (req, res) => {
  try {
    const { eventid } = req.params;

    if (!eventid) {
      return res.status(400).json({ message: "Event ID is required." });
    }

    const shortlistedProjects = await sql`
      SELECT 
        p.*, 
        s.shortlistid 
      FROM 
        projects p
      JOIN 
        shortlists s ON p.projectid = s.projectid
      WHERE 
        s.eventid = ${eventid}
      ORDER BY 
        p.totalscore DESC NULLS LAST;
    `;

    if (shortlistedProjects.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(shortlistedProjects);

  } catch (error) {
    console.error("Error fetching shortlist by event:", error);
    res.status(500).json({ message: "Server error while fetching shortlist." });
  }
};

export const getRecommendationsByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const recommendations = await sql`
      SELECT r.*, p.projectName, u.name as convenerName, u.surname as convenerSurname
      FROM recommendations r
      JOIN projects p ON r.projectId = p.projectId
      JOIN users u ON r.convenerId = u.userId
      WHERE r.eventId = ${eventId}
      ORDER BY r.createdAt DESC
    `;
    
    res.status(200).json(recommendations);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({ message: "Server error while fetching recommendations." });
  }
};

export const recommendProject = async (req, res) => {
  try {
    const { projectId, eventId, convenerId, reason } = req.body;

    // Basic validation
    if (!projectId || !eventId || !convenerId) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const newRecommendation = await sql`
      INSERT INTO recommendations (projectId, eventId, convenerId, reason)
      VALUES (${projectId}, ${eventId}, ${convenerId}, ${reason})
      RETURNING *
    `;

    appEmitter.emit('new-rocemmendation', {
      eventId: eventId, 
      message: `A new project recommendation has been made for event ${eventId}.`
    });

    res.status(201).json(newRecommendation[0]);
  } catch (error) {
    console.error("Error recommending project:", error);
    // Handle unique constraint violation (project already recommended)
    if (error.code === '23505') {
        return res.status(409).json({ message: "This project has already been recommended for this event." });
    }
    res.status(500).json({ message: "Server error while recommending project." });
  }
};

export const promoteProject = async (req, res) => {
  try {
    const { projectId, newEventId } = req.body;

    // 1. Get the original project data
    const originalProject = await sql`
        SELECT * FROM projects WHERE projectId = ${projectId}
    `;

    if (originalProject.length === 0) {
        return res.status(404).json({ message: "Original project not found." });
    }
    const projectData = originalProject[0];

    // 2. Create the new project record for the new event
    const newProject = await sql`
        INSERT INTO projects (
            schoolid, learnerid, projectname, description, supportingdocument,
            category, status, badge, ethicalstatus, timeregistered, eventid,
            parentProjectId -- This is the new key link
        )
        VALUES (
            ${projectData.schoolid}, ${projectData.learnerid}, ${projectData.projectname},
            ${projectData.description}, ${projectData.supportingdocument}, ${projectData.category},
            'registered', NULL, 'Pending', NOW()::TIME, ${newEventId},
            ${projectId} -- Link back to the original project
        )
        RETURNING *
    `;

    appEmitter.emit('project-promoted', { 
      eventId: projectData.eventid, // The event the project came FROM
      projectId: projectId          // The ID of the project that was promoted
    });

    res.status(201).json({
        message: "Project promoted successfully!",
        newProject: newProject[0]
    });

  } catch (error) {
    console.error("Error promoting project:", error);
    res.status(500).json({ message: "Server error while promoting project." });
  }
};

// GET /api/event/judge-projects/:eventid
export const getJudgeProjectAssignments = async (req, res) => {
  const { eventid } = req.params;

  try {
    // Get all judges for the event
    const judges = await sql`
      SELECT u.userid, u.name AS firstname, u.surname AS lastname, u.email, j.yearsJudged, j.numeventsjudged, j.firstCategory, j.secondCategory
      FROM users u
      JOIN userEvents ue ON u.userid = ue.userid
      JOIN judges j ON u.userid = j.userid
      WHERE ue.eventid = ${eventid}
      AND u.userid NOT IN (
        SELECT userid FROM conveners WHERE eventid = ${eventid}
      )
    `;

    // For each judge, get their projects
    const assignments = [];

    for (const judge of judges) {
      const projects = await sql`
        SELECT p.projectid, p.projectname, p.category
        FROM projectJudges jp
        JOIN projects p ON jp.projectid = p.projectid
        WHERE jp.judgeid = ${judge.userid} AND p.eventid = ${eventid}
      `;

      assignments.push({
        ...judge,
        projects,
      });
    }

    res.status(200).json({ assignments });
  } catch (error) {
    console.error("Error retrieving judge assignments:", error);
    res.status(500).json({ message: "Failed to retrieve assignments" });
  }
};

// Assigning a project to a judge.
export const assignProjectToJudge = async (req, res) => {
  const { judgeid, projectid, eventid } = req.body;
  if (!judgeid || !projectid) {
    return res
      .status(400)
      .json({ error: "judgeId and projectId are required." });
  }

  try {
    const attendance = await sql`
      SELECT status FROM judgeattendance WHERE judgeId = ${judgeid} AND eventId = ${eventid}
    `;

    if (!attendance.length || attendance[0].status !== "present") {
      return res
        .status(400)
        .json({ error: "Cannot assign project: Judge is not in attendance." });
    }

    const existing = await sql`
      SELECT * FROM projectJudges WHERE judgeId = ${judgeid} AND projectId = ${projectid}
    `;
    if (existing.length > 0) {
      return res
        .status(409)
        .json({ error: "This project is already assigned to the judge." });
    }

    await sql`
      INSERT INTO projectJudges (judgeId, projectId, eventId)
      VALUES (${judgeid}, ${projectid}, ${eventid})
    `;

    // ✅ ADD THIS EMITTER
    console.log(`[CONTROLLER] Emitting 'project-reallocated' for event ${eventid}`);
    appEmitter.emit('project-reallocated', {
        eventId: eventid,
        message: `Project ${projectid} was manually assigned.`
    });

    res.json({ message: "Project successfully assigned to judge." });
  } catch (error) {
    console.error("Assignment failed:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// this will go through all the project of absent judges and add them to lateprojects pool
export const handleAbsentJudgeProjects = async (req, res) => {
  const { eventid } = req.params;
  if (!eventid) {
    return res.status(400).json({ message: "Event ID is required" });
  }
  try {
    // Get all absent judges for the event
    const absentJudges = await sql`
      SELECT j.userid
      FROM judges j
      JOIN judgeattendance a ON j.userid = a.judgeid 
      WHERE a.eventid = ${eventid}
      AND a.status = 'absent'
    `;

    // For each absent judge, find their assigned projects and add to lateProjects
    for (const judge of absentJudges) {
      const projects = await sql`
        SELECT p.projectid
        FROM projectJudges pj
        JOIN projects p ON pj.projectid = p.projectid
        WHERE pj.judgeid = ${judge.userid} AND p.eventid = ${eventid}
      `;

      // Add judge to late judge table
      const lateJudge = await sql`
        INSERT INTO latejudges (judgeid, eventid)
        VALUES (${judge.userid}, ${eventid})
      `;

      for (const project of projects) {
        // remove the project from projectJudges
        await sql`
          DELETE FROM projectJudges WHERE projectid = ${project.projectid} AND judgeid = ${judge.userid}
        `;
        // get the marksheet for this project and judge
        const marksheet = await sql`
          SELECT m.marksheetid FROM marksheets m
          WHERE m.projectid = ${project.projectid} AND m.judgeid = ${judge.userid}
        `;
        if (marksheet.length > 0) {
          await sql`
          INSERT INTO lateProjectspool (projectid, marksheetid, eventid, judgeid)
          VALUES (${project.projectid}, ${marksheet[0].marksheetid}, ${eventid}, ${judge.userid})
        `;
        } else {
          return res
            .status(404)
            .json({ message: "Marksheet not found for project and judge" });
        }
      }
    }
    // Announce that a reallocation happened for a specific event
    appEmitter.emit('project-reallocated', { 
      eventId: eventid, 
      message: 'Projects have been reallocated due to an absent judge.' 
    });
    console.log(`Handled projects for ${absentJudges.length} absent judges.`);
    return res.status(200).json({ message: "Late projects handled successfully" });
  } catch (error) {
    console.error("Error handling absent judge projects:", error);
    return res.status(500).json({ message: "Failed to handle absent judge projects" });
  }
};

// this will go to the pool and remove the projects from lateprojects pool and assign it to the late judge
// this is done by removing it from lateprojects pool
export const reallocateProjectFromLatePool = async (req, res) => {
  const { judgeid, eventid } = req.params;
  if (!judgeid || !eventid) {
    return res
      .status(400)
      .json({ message: "Judge ID and Event ID are required" });
  }
  try {
    // check if this is a late/absent judge
    const attendance = await sql`
      SELECT status FROM judgeattendance WHERE judgeid = ${judgeid} AND eventid = ${eventid}
    `;
    if (attendance.length && attendance[0].status === "absent") {
      // get all the projects from lateprojects pool for this event that belong to this judge
      const lateProjects = await sql`
        SELECT * FROM lateprojectspool WHERE eventid = ${eventid} AND judgeid = ${judgeid} AND status = 'unallocated'
      `;
      // go through each project and assign it to the judge by removing it from lateprojects pool
      for (const project of lateProjects) {
        // insert into projectJudges
        await sql`
          INSERT INTO projectjudges (projectid, judgeid, eventid)
          VALUES (${project.projectid}, ${judgeid}, ${eventid})
        `;
        await sql`
          UPDATE lateprojectspool SET status = 'allocated' WHERE id = ${project.id}
        `;
        // update their attendence status to present
        await sql`
          UPDATE judgeattendance SET status = 'present' WHERE judgeid = ${judgeid} AND eventid = ${eventid}
        `;
      }
      console.log(
        `Reallocated ${lateProjects.length} projects from late pool to late judge ${judgeid}`
      );

      if (lateProjects.length > 0) {
          appEmitter.emit('project-reallocated', { 
              eventId: eventid, 
              message: `Projects were reallocated to judge ${judgeid} from the late pool.`
          });
      }
      
      return res.status(200).json({
        message: `${lateProjects.length} projects reallocated from late pool to late judge.`,
      });
    } else if (lateProjects.length && attendance[0].status === "present") {
      // this is a judge who is not absent and is left with 1 project
      const lateProjects = await sql`
        SELECT * FROM lateprojectspool WHERE eventid = ${eventid} AND status = 'unallocated'
      `;
      if (lateProjects.length) {
        for (const project of lateProjects) {
          // get the project details
          const projectDetails = await sql`
            SELECT * FROM projects WHERE projectid = ${project.projectid}
          `;
          // check if the project category matches the judge category
          const judgeDetails = await sql`
            SELECT * FROM judges WHERE userid = ${judgeid}
          `;
          if (
            projectDetails.length &&
            judgeDetails.length &&
            projectDetails[0].category === judgeDetails[0].firstcategory
          ) {
            // reallocate the project to the judge
            await sql`
              INSERT INTO projectJudges (projectid, judgeid, eventid)
              VALUES (${project.projectid}, ${judgeid}, ${eventid})
            `;
            // get the marksheet for the project and judge in lateprojects pool
            const marksheet = await sql`
              SELECT * FROM marksheets WHERE judgeid = ${project.judgeid} AND projectid = ${project.projectid}
            `;
            if (marksheet.length) {
              // update the marksheet to assign it to the new judge
              await sql`
                UPDATE marksheets SET judgeid = ${judgeid} WHERE marksheetid = ${marksheet[0].marksheetid}
              `;
              await sql`
                UPDATE lateprojectspool SET status = 'allocated' WHERE id = ${project.id}
              `;
              console.log(
                `Reallocated project ${project.projectid} from late pool to judge ${judgeid}`
              );

              // Announce the same event
              appEmitter.emit('project-reallocated', { 
                eventId: eventid, 
                message: `A project was reallocated to judge ${judgeid}.`
              });

              // *** ONE Project is allocated to a judge at a time ***
              return res.status(200).json({
                message: `Project ${project.projectid} reallocated from late pool to judge ${judgeid}.`,
              });
            }
          }
        }
      }
    } else {
      return res
        .status(400)
        .json({ message: "No late projects found for this judge" });
    }
  } catch (error) {
    console.error("Error reallocating projects from late pool:", error);
    res.status(500).json({ message: "Failed to reallocate projects" });
  }
};



// GET unallocated projects from the late pool for an event
export const getLatePoolProjects = async (req, res) => {
  const { eventid } = req.params;
  if (!eventid) {
    return res.status(400).json({ message: "Event ID is required" });
  }

  try {
    const lateProjects = await sql`
      SELECT l.*, p.projectname, p.category 
      FROM lateprojectspool l
      JOIN projects p ON l.projectid = p.projectid
      WHERE l.eventid = ${eventid} AND l.status = 'unallocated'
    `;

    res.status(200).json(lateProjects);
  } catch (error) {
    console.error("Error fetching late pool projects:", error);
    res.status(500).json({ message: "Failed to fetch late pool projects" });
  }
};

// controllers/projectJudgesController.js
export const removeProjectFromJudge = async (req, res) => {
  const { judgeid, projectid } = req.params;
  try {
    const result = await sql`
      DELETE FROM projectJudges
      WHERE judgeId = ${judgeid} AND projectId = ${projectid}
    `;

    if (result.count === 0) {
      return res
        .status(404)
        .json({ error: "Project not found for this judge." });
    }

    res.json({ message: "Project removed from judge." });
  } catch (error) {
    console.error("Deletion failed:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
