import { sql } from "../config/db.js";

// 1. Get Judges by Event ID
export const getJudgesByEvent = async (req, res) => {
  const { eventid } = req.params;
  const { category } = req.query;
  try {
    const judges = await sql`
      SELECT u.userid, u.name AS firstname, u.surname AS lastname, u.email, j.yearsJudged, j.numeventsjudged, j.firstCategory, j.secondCategory, aj.status, ja.category
      FROM userEvents ue
      JOIN users u ON u.userid = ue.userid
      JOIN judges j ON j.userid = ue.userid
      JOIN judgeattendance ja ON ja.judgeId = u.userid AND ja.eventId = ue.eventid
      WHERE ue.eventid = ${eventid}
    `;
    if (category) {
      const filteredJudges = judges.filter(
        (judge) => judge.firstcategory === category
      );
      return res.status(200).json({ judges: filteredJudges });
    }
    res.status(200).json({ judges });
    console.log("Here are judges: ", judges);
  } catch (err) {
    console.error("Error fetching judges:", err);
    res.status(500).json({ error: "Failed to fetch judges" });
  }
};
// 2. Get Judges by Event ID
export const getAllJudges = async (req, res) => {
  try {
    const judges = await sql`
      SELECT 
        u.userid,
        u.name AS firstname,
        u.surname AS lastname,
        u.gender,
        u.race,
        j.qualification,
        j.yearsjudged,
        j.timesjudged,
        j.firstcategory,
        j.secondcategory,
        
        pj.eventid,
        e.name AS event_name,
        e.type AS event_type,
        e.region AS event_region,
        e.event_status,
        e.venue,
        e.timeregistered AS event_timeregistered 

      FROM judges j
      JOIN users u ON u.userid = j.userid
      JOIN projectjudges pj ON j.userid = pj.judgeid
      JOIN events e ON pj.eventid = e.eventid
    `;

    if (!judges.length) {
      return res.status(404).json({ message: "No judges found" });
    }

    res.status(200).json({ judges });
    console.log("Here are all judges with event info:", judges);
  } catch (err) {
    console.error("Error fetching judges:", err);
    res.status(500).json({ error: "Failed to fetch judges" });
  }
};

export const updatePushToken = async (req, res) => {
  const { judgeId, token } = req.body;
  try {
    await sql`
      UPDATE judges SET expo_push_token = ${token}
      WHERE userid = ${judgeId};
    `;
    res.status(200).json({ message: "Push token updated" });
  } catch (err) {
    console.error("Error updating push token:", err);
    res.status(500).json({ message: "Failed to update push token" });
  }
};

// method to get the co-judge given the judgeid and projectid
// this will find the maksheet from marksheets table using the projectid, since there are two marksheets per project
// it will then find the co-judge by looking for the judgeid that is not the current judgeid
// it must then return the co-judge's userid, name and surname by joining with the users table
export const getCoJudge = async (req, res) => {
  const { judgeid, projectid } = req.params;
  try {
    const result = await sql`
      SELECT u.userid, u.name, u.surname
      FROM marksheets m
      JOIN users u ON u.userid = m.judgeid
      WHERE m.projectid = ${projectid}
    `;
    if (result.length !== 0) {
      const coJudge = result.find((judge) => judge.userid !== parseInt(judgeid));
      return res.status(200).json(coJudge);
    }
  } catch (err) {
    console.error("Error fetching co-judge:", err);
    res.status(500).json({ error: "Failed to fetch co-judge" });
  }
};

export const getAllCoJudges = async (req, res) => {
  const { judgeid } = req.params;
  console.log("START getAllCoJudges for judge ID:", judgeid);
  try {
    // 1. Get all project IDs for the current judge
    const projectIdsResult = await sql`
      SELECT projectid FROM marksheets WHERE judgeid = ${judgeid}
    `;
    const projectIds = projectIdsResult.map(p => p.projectid);
    console.log("Found project IDs for judge:", projectIds);

    if (projectIds.length === 0) {
      console.log("Judge has no projects, returning empty array.");
      return res.status(200).json({ coJudges: [] });
    }

    // 2. Get co-judges and the projects they share
    const sharedProjectsResult = await sql`
      SELECT
        u.userid,
        u.name,
        u.surname,
        u.profilepicture,
        p.projectid,
        p.projectname,
        p.description
      FROM marksheets m
      JOIN users u ON u.userid = m.judgeid
      JOIN projects p ON p.projectid = m.projectid
      WHERE m.projectid = ANY(${projectIds}) AND m.judgeid != ${judgeid}
    `;

    // 3. Group projects by co-judge
    const coJudgesMap = new Map();
    sharedProjectsResult.forEach(row => {
      if (!coJudgesMap.has(row.userid)) {
        coJudgesMap.set(row.userid, {
          userid: row.userid,
          name: row.name,
          surname: row.surname,
          profilepicture: row.profilepicture,
          commonProjects: [],
          ratings: []
        });
      }
      coJudgesMap.get(row.userid).commonProjects.push({
        projectid: row.projectid,
        title: row.projectname,
        description: row.description
      });
    });

    const coJudges = Array.from(coJudgesMap.values());
    //console.log("Co-judges with shared projects:", coJudges.map(judge => judge.commonProjects));

    if (coJudges.length === 0) {
      console.log("No co-judges found, returning empty array.");
      return res.status(200).json({ coJudges: [] });
    }

    // 4. Get ratings for the co-judges
    const coJudgeIds = coJudges.map(judge => judge.userid);
    console.log("Co-judge IDs:", coJudgeIds);

    const ratings = await sql`
      SELECT jr.*
      FROM judgeratings jr
      WHERE jr.fromJudgeId = ${judgeid} AND jr.forJudgeId = ANY(${coJudgeIds})
    `;
    //console.log("Found ratings:", ratings);

    // 5. Pair ratings with co-judges
    coJudges.forEach(judge => {
      judge.ratings = ratings.filter(rating => rating.forjudgeid === judge.userid);
    });

    //console.log("Returning co-judges with ratings and projects:", coJudges);
    res.status(200).json({ coJudges: coJudges });
  } catch (err) {
    console.error("Error in getAllCoJudges:", err);
    res.status(500).json({ error: "Failed to fetch co-judges" });
  }
};
