import { WebSocketServer, WebSocket } from "ws";
import { sql } from "../config/db.js"; // Postgres client

const clients = new Map(); // userId -> { ws, role, categoryId }
const locations = new Map(); // userId -> latest location object

function init(server) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.on("message", async (message) => {
      try {
        const data = JSON.parse(message);

        // 1. Register a client
        if (data.type === "register" && data.userid) {
          if (clients.has(data.userid)) {
            const oldClient = clients.get(data.userid).ws;
            if (oldClient && oldClient.readyState === WebSocket.OPEN) {
              oldClient.close();
            }
          }

          clients.set(data.userid, {
            ws,
            role: data.role || "judge",
            categoryId: data.categoryId || null,
          });

          console.log(
            `Client registered: userId=${data.userid}, role=${data.role}, category=${data.categoryId}`
          );
        }

        // 2. Judge sends location
        else if (data.type === "location" && data.userid && data.latitude && data.longitude) {
          const locationData = {
            judgeid: data.userid,
            latitude: data.latitude,
            longitude: data.longitude,
            accuracy: data.accuracy || null,
            timestamp: new Date().toISOString(),
          };

          // Store latest in memory
          locations.set(data.userid, locationData);

          // Save to DB
          try {
            await sql.query(
              `INSERT INTO judgeslocations (judgeid, latitude, longitude, accuracy, timestamp)
               VALUES ($1, $2, $3, $4, $5)`,
              [
                locationData.judgeid,
                locationData.latitude,
                locationData.longitude,
                locationData.accuracy,
                locationData.timestamp,
              ]
            );
          } catch (dbErr) {
            console.error("DB insert error:", dbErr);
          }

          console.log(`Location update from ${data.userid}:`, locationData);

          // Broadcast to conveners & co-judges
          for (let [uid, client] of clients.entries()) {
            if (client.ws.readyState !== WebSocket.OPEN) continue;

            if (client.role === "convener") {
              client.ws.send(JSON.stringify({ type: "locationUpdate", ...locationData }));
            } else if (
              client.role === "judge" &&
              client.categoryId &&
              client.categoryId === data.categoryId &&
              uid !== data.userid
            ) {
              client.ws.send(JSON.stringify({ type: "locationUpdate", ...locationData }));
            }
          }
        }
      } catch (err) {
        console.error("WS message error:", err);
      }
    });

    ws.on("close", () => {
      for (let [userId, client] of clients.entries()) {
        if (client.ws === ws) {
          clients.delete(userId);
          console.log(`Client disconnected: ${userId}`);
          break;
        }
      }
    });
  });

  console.log("WebSocket server initialized");
}

// helper to send message to one specific user
function sendToUser(userId, message) {
  const client = clients.get(userId);
  if (client && client.ws.readyState === WebSocket.OPEN) {
    client.ws.send(JSON.stringify(message));
    return true;
  }
  return false;
}

export default {
  init,
  clients,
  locations,
  sendToUser,
};
