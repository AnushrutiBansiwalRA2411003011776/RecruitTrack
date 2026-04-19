const express = require("express");
const router = express.Router();
const db = require("../db/connection");

router.post("/result", async (req, res) => {
  try {
    const { application_id, offer_status, offer_letter_status, joining_date } =
      req.body;
    const [result] = await db.execute(
      "INSERT INTO result (application_id, offer_status, offer_letter_status, joining_date) VALUES (?, ?, ?, ?)",
      [application_id, offer_status, offer_letter_status, joining_date],
    );
    res.status(201).json({ message: "Result stored", id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/results", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT r.*, a.student_id, s.name as student_name, s.email as student_email, j.role as job_role, j.company_id FROM result r JOIN application a ON r.application_id = a.application_id JOIN student s ON a.student_id = s.student_id JOIN job_posting j ON a.job_id = j.job_id",
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:application_id", async (req, res) => {
  try {
    const { application_id } = req.params;
    const [rows] = await db.execute(
      "SELECT * FROM result WHERE application_id = ?",
      [application_id],
    );
    res.json(rows[0] || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
