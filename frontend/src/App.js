import React, { useState } from 'react';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import TaskFilter from './components/TaskFilter';
import Header from './components/Header';
import useTasks from './hooks/useTasks';

// Global styles
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
  }

  body {
    background: ${props => props.theme.background};
    color: ${props => props.theme.text};
    min-height: 100vh;
    transition: all 0.3s ease;
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.scrollTrack};
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.scrollThumb};
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.scrollThumbHover};
  }
`;

// Theme definitions
const lightTheme = {
  name: 'light',
  background: 'linear-gradient(120deg, #f5f7fa 0%, #c3cfe2 100%)',
  cardBg: '#ffffff',
  taskBg: '#ffffff',
  cardShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
  text: '#333333',
  subtleText: '#888888',
  accent: '#4a76fd',
  buttonBg: '#4a76fd',
  buttonText: '#ffffff',
  progressBar: '#4a76fd',
  progressBg: '#e0e0e0',
  filterActiveText: '#ffffff',
  filterActiveBg: '#4a76fd',
  filterBg: '#ffffff',
  filterText: '#333333',
  inputBg: '#f0f0f0',
  scrollTrack: '#f1f1f1',
  scrollThumb: '#c3cfe2',
  scrollThumbHover: '#a1afcf',
  completedTaskOpacity: 0.7,
  actionIcons: '#555555',
  borderColor: '#eaeaea',
  formBg: '#ffffff',
  formShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
  iconBg: '#f0f0f0',
  iconColor: '#555555',
  taskHover: '#f8f8f8',
  taskActive: '#f0f4ff',
  subtaskColor: '#555555'
};

const darkTheme = {
  name: 'dark',
  background: 'linear-gradient(120deg, #2b3042 0%, #1a1d2b 100%)',
  cardBg: '#2d3142',
  taskBg: '#353a52',
  cardShadow: '0 10px 20px rgba(0, 0, 0, 0.3)',
  text: '#e0e0e0',
  subtleText: '#aaaaaa',
  accent: '#4a76fd',
  buttonBg: '#4a76fd',
  buttonText: '#ffffff',
  progressBar: '#4a76fd',
  progressBg: '#454c63',
  filterActiveText: '#ffffff',
  filterActiveBg: '#4a76fd',
  filterBg: '#2d3142',
  filterText: '#cccccc',
  inputBg: '#262a38',
  scrollTrack: '#2d3142',
  scrollThumb: '#454c63',
  scrollThumbHover: '#5a6282',
  completedTaskOpacity: 0.5,
  actionIcons: '#bbbbbb',
  borderColor: '#3d4256',
  formBg: '#2d3142',
  formShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
  iconBg: '#353a52',
  iconColor: '#bbbbbb',
  taskHover: '#373d57',
  taskActive: '#394169',
  subtaskColor: '#bbbbbb'
};

// Styled components
const AppContainer = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-top: 2rem;
  
  @media (min-width: 992px) {
    grid-template-columns: 1fr 350px;
  }
`;

const TasksSection = styled.section`
  position: relative;
`;

const SideSection = styled.section`
  position: relative;
`;

const FormCard = styled(motion.div)`
  background: ${props => props.theme.formBg};
  border-radius: 20px;
  box-shadow: ${props => props.theme.formShadow};
  padding: 1.5rem;
  margin-bottom: 2rem;
  position: sticky;
  top: 2rem;
`;

const FilterCard = styled(motion.div)`
  background: ${props => props.theme.cardBg};
  border-radius: 20px;
  box-shadow: ${props => props.theme.cardShadow};
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const App = () => {
  const [theme, setTheme] = useState(lightTheme);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const { 
    tasks, 
    allTasks,
    isLoading, 
    error, 
    filter, 
    setFilter, 
    createTask, 
    updateTask, 
    deleteTask,
    reorderTask,
    addSubtask,
    updateSubtask,
    deleteSubtask
  } = useTasks();

  const toggleTheme = () => {
    setTheme(theme.name === 'light' ? darkTheme : lightTheme);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleTaskCreate = async (taskData) => {
    await createTask(taskData);
    setShowTaskForm(false);
  };

  const handleTaskUpdate = async (id, taskData) => {
    await updateTask(id, taskData);
    setEditingTask(null);
    setShowTaskForm(false);
  };

  const handleTaskFormClose = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };
  
  const handleAddTaskClick = () => {
    setEditingTask(null);
    setShowTaskForm(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AppContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Header 
          theme={theme.name} 
          toggleTheme={toggleTheme} 
          onAddTaskClick={handleAddTaskClick}
        />
        
        <MainContent>
          <TasksSection>
            {error && <p>{error}</p>}
            <TaskList
              tasks={tasks}
              isLoading={isLoading}
              onEditTask={handleEditTask}
              onDeleteTask={deleteTask}
              onUpdateTask={updateTask}
              onAddSubtask={addSubtask}
              onUpdateSubtask={updateSubtask}
              onDeleteSubtask={deleteSubtask}
              onReorderTasks={reorderTask}
              onAddTaskClick={handleAddTaskClick}
            />
          </TasksSection>
          
          <SideSection>
            <AnimatePresence mode="wait">
              {showTaskForm && (
                <FormCard
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <TaskForm
                    onSubmit={editingTask ? 
                      (data) => handleTaskUpdate(editingTask.id, data) : 
                      handleTaskCreate
                    }
                    onCancel={handleTaskFormClose}
                    initialData={editingTask}
                  />
                </FormCard>
              )}
            </AnimatePresence>
            
            <FilterCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <TaskFilter 
                currentFilter={filter} 
                onFilterChange={setFilter}
                taskCounts={{
                  all: allTasks.length,
                  completed: allTasks.filter(t => t.completed).length,
                  pending: allTasks.filter(t => !t.completed && t.progress === 0).length,
                  partial: allTasks.filter(t => !t.completed && t.progress > 0).length,
                  'in-progress': allTasks.filter(t => t.status === 'in-progress').length
                }}
              />
            </FilterCard>
          </SideSection>
        </MainContent>
      </AppContainer>
    </ThemeProvider>
  );
};

export default App; 