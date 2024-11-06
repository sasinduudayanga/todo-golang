// src/components/TaskList.js
import React, { useEffect, useState } from "react";
import { getTasks, deleteTask } from "../services/api";
import { Link } from "react-router-dom";

function TaskList() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await getTasks();
      setTasks(response.data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  return (
    <div>
      <h1>Task List</h1>
      <Link to="/task/create">
        <button>Create New Task</button>
      </Link>
      <ul>
        {tasks.length === 0 ? (
          <p>No tasks available. Please add a task.</p>
        ) : (
          tasks.map((task) => (
            <li key={task.id}>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>Status: {task.status}</p>
              <p>Due Date: {task.due_date}</p>
              <Link to={`/task/edit/${task.id}`}>
                <button>Edit</button>
              </Link>
              <button onClick={() => handleDelete(task.id)}>Delete</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default TaskList;
