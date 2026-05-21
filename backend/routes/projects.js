const router = require('express').Router();
let Project = require('../models/project.model');

router.route('/').get((req, res) => {
  Project.find()
    .then(projects => res.json(projects))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const { name, description, createdBy, members } = req.body;

  const newProject = new Project({
    name,
    description,
    createdBy,
    members,
  });

  newProject.save()
    .then(project => res.json(project))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
