import { sql } from "../config/db.js";
import { createNotification } from "./notificationControllers.js";
import appEmitter from "../utils/eventEmitter.js";

// In convenerControllers.js

export const appoint = async (req, res) => {
  const { eventid } = req.params;
  const { userid, category } = req.body;

  try {
    // Check the judgeattendance table instead of userEvents
    const attendance = await sql`
      SELECT status FROM judgeattendance WHERE judgeId = ${userid} AND eventId = ${eventid}
    `;

    if (attendance.length === 0 || attendance[0].status !== 'present') {
      return res.status(400).json({ error: "Cannot appoint: Judge is not in attendance." });
    }

    // Check if this user is already a convener
    const exists = await sql`
      SELECT * FROM conveners WHERE userid = ${userid}
    `;
    if (exists.length) {
      return res.status(400).json({ error: "User is already a convener for an event." });
    }

    // Fetch yearsJudged from the judges table
    const [judgeProfile] = await sql`
      SELECT yearsJudged FROM judges WHERE userId = ${userid}
    `;

    if (!judgeProfile) {
        return res.status(404).json({ error: "Judge profile not found for this user." });
    }
    const { yearsjudged } = judgeProfile;


    // Insert as convener for the selected category
    await sql`
      INSERT INTO conveners (userid, category, eventid, yearsJudged)
      VALUES (${userid}, ${category}, ${eventid}, ${yearsjudged})
    `;

    // Upgrade role if necessary
    await sql`
      UPDATE users
      SET role = 'convener'
      WHERE userid = ${userid}
    `;    

    // Return the user details
    const [user] = await sql`
      SELECT userid, name AS firstname, surname AS lastname, email
      FROM users
      WHERE userid = ${userid}
    `;


    console.log(`[CONTROLLER] Emitting 'convener-update' for event ${eventid}`);
    appEmitter.emit('convener-update', {
        eventId: eventid,
        message: `Appointed a new convener.`
    });
    res.status(200).json({ ...user, category, yearsjudged });
  } catch (error) {
    console.error("Error appointing convener:", error);
    res.status(500).json({ error: "Failed to appoint convener" });
  }
};

export const getConvenersList = async (eventid) => {
  const result = await sql`
    SELECT c.userid, c.category, u.name AS firstname, u.surname AS lastname, u.email
    FROM conveners c
    JOIN users u ON u.userid = c.userid
    WHERE c.eventid = ${eventid}
  `;
  return result;
};

// POST /api/conveners/:eventid
export const appointConvener = async (req, res) => {
  const { eventid } = req.params;
  const { userid, category } = req.body;

  if (!eventid || !userid || !category) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  console.log(
    `[Convener] automateConvenerAppointment started for eventid: ${eventid}`
  );

  try {
    // retrieve the event to check if it exists
    const event = await sql`
          SELECT * FROM events WHERE eventid = ${eventid}
      `;
    if (!event.length) {
      console.warn(`[Convener] Event not found: ${eventid}`);
      return res.status(404).json({ message: "Event not found" });
    }

    // list of categories at the event
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
    // Ensure user is part of the event (via userEvents)
    const judge = await sql`
      SELECT * FROM userEvents WHERE userid = ${userid} AND eventid = ${eventid}
    `;
    if (!judge.length) {
      return res.status(400).json({ error: "User is not part of this event" });
    }

    // Ensure user is not already a convener
    const exists = await sql`
      SELECT * FROM conveners WHERE userid = ${userid}
    `;
    if (exists.length) {
      return res.status(400).json({ error: "User is already a convener" });
    }

    const [judgeProfile] = await sql`
      SELECT yearsJudged FROM judges WHERE userId = ${userid}
    `;
    if (!judgeProfile) {
        return res.status(404).json({ error: "Judge profile not found." });
    }
    const { yearsjudged } = judgeProfile;

    // Insert into conveners
    await sql`
      INSERT INTO conveners (userid, category, eventid, yearsJudged) VALUES (${userid}, ${category}, ${eventid}, ${yearsjudged})
    `;

    const [user] = await sql`
      SELECT userid, name AS firstname, surname AS lastname, email FROM users WHERE userid = ${userid}
    `;

    res.status(200).json({ ...user, category });
  } catch (error) {
    console.error("Error appointing convener:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// DELETE /api/conveners/:eventid/:userid
export const removeConvenerFromEvent = async (req, res) => {
  const { userid } = req.params;

  try {
    const result = await sql`
      DELETE FROM conveners
      WHERE userid = ${userid}
      RETURNING *
    `;

    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "Convener not found or already removed." });
    }

    console.log(`[CONTROLLER] Emitting 'convener-update' after removal`);
/*   appEmitter.emit('convener-update', {
      // You'll need the eventid here. Make sure it's passed into the function.
      // Assuming your route is /:eventid/:userid
      eventId: req.params.eventid,
      message: `Removed a convener.`
  }); */
    res.status(200).json({ message: "Convener removed successfully." });
  } catch (error) {
    console.error(`Error removing convener with userid ${userid}:`, error);
    res
      .status(500)
      .json({ message: "Internal server error while removing convener." });
  }
};

