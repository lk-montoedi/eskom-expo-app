import { sql } from "../config/db.js";
import { createNotification } from "./notificationControllers.js";
import qrcode from "qrcode";
import { uploadBase64File } from "../utils/supabaseUpload.js";
import axios from "axios";

const axiosRef = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// Create an event
export const createEvent = async (req, res) => {
  // Request the fields
  const {
    expoForum,
    hostPlace,
    venue,
    openingDate,
    closingDate,
    eventStartDate,
    eventCloseDate,
    eventStartTime,
    eventEndTime,
  } = req.body;

  try {
    const eventResult = await sql`
            INSERT INTO events (
                type, name, start_date, end_date,
                regOpenDate, regCloseDate, start_time,
                end_time, region, venue, timeregistered
            ) VALUES (
                ${expoForum}, ${expoForum + " " + hostPlace + " 2025"}, ${eventStartDate},
                ${eventCloseDate}, ${openingDate}, ${closingDate},
                ${eventStartTime}, ${eventEndTime}, ${hostPlace}, ${venue}, ${new Date()}
            )
            RETURNING eventid
        `;
    console.log("Event Information:", eventResult);

    if (eventResult.length === 0 || !eventResult[0].eventid) {
      return res
        .status(400)
        .json({ message: "Failed to create event, no eventId returned." });
    }
    console.log("Backend Juice:" + eventResult[0].eventid);
    console.log("Saving image to supabase...");

    // Generate QR code for attendance
    const qrCodeData = JSON.stringify({ eventId: eventResult[0].eventid });
    const qrCodeBase64 = await qrcode.toDataURL(qrCodeData);

    // Upload QR code to Supabase
    const publicUrl = await uploadBase64File(
      qrCodeBase64,
      "user-photos",
      false
    );

    // Save qr code url to database
    await sql`
      UPDATE events
      SET attendance_code = ${publicUrl},
       progress_state = 'Not Started'
      WHERE eventid = ${eventResult[0].eventid}
    `;

    res.status(201).json({
      message: "Event created successfully",
      eventId: eventResult[0].eventid,
    });
  } catch (error) {
    console.error("Event creation Error:", error);
    res.status(500).json({ message: "Server error during event creation" });
  }
};

// Get all events (with optional filtering)
export const getAllEvents = async (req, res) => {
  try {
    const { type, region, name, startDate, endDate, judgeId } = req.query;

    // If judgeId is provided, filter events by judge
    //console.log("Judge ID:", judgeId);
    if (judgeId) {
      const judgeEvents = await sql`
        SELECT e.*, ue.attended
        FROM events e
        JOIN userevents ue ON e.eventid = ue.eventid
        WHERE ue.userid = ${judgeId}
        order by e.start_date, e.start_time
      `;
      //console.log("Judge Events:", judgeEvents);
      if (!judgeEvents.length) {
        return res
          .status(404)
          .json({ message: "No events found for this judge" });
      }
      //console.log("Fetched Events:", judgeEvents);
      return res.status(200).json(judgeEvents);
    }

    // Build the query dynamically based on provided filters
    let query = "SELECT * FROM events WHERE 1=1";
    const params = [];

    if (type) {
      query += " AND type = $" + (params.length + 1);
      params.push(type);
    }
    if (region) {
      query += " AND region = $" + (params.length + 1);
      params.push(region);
    }
    if (name) {
      query += " AND name ILIKE $" + (params.length + 1);
      params.push(`%${name}%`);
    }
    if (startDate) {
      query += " AND start_date >= $" + (params.length + 1);
      params.push(startDate);
    }
    if (endDate) {
      query += " AND end_date <= $" + (params.length + 1);
      params.push(endDate);
    }

    query += " ORDER BY start_time";
    const events = await sql.query(query, params);

    // log the events fetched
    //console.log("Fetched Events:", events);

    // Check if any events were found
    if (!events.length) {
      return res.status(404).json({ message: "No events found" });
    }

    // Return the events
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Failed to fetch events." });
  }
};

