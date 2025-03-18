const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Path to data file
const dataFilePath = path.join(__dirname, '..', 'data.json');

// Initialize data file if it doesn't exist
if (!fs.existsSync(dataFilePath)) {
  fs.writeFileSync(dataFilePath, JSON.stringify({ tasks: [] }));
}

// Helper function to read tasks
const getTasks = () => {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading tasks:', error);
    return { tasks: [] };
  }
};

// Helper function to save tasks
const saveTasks = (tasks) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(tasks, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving tasks:', error);
    return false;
  }
};

// Routes
// Get all tasks
app.get('/api/tasks', (req, res) => {
  const data = getTasks();
  res.json(data.tasks);
});

// Get task by id
app.get('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const data = getTasks();
  const task = data.tasks.find(task => task.id === id);
  
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }
  
  res.json(task);
});

// Create a new task
app.post('/api/tasks', (req, res) => {
  const { title, description, dueDate } = req.body;
  
  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }
  
  const newTask = {
    id: uuidv4(),
    title,
    description: description || '',
    dueDate: dueDate || null,
    completed: false,
    progress: 0,
    createdAt: new Date().toISOString(),
    subtasks: []
  };
  
  const data = getTasks();
  data.tasks.push(newTask);
  
  if (saveTasks(data)) {
    res.status(201).json(newTask);
  } else {
    res.status(500).json({ message: 'Failed to save task' });
  }
});

// Update a task
app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, dueDate, completed, progress } = req.body;
  
  const data = getTasks();
  const taskIndex = data.tasks.findIndex(task => task.id === id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }
  
  const updatedTask = {
    ...data.tasks[taskIndex],
    title: title || data.tasks[taskIndex].title,
    description: description !== undefined ? description : data.tasks[taskIndex].description,
    dueDate: dueDate !== undefined ? dueDate : data.tasks[taskIndex].dueDate,
    completed: completed !== undefined ? completed : data.tasks[taskIndex].completed,
    progress: progress !== undefined ? progress : data.tasks[taskIndex].progress
  };
  
  // Calculate progress based on subtasks if available
  if (updatedTask.subtasks && updatedTask.subtasks.length > 0) {
    const completedSubtasks = updatedTask.subtasks.filter(subtask => subtask.completed).length;
    updatedTask.progress = Math.round((completedSubtasks / updatedTask.subtasks.length) * 100);
    updatedTask.completed = updatedTask.progress === 100;
  }
  
  data.tasks[taskIndex] = updatedTask;
  
  if (saveTasks(data)) {
    res.json(updatedTask);
  } else {
    res.status(500).json({ message: 'Failed to update task' });
  }
});

// Delete a task
app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  
  const data = getTasks();
  const taskIndex = data.tasks.findIndex(task => task.id === id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }
  
  data.tasks.splice(taskIndex, 1);
  
  if (saveTasks(data)) {
    res.json({ message: 'Task deleted successfully' });
  } else {
    res.status(500).json({ message: 'Failed to delete task' });
  }
});

// Add a subtask to a task
app.post('/api/tasks/:id/subtasks', (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  
  if (!title) {
    return res.status(400).json({ message: 'Subtask title is required' });
  }
  
  const data = getTasks();
  const taskIndex = data.tasks.findIndex(task => task.id === id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }
  
  const subtask = {
    id: uuidv4(),
    title,
    completed: false,
    createdAt: new Date().toISOString()
  };
  
  data.tasks[taskIndex].subtasks.push(subtask);
  
  // Recalculate task progress
  const completedSubtasks = data.tasks[taskIndex].subtasks.filter(st => st.completed).length;
  data.tasks[taskIndex].progress = Math.round((completedSubtasks / data.tasks[taskIndex].subtasks.length) * 100);
  data.tasks[taskIndex].completed = data.tasks[taskIndex].progress === 100;
  
  if (saveTasks(data)) {
    res.status(201).json(subtask);
  } else {
    res.status(500).json({ message: 'Failed to add subtask' });
  }
});

// Update a subtask
app.put('/api/tasks/:taskId/subtasks/:subtaskId', (req, res) => {
  const { taskId, subtaskId } = req.params;
  const { title, completed } = req.body;
  
  const data = getTasks();
  const taskIndex = data.tasks.findIndex(task => task.id === taskId);
  
  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }
  
  const subtaskIndex = data.tasks[taskIndex].subtasks.findIndex(subtask => subtask.id === subtaskId);
  
  if (subtaskIndex === -1) {
    return res.status(404).json({ message: 'Subtask not found' });
  }
  
  data.tasks[taskIndex].subtasks[subtaskIndex] = {
    ...data.tasks[taskIndex].subtasks[subtaskIndex],
    title: title || data.tasks[taskIndex].subtasks[subtaskIndex].title,
    completed: completed !== undefined ? completed : data.tasks[taskIndex].subtasks[subtaskIndex].completed
  };
  
  // Recalculate task progress
  const completedSubtasks = data.tasks[taskIndex].subtasks.filter(subtask => subtask.completed).length;
  data.tasks[taskIndex].progress = Math.round((completedSubtasks / data.tasks[taskIndex].subtasks.length) * 100);
  data.tasks[taskIndex].completed = data.tasks[taskIndex].progress === 100;
  
  if (saveTasks(data)) {
    res.json(data.tasks[taskIndex].subtasks[subtaskIndex]);
  } else {
    res.status(500).json({ message: 'Failed to update subtask' });
  }
});

// Delete a subtask
app.delete('/api/tasks/:taskId/subtasks/:subtaskId', (req, res) => {
  const { taskId, subtaskId } = req.params;
  
  const data = getTasks();
  const taskIndex = data.tasks.findIndex(task => task.id === taskId);
  
  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }
  
  const subtaskIndex = data.tasks[taskIndex].subtasks.findIndex(subtask => subtask.id === subtaskId);
  
  if (subtaskIndex === -1) {
    return res.status(404).json({ message: 'Subtask not found' });
  }
  
  data.tasks[taskIndex].subtasks.splice(subtaskIndex, 1);
  
  // Recalculate task progress if there are any subtasks left
  if (data.tasks[taskIndex].subtasks.length > 0) {
    const completedSubtasks = data.tasks[taskIndex].subtasks.filter(subtask => subtask.completed).length;
    data.tasks[taskIndex].progress = Math.round((completedSubtasks / data.tasks[taskIndex].subtasks.length) * 100);
  } else {
    data.tasks[taskIndex].progress = 0;
  }
  
  data.tasks[taskIndex].completed = data.tasks[taskIndex].progress === 100;
  
  if (saveTasks(data)) {
    res.json({ message: 'Subtask deleted successfully' });
  } else {
    res.status(500).json({ message: 'Failed to delete subtask' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 