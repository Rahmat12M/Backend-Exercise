import pool from "../config/db.js";

const createEvent = async (req, res) => {
  try {
    const { name, location, startedAt } = req.body;

    if (!name || !location || !startedAt) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const result = await pool.query(
      `INSERT INTO events (name, location, started_at)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, location, startedAt]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "DB error", error: err.message });
  }
};
export default createEvent;