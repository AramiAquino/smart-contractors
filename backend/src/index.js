const express = require('express');
const app = express();
const userController = require('./controllers/userController');

app.use(express.json());
app.use('/', userController);

app.listen(3000, () => {
  console.log('🚀 Backend corriendo en http://localhost:3000');
});
