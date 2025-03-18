import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiList, FiCheckCircle, FiClock, FiActivity } from 'react-icons/fi';

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FilterTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.text};
`;

const FilterButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const FilterButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border: none;
  text-align: left;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  background: ${props => props.active ? props.theme.filterActiveBg : props.theme.filterBg};
  color: ${props => props.active ? props.theme.filterActiveText : props.theme.filterText};
  box-shadow: ${props => props.active ? '0 4px 8px rgba(74, 118, 253, 0.2)' : 'none'};
  
  &:hover {
    background: ${props => props.active ? props.theme.filterActiveBg : props.theme.inputBg};
    transform: translateX(${props => props.active ? '0' : '4px'});
  }
  
  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
  }
  
  .count {
    margin-left: auto;
    background: ${props => props.active ? 'rgba(255, 255, 255, 0.2)' : props.theme.inputBg};
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.8rem;
    min-width: 28px;
    text-align: center;
  }
`;

const TaskFilter = ({ currentFilter, onFilterChange, taskCounts }) => {
  const filters = [
    { 
      id: 'all', 
      label: 'All Tasks', 
      icon: <FiList size={16} />, 
      count: taskCounts.all 
    },
    { 
      id: 'pending', 
      label: 'Pending', 
      icon: <FiClock size={16} />, 
      count: taskCounts.pending 
    },
    { 
      id: 'partial', 
      label: 'In Progress', 
      icon: <FiActivity size={16} />, 
      count: taskCounts.partial 
    },
    { 
      id: 'completed', 
      label: 'Completed', 
      icon: <FiCheckCircle size={16} />, 
      count: taskCounts.completed 
    }
  ];
  
  return (
    <FilterContainer>
      <FilterTitle>Filter Tasks</FilterTitle>
      
      <FilterButtonsContainer>
        {filters.map(filter => (
          <FilterButton
            key={filter.id}
            active={currentFilter === filter.id}
            onClick={() => onFilterChange(filter.id)}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <span className="icon">{filter.icon}</span>
            <span>{filter.label}</span>
            <span className="count">{filter.count}</span>
          </FilterButton>
        ))}
      </FilterButtonsContainer>
    </FilterContainer>
  );
};

export default TaskFilter; 