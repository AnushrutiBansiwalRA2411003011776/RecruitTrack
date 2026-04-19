const API_BASE = "http://localhost:5000";

async function loadDropdowns() {
  try {
    const [students, jobs, applications, companies] = await Promise.all([
      fetch(`${API_BASE}/students`).then((res) => res.json()),
      fetch(`${API_BASE}/jobs`).then((res) => res.json()),
      fetch(`${API_BASE}/applications`).then((res) => res.json()),
      fetch(`${API_BASE}/companies`).then((res) => res.json()),
    ]);

    populateSelect("studentSelect", students, "name");
    populateSelect("applicationSelect", applications, "application_id");
    populateSelect("applicationSelectResult", applications, "application_id");
    populateSelect("companySelect", companies, "name");
  } catch (error) {
    console.error("Error loading dropdowns:", error);
  }
}

function populateSelect(selectId, data, displayField) {
  const select = document.getElementById(selectId);
  if (!select) return;
  select.innerHTML = `<option value="">Select ${selectId.replace("Select", "")}</option>`;
  data.forEach((item) => {
    const option = document.createElement("option");
    option.value =
      item.id ||
      item.student_id ||
      item.application_id ||
      item.company_id ||
      item.job_id;
    option.textContent =
      item[displayField] || item.name || item.role || item.email;
    select.appendChild(option);
  });
}

async function handleSubmit(url, data) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    alert("Success: " + JSON.stringify(result));
    loadTables();
  } catch (error) {
    console.error("Error:", error);
    alert("Error: " + error.message);
  }
}

function loadTables() {
  // Load jobs for student page
  if (document.getElementById("jobsTable")) {
    fetch(`${API_BASE}/jobs`)
      .then((res) => res.json())
      .then((data) => {
        const tbody = document.querySelector("#jobsTable tbody");
        tbody.innerHTML = data
          .map(
            (job) => `
          <tr>
            <td>${job.role}</td>
            <td>${job.required_skills}</td>
            <td>${job.work_mode}</td>
            <td>${job.experience_required}</td>
            <td>${job.package_offered}</td>
            <td><button onclick="applyForJob(${job.job_id})">Apply</button></td>
          </tr>
        `,
          )
          .join("");
      })
      .catch(console.error);
  }

  // Load tables for admin page
  if (document.getElementById("studentsTable")) {
    fetch(`${API_BASE}/students`)
      .then((res) => res.json())
      .then((data) => {
        const tbody = document.querySelector("#studentsTable tbody");
        tbody.innerHTML = data
          .map(
            (student) => `
          <tr><td>${student.name}</td><td>${student.email}</td></tr>
        `,
          )
          .join("");
      })
      .catch(console.error);
  }

  if (document.getElementById("jobsTable")) {
    fetch(`${API_BASE}/jobs`)
      .then((res) => res.json())
      .then((data) => {
        const tbody = document.querySelector("#jobsTable tbody");
        tbody.innerHTML = data
          .map(
            (job) => `
          <tr><td>${job.role}</td><td>${job.company_id}</td></tr>
        `,
          )
          .join("");
      })
      .catch(console.error);
  }

  if (document.getElementById("applicationsTable")) {
    fetch(`${API_BASE}/applications`)
      .then((res) => res.json())
      .then((data) => {
        const tbody = document.querySelector("#applicationsTable tbody");
        tbody.innerHTML = data
          .map(
            (app) => `
          <tr><td>${app.student_name}</td><td>${app.job_role}</td><td>${app.current_stage}</td></tr>
        `,
          )
          .join("");
      })
      .catch(console.error);
  }
}

function applyForJob(jobId) {
  const studentId = document.getElementById("studentSelect").value;
  if (!studentId) {
    alert("Please select a student first.");
    return;
  }
  handleSubmit(`${API_BASE}/apply`, {
    student_id: studentId,
    job_id: jobId,
    resume_id: null,
    current_stage: "Applied",
    remarks: "",
  });
}

function checkResult() {
  const studentId = document.getElementById("studentSelect").value;
  if (!studentId) {
    alert("Please select a student.");
    return;
  }
  // Assuming result by student, but route is by application_id, need to adjust
  fetch(`${API_BASE}/results`)
    .then((res) => res.json())
    .then((data) => {
      const result = data.find((r) => r.student_id == studentId);
      document.getElementById("resultDisplay").innerHTML = result
        ? `Status: ${result.offer_status}`
        : "No result found";
    })
    .catch(console.error);
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  loadDropdowns();
  loadTables();

  // Student form
  const studentForm = document.getElementById("studentForm");
  if (studentForm) {
    studentForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(studentForm));
      handleSubmit(`${API_BASE}/students`, data);
      studentForm.reset();
    });
  }

  // Job form
  const jobForm = document.getElementById("jobForm");
  if (jobForm) {
    jobForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(jobForm));
      handleSubmit(`${API_BASE}/jobs`, data);
      jobForm.reset();
    });
  }

  // Interview form
  const interviewForm = document.getElementById("interviewForm");
  if (interviewForm) {
    interviewForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(interviewForm));
      handleSubmit(`${API_BASE}/interview`, data);
      interviewForm.reset();
    });
  }

  // Result form
  const resultForm = document.getElementById("resultForm");
  if (resultForm) {
    resultForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(resultForm));
      handleSubmit(`${API_BASE}/result`, data);
      resultForm.reset();
    });
  }
});
