const userRepository = require('../repositories/userRepository');

const listUsers = (callback) => {
  userRepository.getAllUsers((err, users) => {
    if (err) return callback(err);
    // Aquí podrías agregar lógica extra antes de devolver los datos
    callback(null, users);
  });
};

const addUser = (name, callback) => {
  // Validaciones o lógica de negocio
  if (!name) return callback(new Error("Name is required"));
  userRepository.createUser(name, callback);
};

module.exports = {
  listUsers,
  addUser
};
