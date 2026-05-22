require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('./models/project.model');

const uri = process.env.MONGO_URI;
mongoose.connect(uri)
  .then(async () => {
    const projects = await Project.find();
    console.log(JSON.stringify(projects, null, 2));
    process.exit(0);
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
