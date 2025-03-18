import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit2, FiTrash2, FiMoreVertical, FiPlus, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import Task from './Task';

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const TasksHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const TasksTitle = styled.h2`
  font-size: 1.75rem;
  color: ${props => props.theme.text};
`;

const EmptyState = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 2rem;
  background: ${props => props.theme.cardBg};
  border-radius: 20px;
  box-shadow: ${props => props.theme.cardShadow};
  
  h3 {
    margin: 1.5rem 0 0.75rem;
    color: ${props => props.theme.text};
    font-size: 1.5rem;
  }
  
  p {
    color: ${props => props.theme.subtleText};
    max-width: 400px;
    margin-bottom: 2rem;
  }
`;

const AddTaskButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${props => props.theme.buttonBg};
  color: ${props => props.theme.buttonText};
  border: none;
  border-radius: 30px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(74, 118, 253, 0.25);
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(74, 118, 253, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  font-size: 1.1rem;
  color: ${props => props.theme.subtleText};
`;

const TaskList = ({ 
  tasks, 
  isLoading, 
  onEditTask, 
  onDeleteTask, 
  onUpdateTask,
  onAddSubtask,
  onUpdateSubtask,
  onDeleteSubtask
}) => {
  if (isLoading) {
    return (
      <LoadingContainer>
        Loading tasks...
      </LoadingContainer>
    );
  }
  
  if (tasks.length === 0) {
    return (
      <EmptyState
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <svg width="100" height="100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#4a76fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 8V16" stroke="#4a76fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 12H16" stroke="#4a76fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <h3>No Tasks Found</h3>
        <p>You don't have any tasks yet. Add your first task to get started with managing your day.</p>
        <AddTaskButton
          onClick={() => {}}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiPlus size={18} />
          Add Your First Task
        </AddTaskButton>
      </EmptyState>
    );
  }
  
  return (
    <ListContainer>
      <TasksHeader>
        <TasksTitle>Your Tasks</TasksTitle>
      </TasksHeader>
      
      <AnimatePresence>
        {tasks.map(task => (
          <Task
            key={task.id}
            task={task}
            onEdit={() => onEditTask(task)}
            onDelete={() => onDeleteTask(task.id)}
            onUpdate={(updates) => onUpdateTask(task.id, updates)}
            onAddSubtask={(title) => onAddSubtask(task.id, { title })}
            onUpdateSubtask={(subtaskId, updates) => onUpdateSubtask(task.id, subtaskId, updates)}
            onDeleteSubtask={(subtaskId) => onDeleteSubtask(task.id, subtaskId)}
          />
        ))}
      </AnimatePresence>
    </ListContainer>
  );
};

export default TaskList; 