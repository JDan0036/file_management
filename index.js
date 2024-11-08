// index.js
const express = require('express');
const cors = require('cors');
const fileRoutes = require('./routes/files'); // Import the file routes
require('./config/database'); // Ensure database is connected

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', fileRoutes); // Mount the file routes at /files

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
