import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';
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

const TaskForm = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: ''
  });
  
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        dueDate: initialData.dueDate ? format(new Date(initialData.dueDate), 'yyyy-MM-dd') : ''
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
      
      <FormGroup>
        <Label htmlFor="dueDate">Due Date</Label>
        <Input
          type="date"
          id="dueDate"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
        />
      </FormGroup>
      
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