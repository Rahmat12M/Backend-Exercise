import pool from "../config/db.js";

const createLog = async (req, res) => {
  try {
    const { eventId } = req.params;

    const {
      deviceId,
      type,
      timestamp,
      details,
    } = req.body;

    if (!deviceId || !type || !timestamp) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // 1. check participant exists
    const participantCheck = await pool.query(
      `
      SELECT 1 FROM participants
      WHERE event_id = $1 AND device_id = $2
      `,
      [eventId, deviceId]
    );

    if (participantCheck.rowCount === 0) {
      return res.status(403).json({
        message: "Device not registered for this event",
      });
    }

    // 2. insert log
    const result = await pool.query(
      `
      INSERT INTO logs (
        event_id,
        device_id,
        type,
        timestamp,
        details
      )
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *;
      `,
      [eventId, deviceId, type, timestamp, details || {}]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "DB error", error: err.message });
  }
};

export default createLog;