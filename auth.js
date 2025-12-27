const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getUsers, addUser } = require('../data/persistence');
require('dotenv').config();

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { username, password, role = 'user' } = req.body;

  if (getUsers().find(u => u.username === username)) {
    return res.status(400).json({ msg: 'Username already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: Date.now().toString(),
    username,
    password: hashedPassword,
    role,
    likes: [],
    wishlist: [],
    visited: []
  };

  addUser(newUser);

  const token = jwt.sign({ id: newUser.id, role: newUser.role }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '24h' });
  res.json({ token, role: newUser.role });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = getUsers().find(u => u.username === username);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ msg: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '24h' });
  res.json({ token, role: user.role });
});

module.exports = router;