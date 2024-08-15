const mongoose = require('mongoose');

const dbURI = 'mongodb+srv://rayenzaghdoudi6:dxgLYZRZLxz8jTs4@cluster0.bhpablb.mongodb.net/';
mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));