// GET /api/event/conveners/:eventid
export const getConvenersByEvent = async (req, res) => {
  const { eventid } = req.params;

  try {
    const conveners = await sql`
      SELECT DISTINCT ON  (c.userid)
      c.userid, c.category, c.yearsJudged, u.name AS firstname, u.surname AS lastname, u.email, c.accepted
      FROM conveners c
      JOIN users u ON u.userid = c.userid
      WHERE EXISTS (
        SELECT 1 FROM userEvents ue
        WHERE ue.userid = c.userid AND ue.eventid = ${eventid}
      )
    `;
    res.status(200).json({ conveners });
  } catch (error) {
    console.error("Error fetching conveners:", error);
    res.status(500).json({ error: "Failed to fetch conveners" });
  }
};

export const automateConvenerAppointment = async (req, res) => {
  const { eventid } = req.params;

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
    console.log(`[Convener] Starting allocation for event ${eventid}`);

    // Step 1: Reset roles of existing conveners for this event
    await sql`
      UPDATE users
      SET role = 'judge'
      WHERE userid IN (
        SELECT userid FROM conveners WHERE eventid = ${eventid}
      )
    `;

    // Step 2: Remove previous conveners from this event
    await sql`
      DELETE FROM conveners WHERE eventid = ${eventid}
    `;

    const allNewConveners = [];

    // Step 3: Select conveners per category
    for (const category of categories) {
      const judges = await sql`
        SELECT u.userid, j.yearsjudged
        FROM users u
        JOIN judges j ON u.userid = j.userid
        JOIN judgeattendance ja ON u.userid = ja.judgeId AND ja.eventId = ${eventid}
        WHERE 
          ja.status = 'present'
          AND (j.firstcategory = ${category} OR j.secondcategory = ${category})
      `;

      if (judges.length === 0) continue;

      const requiredCount = Math.ceil(judges.length / 20);
      const selectedConveners = judges
        .slice(0, requiredCount)
        .map((j) => ({ userid: j.userid, category, yearsjudged: j.yearsjudged }));

      allNewConveners.push(...selectedConveners);
    }

    // Step 4: Bulk insert new conveners using raw query with placeholders
    if (allNewConveners.length > 0) {
      const values = [];
      const placeholders = [];

      allNewConveners.forEach(({ userid, category, yearsjudged }, i) => {
        values.push(userid, eventid, category, yearsjudged);
        const idx = i * 4;
        placeholders.push(`($${idx + 1}, $${idx + 2}, $${idx + 3}, $${idx + 4})`);
      });

      const insertQuery = `
        INSERT INTO conveners (userid, eventid, category, yearsJudged)
        VALUES ${placeholders.join(", ")}
      `;

      await sql.query(insertQuery, values);

      // Step 5: Update roles of new conveners to 'convener'
      const convenerIds = allNewConveners.map((c) => c.userid);

      // Corrected line: Use the ANY operator with a PostgreSQL array
      await sql`
        UPDATE users
        SET role = 'convener'
        WHERE userid = ANY(${convenerIds})
      `;

      // Notify newly appointed conveners
      const [event] = await sql`
        SELECT name FROM events WHERE eventid = ${eventid}
      `;
      const eventName = event ? event.name : "an event";

      for (const convener of allNewConveners) {
        await createNotification({
          userid: convener.userid,
          eventid: eventid,
          message: `You have been selected as a ${convener.category} convener @ ${eventName}, you can choose to reject under Appointments`,
        });
      }
    }

    // Step 6: Return conveners for the event
    const conveners = await sql`
      SELECT c.userid, u.name, u.surname, c.category, c.accepted
      FROM conveners c
      JOIN users u ON c.userid = u.userid
      WHERE c.eventid = ${eventid}
    `;
    appEmitter.emit('convener-update', {
            eventId: eventid,
            message: 'Conveners were auto-appointed.'
        });
    res.status(200).json({
      message: "Conveners appointed successfully",
      conveners,
    });
  } catch (error) {
    console.error("[Convener] Error:", error.message);
    res.status(500).json({ message: "Failed to allocate conveners" });
  }
};

