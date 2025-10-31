import { sql } from "../config/db.js";
import WebSocketContext from "../utils/WebSocketContext.js";
//import { sendPushNotification } from "../controllers/notificationControllers.js";
import fetch from "node-fetch"; // or 'import fetch from "cross-fetch"' if you use that
import appEmitter from "../utils/eventEmitter.js";
// Controller function to create a new marksheet
export const createMarksheet = async (req, res) => {
  // Extracting data from the request body
  const {
    projectId,
    ethicsMarksheetId,
    type,
    totalScore,
    section1,
    section2,
    section3,
    section4,
    section5,
    section6,
    section7,
    section8,
    section9,
    section10,
    section11,
    section12,
    section13,
    section14,
    section15,
    section16,
    section17,
    section18,
    section19,
    section20,
    section21,
    section22,
    section23,
    section24,
    section25,
    judgeid, // <-- Make sure judgeid is extracted here
  } = req.body;

  console.log("[MarksheetController] createMarksheet called with:", req.body); // Logging the request body for debugging

  try {
    // Using the imported 'sql' object to execute a SQL INSERT query
    const result = await sql`
            INSERT INTO marksheets (
                projectId, ethicsMarksheetId, type, totalScore, section1, section2, section3, section4, section5, section6, section7, section8, section9, section10, section11, section12, section13, section14, section15, section16, section17, section18, section19, section20, section21, section22, section23, section24, section25, judgeid
            ) VALUES (
                ${projectId}, ${ethicsMarksheetId}, ${type},${totalScore}, ${section1}, ${section2}, ${section3}, ${section4}, ${section5}, ${section6}, ${section7}, ${section8}, ${section9}, ${section10}, ${section11}, ${section12}, ${section13}, ${section14}, ${section15}, ${section16}, ${section17}, ${section18}, ${section19}, ${section20}, ${section21}, ${section22}, ${section23}, ${section24}, ${section25}, ${judgeid}
            ) RETURNING * // Returning all columns of the newly inserted row
        `;
    // Checking if any row was inserted (result should have a length greater than 0)
    if (!result.length) {
      console.log(
        "[MarksheetController] createMarksheet - Failed to create marksheet."
      ); // Logging failure
      return res.status(400).json({ message: "Failed to create marksheet." }); // Sending a 400 Bad Request response
    }
    console.log(
      "[MarksheetController] createMarksheet - Marksheet created successfully:",
      result[0]
    ); // Logging success with the created data
    res.status(201).json({
      message: "Marksheet created successfully",
      marksheet: result[0],
    }); // Sending a 201 Created response with the new marksheet data
  } catch (error) {
    console.error(
      "[MarksheetController] createMarksheet - Error during creation:",
      error
    ); // Logging any errors during the process
    res.status(500).json({ message: "Server error during marksheet creation" }); // Sending a 500 Internal Server Error response
  }
};