// Get a single event by ID
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await sql`SELECT * FROM events WHERE eventid = ${id}`;
    if (!event.length) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(event[0]);
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ message: "Failed to fetch event." });
  }
};

// Get the count for an event
export const getEventCounts = async (req, res) => {
    try {
        const {eventId} = req.params;
        console.log("Event ID for counts:", eventId);
        const projectsCount = await sql`
            SELECT COUNT(*)
            FROM projects
            WHERE eventId = ${eventId};
        `;

        const judgesCount = await sql`
            SELECT COUNT(DISTINCT judgeId)
            FROM projectJudges
            WHERE eventId = ${eventId};
        `;

        return {
            projects: projectsCount[0].count,
            judges: judgesCount[0].count
        };
    } catch (error) {
        console.error('Error fetching event counts:', error);
        throw error;
    }
}

// Update an event by ID
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      expoForum,
      hostPlace,
      venue,
      openingDate,
      closingDate,
      eventStartDate,
      eventCloseDate,
      eventStartTime,
      eventEndTime,
    } = req.body;

    let query = "UPDATE events SET";
    const updates = [];
    const params = [];

    if (expoForum) {
      updates.push(` type = ${params.length + 1}`);
      params.push(expoForum);
    }
    if (expoForum && hostPlace) {
      updates.push(` name = ${params.length + 1}`);
      params.push(expoForum + hostPlace + "2025");
    }
    if (eventStartDate) {
      updates.push(` start_date = ${params.length + 1}`);
      params.push(eventStartDate);
    }
    if (eventCloseDate) {
      updates.push(` end_date = ${params.length + 1}`);
      params.push(eventCloseDate);
    }
    if (openingDate) {
      updates.push(` regOpenDate = ${params.length + 1}`);
      params.push(openingDate);
    }
    if (closingDate) {
      updates.push(` regCloseDate = ${params.length + 1}`);
      params.push(closingDate);
    }
    if (eventStartTime) {
      updates.push(` start_time = ${params.length + 1}`);
      params.push(eventStartTime);
    }
    if (eventEndTime) {
      updates.push(` end_time = ${params.length + 1}`);
      params.push(eventEndTime);
    }
    if (hostPlace) {
      updates.push(` region = ${params.length + 1}`);
      params.push(hostPlace);
    }
    if (venue) {
      updates.push(` venue = ${params.length + 1}`);
      params.push(venue);
    }

    if (updates.length === 0) {
      return res
        .status(400)
        .json({ message: "No valid fields provided for update." });
    }

    query += updates.join(",");
    query += ` WHERE eventid = ${params.length + 1} RETURNING *`;
    params.push(id);

    const result = await sql.query(query, params);
    if (!result.length) {
      return res
        .status(404)
        .json({ message: "Event not found or not updated" });
    }
    res
      .status(200)
      .json({ message: "Event updated successfully", event: result[0] });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ message: "Failed to update event." });
  }
};

