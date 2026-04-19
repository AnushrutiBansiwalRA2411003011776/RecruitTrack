const express = require("express");
const router = express.Router();
const db = require("../db/connection");

router.post("/interview", async (req, res) => {
  try {
    const { application_id, interview_type, round_number, score, feedback } =
      req.body;
    const [result] = await db.execute(
      "INSERT INTO interview (application_id, interview_type, round_number, score, feedback) VALUES (?, ?, ?, ?, ?)",
      [application_id, interview_type, round_number, score, feedback],
    );
    res
      .status(201)
      .json({ message: "Interview scheduled", id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/interviews", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM interview");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
