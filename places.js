const express = require('express');
const jwt = require('jsonwebtoken');
const { getPlaces, addPlace, updatePlace, deletePlace } = require('../data/persistence');
require('dotenv').config();

const router = express.Router();

const adminAuth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ msg: 'No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    if (decoded.role !== 'admin') return res.status(403).json({ msg: 'Admin access required' });
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Invalid token' });
  }
};

router.get('/', (req, res) => {
  res.json(getPlaces());
});

router.post('/', adminAuth, (req, res) => {
  const newPlace = {
    _id: Date.now().toString(),
    ...req.body
  };
  addPlace(newPlace);
  res.json(newPlace);
});

router.put('/:id', adminAuth, (req, res) => {
  const success = updatePlace(req.params.id, req.body);
  if (success) {
    const updatedPlace = getPlaces().find(p => p._id === req.params.id);
    res.json(updatedPlace);
  } else {
    res.status(404).json({ msg: 'Place not found' });
  }
});

router.delete('/:id', adminAuth, (req, res) => {
  const success = deletePlace(req.params.id);
  if (success) {
    res.json({ msg: 'Place deleted successfully' });
  } else {
    res.status(404).json({ msg: 'Place not found' });
  }
});

module.exports = router;