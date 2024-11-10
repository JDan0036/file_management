// routes/folders.js
const express = require('express');
const db = require('../config/database');
const router = express.Router();

// Create a new folder
router.post('/', (req, res) => {
  const { name, parentId } = req.body;
  const createdAt = new Date().toISOString();

  // If there's a parentId, get the parent folder's path
  if (parentId) {
    db.get(`SELECT path FROM folders WHERE id = ?`, [parentId], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // If parent folder found, set new folder's path to parent's path + new folder name
      const parentPath = row ? row.path : '/root/';
      const newPath = `${parentPath}${name}/`;

      // Insert the new folder with the calculated path
      db.run(
        `INSERT INTO folders (name, createdAt, parentId, path) VALUES (?, ?, ?, ?)`,
        [name, createdAt, parentId, newPath],
        function (err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.status(201).json({ id: this.lastID, name, path: newPath });
        }
      );
    });
  } else {
    // If no parentId, set path to root path
  const newPath = `/root/${name}/`;

    db.run(
      `INSERT INTO folders (name, createdAt, parentId, path) VALUES (?, ?, ?, ?)`,
      [name, createdAt, null, newPath],
      function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, name, path: newPath });
      }
    );
  }
});

// Get all folders and their files
router.get('/', (req, res) => {
  // Get all folders
  db.all(`SELECT * FROM folders`, [], (err, folders) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // For each folder, get the files associated with it
    const folderPromises = folders.map(folder => {
      return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM files WHERE folderId = ?`, [folder.id], (err, files) => {
          if (err) {
            reject(err);
          } else {
            let updatedPath = folder.path.replace(new RegExp(`${folder.id}/`, 'g'), '');
            resolve({ ...folder, path: updatedPath, files });
          }
        });
      });
    });

    // Wait for all promises to resolve
    Promise.all(folderPromises)
      .then(results => res.json(results))
      .catch(error => res.status(500).json({ error: error.message }));
  });
});

// Delete a folder and all its contents
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.run(`DELETE FROM folders WHERE id = ?`, [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ deleted: this.changes });
  });
});

// Rename a folder and update the path
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { newName } = req.body;

  // Get the current folder info
  db.get(`SELECT * FROM folders WHERE id = ?`, [id], (err, folder) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!folder) return res.status(404).json({ error: 'Folder not found' });

    const oldPath = folder.path;
    const newPath = oldPath.replace(/[^/]+\/$/, `${newName}/`);

    // Update the folder name and path
    db.run(`UPDATE folders SET name = ?, path = ? WHERE id = ?`, [newName, newPath, id], (err) => {
      if (err) return res.status(500).json({ error: err.message });

      // Update paths of all nested folders and files
      db.serialize(() => {
        // Update paths for nested folders
        db.run(
          `UPDATE folders SET path = REPLACE(path, ?, ?) WHERE path LIKE ?`,
          [oldPath, newPath, `${oldPath}%`],
          (err) => {
            if (err) return res.status(500).json({ error: err.message });
          }
        );

        // Update paths for files in nested folders
        db.run(
          `UPDATE files SET filePath = REPLACE(filePath, ?, ?) WHERE filePath LIKE ?`,
          [oldPath, newPath, `${oldPath}%`],
          (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Folder renamed and paths updated successfully' });
          }
        );
      });
    });
  });
});

module.exports = router;