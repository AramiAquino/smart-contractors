const express = require('express');
const router = express.Router();
const userService = require('../services/userService');

// GET /users → listar todos
router.get('/', (req, res) => {
  userService.listUsers((err, users) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(users);
  });
});

// POST /users → registrar nuevo usuario
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  userService.addUser(name, email, password, (err, user) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ name: user.name, email: user.email });
  });
});

// POST /login → autenticar y devolver JWT
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  userService.login(email, password, (err, result) => {
    if (err) return res.status(401).json({ error: err.message });
    res.json({ user: result.user.email, token: result.token });
  });
});

module.exports = router;
