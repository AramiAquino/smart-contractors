const express = require('express');
const app = express();

const userController = require('./controllers/userController');
const workController = require('./controllers/workController');
const authMiddleware = require('./middleware/authMiddleware');

// Inicializar base de datos
require('./db');
console.log('✅ Base de datos inicializada correctamente');

app.use(express.json());

// Rutas públicas
app.use('/users', userController); // incluye /users (registro) y /users/login

// Rutas protegidas (ejemplo: works requiere token)
app.use('/works', authMiddleware, workController);

app.listen(3000, () => {
  console.log('🚀 Backend corriendo en http://localhost:3000');
});
