import pool from "../config/db.js";
const getEventSummary = async (req, res) => {
  try {
    const { eventId } = req.params;

    // 1. event info
    const eventRes = await pool.query(
      `SELECT * FROM events WHERE id = $1`,
      [eventId]
    );

    if (eventRes.rowCount === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    const event = eventRes.rows[0];

    // 2. participant stats
    const participantsRes = await pool.query(
      `
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE role = 'visitor')::int AS visitors,
        COUNT(*) FILTER (WHERE role = 'performer')::int AS performers,
        COUNT(*) FILTER (WHERE role = 'controller')::int AS controllers
      FROM participants
      WHERE event_id = $1
      `,
      [eventId]
    );

    // 3. log stats
    const logsStatsRes = await pool.query(
      `
      SELECT
        COUNT(*) FILTER (WHERE type = 'disconnected')::int AS disconnects,
        COUNT(*) FILTER (WHERE type = 'reconnected')::int AS reconnects,
        COUNT(*) FILTER (WHERE type = 'animation_triggered')::int AS animations,
        COUNT(*) FILTER (WHERE type = 'sound_triggered')::int AS sounds
      FROM logs
      WHERE event_id = $1
      `,
      [eventId]
    );

    // 4. recent logs
    const recentLogsRes = await pool.query(
      `
      SELECT *
      FROM logs
      WHERE event_id = $1
      ORDER BY timestamp DESC
      LIMIT 10
      `,
      [eventId]
    );

    res.json({
      event: {
        id: event.id,
        name: event.name,
        location: event.location,
        startedAt: event.started_at,
      },
      participants: participantsRes.rows[0],
      logs: logsStatsRes.rows[0],
      recentLogs: recentLogsRes.rows,
    });
  } catch (err) {
    res.status(500).json({ message: "DB error", error: err.message });
  }
};
export default getEventSummary;