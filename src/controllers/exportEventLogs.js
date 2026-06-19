import pool from "../config/db.js";
const exportLogs = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { format } = req.query; // json | csv

    const result = await pool.query(
      `
      SELECT event_id, device_id, type, timestamp, details
      FROM logs
      WHERE event_id = $1
      ORDER BY timestamp ASC
      `,
      [eventId]
    );

    const logs = result.rows;

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
          message: "Invalid log type"
        });
      }

    // JSON export
    if (!format || format === "json") {
      return res.json(logs);
    }

    // CSV export
    if (format === "csv") {
      const header = "eventId,deviceId,type,timestamp,details\n";

      const csv = logs
        .map((l) => {
          return `${l.event_id},${l.device_id},${l.type},${l.timestamp.toISOString()},${JSON.stringify(l.details)}`;
        })
        .join("\n");

      res.header("Content-Type", "text/csv");
      return res.send(header + csv);
    }

    return res.status(400).json({ message: "Invalid format" });
  } catch (err) {
    res.status(500).json({ message: "DB error", error: err.message });
  }
};

export default exportLogs;