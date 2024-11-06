// src/components/TaskForm.js
import React, { useState, useEffect } from "react";
import { createTask, updateTask, getTaskById } from "../services/api";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate

function TaskForm() {
  const [task, setTask] = useState({
    title: "",
    description: "",
    status: "",
    due_date: "",
  });

  const { id } = useParams(); // to get the task ID from the URL for editing
  const navigate = useNavigate(); // Use useNavigate hook

  useEffect(() => {
    if (id) {
      // If an ID is present, fetch the task for editing
      const fetchTask = async () => {
        try {
          const response = await getTaskById(id);
          setTask(response.data);
        } catch (error) {
          console.error("Error fetching task:", error);
        }
      };
      fetchTask();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (id) {
        // If editing an existing task
        await updateTask(id, task);
        alert("Task updated successfully");
      } else {
        // If creating a new task
        const response = await createTask(task); // Ensure the data is correct
        console.log(response); // Log the response for debugging
        alert("Task created successfully");
      }
      navigate("/"); // Use navigate instead of history.push
    } catch (error) {
      console.error("Error saving task:", error);
      alert("Failed to save task");
    }
  };

  return (
    <div>
      <h1>{id ? "Edit Task" : "Create Task"}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={task.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={task.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div>
          <label>Status:</label>
          <select
            name="status"
            value={task.status}
            onChange={handleChange}
            required
          >
            <option value="">Select Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <label>Due Date:</label>
          <input
            type="date"
            name="due_date"
            value={task.due_date}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">{id ? "Update Task" : "Create Task"}</button>
      </form>
    </div>
  );
}

export default TaskForm;
