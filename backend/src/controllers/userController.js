const express = require('express');
const router = express.Router();
const userService = require('../services/userService');

// GET /users
router.get('/users', (req, res) => {
  userService.listUsers((err, users) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(users);
  });
});

// POST /users
router.post('/users', (req, res) => {
  const { name } = req.body;
  userService.addUser(name, (err, user) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(user);
  });
});

module.exports = router;
