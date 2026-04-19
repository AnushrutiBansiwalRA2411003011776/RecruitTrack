const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const studentRoutes = require('./routes/studentRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const resultRoutes = require('./routes/resultRoutes');

app.use('/students', studentRoutes);
app.use('/jobs', jobRoutes);
app.use('/', applicationRoutes);
app.use('/', interviewRoutes);
app.use('/', resultRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});