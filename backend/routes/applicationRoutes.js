const express = require('express');
const router = express.Router();
const db = require('../db/connection');

router.post('/apply', async (req, res) => {
  try {
    const { student_id, job_id, resume_id, current_stage, remarks } = req.body;
    const [result] = await db.execute('INSERT INTO application (student_id, job_id, resume_id, current_stage, remarks) VALUES (?, ?, ?, ?, ?)', [student_id, job_id, resume_id, current_stage, remarks]);
    res.status(201).json({ message: 'Application submitted', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/applications', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT a.*, s.name as student_name, s.email as student_email, j.role as job_role, j.company_id FROM application a JOIN student s ON a.student_id = s.student_id JOIN job_posting j ON a.job_id = j.job_id');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;