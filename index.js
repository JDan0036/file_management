const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json()); // Allows Express to parse JSON request bodies

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});