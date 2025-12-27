const express = require('express');
const cors = require('cors');
const { loadData } = require('./data/persistence');
require('dotenv').config();

loadData();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/places', require('./routes/places'));
app.use('/api/stories', require('./routes/stories'));
app.use('/api/chatbot', require('./routes/chatbot'));
app.use('/api/userActions', require('./routes/userActions'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Data persists in backend/data/data.json');
  console.log('Admin login: username="admin", password="password"');
});