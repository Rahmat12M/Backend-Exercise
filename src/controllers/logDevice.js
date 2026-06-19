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

    // Missing required fields
    if (!deviceId || !type || !timestamp) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    // Event does not exist
    const event = await pool.query(
      "SELECT id FROM events WHERE id = $1",
      [eventId]
    );

    if (event.rows.length === 0) {
      return res.status(404).json({
        message: "Event does not exist",
      });
    }

    // Invalid log type
    const validTypes = [
      "joined",
      "disconnected",
      "reconnected",
      "position_updated",
      "animation_triggered",
      "sound_triggered",
    ];

    if (!validTypes.includes(type)) {
      return res.status(400).json({
        message: "Invalid log type",
      });
    }

    // Logging activity for an unregistered device
    const participantCheck = await pool.query(
      `
      SELECT 1
      FROM participants
      WHERE event_id = $1
      AND device_id = $2
      `,
      [eventId, deviceId]
    );

    if (participantCheck.rowCount === 0) {
      return res.status(403).json({
        message: "Logging activity for an unregistered device",
      });
    }

    // Insert log
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
    res.status(500).json({
      message: "Database error",
      error: err.message,
    });
  }
};

export default createLog;