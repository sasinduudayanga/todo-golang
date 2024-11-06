package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"todo-app/handlers"

	_ "github.com/go-sql-driver/mysql"
	"github.com/rs/cors"
)

var db *sql.DB

func main() {

	var err error

	// Define the data source name (DSN) with your MySQL credentials
	dsn := "root:@tcp(127.0.0.1:3306)/golang_todo_app"
	db, err = sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal("Error connecting to the database: ", err)
	}

	// Verify the connection
	err = db.Ping()
	if err != nil {
		log.Fatal("Error pinging the database: ", err)
	}

	fmt.Println("Connected to MySQL database!")

	// Create a new ServeMux instance to register routes
	mux := http.NewServeMux()

	http.HandleFunc("/tasks/all", handlers.GetAllTasksHandler(db))   // Get all tasks
	http.HandleFunc("/task/create", handlers.CreateTaskHandler(db))  // Create a new task
	http.HandleFunc("/task/update/", handlers.UpdateTaskHandler(db)) // Update a task
	http.HandleFunc("/task/delete/", handlers.DeleteTaskHandler(db)) // Delete a task
	http.HandleFunc("/task/", handlers.GetTaskByIdHandler(db))       // Get a task by ID

	// Set up the CORS handler
	corsHandler := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:3000"}, // Allow React frontend
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders: []string{"Content-Type"},
	})

	// Wrap the ServeMux with the CORS handler
	http.ListenAndServe(":8080", corsHandler.Handler(mux))

	fmt.Println("Server is running on port 8080")

}
