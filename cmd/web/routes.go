package main

import (
	"github.com/bmizerany/pat"
	"net/http"
	"ws/internal/handlers"
)

func routes() http.Handler {

	mux := pat.New()
	mux.Get("/", http.HandlerFunc(handlers.Home))
	mux.Get("/ws", http.HandlerFunc(handlers.WsEndpoint))

	// Serve static files
	fileServer := http.FileServer(http.Dir("./static/"))
	mux.Get("/static/", http.StripPrefix("/static/", fileServer))

	return mux

}
