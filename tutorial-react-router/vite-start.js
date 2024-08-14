import { createServer } from "vite";

createServer()
  .listen()
  .then(() => {
    console.log("Vite server is running");
  })
  .catch((err) => {
    console.error("Failed to start Vite server:", err);
  });
