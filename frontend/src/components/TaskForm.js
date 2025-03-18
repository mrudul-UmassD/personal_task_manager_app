import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
import { format } from 'date-fns';

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const FormTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.text};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CloseButton = styled(motion.button)`
  background: none;
  border: none;
  color: ${props => props.theme.subtleText};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  border-radius: 50%;
  
  &:hover {
    color: ${props => props.theme.text};
    background: ${props => props.theme.inputBg};
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${props => props.theme.text};
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border-radius: 10px;
  border: none;
  background: ${props => props.theme.inputBg};
  color: ${props => props.theme.text};
  font-size: 1rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: 2px solid ${props => props.theme.accent};
    box-shadow: 0 0 0 4px rgba(74, 118, 253, 0.1);
  }
`;

const DateTimeContainer = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const DateTimeGroup = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Select = styled.select`
  padding: 0.75rem 1rem;
  border-radius: 10px;
  border: none;
  background: ${props => props.theme.inputBg};
  color: ${props => props.theme.text};
  font-size: 1rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: 2px solid ${props => props.theme.accent};
    box-shadow: 0 0 0 4px rgba(74, 118, 253, 0.1);
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem 1rem;
  border-radius: 10px;
  border: none;
  background: ${props => props.theme.inputBg};
  color: ${props => props.theme.text};
  font-size: 1rem;
  transition: all 0.2s ease;
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    outline: 2px solid ${props => props.theme.accent};
    box-shadow: 0 0 0 4px rgba(74, 118, 253, 0.1);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const Button = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  border-radius: 30px;
  border: none;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(Button)`
  background: transparent;
  color: ${props => props.theme.subtleText};
  
  &:hover:not(:disabled) {
    color: ${props => props.theme.text};
    background: ${props => props.theme.inputBg};
  }
`;

const SubmitButton = styled(Button)`
  background: ${props => props.theme.buttonBg};
  color: ${props => props.theme.buttonText};
  box-shadow: 0 4px 10px rgba(74, 118, 253, 0.25);
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(74, 118, 253, 0.3);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const Divider = styled.div`
  height: 1px;
  background: ${props => props.theme.borderColor};
  margin: 0.5rem 0;
`;

const SubtasksSection = styled.div`
  margin-top: 1rem;
`;

const SubtaskHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const SubtaskTitle = styled.h3`
  font-size: 1rem;
  color: ${props => props.theme.text};
`;

const AddButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.iconBg};
  color: ${props => props.theme.iconColor};
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  cursor: pointer;
  
  &:hover {
    background: ${props => props.theme.accent};
    color: white;
  }
`;

const SubtaskItem = styled.div`
  background: ${props => props.theme.inputBg};
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1rem;
  position: relative;
`;

const SubtaskControls = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
`;

const RemoveButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  color: ${props => props.theme.subtleText};
  border: none;
  cursor: pointer;
  
  &:hover {
    color: ${props => props.theme.text};
  }
`;

const TaskForm = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    dueTime: '',
    status: 'pending',
    subtasks: []
  });
  
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        dueDate: initialData.dueDate ? format(new Date(initialData.dueDate), 'yyyy-MM-dd') : '',
        dueTime: initialData.dueTime || '',
        status: initialData.status || 'pending',
        subtasks: initialData.subtasks || []
      });
    }
  }, [initialData]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  const addSubtask = () => {
    setFormData(prev => ({
      ...prev,
      subtasks: [
        ...prev.subtasks, 
        {
          id: `temp-${Date.now()}`,
          title: '',
          dueDate: '',
          dueTime: '',
          status: 'pending',
          completed: false
        }
      ]
    }));
  };
  
  const removeSubtask = (index) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.filter((_, i) => i !== index)
    }));
  };
  
  const handleSubtaskChange = (index, field, value) => {
    setFormData(prev => {
      const updatedSubtasks = [...prev.subtasks];
      updatedSubtasks[index] = {
        ...updatedSubtasks[index],
        [field]: value
      };
      return {
        ...prev,
        subtasks: updatedSubtasks
      };
    });
  };
  
  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormTitle>
        {initialData ? 'Edit Task' : 'Create New Task'}
        <CloseButton 
          onClick={onCancel}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiX size={20} />
        </CloseButton>
      </FormTitle>
      
      <FormGroup>
        <Label htmlFor="title">Task Title *</Label>
        <Input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="What needs to be done?"
          required
        />
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="description">Description</Label>
        <TextArea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Add details about this task..."
        />
      </FormGroup>
      
      <DateTimeContainer>
        <DateTimeGroup>
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
          />
        </DateTimeGroup>
        
        <DateTimeGroup>
          <Label htmlFor="dueTime">Due Time</Label>
          <Input
            type="time"
            id="dueTime"
            name="dueTime"
            value={formData.dueTime}
            onChange={handleChange}
          />
        </DateTimeGroup>
      </DateTimeContainer>
      
      <FormGroup>
        <Label htmlFor="status">Status</Label>
        <Select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </Select>
      </FormGroup>
      
      <Divider />
      
      <SubtasksSection>
        <SubtaskHeader>
          <SubtaskTitle>Subtasks</SubtaskTitle>
          <AddButton 
            onClick={addSubtask}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="button"
          >
            <FiPlus size={16} />
          </AddButton>
        </SubtaskHeader>
        
        <AnimatePresence>
          {formData.subtasks.map((subtask, index) => (
            <motion.div
              key={subtask.id || index}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <SubtaskItem>
                <SubtaskControls>
                  <RemoveButton
                    onClick={() => removeSubtask(index)}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                  >
                    <FiTrash2 size={16} />
                  </RemoveButton>
                </SubtaskControls>
                
                <FormGroup>
                  <Label>Subtask Title *</Label>
                  <Input
                    type="text"
                    value={subtask.title}
                    onChange={(e) => handleSubtaskChange(index, 'title', e.target.value)}
                    placeholder="Enter subtask title"
                    required
                  />
                </FormGroup>
                
                <DateTimeContainer>
                  <DateTimeGroup>
                    <Label>Due Date</Label>
                    <Input
                      type="date"
                      value={subtask.dueDate || ''}
                      onChange={(e) => handleSubtaskChange(index, 'dueDate', e.target.value)}
                    />
                  </DateTimeGroup>
                  
                  <DateTimeGroup>
                    <Label>Due Time</Label>
                    <Input
                      type="time"
                      value={subtask.dueTime || ''}
                      onChange={(e) => handleSubtaskChange(index, 'dueTime', e.target.value)}
                    />
                  </DateTimeGroup>
                </DateTimeContainer>
                
                <FormGroup>
                  <Label>Status</Label>
                  <Select
                    value={subtask.status || 'pending'}
                    onChange={(e) => handleSubtaskChange(index, 'status', e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </Select>
                </FormGroup>
              </SubtaskItem>
            </motion.div>
          ))}
        </AnimatePresence>
      </SubtasksSection>
      
      <ButtonContainer>
        <CancelButton 
          type="button" 
          onClick={onCancel}
          whileTap={{ scale: 0.95 }}
        >
          Cancel
        </CancelButton>
        <SubmitButton 
          type="submit"
          disabled={!formData.title}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {initialData ? 'Update Task' : 'Create Task'}
        </SubmitButton>
      </ButtonContainer>
    </FormContainer>
  );
};

export default TaskForm; 