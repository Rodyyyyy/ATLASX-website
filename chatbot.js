const express = require('express');
const { getPlaces } = require('../data/persistence');

const router = express.Router();

router.post('/recommend', (req, res) => {
  const { country, vibes } = req.body;

  if (!country || !vibes || !Array.isArray(vibes)) {
    return res.status(400).json({ msg: 'Invalid input: country and vibes array required' });
  }

  const lowerCountry = country.toLowerCase().trim();
  const lowerVibes = vibes.map(v => v.toLowerCase().trim());

  const recommendations = getPlaces().filter(place => {
    const matchesCountry = 
      place.country.toLowerCase().includes(lowerCountry) ||
      place.city.toLowerCase().includes(lowerCountry);

    const matchesVibe = lowerVibes.some(vibe => 
      place.vibes.some(pv => pv.toLowerCase() === vibe)
    );

    return matchesCountry && matchesVibe;
  });

  res.json(recommendations.slice(0, 5));
});

module.exports = router;