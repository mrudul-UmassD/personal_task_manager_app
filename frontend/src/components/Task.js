import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit2, FiTrash2, FiMoreVertical, FiPlus, FiChevronDown, FiChevronUp, FiCalendar, FiClock } from 'react-icons/fi';
import { format, parseISO } from 'date-fns';
import { Draggable } from 'react-beautiful-dnd';

const TaskContainer = styled(motion.div)`
  background: ${props => props.theme.taskBg};
  border-radius: 16px;
  box-shadow: ${props => props.theme.cardShadow};
  overflow: hidden;
  opacity: ${props => props.completed ? props.theme.completedTaskOpacity : 1};
  margin-bottom: 1rem;
  border-left: 5px solid ${props => {
    if (props.status === 'completed') return '#4caf50';
    if (props.status === 'in-progress') return '#ff9800';
    return '#e0e0e0';
  }};
  
  ${props => props.isDragging && `
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
    transform: rotate(1deg);
  `}
`;

const TaskHeader = styled.div`
  padding: 1.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    background: ${props => props.theme.taskHover};
  }
`;

const TaskCheckbox = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid ${props => props.checked ? props.theme.accent : props.theme.borderColor};
  background: ${props => props.checked ? props.theme.accent : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.theme.accent};
    transform: scale(1.05);
  }
  
  &:after {
    content: ${props => props.checked ? '"✓"' : '""'};
    font-size: 14px;
    font-weight: bold;
  }
`;

const TaskContent = styled.div`
  flex: 1;
`;

const TaskTitle = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 0.35rem;
  color: ${props => props.theme.text};
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
`;

const TaskMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.85rem;
  color: ${props => props.theme.subtleText};
`;

const TaskDate = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  
  background: ${props => {
    if (props.status === 'completed') return 'rgba(76, 175, 80, 0.15)';
    if (props.status === 'in-progress') return 'rgba(255, 152, 0, 0.15)';
    return 'rgba(224, 224, 224, 0.25)';
  }};
  
  color: ${props => {
    if (props.status === 'completed') return '#4caf50';
    if (props.status === 'in-progress') return '#ff9800';
    return '#757575';
  }};
`;

const TaskActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled(motion.button)`
  background: ${props => props.theme.iconBg};
  color: ${props => props.theme.actionIcons};
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s ease;
  
  &:hover {
    color: ${props => props.theme.text};
    transform: translateY(-2px);
  }
`;

const ProgressContainer = styled.div`
  height: 8px;
  background: ${props => props.theme.progressBg};
  border-radius: 4px;
  margin: 0.75rem 0 0.25rem;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  height: 100%;
  background: ${props => props.theme.progressBar};
  border-radius: 4px;
  width: ${props => props.value}%;
  transition: width 0.3s ease;
`;

const ProgressText = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.subtleText};
`;

const TaskDetails = styled(motion.div)`
  padding: 0 1.25rem 1.25rem;
  border-top: 1px solid ${props => props.theme.borderColor};
`;

const TaskDescription = styled.p`
  color: ${props => props.theme.text};
  margin-bottom: 1.5rem;
  line-height: 1.5;
  font-size: 0.95rem;
`;

const SubtasksContainer = styled.div`
  margin-top: 1.5rem;
`;

const SubtasksHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const SubtasksTitle = styled.h4`
  font-size: 1rem;
  color: ${props => props.theme.text};
`;

const SubtasksList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SubtaskItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  background: ${props => props.theme.inputBg};
  color: ${props => props.theme.subtaskColor};
  font-size: 0.9rem;
  
  &:hover {
    background: ${props => props.theme.taskHover};
  }
  
  border-left: 4px solid ${props => {
    if (props.status === 'completed') return '#4caf50';
    if (props.status === 'in-progress') return '#ff9800';
    return '#e0e0e0';
  }};
`;

const SubtaskCheckbox = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid ${props => props.checked ? props.theme.accent : props.theme.borderColor};
  background: ${props => props.checked ? props.theme.accent : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.theme.accent};
  }
  
  &:after {
    content: ${props => props.checked ? '"✓"' : '""'};
    font-size: 10px;
    font-weight: bold;
  }