// Controller function to create a new ethics marksheet
export const createEthicsMarksheet = async (req, res) => {
  // Extracting data from the request body
  const {
    projectid,
    type,
    overallSeverity,
    section1,
    section2,
    section3,
    section4,
    section5,
    section6,
    section7,
    section8,
    section9,
    section10,
    section11,
    section12,
    section13,
    section14,
    section15,
    section16,
    section17,
    section18,
    section19,
    section20,
    section21,
    section22,
    section23,
    section24,
    section25,
    judgecomment,
    judgeid,
    section26,
    section27,
    section28,
    section29,
    section30,
    section31,
    section32,
  } = req.body;

  console.log(
    "[EthicsMarksheetController] createEthicsMarksheet called with:",
    req.body
  );

  try {
    // Convert string IDs to integers and validate
    const projectIdInt = Number(req.body.projectId);
    const judgeIdInt = Number(req.body.judgeid);

    console.log(
      "Incoming projectId:",
      req.body.projectId,
      "→ parsed:",
      projectIdInt
    );
    console.log("Incoming judgeid:", req.body.judgeid, "→ parsed:", judgeIdInt);

    if (isNaN(projectIdInt)) {
      return res
        .status(400)
        .json({ message: "Invalid projectId - must be a valid number" });
    }

    if (isNaN(judgeIdInt)) {
      return res
        .status(400)
        .json({ message: "Invalid judgeid - must be a valid number" });
    }

    // Validate severity levels
    const validSeverities = ["none", "moderate", "severe"];
    const severity = overallSeverity?.toLowerCase() || "none";

    if (!validSeverities.includes(severity)) {
      return res.status(400).json({
        message: "Invalid overallSeverity - must be: none, moderate, or severe",
      });
    }

    // SQL INSERT query for the ethicsMarksheets table
    const result = await sql`
      INSERT INTO ethicsMarksheets (
        projectId, type, overallSeverity,
        section1, section2, section3, section4, section5, section6, section7, section8,
        section9, section10, section11, section12, section13, section14, section15, section16,
        section17, section18, section19, section20, section21, section22, section23, section24,
        section25, judgecomment, judgeid, section26, section27, section28, section29, section30, 
        section31, section32
      ) VALUES (
        ${projectIdInt}, 
        ${type || ""}, 
        ${severity}, 
        ${section1 || false}, ${section2 || false}, ${section3 || false}, ${section4 || false}, 
        ${section5 || false}, ${section6 || false}, ${section7 || false}, ${section8 || false}, 
        ${section9 || false}, ${section10 || false}, ${section11 || false}, ${section12 || false}, 
        ${section13 || false}, ${section14 || false}, ${section15 || false}, ${section16 || false}, 
        ${section17 || false}, ${section18 || false}, ${section19 || false}, ${section20 || false}, 
        ${section21 || false}, ${section22 || false}, ${section23 || false}, ${section24 || false}, 
        ${section25 || false}, 
        ${judgecomment || ""}, 
        ${judgeIdInt}, 
        ${section26 || false}, ${section27 || false}, ${section28 || false}, ${section29 || false}, 
        ${section30 || false}, ${section31 || false}, ${section32 || false}
      ) RETURNING *
    `;

    // Checking if the insertion was successful
    if (!result.length) {
      return res
        .status(400)
        .json({ message: "Failed to create ethics marksheet." });
    }

    res.status(201).json({
      message: "Ethics marksheet created successfully",
      ethicsMarksheet: result[0],
    });
  } catch (error) {
    console.error("Ethics marksheet creation error:", error);

    // Handle specific database errors
    if (error.code === "23502") {
      return res.status(400).json({
        message: "Database constraint violation - missing required field",
        details: error.detail,
      });
    }

    if (error.code === "23503") {
      return res.status(400).json({
        message:
          "Foreign key constraint violation - invalid project or judge ID",
      });
    }

    res.status(500).json({
      message: "Server error during ethics marksheet creation",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Controller function to retrieve all marksheets (only id and type)
export const getAllMarksheets = async (req, res) => {
  try {
    // SQL SELECT query to fetch marksheetId and type from the marksheets table
    const marksheets = await sql`
            SELECT marksheetId, type
            FROM marksheets
        `;
    res.status(200).json(marksheets); // Sending a 200 OK response with the fetched marksheets
  } catch (error) {
    console.error("Error fetching marksheets:", error); // Logging any errors during fetching
    res.status(500).json({ message: "Failed to fetch marksheets." }); // Sending a 500 response on failure
  }
};

// Controller function to assign a marksheet to a specific project
export const assignMarksheetToProject = async (req, res) => {
  const { projectId } = req.params; // Extracting projectId from the URL parameters
  const { marksheetId } = req.body; // Extracting marksheetId from the request body

  try {
    // SQL UPDATE query to set the assignedMarksheetId for a given project
    const result = await sql`
            UPDATE projects
            SET assignedMarksheetId = ${marksheetId}
            WHERE projectid = ${projectId}
            RETURNING * // Returning the updated project data
        `;

    // Checking if any project was updated
    if (result.length > 0) {
      res.status(200).json({
        message: "Marksheet assigned successfully",
        project: result[0],
      }); // Sending a 200 response with the updated project
    } else {
      res.status(404).json({ message: "Project not found." }); // Sending a 404 response if the project with the given ID doesn't exist
    }
  } catch (error) {
    console.error("Error assigning marksheet:", error); // Logging any errors during assignment
    res.status(500).json({ message: "Failed to assign marksheet." }); // Sending a 500 response on failure
  }
};

// Controller function to retrieve a specific marksheet by its ID
export const getMarksheetById = async (req, res) => {
  try {
    const { id } = req.params; // Extracting the marksheet ID from the URL parameters
    // SQL SELECT query to fetch a marksheet based on its ID
    const marksheet = await sql`
            SELECT *
            FROM marksheets
            WHERE marksheetid = ${id}
        `;
    // Checking if a marksheet with the given ID was found
    console.log(marksheet);
    if (marksheet.length > 0) {
      res.status(200).json(marksheet[0]); // Sending a 200 response with the marksheet data
    } else {
      res.status(404).json({ message: "Marksheet not found" }); // Sending a 404 response if the marksheet with the given ID doesn't exist
    }
  } catch (error) {
    console.error("Error fetching marksheet:", error); // Logging any errors during fetching
    res.status(500).json({ message: "Failed to fetch marksheet." }); // Sending a 500 response on failure
  }
};

// Controller function to seed the database with some empty regular marksheets (for development/testing)
export const seedRegularMarksheets = async (req, res) => {
  try {
    const mockMarksheets = [
      {
        projectId: null,
        ethicsMarksheetId: null,
        type: "mathematics",
        totalScore: 0,
      },
      {
        projectId: null,
        ethicsMarksheetId: null,
        type: "social-science",
        totalScore: 0,
      },
      {
        projectId: null,
        ethicsMarksheetId: null,
        type: "scientific-investigations",
        totalScore: 0,
      },
      {
        projectId: null,
        ethicsMarksheetId: null,
        type: "engineering",
        totalScore: 0,
      },
    ];

    // Looping through the mock marksheets and inserting them into the database
    for (let i = 0; i < mockMarksheets.length; i++) {
      const m = mockMarksheets[i];
      await sql`
                INSERT INTO marksheets (
                    projectId, ethicsMarksheetId, type, totalScore,
                    section1, section2, section3, section4, section5, section6, section7, section8,
                    section9, section10, section11, section12, section13, section14, section15, section16,
                    section17, section18, section19, section20, section21, section22, section23, section24, section25,
                    judgeid -- Assuming a default or null judgeid for seeding
                ) VALUES (
                    ${m.projectId}, ${m.ethicsMarksheetId}, ${m.type}, ${m.totalScore},
                    NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
                    NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
                    NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL -- Default to NULL for judgeid
                )
            `;
    }

    res.status(201).json({ message: "Empty marksheets seeded successfully" }); // Sending a 201 response after successful seeding
  } catch (error) {
    console.error("Error seeding empty marksheets:", error); // Logging any errors during seeding
    res.status(500).json({ message: "Failed to seed marksheets" }); // Sending a 500 response on failure
  }
};

// Controller function to create both an ethics marksheet and a regular marksheet, and then assign the regular one to a project
export const createAndAssignMarksheet = async (req, res) => {
  const { projectId, type, judgeid } = req.body; // judgeid is already being extracted here

  console.log(
    `[MarksheetController] createAndAssignMarksheet called with projectId: ${projectId}, type: ${type}, judgeid: ${judgeid}`
  );

  try {
    // 1. Create ethics marksheet
    const createEthicsResult = await sql`
            INSERT INTO ethicsMarksheets (
                projectId, type, overallSeverity,
                section1, section2, section3, section4, section5, section6, section7, section8,
                section9, section10, section11, section12, section13, section14, section15, section16,
                section17, section18, section19, section20, section21, section22, section23, section24, 
                section25, judgecomment, judgeid, section26, section27, section28, section29, section30, section31, section32
            ) VALUES (
                ${projectId}, 'ethics', 'none',
                false, false, false, false, false, false, false, false,
                false, false, false, false, false, false, false, false,
                false, false, false, false, false, false, false, false,
                false,'',${judgeid},false, false, false, false, false, false, false
                
            )
            RETURNING ethicsMarksheetId
        `;

    if (!createEthicsResult.length) {
      console.error(
        "[MarksheetController] createAndAssignMarksheet - Failed to create ethics marksheet."
      );
      return res
        .status(400)
        .json({ message: "Failed to create ethics marksheet." });
    }

    const newEthicsMarksheetId = createEthicsResult[0].ethicsmarksheetid;
    console.log(
      "[MarksheetController] createAndAssignMarksheet - Ethics marksheet created with ID:",
      newEthicsMarksheetId
    );

    // 2. Create regular marksheet linked to ethics marksheet
    const createMarksheetResult = await sql`
            INSERT INTO marksheets (
                projectId, ethicsMarksheetId, type, totalScore,
                section1, section2, section3, section4, section5, section6, section7, section8,
                section9, section10, section11, section12, section13, section14, section15, section16,
                section17, section18, section19, section20, section21, section22, section23, section24, section25, judgeid
            ) VALUES (
                ${projectId}, ${newEthicsMarksheetId}, ${type}, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, ${judgeid}
            )
            RETURNING marksheetId
        `;

    if (!createMarksheetResult.length) {
      console.error(
        "[MarksheetController] createAndAssignMarksheet - Failed to create regular marksheet."
      );
      return res
        .status(400)
        .json({ message: "Failed to create regular marksheet." });
    }

    const newMarksheetId = createMarksheetResult[0].marksheetid;
    console.log(
      "[MarksheetController] createAndAssignMarksheet - Regular marksheet created with ID:",
      newMarksheetId
    );

    // 3. Assign marksheet to project
    const assignResult = await sql`
            UPDATE projects
            SET assignedmarksheetid = ${newMarksheetId}
            WHERE projectid = ${projectId}
            RETURNING *
        `;

    if (!assignResult.length) {
      console.warn(
        "[MarksheetController] createAndAssignMarksheet - Project not found or assignment failed."
      );
    } else {
      console.log(
        "[MarksheetController] createAndAssignMarksheet - Marksheet assigned to project."
      );
    }

    res.status(201).json({
      message: "Marksheet created and assigned successfully",
      marksheetId: newMarksheetId,
    });
  } catch (error) {
    console.error(
      "[MarksheetController] createAndAssignMarksheet - Error:",
      error
    );
    res.status(500).json({
      message: "Server error during marksheet creation and assignment",
    });
  }
};

// Controller function to get projects with details needed for judging (joining data from multiple tables)
export const getProjectsWithDetailsForJudging = async (req, res) => {
  try {
    const projectsWithDetails = await sql`
            SELECT DISTINCT ON (p.projectid)
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
            LEFT JOIN marksheets AS ms ON p.assignedmarksheetid = ms.marksheetId
            ORDER BY p.projectid, ms.marksheetId DESC;
        `;

    //console.log("Projects with details from database:", projectsWithDetails); // Logging the fetched data

    // Checking if any projects were found
    if (projectsWithDetails.length > 0) {
      res.status(200).json(projectsWithDetails); // Sending a 200 response with the fetched project details
    } else {
      res.status(404).json({ message: "No projects found." }); // Sending a 404 response if no projects were found
    }
  } catch (error) {
    console.error(
      "Error fetching projects with learner details for judging:",
      error
    ); // Logging any errors during fetching
    res.status(500).json({ message: "Failed to fetch projects with details." }); // Sending a 500 response on failure
  }
};

// Controller function to update an existing marksheet by its ID

// Helper function to send push notifications via Expo
async function sendPushNotification(expoPushToken, message) {
  if (!expoPushToken) return;

  const body = {
    to: expoPushToken,
    sound: "default",
    title: "Conflict Alert",
    body: message,
    data: { someData: "goes here" },
  };

  try {
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (data.errors) {
      console.error("Expo push notification errors:", data.errors);
    }
  } catch (err) {
    console.error("Error sending push notification:", err);
  }
}

export const updateMarksheet = async (req, res) => {
  const { marksheetId } = req.params;
  const {
    projectId,
    judgeId, // Optional; fallback to DB if not sent
    ethicsMarksheetId,
    type,
    totalScore,
    section1,
    section2,
    section3,
    section4,
    section5,
    section6,
    section7,
    section8,
    section9,
    section10,
    section11,
    section12,
    section13,
    section14,
    section15,
    section16,
    section17,
    section18,
    section19,
    section20,
    section21,
    section22,
    section23,
    section24,
    section25,
  } = req.body;
 
  console.log("Marksheet type:", type);
  try {
    const resultSheet = await sql`
      UPDATE marksheets
      SET
        totalScore = ${totalScore},
        type = ${type},
        section1 = ${section1}, section2 = ${section2}, section3 = ${section3},
        section4 = ${section4}, section5 = ${section5}, section6 = ${section6},
        section7 = ${section7}, section8 = ${section8}, section9 = ${section9},
        section10 = ${section10}, section11 = ${section11}, section12 = ${section12},
        section13 = ${section13}, section14 = ${section14}, section15 = ${section15},
        section16 = ${section16}, section17 = ${section17}, section18 = ${section18},
        section19 = ${section19}, section20 = ${section20}, section21 = ${section21},
        section22 = ${section22}, section23 = ${section23}, section24 = ${section24},
        section25 = ${section25}
      WHERE marksheetId = ${marksheetId}
      RETURNING *
    `;

    if (!resultSheet.length) {
      return res
        .status(404)
        .json({ message: "Marksheet not found or not updated." });
    }

    const [projectInfo] = await sql`SELECT eventid FROM projects WHERE projectid = ${projectId}`;
    if (!projectInfo) {
      // This is an important check in case the project is deleted while being marked
      return res.status(404).json({ message: "Associated project not found." });
    }
    const { eventid } = projectInfo;

    const marksheets = await sql`
      SELECT * FROM marksheets WHERE projectid = ${projectId}
    `;
    console.log(
      `[MarksheetController] updateMarksheet - Marksheets for project ID ${projectId}:`
    );

    // loop through marksheets to see if marksheettypes are the same
    let sameType = true;
    for (let i = 1; i < marksheets.length; i++) {
      if (marksheets[i].type === "none" || marksheets[0].type === "none") {
        break;
      }
      if (marksheets[i].type !== marksheets[0].type) {
        // create a marksheet type conflict
        await sql`
          INSERT INTO marksheetconflicts (projectid, marksheetid1, marksheetid2, type1, type2)
          VALUES (${projectId}, ${marksheets[0].marksheetid}, ${marksheets[i].marksheetid}, ${marksheets[0].type}, ${marksheets[i].type})
        `;
        sameType = false;
        break;
      }
    }

    // check if total of both marksheets is zero - if so the return 
    // this was likely a marksheet type update
    if (marksheets.length === 2 && sameType) {
      if (marksheets[0].totalscore === 0 && marksheets[1].totalscore === 0) {
        appEmitter.emit('marksheet-updated', {
            eventId: eventid,
            projectId: projectId,
            message: `A marksheet type was updated for project ${projectId}.`
        });
        
        return res.status(200).json({
          message: "Marksheet type updated successfully",
          marksheets: resultSheet[0],
        });
      }
    }

    // add 20 points for the judge
    if (judgeId) {
      await sql`
        UPDATE judges
        SET points = points + 20
        WHERE userId = ${judgeId}
      `;
    }

    // check if all marksheets are completed (total score > 0)
    let completed = false;
    if (marksheets.length > 0) {
      for (const m of marksheets) {
        if (m.totalscore === 0) {
          completed = false;
          break;
        } else {
          completed = true;
        }
      }
    }

    console.log(
      `Marksheet types: Marksheet 1 - ${marksheets[0].type}, Marksheet 2 - ${marksheets[1].type}`
    );

    if (completed) {
      if (marksheets.length === 1) {
        console.log(
          `[MarksheetController] updateMarksheet - Marksheet updated successfully for project ID ${projectId}`
        );

        return res.status(200).json({
          message: "Marksheet updated successfully",
          marksheet: resultSheet[0],
        });
      }

      const project = await sql`
        SELECT * FROM projects WHERE projectid = ${projectId}
      `;
      if (project.length === 0) {
        console.error(
          `[MarksheetController] updateMarksheet - Could not change project status with ID ${projectId}`
        );
        return res
          .status(500)
          .json({ message: "Failed to update project status to completed." });
      }

      let sameRank = false;
      const score1 = marksheets[0].totalscore;
      const score2 = marksheets[1].totalscore;

      if (Math.floor(score1 / 10) === Math.floor(score2 / 10)) {
        sameRank = true;
      }

      if (!sameRank) {
        await sql`
          UPDATE projects
          SET status = 'completed'
          WHERE projectid = ${projectId}
          RETURNING *
      `;

        const conflictResult = await sql`
          INSERT INTO conflicts (projectid, judgeid1, judgeid2, status, judge1mark, judge2mark)
          VALUES (${projectId}, ${marksheets[0].judgeid}, ${marksheets[1].judgeid}, 'pending', ${marksheets[0].totalscore}, ${marksheets[1].totalscore})
          RETURNING *
        `;

        if (conflictResult.length === 0) {
          console.error(
            `[MarksheetController] updateMarksheet - Could not create conflict for project ID ${projectId}`
          );
          return res
            .status(500)
            .json({ message: "Failed to create conflict for project." });
        }
        console.log(
          `[MarksheetController] updateMarksheet - Conflict created for project ID ${projectId}`
        );

        const judgeId1 = marksheets[0].judgeid;
        const judgeId2 = marksheets[1].judgeid;

        const conflictsForJudge1 = await sql`
            SELECT * FROM conflicts WHERE judgeid1 = ${judgeId1} OR judgeid2 = ${judgeId1}
        `;
        WebSocketContext.sendToUser(judgeId1, {
          type: "conflict_update",
          conflicts: conflictsForJudge1,
        });

        const conflictsForJudge2 = await sql`
            SELECT * FROM conflicts WHERE judgeid1 = ${judgeId2} OR judgeid2 = ${judgeId2}
        `;
        WebSocketContext.sendToUser(judgeId2, {
          type: "conflict_update",
          conflicts: conflictsForJudge2,
        });

        // --- Fetch Expo Push Tokens for both judges ---
        const judgeTokens = await sql`
          SELECT userId, expo_push_token FROM judges
          WHERE userId = ${marksheets[0].judgeid} OR userId = ${marksheets[1].judgeid}
        `;

        // Map tokens by judgeId for convenience
        const tokensByJudge = {};
        for (const jt of judgeTokens) {
          tokensByJudge[jt.userid] = jt.expo_push_token;
        }

        // Compose notification message
        const message = `A scoring conflict was detected for project ID ${projectId}. Please review and resolve it.`;

        // Send push notifications concurrently
        await Promise.all([
          sendPushNotification(tokensByJudge[marksheets[0].judgeid], message),
          sendPushNotification(tokensByJudge[marksheets[1].judgeid], message),
        ]);

        appEmitter.emit('marksheet-updated', {
            eventId: eventid,
            projectId: projectId,
            message: `Scores submitted for project ${projectId}, a conflict was created.`
        });

        return res.status(200).json({
          message:
            "Marksheet updated successfully, conflict created and judges notified.",
        });
      } else {
        const badgeMark = Math.floor(score1 / 10);

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
          SET badge = ${badge},totalscore = ${totalScore},status = 'completed'
          WHERE projectid = ${projectId}
          RETURNING *
      `;
        
        appEmitter.emit('marksheet-updated', {
            eventId: eventid,
            projectId: projectId,
            message: `Scores submitted and badge awarded for project ${projectId}.`
        });
        return res.status(200).json({
          message:
            "Marksheet updated successfully, conflict created and judges notified.",
        });
      }
    }

    // If not completed or no conflict:
    await sql`
      UPDATE projects
      SET status = 'in-progress'
      WHERE projectid = ${projectId}
    `;
    appEmitter.emit('marksheet-updated', {
        eventId: eventid,
        projectId: projectId,
        message: `A score was updated for project ${projectId}.`
    });

    
    res.status(200).json({
      message: "Marksheet updated successfully",
      marksheet: resultSheet[0],
    });
  } catch (error) {
    console.error("[MarksheetController] updateMarksheet - Error:", error);
    res.status(500).json({ message: "Server error during marksheet update." });
  }
};

// Controller function to update an existing ethics marksheet by its ID
// ...existing code...

export const updateEthicsMarksheet = async (req, res) => {
  const { ethicsMarksheetId } = req.params;
  console.log(
    "[MarksheetController] updateEthicsMarksheet - Called with ID:",
    ethicsMarksheetId
  );
  const {
    projectid,
    overallSeverity,
    section1,
    section2,
    section3,
    section4,
    section5,
    section6,
    section7,
    section8,
    section9,
    section10,
    section11,
    section12,
    section13,
    section14,
    section15,
    section16,
    section17,
    section18,
    section19,
    section20,
    section21,
    section22,
    section23,
    section24,
    section25,
    judgecomment,
    judgeid,
    section26,
    section27,
    section28,
    section29,
    section30,
    section31,
    section32,
  } = req.body;

  if (!ethicsMarksheetId) {
    return res
      .status(400)
      .json({ message: "Missing ethicsMarksheetId in URL." });
  }
  console.log(
    "[MarksheetController] updateEthicsMarksheet - Called with ID:",
    projectid
  );
  try {
    // Update the ethicsMarksheets table
    const result = await sql`
      UPDATE ethicsMarksheets
      SET
       
        overallSeverity = ${overallSeverity},
        section1 = ${section1}, section2 = ${section2}, section3 = ${section3},
        section4 = ${section4}, section5 = ${section5}, section6 = ${section6},
        section7 = ${section7}, section8 = ${section8}, section9 = ${section9},
        section10 = ${section10}, section11 = ${section11}, section12 = ${section12},
        section13 = ${section13}, section14 = ${section14}, section15 = ${section15},
        section16 = ${section16}, section17 = ${section17}, section18 = ${section18},
        section19 = ${section19}, section20 = ${section20}, section21 = ${section21},
        section22 = ${section22}, section23 = ${section23}, section24 = ${section24},
        section25 = ${section25},judgecomment = ${judgecomment},
        judgeid = ${judgeid}, section26 = ${section26}, section27 = ${section27},
        section28 = ${section28}, section29 = ${section29}, section30 = ${section30},
        section31 = ${section31}, section32 = ${section32}
      WHERE ethicsMarksheetId = ${ethicsMarksheetId}
      RETURNING *;
    `;

    if (!result.length) {
      return res
        .status(404)
        .json({ message: "Ethics marksheet not found or not updated." });
    }

    const ethicsMarksheet = result[0];
    const finalProjectId = projectid || ethicsMarksheet.projectid;

    if (!finalProjectId) {
      return res.status(400).json({
        message: "Project ID is missing in both body and updated record.",
      });
    }

    // Always upsert judge info into the ethics table
    let ethicsRecord = await sql`
      SELECT * FROM ethics WHERE projectId = ${finalProjectId};
    `;

    // Determine if this judge is judge1 or judge2 in the ethics table
    if (ethicsRecord.length === 0) {
      // Insert new ethics record, set judge1Id and info
      await sql`
        INSERT INTO ethics (
          projectId,
          judge1Id,
          judge1_comment,
          judge1_severity,
          createdAt,
          updatedAt
        ) VALUES (
          ${finalProjectId},
          ${judgeid},
          ${judgecomment},
          ${overallSeverity},
          NOW(),
          NOW()
        );
      `;
    } else {
      const ethics = ethicsRecord[0];
      if (!ethics.judge1id || ethics.judge1id === judgeid) {
        // Fill judge1 slot
        await sql`
          UPDATE ethics
          SET
            judge1Id = ${judgeid},
            judge1_comment = ${judgecomment},
            judge1_severity = ${overallSeverity},
            updatedAt = NOW()
          WHERE projectId = ${finalProjectId};
        `;
      } else if (!ethics.judge2id || ethics.judge2id === judgeid) {
        // Fill judge2 slot
        await sql`
          UPDATE ethics
          SET
            judge2Id = ${judgeid},
            judge2_comment = ${judgecomment},
            judge2_severity = ${overallSeverity},
            updatedAt = NOW()
          WHERE projectId = ${finalProjectId};
        `;
      }
      // else: both judge slots are filled, do not overwrite
    }

    return res.status(200).json({
      message:
        "Ethics marksheet updated and judge info recorded in ethics table.",
      ethicsMarksheet,
    });
  } catch (error) {
    console.error("[updateEthicsMarksheet] Error:", error);
    return res
      .status(500)
      .json({ message: "Server error during ethics marksheet update." });
  }
};
// ...existing code...
// Controller function to retrieve all projects for the judge
export const getAllProjectsForJudge = async (req, res) => {
  const { judgeid } = req.params;

  if (!judgeid) {
    return res.status(400).json({ message: "Judge ID is required" });
  }

  try {
    const result = await sql`
        SELECT p.*, ms.type AS marksheettype, em.overallseverity as ethicsOverallSeverity
        FROM projects p
        JOIN marksheets ms ON p.projectid = ms.projectid
        LEFT JOIN ethicsMarksheets em ON ms.ethicsMarksheetId = em.ethicsMarksheetId -- Join to get ethics severity
        WHERE ms.judgeid = ${judgeid}
      `;

    //console.log(
    //  "[MarksheetController] getAllProjectsForJudge - Retrieved projects:",
    //  result
    //);

    if (!result.length) {
      return res
        .status(404)
        .json({ message: "No marksheets found for this judge" });
    }

    res.status(200).json({
      projects: result || [],
      message: !result.length
        ? "No marksheets found for this judge."
        : "Marksheets retrieved successfully.",
    });
  } catch (error) {
    console.error("Error retrieving projects:", error);
    res.status(500).json({ message: "Failed to retrieve projects." });
  }
};

// function to change the type of a marksheet using marksheetId and type
export const changeMarksheetType = async (req, res) => {
  const { projectId } = req.params;
  const { type } = req.body;

  console.log("[MarksheetController] changeMarksheetType called with:", {
    projectId,
    type,
  });

  if (!projectId || !type) {
    return res
      .status(400)
      .json({ message: "Project ID and type are required" });
  }

  try {
    const result = await sql`
      UPDATE marksheets
      SET type = ${type}
      WHERE projectid = ${projectId}
      RETURNING projectid, judgeid, type, totalscore, ethicsmarksheetid
    `;

    //console.log("[MarksheetController] changeMarksheetType - Result:", result);

    if (!result.length) {
      return res.status(404).json({ message: "Marksheets not found" });
    }

    res.status(200).json({
      message: "Marksheets type updated successfully",
      marksheet: result[0],
    });
  } catch (error) {
    console.error("[MarksheetController] changeMarksheetType - Error:", error);
    res
      .status(500)
      .json({ message: "Server error during marksheets type change." });
  }
};

// funtion to get marksheet by judgeId and projectId joining marksheets and projectjudges tables
export const getMarksheetByJudgeAndProject = async (req, res) => {
  const { judgeId, projectId } = req.params;

  if (!judgeId || !projectId) {
    return res
      .status(400)
      .json({ message: "Judge ID and Project ID are required" });
  }

  try {
    // retrieve marksheet using judgeId and projectId
    const result = await sql`
        SELECT m.*
        FROM marksheets m
        WHERE m.judgeid = ${judgeId} AND m.projectid = ${projectId}
      `;

    if (!result.length) {
      return res
        .status(404)
        .json({ message: "No marksheet found for this judge and project" });
    }

    res.status(200).json(result[0]);
  } catch (error) {
    console.error("Error retrieving marksheet:", error);
    res.status(500).json({ message: "Failed to retrieve marksheet." });
  }
};

// Controller to get totalscore for both judges for a specific project

export const getCoJudgesTotalScores = async (req, res) => {
  const { projectId } = req.params;

  if (!projectId) {
    return res.status(400).json({ message: "Project ID is required" });
  }

  try {
    const result = await sql`
      SELECT m.judgeid, m.totalscore, u.name AS judge_name
      FROM marksheets m
      LEFT JOIN users u ON m.judgeid = u.userid
      WHERE m.projectid = ${projectId}
      ORDER BY m.judgeid
    `;

    console.log(
      "[MarksheetController] getCoJudgesTotalScores - Result:",
      result
    );

    if (!result.length) {
      return res
        .status(404)
        .json({ message: "No marksheets found for this project" });
    }

    res.status(200).json({
      projectId,
      scores: result.map((r) => ({
        judgeId: r.judgeid,
        judgeName: r.judge_name,
        totalScore: r.totalscore,
      })),
    });
  } catch (error) {
    console.error("Error fetching co-judges' totalscores:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch co-judges' totalscores." });
  }
};

// Convener override total score for a project (updates both judges' totalscore)
export const overrideTotalScoreByConvener = async (req, res) => {
  const { projectId } = req.params;
  const { userId, newTotalScore } = req.body;

  if (!projectId || !userId || typeof newTotalScore !== "number") {
    return res
      .status(400)
      .json({ message: "projectId, userId, and newTotalScore are required" });
  }

  // Check if user is a convener
  const convenerResult = await sql`
    SELECT category FROM conveners WHERE userId = ${userId}
  `;
  if (convenerResult.length === 0) {
    return res.status(403).json({ message: "User is not a convener" });
  }

  try {
    // Update totalscore for all marksheets for this project (both judges)
    const updateResult = await sql`
      UPDATE marksheets
      SET totalscore = ${newTotalScore}
      WHERE projectid = ${projectId}
      RETURNING marksheetid, judgeid, totalscore
    `;

    console.log(
      "[MarksheetController] overrideTotalScoreByConvener - Update Result:",
      updateResult
    );

    if (!updateResult.length) {
      return res
        .status(404)
        .json({ message: "No marksheets found for this project" });
    }

    res.status(200).json({
      message: "Total score overridden by convener for both judges",
      projectId,
      newTotalScore,
      updated: updateResult,
    });
  } catch (error) {
    console.error("Error overriding total score by convener:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller function to retrieve a specific ethics marksheet by its ID
export const getEthicsMarksheetById = async (req, res) => {
  const { ethicsMarksheetId } = req.params;
  console.log(
    "[MarksheetController] getEthicsMarksheetById - Called with ID:",
    ethicsMarksheetId
  );
  try {
    const result = await sql`
      SELECT * FROM ethicsmarksheets WHERE ethicsmarksheetid = ${ethicsMarksheetId}
    `;
    console.log(
      "[MarksheetController] getEthicsMarksheetById - Result:",
      result
    );
    if (result.length === 0) {
      return res.status(404).json({ message: "Ethics marksheet not found" });
    }

    res.status(200).json(result[0]);
  } catch (error) {
    console.error("Error fetching ethics marksheet:", error);
    res.status(500).json({ message: "Failed to fetch ethics marksheet." });
  }
};

// Get latest ethics marksheet for a judge and project
export const getLatestEthicsMarksheet = async (req, res) => {
  const { projectId, judgeId } = req.query;

  if (!projectId || !judgeId) {
    return res
      .status(400)
      .json({ error: "Missing projectId or judgeId query parameters." });
  }

  try {
    const result = await sql`
      SELECT *
      FROM ethicsMarksheets
      WHERE projectId = ${projectId} AND judgeid = ${judgeId}
      ORDER BY ethicsMarksheetId DESC
      LIMIT 1
    `;

    if (result.length === 0) {
      return res.status(404).json({
        message: "No ethics marksheet found for this project and judge.",
      });
    }

    res.status(200).json(result[0]);
  } catch (error) {
    console.error("Error fetching latest ethics marksheet:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
