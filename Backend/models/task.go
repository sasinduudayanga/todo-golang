package models

import (
	"database/sql"
	"fmt"
	"time"
)

// Task represents a task in the to-do app
type Task struct {
	ID          int       `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Status      string    `json:"status"`
	DueDate     time.Time `json:"due_date"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

func GetAllTasks(db *sql.DB) ([]Task, error) {
	rows, err := db.Query("SELECT id, title, description, status, due_date, created_at, updated_at FROM tasks")
	if err != nil {
		return nil, fmt.Errorf("GetAllTasks: %v", err)
	}
	defer rows.Close()

	var tasks []Task
	for rows.Next() {
		var task Task
		if err := rows.Scan(&task.ID, &task.Title, &task.Description, &task.Status, &task.DueDate, &task.CreatedAt, &task.UpdatedAt); err != nil {
			return nil, fmt.Errorf("GetAllTasks: %v", err)
		}
		tasks = append(tasks, task)
	}
	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("GetAllTasks: %v", err)
	}
	return tasks, nil
}

func AddTask(db *sql.DB, task Task) (int64, error) {
	result, err := db.Exec("INSERT INTO tasks (title, description, status, due_date) VALUES (?, ?, ?, ?)",
		task.Title, task.Description, task.Status, task.DueDate)
	if err != nil {
		return 0, fmt.Errorf("AddTask: %v", err)
	}
	id, err := result.LastInsertId()
	if err != nil {
		return 0, fmt.Errorf("AddTask: %v", err)
	}
	return id, nil
}

// UpdateTask updates an existing task in the database
func UpdateTask(db *sql.DB, task Task) error {
	_, err := db.Exec("UPDATE tasks SET title = ?, description = ?, status = ?, due_date = ? WHERE id = ?",
		task.Title, task.Description, task.Status, task.DueDate, task.ID)
	if err != nil {
		return fmt.Errorf("UpdateTask: %v", err)
	}
	return nil
}

// DeleteTask deletes a task from the database by ID
func DeleteTask(db *sql.DB, id int) error {
	_, err := db.Exec("DELETE FROM tasks WHERE id = ?", id)
	if err != nil {
		return fmt.Errorf("DeleteTask: %v", err)
	}
	return nil
}

// GetTaskById fetches a task from the database by ID
func GetTaskById(db *sql.DB, id int) (Task, error) {
	var task Task
	query := "SELECT id, title, description, status, due_date, created_at, updated_at FROM tasks WHERE id = ?"
	row := db.QueryRow(query, id)

	err := row.Scan(&task.ID, &task.Title, &task.Description, &task.Status, &task.DueDate, &task.CreatedAt, &task.UpdatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			return task, fmt.Errorf("GetTaskById: no task found with id %d", id)
		}
		return task, fmt.Errorf("GetTaskById: %v", err)
	}

	return task, nil
}
