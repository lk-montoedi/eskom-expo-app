import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import WebSocket from "ws";
import WebSocketContext from "./src/utils/WebSocketContext.js";

import { sql } from "./src/config/db.js";
import userRouter from "./src/routes/userRoutes.js";
import eventRouter from "./src/routes/eventRoutes.js";
import schoolRouter from "./src/routes/schoolRoutes.js";
import uploadRoutes from "./src/routes/uploadRoutes.js";
import convenerRouter from "./src/routes/convenerRoutes.js";
import projectRouter from "./src/routes/projectRoutes.js";
import learnerRouter from "./src/routes/learnerRoutes.js";
import projectJudgeRouter from "./src/routes/projectJudgeRoutes.js";
import marksheetRouter from "./src/routes/marksheetRoutes.js";
import userEventRouter from "./src/routes/userEventRoutes.js";
import judgeRouter from "./src/routes/judgeRoutes.js";
import shortlistRouter from "./src/routes/shortlistRoutes.js";
import conflictRouter from "./src/routes/conflictRoutes.js";
import ethicsRouter from "./src/routes/ethicsRoutes.js";
import notificationRouter from "./src/routes/notificationRoutes.js";
import locationRouter from "./src/routes/locationRoutes.js";
import judgeAttendanceRouter from "./src/routes/judgeAttendanceRoutes.js";
import emailRouter from "./src/routes/emailRoutes.js";
import eventsRouter from "./src/routes/eventsRouter.js";
import ratingsRouter from "./src/routes/ratingsRoute.js";
import claimsRouter from "./src/routes/claimsRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json({ limit: "50mb" })); // Used for req, res
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors());
app.use(helmet()); // helmet is a security middleware that helps you protect your app by setting various HTTP headers
app.use(morgan("dev")); // log the requests.

// api endpoints
app.use("/api/events", eventsRouter);
app.use("/api/user", userRouter);
app.use("/api/judge", userRouter);
app.use("/api/admin", eventRouter);
app.use("/api/projects", projectRouter);
app.use("/api/teacher/register", userRouter);
app.use("/api/teacher", userRouter);
app.use("/api/student", eventRouter);
app.use("/api/schools", schoolRouter);
app.use("/api/conveners", convenerRouter);
app.use("/api/event", projectRouter);
app.use("/api/student/create", projectRouter);
app.use("/api/get", userEventRouter);
app.use("/api/learners", learnerRouter);
app.use("/api/shortlists", shortlistRouter);
app.use("/api/project-judges", projectJudgeRouter);
app.use("/api/events/", eventRouter);
app.use("/api/ethics", ethicsRouter);
app.use("/api/ratings", ratingsRouter);
app.use("/api/claims", claimsRouter);
app.use("/api", marksheetRouter);
app.use("/api", uploadRoutes);
app.use("/api", judgeRouter);
app.use("/api", convenerRouter);
app.use("/api/conflicts", conflictRouter);
app.use("/api/email", emailRouter);

app.use("/api/notifications", notificationRouter);
app.use("/api/locations", locationRouter);
app.use("/api/attendance", judgeAttendanceRouter);

app.get("/", (req, res) => {
  res.send("Hello from the backend");
});

app.use((req, res) => {
  res
    .status(404)
    .json({ message: `Route ${req.method} ${req.originalUrl} not found` });
});
// To warm up the database
export const warmUpDatabase = async () => {
  try {
    console.time("warm-up");

    // Hit actual data paths to warm compute + storage layers
    await sql`SELECT 1`;
    await sql`SELECT NOW()`;
    await sql`SELECT COUNT(*) FROM users`; // replace with your biggest table

    console.timeEnd(" warming-up");
  } catch (err) {
    console.error("Warm-up failed:", err);
  }
};

