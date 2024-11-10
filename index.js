// index.js
const express = require('express');
const cors = require('cors');
const fileRoutes = require('./routes/files'); // Import the file routes
const foldersRoutes = require('./routes/folders'); // Import the folders routes
require('./config/database'); // Ensure database is connected

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', fileRoutes); // Mount the file routes at /files
app.use('/folders', foldersRoutes); // Mount the folders routes at /folders

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
