const express = require('express');
const jwt = require('jsonwebtoken');
const { getUsers, data, saveData } = require('../data/persistence');
require('dotenv').config();

const router = express.Router();

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ msg: 'No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const user = getUsers().find(u => u.id === decoded.id);
    if (!user) return res.status(401).json({ msg: 'User not found' });
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Invalid token' });
  }
};

router.get('/', auth, (req, res) => {
  const { likes = [], wishlist = [], visited = [] } = req.user;
  res.json({
    likes,
    wishlist,
    visited,
    likesCount: likes.reduce((sum, l) => sum + l.count, 0),
    wishlistCount: wishlist.length,
    visitedCount: visited.length
  });
});

router.post('/like', auth, (req, res) => {
  const { placeId } = req.body;
  if (!placeId) return res.status(400).json({ msg: 'placeId required' });

  let entry = req.user.likes.find(l => l.placeId === placeId);
  if (entry) {
    entry.count += 1;
  } else {
    req.user.likes.push({ placeId, count: 1 });
  }
  saveData();
  res.json({ msg: 'Liked', likes: req.user.likes });
});

router.post('/wishlist', auth, (req, res) => {
  const { placeId } = req.body;
  if (!placeId) return res.status(400).json({ msg: 'placeId required' });

  if (!req.user.wishlist.includes(placeId)) {
    req.user.wishlist.push(placeId);
  }
  saveData();
  res.json({ msg: 'Added to wishlist' });
});

router.post('/visited', auth, (req, res) => {
  const { placeId } = req.body;
  if (!placeId) return res.status(400).json({ msg: 'placeId required' });

  if (!req.user.visited.includes(placeId)) {
    req.user.visited.push(placeId);
  }
  saveData();
  res.json({ msg: 'Marked as visited' });
});

router.post('/reset', auth, (req, res) => {
  req.user.likes = [];
  req.user.wishlist = [];
  req.user.visited = [];
  saveData();
  res.json({ msg: 'All progress reset successfully' });
});

module.exports = router;