const express = require('express');
const router = express.Router();
const db = require('../db/connection');

router.post('/students', async (req, res) => {
  try {
    const { name, email, phone, dob, age, tenth_percent, twelfth_percent, cgpa, yos, backlog, skill_set, department_id } = req.body;
    const [result] = await db.execute('INSERT INTO student (name, email, phone, dob, age, tenth_percent, twelfth_percent, cgpa, yos, backlog, skill_set, department_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [name, email, phone, dob, age, tenth_percent, twelfth_percent, cgpa, yos, backlog, skill_set, department_id]);
    res.status(201).json({ message: 'Student added', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/students', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM student');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;