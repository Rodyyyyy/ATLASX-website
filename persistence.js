const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data.json');

let data = {
  users: [],
  places: [],
  stories: []
};

function loadData() {
  if (fs.existsSync(DATA_FILE)) {
    try {
      const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(fileContent);
      data.users = parsed.users || [];
      data.places = parsed.places || [];
      data.stories = parsed.stories || [];
      console.log('Persistent data loaded from data.json');
    } catch (err) {
      console.error('Error reading data.json, starting fresh', err);
      initializeDefaultData();
    }
  } else {
    initializeDefaultData();
  }
}

function initializeDefaultData() {
  data = {
    users: [
      {
        id: 'admin1',
        username: 'admin',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        role: 'admin',
        likes: [],
        wishlist: [],
        visited: []
      }
    ],
    places: [
      {
        _id: 'paris1',
        name: 'Eiffel Tower',
        desc: 'Iconic iron lattice tower with stunning city views',
        img: 'https://images.unsplash.com/photo-1511739006586-e2da6b1bc5ff?w=800',
        tag: 'Landmark',
        city: 'paris',
        country: 'France',
        vibes: ['romantic', 'historic', 'photography'],
        season: 'spring'
      },
      {
        _id: 'paris2',
        name: 'Louvre Museum',
        desc: 'World\'s largest art museum, home to Mona Lisa',
        img: 'https://images.unsplash.com/photo-1558636502-39b6e7f2c6ca?w=800',
        tag: 'Museum',
        city: 'paris',
        country: 'France',
        vibes: ['historic', 'cultural'],
        season: 'winter'
      },
      {
        _id: 'tokyo1',
        name: 'Senso-ji Temple',
        desc: 'Ancient Buddhist temple with vibrant atmosphere',
        img: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=800',
        tag: 'Temple',
        city: 'tokyo',
        country: 'Japan',
        vibes: ['historic', 'cultural'],
        season: 'spring'
      },
      {
        _id: 'cairo1',
        name: 'Pyramids of Giza',
        desc: 'Ancient wonders with the Great Sphinx',
        img: 'https://images.unsplash.com/photo-1503174971373-b1f69850bded?w=800',
        tag: 'Historic',
        city: 'cairo',
        country: 'Egypt',
        vibes: ['historic', 'adventure'],
        season: 'autumn'
      },
      {
        _id: 'london1',
        name: 'Big Ben',
        desc: 'Famous clock tower in London',
        img: 'https://images.unsplash.com/photo-1529655683826-aba818a4bd34?w=800',
        tag: 'Landmark',
        city: 'london',
        country: 'UK',
        vibes: ['historic', 'urban'],
        season: 'winter'
      },
      {
        _id: 'rome1',
        name: 'Colosseum',
        desc: 'Ancient Roman amphitheater',
        img: 'https://images.unsplash.com/photo-1552831388-6a0b3575b32a?w=800',
        tag: 'Historic',
        city: 'rome',
        country: 'Italy',
        vibes: ['historic', 'cultural'],
        season: 'summer'
      },
      {
        _id: 'ny1',
        name: 'Statue of Liberty',
        desc: 'Iconic symbol of freedom',
        img: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=800',
        tag: 'Landmark',
        city: 'newyork',
        country: 'USA',
        vibes: ['historic', 'iconic'],
        season: 'spring'
      }
    ],
    stories: []
  };
  saveData();
}


function saveData() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Failed to save data.json', err);
  }
}


function getUsers() { return data.users; }
function getPlaces() { return data.places; }
function getStories() { return data.stories; }


function addUser(user) {
  data.users.push(user);
  saveData();
}

function addPlace(place) {
  data.places.push(place);
  saveData();
}

function updatePlace(id, updates) {
  const place = data.places.find(p => p._id === id);
  if (place) {
    Object.assign(place, updates);
    saveData();
    return true;
  }
  return false;
}

function deletePlace(id) {
  const index = data.places.findIndex(p => p._id === id);
  if (index !== -1) {
    data.places.splice(index, 1);
    saveData();
    return true;
  }
  return false;
}


function addStory(story) {
  data.stories.unshift(story); 
  saveData();
}

module.exports = {
  loadData,
  getUsers,
  getPlaces,
  getStories,
  addUser,
  addPlace,
  updatePlace,
  deletePlace,
  addStory,     
  data,         
  saveData      
};