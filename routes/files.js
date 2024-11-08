// routes/files.js
const express = require('express');
const multer = require('multer');
const db = require('../config/database'); // Import the SQLite connection or MongoDB model
const router = express.Router();

// Configure Multer to store files in a specified directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Create (Upload a file)
router.post('/', upload.single('file'), (req, res) => {
  const { originalname } = req.file;
  const filePath = req.file.path;
  db.run(`INSERT INTO files (name, filePath, createdAt) VALUES (?, ?, ?)`,
    [originalname, filePath, new Date().toISOString()],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID });
    });
});

// Read (List all files)
router.get('/', (req, res) => {
  db.all(`SELECT * FROM files`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Read (Get a specific file by ID)
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.get(`SELECT * FROM files WHERE id = ?`, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(row);
  });
});

// Delete (Delete a file by ID)
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM files WHERE id = ?`, [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ deleted: this.changes });
  });
});

module.exports = router;
