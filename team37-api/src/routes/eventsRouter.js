import express from "express";
import appEmitter from "../utils/eventEmitter.js";

const eventsRouter = express.Router();

// This is the ONLY endpoint your frontend will connect to for real-time updates
eventsRouter.get("/stream/:eventid", (req, res) => {
    const { eventid } = req.params;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    // Listener for convener updates
    const convenerListener = (data) => {
        if (data.eventId === eventid) {
            res.write('event: convener-update\n'); // Name the event
            res.write(`data: ${JSON.stringify(data)}\n\n`);
        }
    };

    // Listener for project reallocations
    const projectListener = (data) => {
        if (data.eventId === eventid) {
            res.write('event: project-reallocated\n'); 
            res.write(`data: ${JSON.stringify(data)}\n\n`);
        }
    };

    const marksheetListener = (data) => {
        if (data.eventId === eventid) {
            res.write('event: marksheet-updated\n'); 
            res.write(`data: ${JSON.stringify(data)}\n\n`);
        }
    };

     const shortlistListener = (data) => {
        if (data.eventId === eventid) {
            res.write('event: project-shortlisted\n'); 
            res.write(`data: ${JSON.stringify({ project: data.project })}\n\n`);
        }
    };

    const removeShortlistListener = (data) => {
        if (data.eventId === eventid) {
            res.write('event: project-removed-from-shortlist\n'); 
            res.write(`data: ${JSON.stringify({ projectId: data.projectId })}\n\n`);
        }
    };

    // Attach all your listeners
    appEmitter.on('convener-update', convenerListener);
    appEmitter.on('project-reallocated', projectListener);
    appEmitter.on('marksheet-updated', marksheetListener);
    appEmitter.on('new-rocemmendation', projectListener);
    appEmitter.on('project-promoted', projectListener);
    appEmitter.on('recommendation-updated', projectListener);
    appEmitter.on('project-shortlisted', shortlistListener);
    appEmitter.on('project-removed-from-shortlist', removeShortlistListener);


    // Clean up when the connection is closed
    req.on("close", () => {
        appEmitter.removeListener('convener-update', convenerListener);
        appEmitter.removeListener('project-reallocated', projectListener);
        appEmitter.removeListener('marksheet-updated', marksheetListener);
        appEmitter.removeListener('project-shortlisted', shortlistListener); 
        appEmitter.removeListener('project-removed-from-shortlist', removeShortlistListener);
        res.end();
    });
});

export default eventsRouter;