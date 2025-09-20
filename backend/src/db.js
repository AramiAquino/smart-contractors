const sqlite3 = require('sqlite3').verbose();
//const db = new sqlite3.Database(':memory:'); // Si queremos usar la base de datos en memoria para pruebas rápidas
const db = new sqlite3.Database('./data/database.db');

db.serialize(() => {
  // Tabla de usuarios
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )
  `);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS works (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_address TEXT NOT NULL,
      worker_address TEXT,
      amount REAL NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Created',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      deadline INTEGER,
      delivery_data TEXT,
      blockchain_tx_hash TEXT,
      blockchain_work_id INTEGER
    )
  `);
  
  db.run(`INSERT OR IGNORE INTO users (name) VALUES (?)`, ["Tomi"]);
  db.run(`INSERT OR IGNORE INTO users (name) VALUES (?)`, ["Vaz"]);
  
  db.run(`INSERT OR IGNORE INTO works (
    client_address, 
    worker_address, 
    amount, 
    title, 
    description, 
    status, 
    deadline
  ) VALUES (?, ?, ?, ?, ?, ?, ?)`, [
    "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    "0x8ba1f109551bD432803012645Hac136c4c4c4c4c4",
    100.50,
    "Desarrollo de aplicación web",
    "Necesito una aplicación web moderna con React y Node.js para mi empresa",
    "Created",
    1735689600 // 1 de enero de 2025
  ]);
  
  db.run(`INSERT OR IGNORE INTO works (
    client_address, 
    worker_address, 
    amount, 
    title, 
    description, 
    status, 
    deadline
  ) VALUES (?, ?, ?, ?, ?, ?, ?)`, [
    "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    "0x9ca1f109551bD432803012645Hac136c4c4c4c4c5",
    250.00,
    "Diseño de logo corporativo",
    "Crear un logo profesional para mi startup de tecnología",
    "InProgress",
    1733097600 // 1 de diciembre de 2024
  ]);
  
  db.run(`INSERT OR IGNORE INTO works (
    client_address, 
    worker_address, 
    amount, 
    title, 
    description, 
    status, 
    deadline,
    delivery_data
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
    "0x8ba1f109551bD432803012645Hac136c4c4c4c4c4",
    "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    75.25,
    "Traducción de documentos",
    "Traducir 50 páginas de inglés a español",
    "Submitted",
    1730419200, // 1 de noviembre de 2024
    "Archivos traducidos: doc1.pdf, doc2.pdf, doc3.pdf"
  ]);
  
  db.run(`INSERT OR IGNORE INTO works (
    client_address, 
    worker_address, 
    amount, 
    title, 
    description, 
    status, 
    deadline
  ) VALUES (?, ?, ?, ?, ?, ?, ?)`, [
    "0x9ca1f109551bD432803012645Hac136c4c4c4c4c5",
    null,
    500.00,
    "Desarrollo de smart contract",
    "Crear un smart contract para un sistema de votación descentralizado",
    "Created",
    1738368000 // 1 de febrero de 2025
  ]);
  
  db.run(`INSERT OR IGNORE INTO works (
    client_address, 
    worker_address, 
    amount, 
    title, 
    description, 
    status, 
    deadline
  ) VALUES (?, ?, ?, ?, ?, ?, ?)`, [
    "0x8ba1f109551bD432803012645Hac136c4c4c4c4c4",
    "0x9ca1f109551bD432803012645Hac136c4c4c4c4c5",
    150.75,
    "Análisis de datos",
    "Analizar dataset de ventas y generar reportes con visualizaciones",
    "Completed",
    1727740800 // 1 de octubre de 2024
  ]);
});

module.exports = db;
