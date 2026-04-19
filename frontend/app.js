const API_BASE = "http://localhost:5000";

const studentForm = document.getElementById("studentForm");
const jobForm = document.getElementById("jobForm");
const applyForm = document.getElementById("applyForm");
const interviewForm = document.getElementById("interviewForm");
const resultForm = document.getElementById("resultForm");

const studentsTable = document.querySelector("#studentsTable tbody");
const jobsTable = document.querySelector("#jobsTable tbody");
const applicationsTable = document.querySelector("#applicationsTable tbody");
const interviewsTable = document.querySelector("#interviewsTable tbody");
const resultsTable = document.querySelector("#resultsTable tbody");

const handleSubmit = (url, data, callback) => {
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then(() => {
      if (callback) callback();
      loadAll();
    })
    .catch(console.error);
};

studentForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = Object.fromEntries(new FormData(studentForm));
  handleSubmit(`${API_BASE}/students`, formData, () => studentForm.reset());
});

jobForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = Object.fromEntries(new FormData(jobForm));
  handleSubmit(`${API_BASE}/jobs`, formData, () => jobForm.reset());
});

applyForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = Object.fromEntries(new FormData(applyForm));
  handleSubmit(`${API_BASE}/apply`, formData, () => applyForm.reset());
});

interviewForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = Object.fromEntries(new FormData(interviewForm));
  handleSubmit(`${API_BASE}/interview`, formData, () => interviewForm.reset());
});

resultForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = Object.fromEntries(new FormData(resultForm));
  handleSubmit(`${API_BASE}/result`, formData, () => resultForm.reset());
});

const renderTable = (rows, element, mapper) => {
  element.innerHTML =
    rows.map(mapper).join("") ||
    '<tr><td colspan="5">No records found</td></tr>';
};

const loadAll = () => {
  fetch(`${API_BASE}/students`)
    .then((res) => res.json())
    .then((data) => {
      renderTable(
        data,
        studentsTable,
        (row) =>
          `<tr><td>${row.student_id || row.id || ""}</td><td>${row.name || ""}</td><td>${row.email || ""}</td><td>${row.phone || ""}</td><td>${row.cgpa || ""}</td></tr>`,
      );
    })
    .catch(console.error);

  fetch(`${API_BASE}/jobs`)
    .then((res) => res.json())
    .then((data) => {
      renderTable(
        data,
        jobsTable,
        (row) =>
          `<tr><td>${row.job_id || row.id || ""}</td><td>${row.company_id || ""}</td><td>${row.role || ""}</td><td>${row.required_skills || ""}</td><td>${row.package_offered || ""}</td></tr>`,
      );
    })
    .catch(console.error);

  fetch(`${API_BASE}/applications`)
    .then((res) => res.json())
    .then((data) => {
      renderTable(
        data,
        applicationsTable,
        (row) =>
          `<tr><td>${row.application_id || row.id || ""}</td><td>${row.student_name || ""}</td><td>${row.job_role || ""}</td><td>${row.current_stage || ""}</td></tr>`,
      );
    })
    .catch(console.error);

  fetch(`${API_BASE}/interviews`)
    .then((res) => res.json())
    .then((data) => {
      renderTable(
        data,
        interviewsTable,
        (row) =>
          `<tr><td>${row.interview_id || row.id || ""}</td><td>${row.application_id || ""}</td><td>${row.interview_type || ""}</td><td>${row.round_number || ""}</td><td>${row.score || ""}</td></tr>`,
      );
    })
    .catch(console.error);

  fetch(`${API_BASE}/results`)
    .then((res) => res.json())
    .then((data) => {
      renderTable(
        data,
        resultsTable,
        (row) =>
          `<tr><td>${row.result_id || row.id || ""}</td><td>${row.student_name || ""}</td><td>${row.job_role || ""}</td><td>${row.offer_status || ""}</td><td>${row.joining_date || ""}</td></tr>`,
      );
    })
    .catch(console.error);
};

loadAll();
