const express = require('express');
const app = express();
const userController = require('./controllers/userController');
const workController = require('./controllers/workController');

// Inicializar base de datos
require('./db');
console.log('✅ Base de datos inicializada correctamente');

app.use(express.json());
app.use('/users', userController);
app.use('/works', workController);

app.listen(3000, () => {
  console.log('🚀 Backend corriendo en http://localhost:3000');
});
