const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Base de datos de prueba en memoria
const createTestDb = () => {
  const db = new sqlite3.Database(':memory:');
  
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Crear tablas de prueba
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL
        );
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS work_status (
          id INTEGER PRIMARY KEY,
          name TEXT NOT NULL
        );
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS works (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          client_id INTEGER NOT NULL,
          worker_id INTEGER,
          amount INTEGER NOT NULL,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          status_id INTEGER NOT NULL,
          created_at INTEGER NOT NULL,
          deadline INTEGER NOT NULL,
          delivery_data TEXT,
          FOREIGN KEY (client_id) REFERENCES users(id),
          FOREIGN KEY (worker_id) REFERENCES users(id),
          FOREIGN KEY (status_id) REFERENCES work_status(id)
        );
      `);

      // Insertar datos de prueba
      db.run(`
        INSERT OR IGNORE INTO users (name, email, password) VALUES
        ('Alice', 'alice@test.com', 'hashed_pass1'),
        ('Bob', 'bob@test.com', 'hashed_pass2');
      `);

      db.run(`
        INSERT OR IGNORE INTO work_status (id, name) VALUES
        (0, 'Created'),
        (1, 'InProgress'),
        (2, 'Submitted'),
        (3, 'Completed'),
        (4, 'Cancelled');
      `);

      db.run(`
        INSERT OR IGNORE INTO works (client_id, worker_id, amount, title, description, status_id, created_at, deadline, delivery_data) VALUES 
        (1, 2, 5000, 'Test Work','Test Description', 0, strftime('%s','now'), strftime('%s','now','+7 days'), NULL);
      `, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(db);
        }
      });
    });
  });
};

module.exports = { createTestDb };
