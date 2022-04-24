package main

import (
	"log"
	"net/http"
	"ws/internal/handlers"
)

func main() {

	mux := routes()

	log.Println("Starting channel listener")

	go handlers.ListenToWsChannel()

	log.Println("Starting Web Server (port 8081)")

	_ = http.ListenAndServe(":8081", mux)
}
