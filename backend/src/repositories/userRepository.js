const db = require('../db');
const User = require('../model/user');

const getAllUsers = (callback) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) return callback(err);
    const users = rows.map(row => new User(row.id, row.name));
    callback(null, users);
  });
};


const createUser = (user, callback) => {
  db.run("INSERT INTO users (name) VALUES (?)", [user.name], function(err) {
    if (err) return callback(err);
    callback(null, new User(this.lastID, user.name));
  });
};


module.exports = {
  getAllUsers,
  createUser
};
