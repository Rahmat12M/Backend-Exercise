import pool from "../config/db.js";

const registerParticipant = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { deviceId, role, positionNumber, browser, os } = req.body;

    if (!deviceId || !role || !positionNumber || !browser || !os) {
      return res.status(400).json({ message: "Missing fields" });
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

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "DB error", error: err.message });
  }
};
export default registerParticipant;