`;

const SubtaskText = styled.span`
  flex: 1;
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
`;

const SubtaskMeta = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: ${props => props.theme.subtleText};
  margin-top: 0.25rem;
`;

const SubtaskActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const SubtaskButton = styled(motion.button)`
  background: none;
  border: none;
  color: ${props => props.theme.actionIcons};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  opacity: 0.7;
  
  &:hover {
    opacity: 1;
  }
`;

const StatusSelect = styled.select`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.borderColor};
  background: ${props => props.theme.inputBg};
  color: ${props => props.theme.text};
  font-size: 0.8rem;
  margin-left: 0.5rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.accent};
  }
`;

const SubtaskContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const NewSubtaskForm = styled.form`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const SubtaskInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  border-radius: 8px;
  border: none;
  background: ${props => props.theme.inputBg};
  color: ${props => props.theme.text};
  font-size: 0.9rem;
  
  &:focus {
    outline: 2px solid ${props => props.theme.accent};
  }
`;

const SubtaskSubmitButton = styled(motion.button)`
  background: ${props => props.theme.buttonBg};
  color: ${props => props.theme.buttonText};
  border: none;
  border-radius: 8px;
  padding: 0 1rem;
  font-weight: 600;
  cursor: pointer;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Task = ({ 
  task, 
  onEdit, 
  onDelete, 
  onUpdate,
  onAddSubtask,
  onUpdateSubtask,
  onDeleteSubtask,
  index
}) => {
  const [expanded, setExpanded] = useState(false);
  const [newSubtask, setNewSubtask] = useState('');
  const [showSubtaskForm, setShowSubtaskForm] = useState(false);
  
  const toggleCompleted = () => {
    onUpdate({ 
      completed: !task.completed,
      status: !task.completed ? 'completed' : (task.progress > 0 ? 'in-progress' : 'pending')
    });
  };
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    onUpdate({ 
      status: newStatus,
      completed: newStatus === 'completed'
    });
  };
  
  const handleSubtaskChange = (subtaskId, completed) => {
    onUpdateSubtask(subtaskId, { 
      completed,
      status: completed ? 'completed' : 'pending'
    });
  };
  
  const handleSubtaskStatusChange = (subtaskId, status) => {
    onUpdateSubtask(subtaskId, { 
      status,
      completed: status === 'completed'
    });
  };
  
  const handleDeleteSubtask = (e, subtaskId) => {
    e.stopPropagation();
    onDeleteSubtask(subtaskId);
  };
  
  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (newSubtask.trim()) {
      onAddSubtask(newSubtask.trim());
      setNewSubtask('');
      setShowSubtaskForm(false);
    }
  };
  
  const formatDateTime = (date, time) => {
    if (!date) return null;
    
    try {
      const dateObj = parseISO(date);
      const formattedDate = format(dateObj, 'MMM d, yyyy');
      
      if (time) {
        return `${formattedDate} at ${time}`;
      }
      
      return formattedDate;
    } catch (error) {
      console.error('Error formatting date:', error);
      return date;
    }
  };
  
  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      default:
        return 'Pending';
    }
  };
  
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <TaskContainer
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          completed={task.completed}
          status={task.status}
          isDragging={snapshot.isDragging}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
        >
          <TaskHeader onClick={toggleExpanded}>
            <TaskCheckbox 
              checked={task.completed}
              onClick={(e) => {
                e.stopPropagation();
                toggleCompleted();
              }}
            />
            
            <TaskContent>
              <TaskTitle completed={task.completed}>{task.title}</TaskTitle>
              
              <TaskMeta>
                {task.dueDate && (
                  <TaskDate>
                    <FiCalendar size={14} />
                    {formatDateTime(task.dueDate, task.dueTime)}
                  </TaskDate>
                )}
                
                {task.subtasks && task.subtasks.length > 0 && (
                  <TaskDate>
                    Subtasks: {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}
                  </TaskDate>
                )}
                
                <StatusBadge status={task.status}>
                  {getStatusLabel(task.status)}
                </StatusBadge>
              </TaskMeta>
              
              {task.subtasks && task.subtasks.length > 0 && (
                <>
                  <ProgressContainer>
                    <ProgressBar value={task.progress} />
                  </ProgressContainer>
                  <ProgressText>{task.progress}% completed</ProgressText>
                </>
              )}
            </TaskContent>
            
            <TaskActions>
              <ActionButton 
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiEdit2 size={16} />
              </ActionButton>
              
              <ActionButton 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiTrash2 size={16} />
              </ActionButton>
              
              {expanded ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
            </TaskActions>
          </TaskHeader>
          
          <AnimatePresence>
            {expanded && (
              <TaskDetails
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {task.description && <TaskDescription>{task.description}</TaskDescription>}
                
                <div style={{ marginBottom: '1rem' }}>
                  <Label>Status: </Label>
                  <StatusSelect value={task.status} onChange={handleStatusChange}>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </StatusSelect>
                </div>
                
                <SubtasksContainer>
                  <SubtasksHeader>
                    <SubtasksTitle>Subtasks</SubtasksTitle>
                    <ActionButton 
                      onClick={() => setShowSubtaskForm(!showSubtaskForm)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FiPlus size={16} />
                    </ActionButton>
                  </SubtasksHeader>
                  
                  <AnimatePresence>
                    {showSubtaskForm && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <NewSubtaskForm onSubmit={handleAddSubtask}>
                          <SubtaskInput 
                            type="text"
                            placeholder="Enter subtask..."
                            value={newSubtask}
                            onChange={(e) => setNewSubtask(e.target.value)}
                            autoFocus
                          />
                          <SubtaskSubmitButton
                            type="submit"
                            disabled={!newSubtask.trim()}
                            whileTap={{ scale: 0.95 }}
                          >
                            Add
                          </SubtaskSubmitButton>
                        </NewSubtaskForm>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {task.subtasks.length > 0 ? (
                    <SubtasksList>
                      <AnimatePresence>
                        {task.subtasks.map(subtask => (
                          <motion.div
                            key={subtask.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.2 }}
                          >
                            <SubtaskItem status={subtask.status}>
                              <SubtaskCheckbox 
                                checked={subtask.completed}
                                onClick={() => handleSubtaskChange(subtask.id, !subtask.completed)}
                              />
                              
                              <SubtaskContent>
                                <SubtaskText completed={subtask.completed}>{subtask.title}</SubtaskText>
                                <SubtaskMeta>
                                  {subtask.dueDate && (
                                    <TaskDate>
                                      <FiCalendar size={12} />
                                      {formatDateTime(subtask.dueDate, subtask.dueTime)}
                                    </TaskDate>
                                  )}
                                  
                                  <div>
                                    <Label>Status: </Label>
                                    <StatusSelect 
                                      value={subtask.status} 
                                      onChange={(e) => handleSubtaskStatusChange(subtask.id, e.target.value)}
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <option value="pending">Pending</option>
                                      <option value="in-progress">In Progress</option>
                                      <option value="completed">Completed</option>
                                    </StatusSelect>
                                  </div>
                                </SubtaskMeta>
                              </SubtaskContent>
                              
                              <SubtaskActions>
                                <SubtaskButton
                                  onClick={(e) => handleDeleteSubtask(e, subtask.id)}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <FiTrash2 size={14} />
                                </SubtaskButton>
                              </SubtaskActions>
                            </SubtaskItem>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </SubtasksList>
                  ) : (
                    !showSubtaskForm && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.8 }}
                        style={{ 
                          color: 'var(--subtle-text)', 
                          fontSize: '0.9rem',
                          textAlign: 'center',
                          padding: '1rem 0'
                        }}
                      >
                        No subtasks yet. Click the + button to add one.
                      </motion.p>
                    )
                  )}
                </SubtasksContainer>
              </TaskDetails>
            )}
          </AnimatePresence>
        </TaskContainer>
      )}
    </Draggable>
  );
};

const Label = styled.span`
  font-size: 0.85rem;
  font-weight: 500;
  color: ${props => props.theme.text};
`;

export default Task; 