export const retryRejectedAllocation = async (req, res) => {
  const { eventid } = req.params;

  try {
    console.log(
      `[Convener] Retrying rejected allocations for event ${eventid}`
    );

    // Find rejected conveners for the event
    const rejectedConveners = await sql`
      SELECT userid, category FROM conveners WHERE eventid = ${eventid} AND accepted = false
    `;

    if (rejectedConveners.length === 0) {
      return res
        .status(400)
        .json({ message: "No rejected conveners to retry." });
    }

    let successfulRetries = 0;

    for (const rejected of rejectedConveners) {
      // Step 1: Change role of rejected convener back to 'judge'
      await sql`
        UPDATE users SET role = 'judge' WHERE userid = ${rejected.userid}
      `;

      // Step 2: Remove the rejected convener from the conveners table
      await sql`
        DELETE FROM conveners WHERE userid = ${rejected.userid} AND eventid = ${eventid}
      `;

      // Step 3: Find a new, suitable judge for the category
      const potentialReplacements = await sql`
        SELECT u.userid
        FROM users u
        JOIN judges j ON u.userid = j.userid
        JOIN userEvents ue ON ue.userid = u.userid
        WHERE ue.eventid = ${eventid}
          AND (j.firstcategory = ${rejected.category} OR j.secondcategory = ${rejected.category})
          AND u.userid NOT IN (SELECT userid FROM conveners WHERE eventid = ${eventid}) -- Exclude existing conveners
          AND u.userid NOT IN (SELECT convenerid FROM rejectedconveners WHERE eventid = ${eventid}) -- Exclude rejected conveners
        ORDER BY j.yearsjudged DESC
        LIMIT 1
      `;

      if (potentialReplacements.length > 0) {
        const newConvenerId = potentialReplacements[0].userid;

        // Step 4: Appoint the new convener
        await sql`
          INSERT INTO conveners (userid, eventid, category, accepted)
          VALUES (${newConvenerId}, ${eventid}, ${rejected.category}, null)
        `;

        // Step 5: Update the new convener's role
        await sql`
          UPDATE users SET role = 'convener' WHERE userid = ${newConvenerId}
        `;

        // Notify the new convener
        const [event] = await sql`
            SELECT name FROM events WHERE eventid = ${eventid}
        `;
        const eventName = event ? event.name : "an event";

        await createNotification({
            userid: newConvenerId,
            eventid: eventid,
            message: `You have been selected as a ${rejected.category} convener @ ${eventName}, you can choose to reject under Appointments`,
        });

        successfulRetries++;
      } else {
        console.warn(
          `[Convener] No replacement found for category ${rejected.category} in event ${eventid}`
        );
      }
    }

    // Step 6: Return the updated list of conveners
    const updatedConveners = await sql`
      SELECT c.userid, u.name, u.surname, c.category, c.accepted
      FROM conveners c
      JOIN users u ON c.userid = u.userid
      WHERE c.eventid = ${eventid}
    `;
    appEmitter.emit('convener-update', {
            eventId: eventid,
            message: 'Appointed the rejected conveners again.'
        });

    res.status(200).json({
      message: `Retry process finished. Successfully replaced ${successfulRetries} of ${rejectedConveners.length} rejected conveners.`,
      conveners: updatedConveners,
    });
  } catch (error) {
    console.error(
      `[Convener] Error retrying rejected allocations for event ${eventid}:`,
      error
    );
    res.status(500).json({ message: "Failed to retry rejected allocations." });
  }
};

