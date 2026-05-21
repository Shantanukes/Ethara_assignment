const mongoose = require('mongoose');
const User = require('./models/user.model');
const Project = require('./models/project.model');
const Task = require('./models/task.model');
require('dotenv').config();

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/taskflow';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});
    console.log('Cleared existing data.');

    // Create Users
    const users = await User.create([
      { name: 'Admin User', email: 'admin@test.com', password: 'password', role: 'admin', initials: 'AU', color: '#FFC107' },
      { name: 'Member One', email: 'member1@test.com', password: 'password', role: 'member', initials: 'M1', color: '#4CAF50' },
      { name: 'Member Two', email: 'member2@test.com', password: 'password', role: 'member', initials: 'M2', color: '#2196F3' },
    ]);
    console.log('Users created.');

    const [adminUser, memberOne, memberTwo] = users;

    // Create Projects
    const projects = await Project.create([
      {
        name: 'Project Alpha',
        createdBy: adminUser._id,
        members: [adminUser._id, memberOne._id],
      },
      {
        name: 'Project Beta',
        createdBy: memberOne._id,
        members: [memberOne._id, memberTwo._id],
      },
    ]);
    console.log('Projects created.');

    const [projectAlpha, projectBeta] = projects;

    // Create Tasks
    await Task.create([
      {
        title: 'Design homepage',
        projectId: projectAlpha._id,
        assignedTo: adminUser._id,
        priority: 'high',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
        status: 'in-progress',
      },
      {
        title: 'Develop API for user authentication',
        projectId: projectAlpha._id,
        assignedTo: memberOne._id,
        priority: 'high',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
        status: 'todo',
      },
      {
        title: 'Write documentation for Project Beta',
        projectId: projectBeta._id,
        assignedTo: memberTwo._id,
        priority: 'medium',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 10)),
        status: 'todo',
      },
      {
        title: 'Test new features',
        projectId: projectBeta._id,
        assignedTo: memberOne._id,
        priority: 'low',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 15)),
        status: 'backlog',
      },
    ]);
    console.log('Tasks created.');

    console.log('Database seeded successfully!');

    console.log('\n--- Login Credentials ---');
    users.forEach(user => {
      console.log(`Email: ${user.email} (Password: ${user.password}, Role: ${user.role})`);
    });
    console.log('-------------------------\n');


  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();
