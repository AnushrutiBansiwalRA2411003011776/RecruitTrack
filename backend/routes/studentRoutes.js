const express = require("express");
const router = express.Router();
const db = require("../db/connection");

router.post("/students", async (req, res) => {
  console.log("[ROUTE] /api/students called", req.body);
  try {
    const {
      name,
      email,
      phone,
      dob,
      age,
      tenth_percent,
      twelfth_percent,
      cgpa,
      yos,
      backlog,
      skill_set,
      department_id,
    } = req.body;
    const [result] = await db.execute(
      "INSERT INTO Student (name, email, phone, dob, age, tenth_percent, twelfth_percent, cgpa, yos, backlog, skill_set, department_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        name,
        email,
        phone,
        dob,
        age,
        tenth_percent,
        twelfth_percent,
        cgpa,
        yos,
        backlog,
        skill_set,
        department_id,
      ],
    );
    res.status(201).json({ message: "Student added", id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/students", async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT s.*, d.department_name
      FROM Student s
      LEFT JOIN Department d ON s.department_id = d.department_id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
