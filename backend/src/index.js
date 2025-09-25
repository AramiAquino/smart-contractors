require('dotenv').config();
const express = require('express');
const app = express();


const userController = require('./controllers/userController');
const workController = require('./controllers/workController');
const authMiddleware = require('./middleware/authMiddleware');
const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  console.error('❌ No se encontró la variable de entorno JWT_SECRET');
  process.exit(1);
}

// Inicializar base de datos
require('./db');
console.log('✅ Base de datos inicializada correctamente');

app.use(express.json());

// Rutas públicas (ejemplo: login y registro)
app.use('/users', userController);

// Rutas protegidas (ejemplo: works requiere token)
app.use('/works', authMiddleware, workController);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
});

