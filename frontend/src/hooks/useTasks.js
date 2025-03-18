import { useState, useEffect, useCallback } from 'react';
import TaskApi from '../api/taskApi';

const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'completed', 'pending', 'partial'

  // Fetch all tasks
  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await TaskApi.getAllTasks();
      setTasks(data);
    } catch (err) {
      setError('Failed to fetch tasks. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Filter tasks based on selected filter
  const filteredTasks = useCallback(() => {
    switch (filter) {
      case 'completed':
        return tasks.filter(task => task.completed);
      case 'pending':
        return tasks.filter(task => !task.completed && task.progress === 0);
      case 'partial':
        return tasks.filter(task => !task.completed && task.progress > 0);
      default:
        return tasks;
    }
  }, [tasks, filter]);

  // Create a new task
  const createTask = useCallback(async (task) => {
    try {
      const newTask = await TaskApi.createTask(task);
      setTasks(prevTasks => [...prevTasks, newTask]);
      return newTask;
    } catch (err) {
      setError('Failed to create task. Please try again.');
      console.error(err);
      throw err;
    }
  }, []);

  // Update a task
  const updateTask = useCallback(async (id, updatedTask) => {
    try {
      const result = await TaskApi.updateTask(id, updatedTask);
      setTasks(prevTasks => 
        prevTasks.map(task => task.id === id ? { ...task, ...result } : task)
      );
      return result;
    } catch (err) {
      setError('Failed to update task. Please try again.');
      console.error(err);
      throw err;
    }
  }, []);

  // Delete a task
  const deleteTask = useCallback(async (id) => {
    try {
      await TaskApi.deleteTask(id);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    } catch (err) {
      setError('Failed to delete task. Please try again.');
      console.error(err);
      throw err;
    }
  }, []);

  // Add a subtask to a task
  const addSubtask = useCallback(async (taskId, subtask) => {
    try {
      const newSubtask = await TaskApi.addSubtask(taskId, subtask);
      
      setTasks(prevTasks => 
        prevTasks.map(task => {
          if (task.id === taskId) {
            // Get the updated task to ensure we have the correct progress value
            TaskApi.getTaskById(taskId).then(updatedTask => {
              setTasks(prevTasks => 
                prevTasks.map(t => t.id === taskId ? updatedTask : t)
              );
            });
            
            return {
              ...task,
              subtasks: [...task.subtasks, newSubtask]
            };
          }
          return task;
        })
      );
      
      return newSubtask;
    } catch (err) {
      setError('Failed to add subtask. Please try again.');
      console.error(err);
      throw err;
    }
  }, []);

  // Update a subtask
  const updateSubtask = useCallback(async (taskId, subtaskId, updatedSubtask) => {
    try {
      const result = await TaskApi.updateSubtask(taskId, subtaskId, updatedSubtask);
      
      setTasks(prevTasks => 
        prevTasks.map(task => {
          if (task.id === taskId) {
            // Get the updated task to ensure we have the correct progress value
            TaskApi.getTaskById(taskId).then(updatedTask => {
              setTasks(prevTasks => 
                prevTasks.map(t => t.id === taskId ? updatedTask : t)
              );
            });
            
            return {
              ...task,
              subtasks: task.subtasks.map(subtask => 
                subtask.id === subtaskId ? { ...subtask, ...result } : subtask
              )
            };
          }
          return task;
        })
      );
      
      return result;
    } catch (err) {
      setError('Failed to update subtask. Please try again.');
      console.error(err);
      throw err;
    }
  }, []);

  // Delete a subtask
  const deleteSubtask = useCallback(async (taskId, subtaskId) => {
    try {
      await TaskApi.deleteSubtask(taskId, subtaskId);
      
      setTasks(prevTasks => 
        prevTasks.map(task => {
          if (task.id === taskId) {
            // Get the updated task to ensure we have the correct progress value
            TaskApi.getTaskById(taskId).then(updatedTask => {
              setTasks(prevTasks => 
                prevTasks.map(t => t.id === taskId ? updatedTask : t)
              );
            });
            
            return {
              ...task,
              subtasks: task.subtasks.filter(subtask => subtask.id !== subtaskId)
            };
          }
          return task;
        })
      );
    } catch (err) {
      setError('Failed to delete subtask. Please try again.');
      console.error(err);
      throw err;
    }
  }, []);

  // Load tasks on initial render
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks: filteredTasks(),
    isLoading,
    error,
    filter,
    setFilter,
    createTask,
    updateTask,
    deleteTask,
    addSubtask,
    updateSubtask,
    deleteSubtask,
    refreshTasks: fetchTasks
  };
};

export default useTasks; 