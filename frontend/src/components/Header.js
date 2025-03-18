import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiMoon, FiSun, FiPlus } from 'react-icons/fi';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Logo = styled(motion.h1)`
  font-size: 2rem;
  font-weight: 800;
  color: ${props => props.theme.text};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  span {
    background: linear-gradient(135deg, #4a76fd 0%, #b0c4ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const ThemeToggle = styled(motion.button)`
  background: ${props => props.theme.iconBg};
  color: ${props => props.theme.iconColor};
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.12);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const AddButton = styled(motion.button)`
  background: ${props => props.theme.buttonBg};
  color: ${props => props.theme.buttonText};
  border: none;
  border-radius: 30px;
  padding: 0.5rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  box-shadow: 0 4px 10px rgba(74, 118, 253, 0.25);
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(74, 118, 253, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem;
    border-radius: 50%;
    
    span {
      display: none;
    }
  }
`;

const Header = ({ theme, toggleTheme, onAddTaskClick }) => {
  return (
    <HeaderContainer>
      <Logo
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Task<span>Flow</span>
      </Logo>
      
      <Controls>
        <ThemeToggle 
          onClick={toggleTheme}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
        </ThemeToggle>
        
        <AddButton 
          onClick={onAddTaskClick}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <FiPlus size={18} />
          <span>New Task</span>
        </AddButton>
      </Controls>
    </HeaderContainer>
  );
};

export default Header; 