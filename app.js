const express = require('express');
const mongoose = require('mongoose');
require('./config/db');

const userRoutes = require('./routes/userRoutes');
const imageRoutes = require('./routes/imageRoutes');

const app = express();
app.use(express.json());

app.use('/users', userRoutes);
app.use('/images', imageRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
