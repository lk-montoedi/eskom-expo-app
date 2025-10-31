import { sql } from "../config/db.js";

export const getJudgeConflicts = async (req, res) => {
  const { judgeId } = req.params;
  const conflicts = await sql`
        SELECT *, p.*, c.status AS conflictStatus
        FROM conflicts c
        JOIN projects p ON c.projectid = p.projectid
        WHERE judgeid1 = ${judgeId} OR judgeid2 = ${judgeId}
  `;
  if (!conflicts.length) {
    return res.status(404).json({ message: "No conflicts found" });
  }
  return res.status(200).json({ conflicts });
};

export const getJudgeMarksheetConflicts = async (req, res) => {
  const { judgeId } = req.params;
  try {
    const judge = await sql`
      SELECT * FROM judges WHERE userid = ${judgeId}
    `;
    if (!judge.length) {
      return res.status(404).json({ message: "Judge not found" });
    }

    const user = await sql`
      SELECT * FROM users WHERE userid = ${judgeId}
    `;

    let conflicts = await sql`
      SELECT 
        mc.*, m.*, p.projectid, p.projectname, p.category, p.standnumber, p.description
      FROM marksheetconflicts mc
      JOIN marksheets m ON mc.projectid = m.projectid
      JOIN projects p ON mc.projectid = p.projectid
      WHERE m.judgeid = ${judgeId} and mc.status = 'pending'
    `;

    if (user[0].role.toLowerCase() === "convener") {
      conflicts = await sql`
        SELECT 
          mc.*, m.*
        FROM marksheetconflicts mc
        JOIN marksheets m ON mc.projectid = m.projectid
        JOIN projects p ON m.projectid = p.projectid
        WHERE p.category = ${judge[0].firstcategory} AND mc.status = 'pending'
      `;
    }

    if (!conflicts.length) {
      return res.status(404).json({ message: "No marksheet conflicts found" });
    }

    return res.status(200).json({ conflicts });
  } catch (error) {
    console.error("Error fetching marksheet conflicts:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const resolveMarksheetConflict = async (req, res) => {
  const { conflictId } = req.params;
  const { type } = req.body;
  try {
    // fetch the 2 marksheets and update their types to new type
    const marksheets = await sql`
      SELECT * FROM marksheets WHERE marksheetid = ANY (
        SELECT marksheetid1 FROM marksheetconflicts WHERE id = ${conflictId}
        UNION
        SELECT marksheetid2 FROM marksheetconflicts WHERE id = ${conflictId}
      )
    `;
    if (marksheets.length !== 2) {
      return res
        .status(404)
        .json({ message: "Could not find both marksheets for this conflict" });
    }
    await sql`
      UPDATE marksheets
      SET type = ${type}
      WHERE marksheetid = ${marksheets[0].marksheetid} OR marksheetid = ${marksheets[1].marksheetid}
    `;

    const result = await sql`
      UPDATE marksheetconflicts
      SET 
        status = 'resolved'
      WHERE id = ${conflictId} OR marksheetid1 = ${marksheets[0].marksheetid} OR marksheetid2 = ${marksheets[1].marksheetid} OR marksheetid1 = ${marksheets[1].marksheetid} OR marksheetid2 = ${marksheets[0].marksheetid}
      RETURNING *;
    `;
    if (!result.length) {
      return res.status(404).json({ message: "Conflict not found" });
    }
    return res.status(200).json({
      message: "Marksheet conflict resolved successfully",
      conflict: result[0],
    });
  } catch (error) {
    console.error("Error resolving marksheet conflict:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// By event ID
export const getAllConflicts = async (req, res) => {
  try {
    const conflicts = await sql`
      SELECT 
        c.conflictid,
        c.projectid,
        c.judgeid1,
        c.judgeid2,
        c.status,
        c.judge1mark,
        c.judge2mark,
        c.agreedmark,
        c.meetrequested,
        c.updatedat,
        
        j1.userid AS judge1_id,
        u1.role AS judge1_role,
        u1.userid AS judge1_userid,
        u1.name AS judge1_firstname,
        u1.surname AS judge1_lastname,
        u1.email AS judge1_email,

        j2.userid AS judge2_id,
        u2.role AS judge2_role,
        u2.userid AS judge2_userid,
        u2.name AS judge2_firstname,
        u2.surname AS judge2_lastname,
        u2.email AS judge2_email,

        p.projectname,
        p.description AS project_description,
        p.category AS project_category,
        p.eventid,

        e.name AS event_name,
        e.type AS event_type,
        e.region AS event_region,
        e.event_status,
        e.timeregistered AS event_timeregistered

      FROM conflicts c
      LEFT JOIN judges j1 ON c.judgeid1 = j1.userid
      LEFT JOIN users u1 ON j1.userid = u1.userid
      LEFT JOIN judges j2 ON c.judgeid2 = j2.userid
      LEFT JOIN users u2 ON j2.userid = u2.userid
      LEFT JOIN projects p ON c.projectid = p.projectid
      LEFT JOIN events e ON p.eventid = e.eventid
    `;

    if (!conflicts.length) {
      return res.status(404).json({ message: "No conflicts found" });
    }

    return res.status(200).json({ conflicts });
  } catch (error) {
    console.error("Error fetching conflicts:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const resolveConflict = async (req, res) => {
  const { conflictId } = req.params;
  const { agreedMark, meetRequested, meetupLocation } = req.body;

  try {
    const result = await sql`
      UPDATE conflicts
      SET 
        agreedmark = ${agreedMark},
        meetrequested = ${meetRequested ?? false},
        meetup_location = ${meetupLocation ?? null},
        status = 'resolved',
        updatedAt = NOW()
      WHERE conflictid = ${conflictId}
      RETURNING *;
    `;

    if (!result.length) {
      return res.status(404).json({ message: "Conflict not found" });
    }

    const badgeMark = Math.floor(agreedMark / 10);

    let badge;
    switch (badgeMark) {
      case 8:
      case 9:
      case 10:
        badge = "gold";
        break;
      case 7:
        badge = "silver";
        break;
      case 6:
        badge = "bronze";
        break;
      default:
        badge = "certificate";
    }

    const totalScore = badgeMark * 10;

    await sql`
        UPDATE projects
        SET badge = ${badge}, totalscore = ${totalScore}
        WHERE projectid = ${result[0].projectid}
        RETURNING *
    `;

    res.status(200).json({
      message: "Conflict resolved successfully",
      conflict: result[0],
    });
  } catch (error) {
    console.error("Error resolving conflict:", error);
    res.status(500).json({ message: "Server error resolving conflict" });
  }
};

export const requestMeetup = async (req, res) => {
  const { conflictId } = req.params;
  try {
    const result = await sql`
      UPDATE conflicts
      SET meetrequested = TRUE, updatedAt = NOW()
      WHERE conflictid = ${conflictId}
      RETURNING *;
    `;
    if (!result.length) {
      return res.status(404).json({ message: "Conflict not found" });
    }
    res.status(200).json({
      message: "Meetup requested successfully",
      conflict: result[0],
    });
  } catch (error) {
    console.error("Error requesting meetup:", error);
    res.status(500).json({ message: "Server error requesting meetup" });
  }
};

export const getMeetups = async (req, res) => {
  const { judgeId } = req.params;
  try {
    const meetups = await sql`
      SELECT 
        c.conflictid,
        c.meetup_location,
        p.projectname,
        u1.name AS judge1_name,
        u1.surname AS judge1_surname,
        u2.name AS judge2_name,
        u2.surname AS judge2_surname
      FROM conflicts c
      JOIN projects p ON c.projectid = p.projectid
      JOIN judges j1 ON c.judgeid1 = j1.userid
      JOIN users u1 ON j1.userid = u1.userid
      JOIN judges j2 ON c.judgeid2 = j2.userid
      JOIN users u2 ON j2.userid = u2.userid
      WHERE (c.judgeid1 = ${judgeId} OR c.judgeid2 = ${judgeId}) 
      AND c.meetrequested = TRUE 
      AND LOWER(c.status) = 'pending'
    `;
    if (!meetups.length) {
      return res.status(404).json({ message: "No meetups found" });
    }
    res.status(200).json({ meetups });
  } catch (error) {
    console.error("Error getting meetups:", error);
    res.status(500).json({ message: "Server error getting meetups" });
  }
};

export const getCategoryConflicts = async (req, res) => {
  const { eventId, judgeId } = req.params;
  try {
    // get judge category
    const categoryResult = await sql`
      SELECT category FROM conveners WHERE userid = ${judgeId}
    `;
    if (!categoryResult.length) {
      return res.status(404).json({ message: "Convener not found" });
    }
    const judgeCategory = categoryResult[0].category;
    // get all projects for event and category
    const projects = await sql`
      SELECT projectid FROM projects 
      WHERE eventid = ${eventId} AND category = ${judgeCategory}
    `;
    if (!projects.length) {
      return res.status(200).json([]);
    }
    // get all conflicts for these projects
    const projectIds = projects.map((project) => project.projectid);
    const query = `
      SELECT 
        c.conflictid,
        c.projectid,
        p.projectname,
        p.standnumber,
        p.category,
        p.description,
        c.status,
        c.meetrequested,
        c.meetup_location as meetuplocation,
        c.agreedmark,
        c.updatedat,
        c.judgeid1,
        u1.name AS judge1_firstname,
        u1.surname AS judge1_lastname,
        u1.email AS judge1_email,
        c.judge1mark,
        c.judgeid2,
        u2.name AS judge2_firstname,
        u2.surname AS judge2_lastname,
        u2.email AS judge2_email,
        c.judge2mark
      FROM conflicts c
      LEFT JOIN users u1 ON c.judgeid1 = u1.userid
      LEFT JOIN users u2 ON c.judgeid2 = u2.userid
      JOIN projects p ON c.projectid = p.projectid
      WHERE c.projectid = ANY($1)
    `;
    const conflictsResult = await sql.query(query, [projectIds]);

    if (!conflictsResult.length) {
      return res.status(200).json([]);
    }

    const formattedConflicts = conflictsResult.map((c) => ({
      conflictid: c.conflictid,
      projectid: c.projectid,
      projectname: c.projectname,
      standnumber: c.standnumber,
      category: c.category,
      description: c.description,
      status: c.status,
      meetrequested: c.meetrequested,
      meetuplocation: c.meetuplocation,
      agreedmark: c.agreedmark,
      updatedat: c.updatedat,
      judge1: {
        judgeid: c.judgeid1,
        fullname: `${c.judge1_firstname} ${c.judge1_lastname}`,
        email: c.judge1_email,
        initialmark: c.judge1mark,
        finalmark: c.agreedmark,
      },
      judge2: {
        judgeid: c.judgeid2,
        fullname: `${c.judge2_firstname} ${c.judge2_lastname}`,
        email: c.judge2_email,
        initialmark: c.judge2mark,
        finalmark: c.agreedmark,
      },
    }));

    return res.status(200).json(formattedConflicts);
  } catch (error) {
    console.error("Error fetching category conflicts:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
