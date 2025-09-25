const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

// Listar todos los usuarios
const listUsers = (callback) => {
  userRepository.getAllUsers((err, users) => {
    if (err) return callback(err);
    callback(null, users);
  });
};

// Registrar un usuario nuevo
const addUser = (name, email, password, callback) => {
  if (!name || !email || !password) {
    return callback(new Error("Name, email y password son requeridos"));
  }

  const user = { name, email, password };
  userRepository.createUser(user, callback);
};

// Login y generación de token
const login = (email, password, callback) => {
  userRepository.findByEmail(email, (err, user) => {
    if (err) return callback(err);
    if (!user) return callback(new Error("Usuario no encontrado"));

    if (user.password !== password) {
      return callback(new Error("Credenciales inválidas"));
    }

    // Generar JWT
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      process.env.JWT_SECRET || 'mi_secreto_super_seguro',
      { expiresIn: '2h' }
    );

    callback(null, { user, token });
  });
};

module.exports = {
  listUsers,
  addUser,
  login
};
