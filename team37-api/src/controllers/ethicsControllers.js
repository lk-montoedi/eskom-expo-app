import { sql } from "../config/db.js";

// Helper function to get current active event (published events only)
const getCurrentEvent = async () => {
  const result = await sql`
    SELECT eventid, name as event_name
    FROM events
    WHERE event_status = 'published'
      AND start_date <= NOW() 
      AND end_date >= NOW()
    ORDER BY start_date DESC
    LIMIT 1
  `;
  return result[0] || null;
};

// JUDGE: Get ethics-flagged projects assigned to them (from their joined event)
export const getJudgeProjectsWithEthicsViolations = async (req, res) => {
  const { userId } = req.params;
  
  try {
    // Get the event this judge has joined
    const userEvent = await sql`
      SELECT eventid FROM userevents WHERE userid = ${userId} LIMIT 1
    `;
    
    if (!userEvent.length) {
      return res.status(404).json({ error: "Judge has not joined any event" });
    }

    const eventId = userEvent[0].eventid;

    const projects = await sql`
      SELECT DISTINCT
        p.projectid,
        p.projectname,
         p.category,
        e.flag_status,
        e.judge1id,
        u1.name AS judge1_name,
        e.judge1_severity,
        e.judge1_comment,
        e.judge2id,
        u2.name AS judge2_name,
        e.judge2_severity,
        e.judge2_comment
      FROM projects p
      JOIN ethics e ON e.projectid = p.projectid
      LEFT JOIN users u1 ON u1.userid = e.judge1id
      LEFT JOIN users u2 ON u2.userid = e.judge2id
      WHERE p.eventid = ${eventId}
        AND (
          (e.judge1id = ${userId} AND e.judge1_severity IN ('moderate', 'severe'))
          OR
          (e.judge2id = ${userId} AND e.judge2_severity IN ('moderate', 'severe'))
          OR
          (
            (e.judge1id = ${userId} OR e.judge2id = ${userId})
            AND e.flag_status = 'flagged'
          )
        )
      ORDER BY p.projectname
    `;

    const formattedProjects = projects.map(project => ({
      projectId: project.projectid,
      projectName: project.projectname,
      category: project.category,
      flagStatus: project.flag_status,
      judge1: {
        id: project.judge1id,
        name: project.judge1_name,
        severity: project.judge1_severity,
        comment: project.judge1_comment,
      },
      judge2: {
        id: project.judge2id,
        name: project.judge2_name,
        severity: project.judge2_severity,
        comment: project.judge2_comment,
      }
    }));

    res.status(200).json({
      eventId: eventId,
      projects: formattedProjects
    });
  } catch (error) {
    console.error("Error fetching judge ethics violations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// CONVENER: Get flagged projects in their category (from current active event)
export const getProjectsWithEthicsViolationsForConvener = async (req, res) => {
  const { userId } = req.params;

  try {
    // Step 1: Get convener’s category and event
    const convenerResult = await sql`
      SELECT 
        TRIM(BOTH FROM category) AS category,
        eventid
      FROM conveners
      WHERE userId = ${userId};
    `;

    if (convenerResult.length === 0) {
      return res.status(404).json({ error: "Convener not found" });
    }

    const convenerCategory = convenerResult[0].category;
    const convenerEventId = convenerResult[0].eventid;

    // Step 2: Get distinct projects in this category *and* event with ethics issues
    const projects = await sql`
      SELECT DISTINCT ON (p.projectid)
        p.projectid,
        p.projectname,
        p.category,
        e.flag_status,
        e.convenor_overall_severity,
        e.convenor_comment,
        e.resolution,
        e.updatedAt,
        e.judge1id,
        u1.name AS judge1_name,
        e.judge1_comment,
        e.judge1_severity,
        e.judge2id,
        u2.name AS judge2_name,
        e.judge2_comment,
        e.judge2_severity
      FROM projects p
      JOIN ethics e ON e.projectid = p.projectid
      LEFT JOIN users u1 ON u1.userid = e.judge1id
      LEFT JOIN users u2 ON u2.userid = e.judge2id
      WHERE p.eventid = ${convenerEventId}
        AND LOWER(REPLACE(REPLACE(p.category, E'\r', ''), E'\n', '')) = LOWER(${convenerCategory})
        AND (
          e.judge1_severity IN ('moderate', 'severe')
          OR e.judge2_severity IN ('moderate', 'severe')
          OR e.flag_status IN ('flagged','under-review')
        )
      ORDER BY p.projectid, e.updatedAt DESC
    `;

    // Step 3: Clean response
    const cleanedProjects = projects.map((project) => ({
      projectId: project.projectid,
      projectName: project.projectname,
      category: project.category,
      flagStatus: project.flag_status,
      resolution: project.resolution,
      convenorComment: project.convenor_comment,
      convenorSeverity: project.convenor_overall_severity,
      lastUpdated: project.updatedat,
      judge1: {
        id: project.judge1id,
        name: project.judge1_name,
        severity: project.judge1_severity,
        comment: project.judge1_comment,
      },
      judge2: {
        id: project.judge2id,
        name: project.judge2_name,
        severity: project.judge2_severity,
        comment: project.judge2_comment,
      },
    }));

    res.status(200).json({
      convenerEventId,
      convenerCategory,
      projects: cleanedProjects,
    });
  } catch (error) {
    console.error("Error fetching flagged projects for convener:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// CONVENER: Update ethics record
export const updateEthicsByConvener = async (req, res) => {
  const { projectId } = req.params;
  const {
    convenor_overall_severity,
    convenor_comment,
    flag_status,
    convenorId,
    resolution
  } = req.body;

  const validStatuses = ['unflagged', 'flagged', 'under-review', 'resolved', 'dismissed'];
  if (!validStatuses.includes(flag_status)) {
    return res.status(400).json({ error: "Invalid flag_status value" });
  }

  try {
    const result = await sql`
      UPDATE ethics
      SET convenor_overall_severity = ${convenor_overall_severity},
          convenor_comment = ${convenor_comment},
          flag_status = ${flag_status},
          convenorId = ${convenorId},
          resolution = ${resolution},
          updatedAt = NOW()
      WHERE projectId = ${projectId}
    `;

    if (result.count === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.status(200).json({ message: "Ethics updated successfully" });
  } catch (error) {
    console.error("Error updating ethics record:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Check if a user is a convener
export const isUserConvener = async (req, res) => {
  const { userId } = req.params;
  
  try {
    const result = await sql`
      SELECT category FROM conveners WHERE userId = ${userId}
    `;
    
    res.status(200).json({ 
      isConvener: result.length > 0,
      category: result[0]?.category || null
    });
  } catch (error) {
    console.error("Error checking convener status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get ethics status for current event projects only
export const getEthicsReviewStatusForProjects = async (req, res) => {
  try {
    const currentEvent = await getCurrentEvent();
    if (!currentEvent) {
      return res.status(404).json({ error: "No active event found" });
    }

    const results = await sql`
      SELECT
        e.projectId,
        p.projectName,
        p.category,
        e.flag_status,
        e.convenor_overall_severity,
        e.convenor_comment,
        e.resolution
      FROM ethics e
      JOIN projects p ON e.projectId = p.projectId
      WHERE p.eventid = ${currentEvent.eventid}
      ORDER BY p.projectName
    `;

    res.status(200).json({
      eventId: currentEvent.eventid,
      eventName: currentEvent.event_name,
      projects: results
    });
  } catch (error) {
    console.error("Error fetching ethics review status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get a specific ethics review for a project
export const getConvenerReview = async (req, res) => {
  const { projectId } = req.params;
  
  try {
    const result = await sql`
      SELECT
        convenor_overall_severity,
        convenor_comment,
        flag_status,
        resolution
      FROM ethics
      WHERE projectId = ${projectId}
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: "No ethics review found for this project" });
    }

    res.status(200).json(result[0]);
  } catch (error) {
    console.error("Error fetching convener review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// JUDGE: Submit or update ethics review
export const submitEthicsByJudge = async (req, res) => {
  const { projectId } = req.params;
  const { judgeId, severity, comment } = req.body;

  const validSeverities = ["none", "minor", "moderate", "severe"];
  if (!validSeverities.includes(severity)) {
    return res.status(400).json({ error: "Invalid severity value" });
  }

  try {
    // First, check if there’s already an ethics record for this project
    const ethicsRecord = await sql`
      SELECT * FROM ethics WHERE projectId = ${projectId}
    `;

    if (ethicsRecord.length === 0) {
      // No ethics record yet → create one and assign this judge as judge1
      await sql`
        INSERT INTO ethics (
          projectId, flag_status, judge1Id, judge1_severity, judge1_comment, updatedAt
        ) VALUES (
          ${projectId}, 
          ${["moderate", "severe"].includes(severity) ? "flagged" : "unflagged"},
          ${judgeId}, ${severity}, ${comment}, NOW()
        )
      `;
      return res.status(201).json({ message: "Ethics record created and updated for Judge1" });
    }

    // Ethics record exists → decide if judge is Judge1 or Judge2
    const record = ethicsRecord[0];
    let updateQuery;

    if (record.judge1id === judgeId || !record.judge1id) {
      // Update Judge1
      updateQuery = sql`
        UPDATE ethics
        SET judge1id = ${judgeId},
            judge1_severity = ${severity},
            judge1_comment = ${comment},
            flag_status = ${["moderate", "severe"].includes(severity) ? "flagged" : "unflagged"},
            updatedAt = NOW()
        WHERE projectId = ${projectId}
      `;
    } else if (record.judge2id === judgeId || !record.judge2id) {
      // Update Judge2
      updateQuery = sql`
        UPDATE ethics
        SET judge2id = ${judgeId},
            judge2_severity = ${severity},
            judge2_comment = ${comment},
            flag_status = ${["moderate", "severe"].includes(severity) ? "flagged" : "unflagged"},
            updatedAt = NOW()
        WHERE projectId = ${projectId}
      `;
    } else {
      // Both judge1 and judge2 slots taken
      return res.status(400).json({ error: "This project already has 2 judges assigned" });
    }

    await updateQuery;
    res.status(200).json({ message: "Ethics record updated successfully" });
  } catch (error) {
    console.error("Error submitting ethics review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
