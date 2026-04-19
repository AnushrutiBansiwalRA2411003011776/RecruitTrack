const express = require("express");
const cors = require("cors");
const db = require("./db/connection");

const app = express();

app.use(cors());
app.use(express.json());

const studentRoutes = require("./routes/studentRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const resultRoutes = require("./routes/resultRoutes");
const companyRoutes = require("./routes/companyRoutes");

async function ensureInterviewScoreColumn() {
  try {
    await db.execute(
      "ALTER TABLE Interview ADD COLUMN score DECIMAL(5,2) AFTER round_number",
    );
  } catch (error) {
    if (error.errno !== 1060 && error.code !== "ER_DUP_FIELDNAME") {
      console.warn("Interview score migration failed:", error.message);
    }
  }
}

ensureInterviewScoreColumn();

app.use("/students", studentRoutes);
app.use("/jobs", jobRoutes);
app.use("/", applicationRoutes);
app.use("/", interviewRoutes);
app.use("/", resultRoutes);
app.use("/companies", companyRoutes);

app.use("/api", studentRoutes);
app.use("/api", applicationRoutes);
app.use("/api", interviewRoutes);
app.use("/api", companyRoutes);

app.get("/api/departments", async (req, res) => {
  console.log("[ROUTE] /api/departments called");
  try {
    const [rows] = await db.query(
      "SELECT department_id, department_name FROM Department",
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/jobs", async (req, res) => {
  const {
    company_id,
    role,
    required_skills,
    work_mode,
    experience_required,
    package_offered,
    no_of_openings,
    min_cgpa,
    max_backlogs,
    department_allowed,
  } = req.body;

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [jobResult] = await connection.execute(
      "INSERT INTO job_posting (company_id, role, required_skills, work_mode, experience_required, package_offered, no_of_openings) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        company_id,
        role,
        required_skills,
        work_mode,
        experience_required,
        package_offered,
        no_of_openings,
      ],
    );

    await connection.execute(
      "INSERT INTO eligibility_criteria (job_id, min_cgpa, max_backlogs, department_allowed) VALUES (?, ?, ?, ?)",
      [jobResult.insertId, min_cgpa, max_backlogs, department_allowed],
    );

    await connection.commit();
    res.status(201).json({ id: jobResult.insertId });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
});

app.get("/api/jobs", async (req, res) => {
  console.log("[ROUTE] /api/jobs called");
  try {
    const [rows] = await db.execute(
      `SELECT jp.job_id,
              c.company_name,
              jp.role,
              jp.package_offered,
              jp.work_mode,
              jp.experience_required,
              jp.required_skills,
              jp.no_of_openings,
              ec.min_cgpa,
              ec.department_allowed
       FROM Job_Posting jp
       JOIN Company c ON jp.company_id = c.company_id
       LEFT JOIN eligibility_criteria ec ON jp.job_id = ec.job_id`,
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/applications/all", async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT a.application_id, s.name AS student_name, jp.role, c.company_name, a.application_date, a.current_stage
       FROM application a
       JOIN student s ON a.student_id = s.student_id
       JOIN job_posting jp ON a.job_id = jp.job_id
       JOIN company c ON jp.company_id = c.company_id`,
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/interviews", async (req, res) => {
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
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/results", async (req, res) => {
  try {
    const offer_status = req.body.offer_status ?? req.body.final_status;
    const { application_id, offer_letter_status, joining_date } = req.body;
    const [existing] = await db.execute(
      "SELECT result_id FROM result WHERE application_id = ?",
      [application_id],
    );
    if (existing.length > 0) {
      return res
        .status(409)
        .json({ error: "Result already recorded for this application" });
    }

    await db.execute(
      "INSERT INTO result (application_id, offer_status, offer_letter_status, joining_date) VALUES (?, ?, ?, ?)",
      [application_id, offer_status, offer_letter_status, joining_date],
    );

    const nextStage =
      offer_status === "Selected"
        ? "Offer"
        : offer_status === "Rejected"
          ? "Rejected"
          : "Interview";
    await db.execute(
      "UPDATE application SET current_stage = ? WHERE application_id = ?",
      [nextStage, application_id],
    );

    res.status(201).json({ message: "Result recorded" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/result", async (req, res) => {
  console.log("[ROUTE] /api/result called", req.query);
  try {
    const { application_id } = req.query;
    const [rows] = await db.execute(
      `SELECT r.offer_status,
              r.offer_letter_status,
              r.joining_date,
              i.interview_type,
              i.score,
              i.feedback,
              i.round_number
       FROM Results r
       LEFT JOIN Interview i ON r.application_id = i.application_id
       WHERE r.application_id = ?`,
      [application_id],
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Result not found" });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/", (req, res) => res.send("Server is running"));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
