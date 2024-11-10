// config/delete.js.
// This file just is used to delete the databases
const sqlite3 = require('sqlite3').verbose();

// Open the database (replace 'your-database.db' with your actual database file)
const db = new sqlite3.Database('database.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    return;
  }
  console.log('Connected to the SQLite database.');
});

// Function to delete all tables
const deleteAllTables = () => {
  // Step 1: Get the list of tables
  db.all("SELECT name FROM sqlite_master WHERE type='table';", [], (err, tables) => {
    if (err) {
      console.error('Error fetching table list:', err.message);
      return;
    }

    // Step 2: Drop each table
    if (tables.length === 0) {
      console.log('No tables found to delete.');
      return;
    }

    tables.forEach((table) => {
      const dropQuery = `DROP TABLE IF EXISTS ${table.name}`;
      db.run(dropQuery, (err) => {
        if (err) {
          console.error(`Error deleting table ${table.name}:`, err.message);
        } else {
          console.log(`Table ${table.name} deleted.`);
        }
      });
    });
  });
};

// Call the function to delete all tables
deleteAllTables();

// Close the database connection
db.close((err) => {
  if (err) {
    console.error('Error closing database:', err.message);
  } else {
    console.log('Database connection closed.');
  }
});
