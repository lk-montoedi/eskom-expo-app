import {sql} from "../config/db.js"

export const emailVerification = async (req, res) => {
  const email = req.method === 'GET' ? req.query.email : req.body.email;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const result = await sql`
      SELECT userId FROM users WHERE email = ${email}
    `;

    const exists = result.length > 0;
    return res.status(200).json(exists);
  } catch (error) {
    console.error("Database query error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