// Appoint a single judge as convener for a specific event and category
const appointJudge = async (eventid, judgeid, category) => {
  try {
    // Check if the judge is already a convener for this event and category
    const [existing] = await sql`
      SELECT 1 FROM conveners
      WHERE userid = ${judgeid}
        AND eventid = ${eventid}
        AND category = ${category}
      LIMIT 1
    `;

    if (existing) {
      return false; // Already a convener for this event/category
    }

    // Insert new convener
    await sql`
      INSERT INTO conveners (userid, category, eventid)
      VALUES (${judgeid}, ${category}, ${eventid})
    `;

    // Upgrade role if necessary (only if not already a convener)
    await sql`
      UPDATE users
      SET role = 'convener'
      WHERE userid = ${judgeid} AND role != 'convener'
    `;

    return true;
  } catch (error) {
    console.error(`Error appointing judge ${judgeid} as convener:`, error);
    throw error;
  }
};

// Update a convener for a category at an event
export const updateConvenorCategory = async (req, res) => {
  const { eventid, oldjudgeid, newjudgeid, category } = req.body;
  if (!eventid || !oldjudgeid || !newjudgeid) {
    return res.status(400).json({
      message: "eventid, oldjudgeid, and newjudgeid are required",
    });
  }
  try {
    // Check if new judge is a judge at the event
    const judgeAtEvent = await sql`
      SELECT * FROM userevents WHERE eventid = ${eventid} AND userid = ${newjudgeid}
    `;
    if (!judgeAtEvent.length) {
      return res
        .status(400)
        .json({ message: "New judge is not a judge at this event" });
    }
    // Check if new judge is already a convener for this event
    const alreadyConvener = await sql`
      SELECT * FROM conveners WHERE userid = ${newjudgeid}
    `;
    if (alreadyConvener.length) {
      return res
        .status(400)
        .json({ message: "New judge is already a convener for this event" });
    }
    // Get the category for the old convener
    const oldConvener = await sql`
      SELECT * FROM conveners WHERE userid = ${oldjudgeid}
    `;
    if (!oldConvener.length) {
      return res
        .status(404)
        .json({ message: "Old judge is not a convener for this event" });
    }

    // Delete the old convener
    await sql`
      DELETE FROM conveners WHERE userid = ${oldjudgeid}
    `;
    // Insert the new convener
    await sql`
      INSERT INTO conveners (userid, category) VALUES (${newjudgeid}, ${category})
    `;
    res.status(200).json({ message: "Convener updated successfully" });
  } catch (error) {
    console.error("Error auto assigning conveners:", error);
    res.status(500).json({ message: "Failed to auto-assign conveners." });
  }
};

// Get all conveners for an event by eventid
export const acceptConvenerInvitation = async (req, res) => {
  const { judgeId, eventId } = req.params;

  try {
    const result = await sql`
      UPDATE conveners
      SET accepted = true
      WHERE userid = ${judgeId} AND eventid = ${eventId}
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ message: "Convener not found for this event." });
    }

    console.log(`[CONTROLLER] Emitting 'convener-update' after acceptance for event ${eventId}`);
    appEmitter.emit('convener-update', {
        eventId: eventId,
        message: `A convener accepted their invitation.`
    });

    res.status(200).json({ message: "Convener invitation accepted successfully.", convener: result[0] });
  } catch (error) {
    console.error(`Error accepting convener invitation for judge ${judgeId} in event ${eventId}:`, error);
    res.status(500).json({ message: "Internal server error while accepting invitation." });
  }
};

export const rejectConvenerInvitation = async (req, res) => {
  const { judgeId, eventId } = req.params;

  try {
    const result = await sql`
      UPDATE conveners
      SET accepted = false
      WHERE userid = ${judgeId} AND eventid = ${eventId}
      RETURNING *
    `;

    await sql`
      UPDATE users
      SET role = 'judge'
      WHERE userid = ${judgeId}
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ message: "Convener not found for this event." });
    }

    // Notify admin about the rejection
    const [event] = await sql`
      SELECT name FROM events WHERE eventid = ${eventId}
    `;
    const eventName = event ? event.name : "the event";

    await createNotification({
      role: "admin",
      eventid: eventId,
      message: `Convener Invitation rejected for ${eventName}`,
    });

    // Add to rejectedconveners table
    await sql`
      INSERT INTO rejectedconveners (convenerid, eventid)
      VALUES (${judgeId}, ${eventId})
      ON CONFLICT (convenerid, eventid) DO NOTHING
    `;

    // Notify all the subscribers about the update
    appEmitter.emit("convener-update", {
      eventId: eventId, 
      judgeId: judgeId,
      status: "rejected" 
    });

    res.status(200).json({ message: "Convener invitation rejected successfully.", convener: result[0] });
  } catch (error) {
    console.error(`Error rejecting convener invitation for judge ${judgeId} in event ${eventId}:`, error);
    res.status(500).json({ message: "Internal server error while rejecting invitation." });
  }
};

