const mongoose = require('mongoose');
const User = require('./models/user.model');
const Project = require('./models/project.model');
const Task = require('./models/task.model');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('Database already has data. Skipping automatic seed.');
      return;
    }

    console.log('Seeding database with initial mocked data...');
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
        name: 'Website Redesign',
        description: 'Complete overhaul of our corporate website.',
        createdBy: adminUser._id,
        members: [adminUser._id, memberOne._id, memberTwo._id],
      },
      {
        name: 'Mobile App Launch',
        description: 'Development and launch of the new iOS and Android app.',
        createdBy: memberOne._id,
        members: [memberOne._id, memberTwo._id],
      },
      {
        name: 'Marketing Campaign Q3',
        description: 'Planning and execution of the Q3 marketing strategy.',
        createdBy: adminUser._id,
        members: [adminUser._id, memberTwo._id],
      }
    ]);
    console.log('Projects created.');

    const [websiteProject, mobileAppProject, marketingProject] = projects;

    // Create Tasks
    await Task.create([
      {
        title: 'Design homepage mockups',
        description: 'Create high-fidelity mockups for the new homepage using Figma.',
        projectId: websiteProject._id,
        assignedTo: adminUser._id,
        priority: 'high',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 2)),
        status: 'done',
      },
      {
        title: 'Implement responsive navigation',
        description: 'Build a responsive navbar that collapses into a hamburger menu on mobile.',
        projectId: websiteProject._id,
        assignedTo: memberOne._id,
        priority: 'high',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 4)),
        status: 'in-progress',
      },
      {
        title: 'Setup user authentication API',
        description: 'Develop JWT based authentication endpoints for login and registration.',
        projectId: mobileAppProject._id,
        assignedTo: memberOne._id,
        priority: 'high',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
        status: 'todo',
      },
      {
        title: 'Write API documentation',
        description: 'Document all available endpoints using Swagger or Postman.',
        projectId: mobileAppProject._id,
        assignedTo: memberTwo._id,
        priority: 'medium',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 10)),
        status: 'todo',
      },
      {
        title: 'Draft press release',
        description: 'Write the initial draft for the Q3 marketing press release.',
        projectId: marketingProject._id,
        assignedTo: adminUser._id,
        priority: 'medium',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
        status: 'in-progress',
      },
      {
        title: 'Social media asset creation',
        description: 'Design banners and images for Twitter, LinkedIn, and Facebook.',
        projectId: marketingProject._id,
        assignedTo: memberTwo._id,
        priority: 'medium',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 8)),
        status: 'todo',
      },
      {
        title: 'Test push notifications',
        description: 'Ensure Firebase push notifications are working correctly on iOS devices.',
        projectId: mobileAppProject._id,
        assignedTo: memberOne._id,
        priority: 'high',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 12)),
        status: 'backlog',
      },
      {
        title: 'Optimize database queries',
        description: 'Review and optimize slow queries for the user dashboard.',
        projectId: websiteProject._id,
        assignedTo: memberOne._id,
        priority: 'low',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 15)),
        status: 'backlog',
      },
      {
        title: 'Review Google Analytics data',
        description: 'Analyze Q2 performance to inform Q3 decisions.',
        projectId: marketingProject._id,
        assignedTo: adminUser._id,
        priority: 'low',
        dueDate: new Date(new Date().setDate(new Date().getDate() - 2)),
        status: 'done',
      },
      {
        title: 'Update Terms of Service',
        description: 'Revise terms of service to comply with new regulations.',
        projectId: websiteProject._id,
        assignedTo: memberTwo._id,
        priority: 'high',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
        status: 'in-progress',
      }
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
  }
};

if (require.main === module) {
  const MONGODB_URI = process.env.MONGO_URI || 'mongodb+srv://shantanukes19_db_user:MZq86FOcfIeaJJU3@cluster0.l1h69l7.mongodb.net/';
  mongoose.connect(MONGODB_URI)
    .then(async () => {
      console.log('MongoDB connected for manual seeding...');
      // Clear existing data only when run manually
      await User.deleteMany({});
      await Project.deleteMany({});
      await Task.deleteMany({});
      console.log('Cleared existing data.');
      
      await seedDatabase();
      mongoose.connection.close();
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error);
      mongoose.connection.close();
    });
} else {
  module.exports = seedDatabase;
}
