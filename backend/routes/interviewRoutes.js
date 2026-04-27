const express = require("express");
const router = express.Router();
const db = require("../db/connection");

router.post("/interviews", async (req, res) => {
  try {
    const {
      application_id,
      interview_type,
      interview_date,
      round_number,
      score,
      feedback,
    } = req.body;

    const [result] = await db.execute(
      "INSERT INTO interview (application_id, interview_type, interview_date, round_number, score, feedback) VALUES (?, ?, ?, ?, ?, ?)",
      [
        application_id,
        interview_type,
        interview_date,
        round_number,
        score,
        feedback,
      ],
    );

    // Update application stage to Interview
    await db.execute(
      "UPDATE application SET current_stage = 'Interview' WHERE application_id = ?",
      [application_id],
    );

    res.status(201).json({ message: "Interview scheduled", id: result.insertId });
  } catch (error) {
    console.error("Interview scheduling error:", error);
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
