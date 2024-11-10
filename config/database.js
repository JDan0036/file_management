// config/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, '../database.db'), (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to SQLite database.');

    // Enable foreign key constraints
    db.run('PRAGMA foreign_keys = ON');

    // Create folders table to store folders
    db.run(`CREATE TABLE IF NOT EXISTS folders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      createdAt TEXT,
      parentId INTEGER,
      path TEXT,
      FOREIGN KEY (parentId) REFERENCES folders(id) ON DELETE CASCADE
    )`);

    // Create files table with a folderId to associate files with folders
    db.run(`CREATE TABLE IF NOT EXISTS files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      filePath TEXT NOT NULL,
      createdAt TEXT,
      folderId INTEGER,
      path TEXT,
      FOREIGN KEY (folderId) REFERENCES folders(id) ON DELETE CASCADE
    )`);
  }
});

module.exports = db;