export const getAllConveners = async (req, res) => {
  const { eventid } = req.params;
  if (!eventid) {
    return res.status(400).json({ message: "Event ID is required" });
  }
  try {
    const conveners = await sql`
      SELECT c.*, u.name, u.surname, u.email, u.firstcontact
      FROM conveners c
      JOIN users u ON c.userid = u.userid
      JOIN userevents ue ON c.userid = ue.userid
      WHERE ue.eventid = ${eventid}
      ORDER BY c.category ASC, u.surname ASC
    `;
    res.status(200).json(conveners);
  } catch (error) {
    console.error("Error fetching conveners:", error);
    res.status(500).json({ message: "Failed to fetch conveners." });
  }
};

export const getConvenerAppointments = async (req, res) => {
  const { userid } = req.params;

  try {
    const events = await sql`
      SELECT e.*, c.accepted
      FROM events e
      JOIN conveners c ON e.eventid = c.eventid
      WHERE c.userid = ${userid}
    `;
    res.status(200).json({ events });
  } catch (error) {
    console.error("Error fetching convener appointments:", error);
    res.status(500).json({ error: "Failed to fetch convener appointments" });
  }
};


// Replaces old 'rejectConvenerInvitation'
const processConvenerRejection = async (judgeId, eventId) => {
  try {
    const [convenerToDelete] = await sql`
      SELECT category FROM conveners
      WHERE userid = ${judgeId} AND eventid = ${eventId}
    `;
    if (!convenerToDelete) throw new Error("Convener not found for this event.");

    await sql`
      INSERT INTO rejectedconveners (convenerid, eventid)
      VALUES (${judgeId}, ${eventId})
      ON CONFLICT (convenerid, eventid) DO NOTHING
    `;
    await sql`DELETE FROM conveners WHERE userid = ${judgeId} AND eventid = ${eventId}`;
    await sql`UPDATE users SET role = 'judge' WHERE userid = ${judgeId}`;

    return convenerToDelete.category;
  } catch (error) {
    console.error(`Error processing rejection for judge ${judgeId}:`, error);
    throw error;
  }
};


// Replaces old 'retryRejectedAllocation'
const findAndAppointReplacement = async (eventId, category) => {
  try {
    const [replacement] = await sql`
      SELECT u.userid, j.yearsjudged
      FROM users u
      JOIN judges j ON u.userid = j.userid
      JOIN judgeattendance ja ON u.userid = ja.judgeId AND ja.eventId = ${eventId}
      WHERE 
        ja.status = 'present'
        AND (j.firstcategory = ${category} OR j.secondcategory = ${category})
        AND u.userid NOT IN (SELECT userid FROM conveners WHERE eventid = ${eventId})
        AND u.userid NOT IN (SELECT convenerid FROM rejectedconveners WHERE eventid = ${eventId})
      ORDER BY j.yearsjudged DESC, j.numeventsjudged DESC
      LIMIT 1
    `;

    if (replacement) {
      const { userid: newConvenerId, yearsjudged } = replacement;
      await sql`
        INSERT INTO conveners (userid, eventid, category, accepted, yearsJudged)
        VALUES (${newConvenerId}, ${eventId}, ${category}, null, ${yearsjudged})
      `;
      await sql`UPDATE users SET role = 'convener' WHERE userid = ${newConvenerId}`;
      
      // Notify the new convener...
      const [event] = await sql`SELECT name FROM events WHERE eventid = ${eventId}`;
      await createNotification({
          userid: newConvenerId,
          eventid: eventId,
          message: `You have been appointed as the ${category} convener for the event: ${event.name || 'N/A'}.`,
      });
      return { success: true, message: `Successfully reallocated a new convener for ${category}.` };
    } else {
      console.warn(`No replacement found for category ${category}`);
      return { success: false, message: `No available replacement was found for ${category}.` };
    }
  } catch (error) {
    console.error(`Error finding replacement for category ${category}:`, error);
    throw error;
  }
};

