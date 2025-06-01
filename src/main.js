"use client";

import "./assets/main.css";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import useAuth from "./composables/useAuth";

// Initialize auth state at the top level
const { init } = useAuth()

// Create the app first
const app = createApp(App)

// Use the router
app.use(router)

// Mount the app
app.mount("#app")

// Call init after mounting the app
init().catch((err) => console.error("Auth initialization error:", err))