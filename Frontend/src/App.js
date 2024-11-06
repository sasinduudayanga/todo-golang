// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/task/create" element={<TaskForm />} />
          <Route path="/task/edit/:id" element={<TaskForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
