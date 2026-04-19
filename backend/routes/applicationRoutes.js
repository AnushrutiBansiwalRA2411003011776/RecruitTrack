const express = require("express");
const router = express.Router();
const db = require("../db/connection");

router.post("/apply", async (req, res) => {
  console.log("[ROUTE] /api/apply called", req.body);
  try {
    const { student_id, job_id } = req.body;

    if (!student_id || !job_id) {
      return res
        .status(400)
        .json({ error: "student_id and job_id are required" });
    }

    const [result] = await db.execute(
      "INSERT INTO application (student_id, job_id, current_stage) VALUES (?, ?, ?)",
      [student_id, job_id, "Applied"],
    );

    res
      .status(201)
      .json({ message: "Application submitted", id: result.insertId });
  } catch (error) {
    if (error.errno === 1062 || error.code === "ER_DUP_ENTRY") {
      return res
        .status(409)
        .json({ error: "You have already applied to this job." });
    }
    res.status(500).json({ error: error.message });
  }
});

router.get("/applications", async (req, res) => {
  console.log("[ROUTE] /api/applications called", req.query);
  try {
    const { student_id } = req.query;
    if (!student_id) {
      return res.status(400).json({ error: "student_id is required" });
    }

    const [rows] = await db.execute(
      `SELECT a.application_id,
              s.name AS student_name,
              jp.role AS job_role,
              c.company_name,
              a.current_stage
       FROM Application a
       JOIN Student s ON a.student_id = s.student_id
       JOIN Job_Posting jp ON a.job_id = jp.job_id
       JOIN Company c ON jp.company_id = c.company_id
       WHERE a.student_id = ?`,
      [student_id],
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
