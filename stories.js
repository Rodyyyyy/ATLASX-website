const express = require('express');
const jwt = require('jsonwebtoken');
const { getStories, data, saveData } = require('../data/persistence');
require('dotenv').config();

const router = express.Router();

router.get('/', (req, res) => {
  res.json(getStories());
});

router.post('/', (req, res) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'Please login to share a story' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

    const { title, excerpt, fullContent, location, image } = req.body;

    if (!title || !excerpt || !fullContent || !location) {
      return res.status(400).json({ msg: 'Please fill all required fields' });
    }

    const newStory = {
      _id: Date.now().toString(),
      title,
      excerpt,
      fullContent,
      authorId: decoded.id, 
      author: decoded.username || 'Traveler',
      location,
      image: image || 'https://images.unsplash.com/photo-1501786223877-d1787d0f5e3e?w=800',
      date: new Date().toISOString()
    };

    data.stories.unshift(newStory);
    saveData();

    res.json(newStory);
  } catch (err) {
    res.status(401).json({ msg: 'Invalid session' });
  }
});

router.delete('/:id', (req, res) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'Login required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

    const storyIndex = data.stories.findIndex(s => s._id === req.params.id);
    if (storyIndex === -1) {
      return res.status(404).json({ msg: 'Story not found' });
    }

    const story = data.stories[storyIndex];

    if (decoded.role === 'admin' || story.authorId === decoded.id) {
      data.stories.splice(storyIndex, 1);
      saveData();
      res.json({ msg: 'Story deleted successfully' });
    } else {
      res.status(403).json({ msg: 'You can only delete your own stories' });
    }
  } catch (err) {
    res.status(401).json({ msg: 'Invalid session' });
  }
});

module.exports = router;