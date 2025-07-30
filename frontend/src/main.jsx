import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MantineProvider } from "@mantine/core";
import "@mantine/dates/styles.css";
import store from "./store/store.js";
import "./styles/index.css";
import App from "./App.jsx";

// Create a React Query client
const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <MantineProvider theme={{ fontFamily: "sans-serif" }}>
          <App />
        </MantineProvider>
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);
