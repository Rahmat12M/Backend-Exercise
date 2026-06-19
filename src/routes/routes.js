import express from "express";

import createEvent from "../controllers/event.js";
import registerParticipant from "../controllers/registerParticipant.js";
import createLog from "../controllers/logDevice.js";
import updatePosition from "../controllers/updatePosition.js";
import getEventSummary from "../controllers/eventSummary.js";
import exportLogs from "../controllers/exportEventLogs.js";

const router = express.Router();


router.post("/", createEvent);
router.post("/:eventId/participants", registerParticipant);
router.post("/:eventId/logs", createLog);
router.patch("/:eventId/participants/:deviceId/position", updatePosition);
router.get("/:eventId/summary", getEventSummary);
router.get("/:eventId/logs/export", exportLogs);

export default router;