async function initDB() {
  try {
    await sql`
            CREATE TABLE IF NOT EXISTS users (
                userId SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                surname VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                firstContact VARCHAR(10) NOT NULL,
                secondContact VARCHAR(10) ,
                birthDate VARCHAR(255) NOT NULL,
                gender VARCHAR(255) NOT NULL,
                race VARCHAR(255) NOT NULL,
                profilePicture VARCHAR(512) ,
                password VARCHAR(255) NOT NULL,
                province VARCHAR(255) NOT NULL,
                region VARCHAR(255) NOT NULL,
                Role VARCHAR(255) NOT NULL
            )
        `;

    await sql`
            CREATE TABLE IF NOT EXISTS judges(
                userId INT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                institution VARCHAR(255) NOT NULL,
                qualification VARCHAR(255) NOT NULL,
                proofCertificate VARCHAR(512) ,
                identityDocument VARCHAR(512) ,
                yearsJudged INT NOT NULL,
                expoForum VARCHAR(255) NOT NULL,
                expoExperience VARCHAR(255) NOT NULL,
                firstCategory VARCHAR(255) NOT NULL,
                secondCategory VARCHAR(255) NOT NULL,
                numeventsjudged INT,
                expo_push_token VARCHAR(255),
                rating DECIMAL(2,1) DEFAULT 0,
                points INT DEFAULT 0,
                FOREIGN KEY (userId) REFERENCES users(userId)

            ) 
        `;

    await sql`
            CREATE TABLE IF NOT EXISTS claims(
                id SERIAL PRIMARY KEY,
                userid INT,
                item VARCHAR(255) NOT NULL,
                status VARCHAR(255) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved')), 
                date DATE NOT NULL DEFAULT NOW(),
                FOREIGN KEY (userid) REFERENCES users(userId)
            )
        `;
    await sql`
            CREATE TABLE IF NOT EXISTS notifications(
                id SERIAL PRIMARY KEY,
                role VARCHAR(55),
                message TEXT NOT NULL,
                userid INT,
                read BOOLEAN DEFAULT FALSE,
                eventid INT,
                date DATE,
                FOREIGN KEY (userid) REFERENCES users(userId),
                FOREIGN KEY (eventid) REFERENCES events(eventId)
            )
        `;
    await sql`
            CREATE TABLE IF NOT EXISTS conveners(
                userid INT PRIMARY KEY,
                category VARCHAR(255) NOT NULL,
                yearsJudged INT NOT NULL,
                eventid INT,
                accepted BOOLEAN,
                FOREIGN KEY (userId) REFERENCES users(userId),
                FOREIGN KEY (eventid) REFERENCES events(eventId)

            )
        `;
    await sql`
            CREATE TABLE IF NOT EXISTS rejectedconveners(
                convenerid INT PRIMARY KEY,
                eventid INT PRIMARY KEY
            )
    `;

    await sql`
            CREATE TABLE IF NOT EXISTS schools(
                schoolId SERIAL PRIMARY KEY,
                schoolName VARCHAR(255) NOT NULL,
                region VARCHAR(255),
                district VARCHAR(255),
                province VARCHAR(255)
            ) 
        `;

    await sql`
            CREATE TABLE IF NOT EXISTS teachers(
                userId INT PRIMARY KEY,
                disability VARCHAR(255),
                schoolId INT NOT NULL,
                FOREIGN KEY (userId) REFERENCES users(userId),
                FOREIGN KEY (schoolId) REFERENCES schools(schoolId)
            )
        `;
    await sql`
            CREATE TABLE IF NOT EXISTS learners(
                userId INT PRIMARY KEY,
                grade INT NOT NULL,
                disability VARCHAR(255),
                disabilityInfo VARCHAR(255),
                schoolId INT NOT NULL,
                FOREIGN KEY (userId) REFERENCES users(userId),
                FOREIGN KEY (schoolId) REFERENCES schools(schoolId)
            )
        `;

    await sql`
            CREATE TABLE IF NOT EXISTS events(
                eventId SERIAL PRIMARY KEY,
                type VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                start_date DATE NOT NULL,
                end_date DATE NOT NULL,
                regOpenDate DATE NOT NULL,
                regCloseDate DATE NOT NULL,
                start_time TIME NOT NULL,
                end_time TIME NOT NULL,
                region VARCHAR(255) NOT NULL,
                venue VARCHAR(255) NOT NULL,
                event_status VARCHAR(20) DEFAULT 'unpublished',
                timeregistered TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                progress_state VARCHAR(255),
                attendance_code VARCHAR(255)
            ) 
        `;

    await sql`
            CREATE TABLE IF NOT EXISTS userEvents(
                PRIMARY KEY (eventId, userId),
                userId INT NOT NULL,
                eventId INT NOT NULL,
                attended BOOLEAN,
                FOREIGN KEY (userId) REFERENCES users(userId),
                FOREIGN KEY (eventId) REFERENCES events(eventId)

            ) 
        `;

    await sql`
            CREATE TABLE IF NOT EXISTS projects(
                projectid SERIAL PRIMARY KEY,
                schoolid INT NOT NULL ,
                learnerid INT NOT NULL,
                projectname VARCHAR(255) NOT NULL,
                description VARCHAR(255) NOT NULL,
                supportingdocument VARCHAR(512) NOT NULL,
                category VARCHAR(255) NOT NULL,
                standnumber SERIAL,
                status VARCHAR(255),
                badge VARCHAR(255),
                ethicalstatus VARCHAR(255),
                timeregistered TIME NOT NULL,
                eventid INTEGER NOT NULL,
                assignedmarksheetid INT,
                totalscore INT,
                FOREIGN KEY (eventid) REFERENCES events(eventId),
                FOREIGN KEY (schoolid) REFERENCES schools(schoolId),
                FOREIGN KEY (learnerid) REFERENCES learners(userId),
                FOREIGN KEY (assignedMarksheetId) REFERENCES marksheets(marksheetId)
            ) 
        `;

    await sql`
            CREATE TABLE IF NOT EXISTS lateprojectspool(
                id SERIAL PRIMARY KEY,
                projectid INT UNIQUE,
                marksheetid INT, -- existing marksheet
                eventid INT,
                judgeid INT, -- late judge
                status VARCHAR(255) DEFAULT 'unallocated' CHECK (status IN ('unallocated', 'allocated')),
                FOREIGN KEY (projectid) REFERENCES projects(projectId),
                FOREIGN KEY (eventid) REFERENCES events(eventId),
                FOREIGN KEY (judgeid) REFERENCES judges(userId)
            )
    `;

    await sql`
            CREATE TABLE IF NOT EXISTS shortlists(
                shortlistId SERIAL PRIMARY KEY,
                projectId INT NOT NULL,
                eventId INT NOT NULL,
                status VARCHAR(255) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved')),
                FOREIGN KEY (projectId) REFERENCES projects(projectId),
                FOREIGN KEY (eventId) REFERENCES events(eventId)

        ) 
    `;

    await sql`
        CREATE TABLE IF NOT EXISTS recommendations (
        recommendationId SERIAL PRIMARY KEY,
        projectId INT NOT NULL,
        eventId INT NOT NULL,
        convenerId INT NOT NULL,
        -- Status can be 'pending', 'approved', 'rejected'
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        reason TEXT, -- Optional: a short note from the convener
        createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (projectId) REFERENCES projects(projectId),
        FOREIGN KEY (eventId) REFERENCES events(eventId),
        FOREIGN KEY (convenerId) REFERENCES users(userId)
    );
    `;

    await sql`
            CREATE TABLE IF NOT EXISTS conflicts(
                conflictId SERIAL PRIMARY KEY,
                projectId INT NOT NULL,
                judgeId1 INT NOT NULL,
                judgeId2 INT NOT NULL,
                status VARCHAR(255) NOT NULL,
                judge1mark INT,
                judge2mark INT,
                agreedmark INT,
                meetrequested BOOLEAN DEFAULT FALSE,
                meetup_location VARCHAR(255),
                updatedat TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (projectId) REFERENCES projects(projectId),
                FOREIGN KEY (judgeId1) REFERENCES judges(userId),
                FOREIGN KEY (judgeId2) REFERENCES judges(userId)

            ) 
        `;

    await sql`
            CREATE TABLE IF NOT EXISTS conflictscores(
                id SERIAL PRIMARY KEY,
                conflictid INT NOT NULL,
                judgeid INT NOT NULL,
                score INT NOT NULL,
                FOREIGN KEY (conflictid) REFERENCES conflicts(conflictid),
                FOREIGN KEY (judgeid) REFERENCES judges(userid)
            )`;

    await sql`
            CREATE TABLE IF NOT EXISTS marksheetconflicts(
                id SERIAL PRIMARY KEY,
                projectid INT NOT NULL,
                marksheetid1 INT NOT NULL,
                marksheetid2 INT NOT NULL,
                type1 VARCHAR(255) NOT NULL,
                type2 VARCHAR(255) NOT NULL,
                status VARCHAR(255) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved')),
                updatedat TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (marksheetid1) REFERENCES marksheets(marksheetId),
                FOREIGN KEY (marksheetid2) REFERENCES marksheets(marksheetId),
                FOREIGN KEY (projectid) REFERENCES projects(projectId)
            )
    `;

    await sql`
        CREATE TABLE IF NOT EXISTS ethics (
            ethicsId SERIAL PRIMARY KEY,
            projectId INT NOT NULL UNIQUE,
            convenor_overall_severity VARCHAR(255),
            flag_status VARCHAR(20) NOT NULL DEFAULT 'unflagged' CHECK (
            flag_status IN ('unflagged', 'flagged', 'under-review', 'resolved', 'dismissed')
            ),
            convenor_comment TEXT,
            resolution TEXT, -- Final decision or action taken
            convenorId INT,
            judge1Id INT,
            judge2Id INT,
            judge1_comment VARCHAR(255),
            judge2_comment VARCHAR(255),
            judge1_severity VARCHAR(255), 
            judge2_severity VARCHAR(255), 
            createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (projectId) REFERENCES projects(projectId),
            FOREIGN KEY (convenorId) REFERENCES users(userId),
            FOREIGN KEY (judge1Id) REFERENCES users(userId),
            FOREIGN KEY (judge2Id) REFERENCES users(userId)
        )
         `;

    await sql`
            CREATE TABLE IF NOT EXISTS projectJudges(
                PRIMARY KEY (judgeId, projectId, eventId),
                projectId INT,
                judgeId INT,
                eventId INT,
                FOREIGN KEY (projectId) REFERENCES projects(projectId),
                FOREIGN KEY (judgeId) REFERENCES judges(userId),
                FOREIGN KEY (eventId) REFERENCES public.events(eventId)
            ) 
        `;

    await sql`
            CREATE TABLE IF NOT EXISTS judgeratings(
                id SERIAL PRIMARY KEY,
                forJudgeId INT NOT NULL,
                fromJudgeId INT NOT NULL,
                rating DECIMAL NOT NULL CHECK (rating >= 1 AND rating <= 5),
                comments TEXT,
                createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (forJudgeId) REFERENCES judges(userId),
                FOREIGN KEY (fromJudgeId) REFERENCES judges(userId)
            )
        `;

    await sql`
            CREATE TABLE IF NOT EXISTS ethicsMarksheets(
                ethicsMarksheetId SERIAL PRIMARY KEY,
                projectId INT NOT NULL,
                type VARCHAR(255),
                overallSeverity VARCHAR(255) NOT NULL,
                section1 VARCHAR(255) NOT NULL,
                section2 VARCHAR(255) NOT NULL,
                section3 VARCHAR(255) NOT NULL,
                section4 VARCHAR(255) NOT NULL,
                section5 VARCHAR(255) NOT NULL,
                section6 VARCHAR(255) NOT NULL,
                section7 VARCHAR(255) NOT NULL,
                section8 VARCHAR(255) NOT NULL,
                section9 VARCHAR(255) NOT NULL,
                section10 VARCHAR(255) NOT NULL,
                section11 VARCHAR(255) NOT NULL,
                section12 VARCHAR(255) NOT NULL,
                section13 VARCHAR(255) NOT NULL,
                section14 VARCHAR(255) NOT NULL,
                section15 VARCHAR(255) NOT NULL,
                section16 VARCHAR(255) NOT NULL,
                section17 VARCHAR(255) NOT NULL,
                section18 VARCHAR(255) NOT NULL,
                section19 VARCHAR(255) NOT NULL,
                section20 VARCHAR(255) NOT NULL,
                section21 VARCHAR(255) NOT NULL,
                section22 VARCHAR(255) NOT NULL,
                section23 VARCHAR(255) NOT NULL,
                section24 VARCHAR(255) NOT NULL,
                section25 VARCHAR(255) NOT NULL,
                judgecomment VARCHAR(255),
                 judgeid INT,
                section26 VARCHAR(255) NOT NULL,
                section27 VARCHAR(255) NOT NULL,
                section28 VARCHAR(255) NOT NULL,
                section29 VARCHAR(255) NOT NULL,
                section30 VARCHAR(255) NOT NULL,
                section31 VARCHAR(255) NOT NULL,
                section32 VARCHAR(255) NOT NULL,
                FOREIGN KEY (projectId) REFERENCES projects(projectId),
                FOREIGN KEY (judgeid) REFERENCES users(userid)
            ) 
        `;

    await sql`
            CREATE TABLE IF NOT EXISTS marksheets(
                marksheetId SERIAL PRIMARY KEY,
                projectId INT NOT NULL,
                ethicsMarksheetId INT NOT NULL,
                type VARCHAR(255) NOT NULL,
                totalScore INT NOT NULL,
                section1 VARCHAR(255) NOT NULL,
                section2 VARCHAR(255) NOT NULL,
                section3 VARCHAR(255) NOT NULL,
                section4 VARCHAR(255) NOT NULL,
                section5 VARCHAR(255) NOT NULL,
                section6 VARCHAR(255) NOT NULL,
                section7 VARCHAR(255) NOT NULL,
                section8 VARCHAR(255) NOT NULL,
                section9 VARCHAR(255) NOT NULL,
                section10 VARCHAR(255) NOT NULL,
                section11 VARCHAR(255) NOT NULL,
                section12 VARCHAR(255) NOT NULL,
                section13 VARCHAR(255) NOT NULL,
                section14 VARCHAR(255) NOT NULL,
                section15 VARCHAR(255) NOT NULL,
                section16 VARCHAR(255) NOT NULL,
                section17 VARCHAR(255) NOT NULL,
                section18 VARCHAR(255) NOT NULL,
                section19 VARCHAR(255) NOT NULL,
                section20 VARCHAR(255) NOT NULL,
                section21 VARCHAR(255) NOT NULL,
                section22 VARCHAR(255) NOT NULL,
                section23 VARCHAR(255) NOT NULL,
                section24 VARCHAR(255) NOT NULL,
                section25 VARCHAR(255) NOT NULL,
                judgeid INT,
                FOREIGN KEY (judgeid) REFERENCES public.judges(userid),
                FOREIGN KEY (projectId) REFERENCES projects(projectId),
                FOREIGN KEY (ethicsMarksheetId) REFERENCES ethicsMarksheets(ethicsMarksheetId)
            ) 
        `;
    await sql`
        CREATE TABLE IF NOT EXISTS judgeslocations(
        id SERIAL PRIMARY KEY,
        judgeid INT,
        latitude DECIMAL(9,6) NOT NULL,
        longitude DECIMAL(9,6) NOT NULL,
        accuracy DECIMAL(9,2),
        timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (judgeid) REFERENCES public.judges(userid)
        )
    `;
    await sql`
        CREATE TABLE IF NOT EXISTS judgeattendance (
        attendanceId SERIAL PRIMARY KEY,
        judgeId INT NOT NULL,
        eventId INT NOT NULL,
        status VARCHAR(10) DEFAULT 'absent', -- 'By default, judges are marked absent'
        arrivalTime TIMESTAMP,
        category VARCHAR(255),
        FOREIGN KEY (judgeId) REFERENCES judges(userId),
        FOREIGN KEY (eventId) REFERENCES events(eventId)
        )
    `;

    await sql`
        CREATE TABLE IF NOT EXISTS latejudges(
            id SERIAL PRIMARY KEY,
            judgeid INT NOT NULL,
            eventid INT NOT NULL,
            FOREIGN KEY (judgeid) REFERENCES judges(userId),
            FOREIGN KEY (eventid) REFERENCES events(eventId)
        )
    `;

    await sql`
        CREATE TABLE IF NOT EXISTS judgeMarksheets(
            PRIMARY KEY (userId, marksheetId),
            userId INT NOT NULL,
            marksheetId INT NOT NULL,
            startTimer TIME,
            FOREIGN KEY (userId) REFERENCES users(userId),
            FOREIGN KEY (marksheetId) REFERENCES marksheets(marksheetId)

        ) 
    `;

    await sql`
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1
                FROM information_schema.columns
                WHERE table_name = 'conveners' AND column_name = 'yearsjudged'
            ) THEN
                ALTER TABLE conveners
                ADD COLUMN yearsJudged INT NOT NULL DEFAULT 0;
            END IF;
        END;
        $$;
    `;
    // Add event_status column if it doesn't exist
    await sql`
            DO $$
            BEGIN
                IF NOT EXISTS (
                SELECT 1
                FROM information_schema.columns
                WHERE table_name = 'events' AND column_name = 'event_status'
                ) THEN
                ALTER TABLE events
                ADD COLUMN event_status VARCHAR(20) DEFAULT 'unpublished' CHECK (event_status IN ('unpublished', 'published'));
                END IF;
            END;
            $$;
            `;

    await sql`
                ALTER TABLE shortlists
                ALTER COLUMN status SET DEFAULT 'shortlisted';
            `;

    console.log("Database initialized successfullly");
  } catch (error) {
    console.log("Error initDB", error);
  }
}

initDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
    warmUpDatabase();
    setInterval(warmUpDatabase, 10 * 60 * 1000);
    WebSocketContext.init(server);
  });
});
