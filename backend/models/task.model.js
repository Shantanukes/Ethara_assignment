const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const taskSchema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
  title: { type: String, required: true },
  description: { type: String },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, required: true },
  priority: { type: String, required: true },
  dueDate: { type: Date },
}, {
  timestamps: true,
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
