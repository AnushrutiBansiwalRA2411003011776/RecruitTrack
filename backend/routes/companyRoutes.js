const express = require("express");
const router = express.Router();
const db = require("../db/connection");

// GET all companies
router.get("/companies", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT company_id, company_name AS name FROM company",
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching companies:", error);
    res.status(500).json({ error: "Failed to fetch companies" });
  }
});

module.exports = router;
