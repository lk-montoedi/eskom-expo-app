import { sql } from "../config/db.js";

// Internal function to create a notification, exported for use in other controllers
export const createNotification = async ({
  userid,
  role,
  message,
  eventid,
}) => {
  try {
    await sql`
      INSERT INTO notifications (userid, role, message, eventid, date)
      VALUES (${userid || null}, ${role || null}, ${message}, ${
      eventid || null
    }, ${new Date()})
    `;
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

// GET /api/notifications/:userid
export const getNotificationsForUser = async (req, res) => {
  const { userid } = req.params;

  try {
    // Step 1: Get the user's role
    const [user] = await sql`
      SELECT role FROM users WHERE userid = ${userid}
    `;

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Step 2: Determine which roles to fetch notifications for
    const rolesToFetch = [user.role];
    if (user.role === "convener") {
      rolesToFetch.push("judge");
    }

    // Step 3: Fetch all relevant notifications (by user ID and by role)
    const notifications = await sql`
      SELECT n.*, e.name as event_name 
      FROM notifications n
      LEFT JOIN events e ON n.eventid = e.eventid
      WHERE n.userid = ${userid} OR n.role = ANY(${rolesToFetch})
      ORDER BY n.date DESC, n.id DESC
    `;

    res.status(200).json(notifications);
  } catch (error) {
    console.error(`Error fetching notifications for user ${userid}:`, error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};