// Delete an event by ID
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params; // This is the eventId

    // 1. Get all project IDs for the event.
    const projectsResult = await sql`SELECT projectId FROM projects WHERE eventId = ${id}`;
    const projectIds = projectsResult.map(p => p.projectid);

    if (projectIds.length > 0) {
      // 2. Get marksheet IDs.
      const marksheetsResult = await sql`
        SELECT marksheetId FROM marksheets WHERE projectId = ANY(${projectIds})
      `;
      const marksheetIds = marksheetsResult.map(m => m.marksheetid);

      if (marksheetIds.length > 0) {
        await sql`DELETE FROM judgeMarksheets WHERE marksheetId = ANY(${marksheetIds})`;
      }

      // 3. Delete from other tables that have a foreign key to 'projects'.
      await sql`DELETE FROM marksheetconflicts WHERE projectid = ANY(${projectIds})`;
      await sql`DELETE FROM ethics WHERE projectId = ANY(${projectIds})`;
      await sql`DELETE FROM conflicts WHERE projectId = ANY(${projectIds})`;
      await sql`DELETE FROM lateprojectspool WHERE projectid = ANY(${projectIds})`;
      
      // CORRECTED ORDER:
      // First, delete from 'marksheets' to remove the dependency.
      await sql`DELETE FROM marksheets WHERE projectId = ANY(${projectIds})`;
      
      // NOW, it is safe to delete from 'ethicsmarksheets'.
      await sql`DELETE FROM ethicsmarksheets WHERE projectid = ANY(${projectIds})`;
    }

    // 4. Delete from tables that have a direct foreign key to 'events'.
    await sql`DELETE FROM projectJudges WHERE eventid = ${id}`;
    await sql`DELETE FROM shortlists WHERE eventId = ${id}`;
    await sql`DELETE FROM userevents WHERE eventid = ${id}`;
    await sql`DELETE FROM judgeattendance WHERE eventId = ${id}`;
    await sql`DELETE FROM latejudges WHERE eventid = ${id}`;
    await sql`DELETE FROM notifications WHERE eventid = ${id}`;
    await sql`DELETE FROM rejectedconveners WHERE eventid = ${id}`;
    await sql`DELETE FROM conveners WHERE eventid = ${id}`;

    // 5. Now, delete the projects for the event.
    await sql`DELETE FROM projects WHERE eventid = ${id}`;

    // 6. Finally, delete the event itself.
    const result = await sql`DELETE FROM events WHERE eventid = ${id} RETURNING *`;

    if (result.count === 0) {
      return res
        .status(404)
        .json({ message: "Event not found or already deleted" });
    }

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Failed to delete event.", error: error.message });
  }
};

export const getPromotionTargets = async (req, res) => {
  try {
    const { currentEventId } = req.params;
    console.log("Current Event ID:", currentEventId);
    // 1. Find the type of the current event
    const currentEvent = await sql`
      SELECT type FROM events WHERE eventid = ${currentEventId}
    `;
    console.log("Current Event Data:", currentEvent);
    if (currentEvent.length === 0) {
      return res.status(404).json({ message: "Current event not found." });
    }

    const currentType = currentEvent[0].type;
    let targetType = null;
    console.log("Current Event Type:", currentType);
    // 2. Determine the next level
    if (currentType.toLowerCase() === 'district') {
      targetType = 'Regional';
    } else if (currentType.toLowerCase() === 'regional') {
      targetType = 'International';
    }
    console.log("Target Event Type:", targetType);
    // If there's no next level, return an empty array
    if (!targetType) {
      return res.status(200).json([]);
    }
    console.log("Fetching target events of type:", targetType);

    // 3. Find all upcoming events of the target type
    const targetEvents = await sql`
      SELECT eventid, name, start_date FROM events 
      WHERE type = ${targetType} AND start_date >= NOW()
      ORDER BY start_date ASC
    `;
    console.log("Target Events Found:", targetEvents);
    res.status(200).json(targetEvents);

  } catch (error) {
    console.error("Error fetching promotion targets:", error);
    res.status(500).json({ message: "Server error fetching promotion targets." });
  }
};
// Patch an event's status
export const updateEventStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  console.log("Event ID:", id);

  if (!["unpublished", "published"].includes(status)) {
    return res.status(400).json({ message: "Invalid event status" });
  }

  try {
    const result = await sql`
      UPDATE events
      SET event_status = ${status}
      WHERE eventid = ${id}
      RETURNING *;
    `;

    console.log("Updated Event:", result);

    if (!result.length) {
      return res.status(404).json({ message: "Event not found" });
    }

    // If the event is published, send notifications to all relevant roles
    if (status === "published" && result.length > 0) {
      const eventName = result[0].name;
      const eventid = result[0].eventid;
      const message = `${eventName} is now available to join`;

      const rolesToNotify = ["teacher", "judge", "learner"];
      for (const role of rolesToNotify) {
        await createNotification({
          role: role,
          eventid: eventid,
          message: message,
        });
      }
    }

    res.status(200).json({ message: "Event status updated", event: result[0] });
  } catch (error) {
    console.error("Error updating event status:", error);
    res.status(500).json({ message: "Failed to update event status" });
  }
};

