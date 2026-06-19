import pool from "../config/db.js";

const updatePosition = async (req, res) => {
  try {
    const { eventId, deviceId } = req.params;
    const { positionNumber } = req.body;

    if (positionNumber === undefined) {
      return res.status(400).json({ message: "positionNumber required" });
    }

    const result = await pool.query(
      `
      UPDATE participants
      SET position_number = $1,
          updated_at = NOW()
      WHERE event_id = $2 AND device_id = $3
      RETURNING *;
      `,
      [positionNumber, eventId, deviceId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Participant not found",
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "DB error", error: err.message });
  }
};
export default updatePosition;