require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user.model');

const uri = process.env.MONGO_URI;
mongoose.connect(uri)
  .then(async () => {
    const users = await User.find();
    console.log(JSON.stringify(users, null, 2));
    process.exit(0);
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
