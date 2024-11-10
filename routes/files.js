// routes/files.js
const express = require('express');
const multer = require('multer');
const db = require('../config/database');
const router = express.Router();
const path = require('path');

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

// Create (Upload a file to a specific folder if folderId is provided)
router.post('/', upload.single('file'), (req, res) => {
  const { originalname } = req.file;
  const filePath = req.file.path;
  const { folderId } = req.body; // Folder ID passed from the frontend
  const createdAt = new Date().toISOString();

  db.run(
    `INSERT INTO files (name, filePath, createdAt, path, folderId) VALUES (?, ?, ?, ?, ?)`,
    [originalname, filePath, createdAt, path, folderId || null],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID, name: originalname });
    }
  );
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

// Rename a file
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { newName } = req.body;

  db.run(`UPDATE files SET name = ? WHERE id = ?`, [newName, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'File not found' });
    res.json({ message: 'File renamed successfully' });
  });
});


module.exports = router;