import axios from 'axios';

const API_URL = '/api';

// Task API Service
const TaskApi = {
  // Get all tasks
  getAllTasks: async () => {
    try {
      const response = await axios.get(`${API_URL}/tasks`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  // Get task by ID
  getTaskById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching task with id ${id}:`, error);
      throw error;
    }
  },

  // Create a new task
  createTask: async (task) => {
    try {
      const response = await axios.post(`${API_URL}/tasks`, task);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  // Update a task
  updateTask: async (id, task) => {
    try {
      const response = await axios.put(`${API_URL}/tasks/${id}`, task);
      return response.data;
    } catch (error) {
      console.error(`Error updating task with id ${id}:`, error);
      throw error;
    }
  },

  // Delete a task
  deleteTask: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting task with id ${id}:`, error);
      throw error;
    }
  },

  // Add a subtask to a task
  addSubtask: async (taskId, subtask) => {
    try {
      const response = await axios.post(`${API_URL}/tasks/${taskId}/subtasks`, subtask);
      return response.data;
    } catch (error) {
      console.error(`Error adding subtask to task ${taskId}:`, error);
      throw error;
    }
  },

  // Update a subtask
  updateSubtask: async (taskId, subtaskId, subtask) => {
    try {
      const response = await axios.put(`${API_URL}/tasks/${taskId}/subtasks/${subtaskId}`, subtask);
      return response.data;
    } catch (error) {
      console.error(`Error updating subtask ${subtaskId} for task ${taskId}:`, error);
      throw error;
    }
  },

  // Delete a subtask
  deleteSubtask: async (taskId, subtaskId) => {
    try {
      const response = await axios.delete(`${API_URL}/tasks/${taskId}/subtasks/${subtaskId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting subtask ${subtaskId} for task ${taskId}:`, error);
      throw error;
    }
  }
};

export default TaskApi; 