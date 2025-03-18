# TaskFlow - Daily Task Manager

A beautiful and feature-rich task manager application built with React, Express, and Node.js. This application allows you to manage your daily tasks with a unique and attractive UI.

## Features

- Create, update, and delete tasks
- Mark tasks as completed
- Filter tasks by status (pending/completed/partially completed)
- Create and manage subtasks with completion tracking
- Task progress visualization
- Responsive design with dark/light theme
- No database required - data is saved locally

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Setup

1. Clone the repository
   ```
   git clone https://github.com/mrudul-UmassD/personal_task_manager_app.git
   cd TaskManagerApp
   ```

2. Install dependencies for backend
   ```
   cd backend
   npm install
   ```

3. Install dependencies for frontend
   ```
   cd ../frontend
   npm install
   ```

## Running the Application

1. Start the backend server (from the root directory)
   ```
   cd backend
   npm start
   ```
   The server will run on http://localhost:5000

2. Start the frontend application (in a new terminal window, from the root directory)
   ```
   cd frontend
   npm start
   ```
   The application will open in your browser at http://localhost:3000

## Usage

- **Adding a Task**: Click the "New Task" button in the header
- **Editing a Task**: Click the edit icon on any task
- **Completing a Task**: Click the checkbox next to a task
- **Adding Subtasks**: Expand a task and click the "+" button in the Subtasks section
- **Filtering Tasks**: Use the filter panel on the right side
- **Dark/Light Theme**: Toggle the theme using the moon/sun icon in the header

## Project Structure

```
TaskManagerApp/
├── backend/               # Backend Express.js application
│   ├── src/               # Source files
│   │   └── index.js       # Main server file
│   ├── data.json          # Local data storage
│   └── package.json       # Dependencies and scripts
├── frontend/              # Frontend React application
│   ├── public/            # Static assets
│   ├── src/               # Source files
│   │   ├── api/           # API service
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom hooks
│   │   ├── App.js         # Main App component
│   │   └── index.js       # Entry point
│   └── package.json       # Dependencies and scripts
└── README.md              # Project documentation
``` 