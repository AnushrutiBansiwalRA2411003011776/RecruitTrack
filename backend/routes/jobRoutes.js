const express = require('express');
const router = express.Router();
const db = require('../db/connection');

router.post('/jobs', async (req, res) => {
  try {
    const { company_id, role, required_skills, work_mode, experience_required, package_offered, no_of_openings } = req.body;
    const [result] = await db.execute('INSERT INTO job_posting (company_id, role, required_skills, work_mode, experience_required, package_offered, no_of_openings) VALUES (?, ?, ?, ?, ?, ?, ?)', [company_id, role, required_skills, work_mode, experience_required, package_offered, no_of_openings]);
    res.status(201).json({ message: 'Job added', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/jobs', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM job_posting');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;