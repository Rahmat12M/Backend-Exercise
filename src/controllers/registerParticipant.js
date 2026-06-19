import pool from "../config/db.js";

const registerParticipant = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { deviceId, role, positionNumber, browser, os } = req.body;

    // Missing required fields
    if (!deviceId || !role || !positionNumber || !browser || !os) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    // Invalid role
    const validRoles = ["visitor", "performer", "controller"];

    if (!validRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
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

    
    const participant = await pool.query(
      `SELECT * FROM participants
       WHERE event_id=$1 AND device_id=$2`,
      [eventId, deviceId]
    );

    let message = "Participant registered";

    if (participant.rows.length > 0) {
      message = "Duplicate device registration. Participant updated.";
    }

    const result = await pool.query(
      `
      INSERT INTO participants (
        event_id,
        device_id,
        role,
        position_number,
        browser,
        os
      )
      VALUES ($1,$2,$3,$4,$5,$6)
      ON CONFLICT (event_id, device_id)
      DO UPDATE SET
        role = EXCLUDED.role,
        position_number = EXCLUDED.position_number,
        browser = EXCLUDED.browser,
        os = EXCLUDED.os,
        updated_at = NOW()
      RETURNING *;
      `,
      [eventId, deviceId, role, positionNumber, browser, os]
    );

    return res.status(200).json({
      message,
      participant: result.rows[0],
    });

  } catch (err) {
    res.status(500).json({
      message: "Database error",
      error: err.message,
    });
  }
};

export default registerParticipant;