// Final function to be called.
export const handleRejectionAndReallocate = async (req, res) => {
  const { userid, eventid } = req.params; // Ensure 'judgeId' matches your route name
  
  try {
    // Step 1: Process the rejection, which returns the now-empty category.
    const categoryToFill = await processConvenerRejection(userid, eventid);

    // Step 2: Attempt to find a replacement for that specific category.
    const reallocationResult = await findAndAppointReplacement(eventid, categoryToFill);

    // Step 3: Send the live update signal.
    appEmitter.emit('convener-update', { 
      eventId: eventid, 
      message: 'A convener status changed.' 
    });

    // Step 4: Send a clear, successful response.
    res.status(200).json({ 
      message: `Rejection successful. ${reallocationResult.message}` 
    });

  } catch (error) {
    if (error.message.includes("Convener not found")) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: "An internal server error occurred." });
  }
};

//Recommended projects to be shortlisted by the convener
export const recommendProjectForShortlist = async (req, res) => {
  const { eventid, userid, projectid } = req.params;
  const { reason } = req.body;

  if (!eventid || !userid || !projectid) {
    return res.status(400).json({ message: "eventid, userid, and projectid are required." });
  }

  try {
    // Check if the convener is valid for this event
    const [convener] = await sql`
      SELECT * FROM conveners WHERE userid = ${userid} AND eventid = ${eventid}
    `;
    if (!convener) {
      return res.status(404).json({ message: "Convener not found for this event." });
    }

    // Check if the project exists for this event
    const [project] = await sql`
      SELECT * FROM projects WHERE projectid = ${projectid} AND eventid = ${eventid}
    `;
    if (!project) {
      return res.status(404).json({ message: "Project not found for this event." });
    }

    // Insert recommendation
    await sql`
      INSERT INTO recommendations (projectId, eventId, convenerId, status, reason)
      VALUES (${projectid}, ${eventid}, ${userid}, 'pending', ${reason || null})
    `;

    res.status(201).json({ message: "Project recommended for shortlist." });
  } catch (error) {
    console.error("Error recommending project for shortlist:", error);
    res.status(500).json({ message: "Failed to recommend project for shortlist." });
  }
};


//Get the recommended projects for shortlisting by conveners
export const getRecommendedProjects = async (req, res) => {
  const { eventid, projectid } = req.params;
  if (!eventid || !projectid) {
    return res.status(400).json({ message: "Event ID and Project ID are required." });
  }

  try {
    const recommendations = await sql`
      SELECT * FROM recommendations WHERE eventId = ${eventid} AND projectId = ${projectid}
    `;
    res.status(200).json(recommendations);
  } catch (error) {
    console.error("Error fetching recommended projects:", error);
    res.status(500).json({ message: "Failed to fetch recommended projects." });
  }
};

//Remove project from the recommended list by conveners
export const removeRecommendedProject = async (req, res) => {
  const { eventid, userid, projectid } = req.params;
 if (!eventid || !projectid) {
    return res.status(400).json({ message: "Event ID and Project ID are required." });
  }

  try {
    // Check if the recommendation exists
    const [recommendation] = await sql`
      SELECT * FROM recommendations WHERE eventId = ${eventid} AND projectId = ${projectid} AND convenerId = ${userid}
    `;
    if (!recommendation) {
      return res.status(404).json({ message: "Recommendation not found." });
    }

    // Remove the recommendation
    await sql`
      DELETE FROM recommendations WHERE eventId = ${eventid} AND projectId = ${projectid} AND convenerId = ${userid}
    `;

    res.status(200).json({ message: "Recommendation removed successfully." });
  } catch (error) {
    console.error("Error removing recommended project:", error);
    res.status(500).json({ message: "Failed to remove recommended project." });
  }
};