// Method to join the event.
export const joinEvent = async (req, res) => {
  const { id: eventId } = req.params;
  const { userId } = req.body;

  console.log("Event Id backend:", eventId);
  console.log("User Id backend:", userId);

  if (!userId || !eventId) {
    return res.status(400).json({ message: "Missing userId or eventId" });
  }

  try {
    const existing = await sql`
      SELECT * FROM userEvents WHERE userId = ${userId} AND eventId = ${eventId}
    `;

    if (existing.length > 0) {
      return res
        .status(400)
        .json({ message: "User already joined the event." });
    }

    await sql`
      INSERT INTO userevents (eventId, userid, attended)
      VALUES (${eventId}, ${userId}, false)
    `;

    const user = await sql`
      SELECT * FROM judges WHERE userid = ${userId}
    `;

    if (user.length > 0) {
      console.log("Judge category:", user[0].firstcategory);
      // add to the judgesAttendance table
      await sql`
          INSERT INTO judgeattendance (judgeId, eventId, status, category)
          VALUES (${userId}, ${eventId}, 'absent', ${user[0].firstcategory})
        `;
    }

    res.status(200).json({ message: "Successfully joined event" });
  } catch (err) {
    console.error("Join event error:", err);
    res.status(500).json({ message: "Error joining event" });
  }
};

export const startEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await sql`
      UPDATE events
      SET progress_state = 'In Progress'
      WHERE eventid = ${id}
      RETURNING *;
    `;

    if (!result.length) {
      return res.status(404).json({ message: "Event not found" });
    }

    const response = await axios.post(`http://localhost:3001/api/projects/handle-absent-judges/${id}`);
    console.log("Handle absent judges response:", response.data);
    if (response.status !== 200) {
      console.error(
        "Failed to handle absent judges when starting event:",
        response.data
      );
      return res
        .status(500)
        .json({ message: "Failed to handle absent judges" });
    }

    res.status(200).json({ message: "Event started", event: result[0] });
  } catch (error) {
    console.error("Error starting event:", error);
    res.status(500).json({ message: "Failed to start event" });
  }
};

// Get judge attendance for an event
export const getJudgeAttendanceForEvent = async (req, res) => {
  const { eventid } = req.params;
  if (!eventid) {
    return res.status(400).json({ message: "Event ID is required" });
  }

  try {
    const attendanceRecords = await sql`
      SELECT judgeid, status FROM judgeattendance WHERE eventid = ${eventid}
    `;
    res.status(200).json(attendanceRecords);
  } catch (error) {
    console.error("Error fetching judge attendance:", error);
    res.status(500).json({ message: "Failed to fetch judge attendance" });
  }
};

// The method check if the user has not joined the event yet.
export const hasJoinedEvent = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await sql`
      SELECT eventId FROM userEvents WHERE userId = ${userId} LIMIT 1
    `;

    if (result.length > 0) {
      return res.status(200).json({ eventId: result[0].eventid });
    } else {
      return res.status(200).json({ eventId: null });
    }
  } catch (err) {
    console.error("Failed to fetch joined event", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getJoinedEvents = async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    console.error("[Events] User ID not received.");
    return res.status(404).json({ message: "User ID is required." });
  }
  const joinedEventsIds = await sql`
    SELECT e.eventid FROM events e
    JOIN userevents ue ON e.eventid = ue.eventid
    WHERE ue.userid = ${userId}
  `;
  for (let i = 0; i < joinedEventsIds.length; i++) {
    const projectId = await sql`
      SELECT p.projectid FROM projects p
      WHERE p.eventid = ${joinedEventsIds[i].eventid}
      AND p.learnerid = ${userId}
    `;
    if (projectId.length > 0) {
      joinedEventsIds[i].projectid = projectId[0].projectid;
    } else {
      joinedEventsIds[i].projectid = null;
    }
  }
  console.log("Joined Events IDs:", joinedEventsIds);
  return res.json({ joinedEventsIds });
};
