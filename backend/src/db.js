const sqlite3 = require('sqlite3').verbose();
//const db = new sqlite3.Database(':memory:'); // Si queremos usar la base de datos en memoria para pruebas rápidas
const db = new sqlite3.Database('./data/database.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )
  `);
  
  // Insertar datos de prueba
  db.run(`INSERT OR IGNORE INTO users (name) VALUES (?)`, ["Tomi"]);
  db.run(`INSERT OR IGNORE INTO users (name) VALUES (?)`, ["Vaz"]);
});



module.exports = db;
