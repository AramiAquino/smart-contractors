const db = require('../db');
const User = require('../model/user');

// Obtener todos los usuarios
const getAllUsers = (callback) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) return callback(err);
    const users = rows.map(row => new User(row.id, row.name, row.email, row.password));
    callback(null, users);
  });
};

// Crear usuario
const createUser = (user, callback) => {
  db.run(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [user.name, user.email, user.password],
    function (err) {
      if (err) return callback(err);
      callback(null, new User(this.lastID, user.name, user.email, user.password));
    }
  );
};

// Buscar usuario por email (más típico para login)
const findByEmail = (email, callback) => {
  db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
    if (err) return callback(err);
    if (!row) return callback(null, null);
    const user = new User(row.id, row.name, row.email, row.password);
    callback(null, user);
  });
};

module.exports = {
  getAllUsers,
  createUser,
  findByEmail
};
