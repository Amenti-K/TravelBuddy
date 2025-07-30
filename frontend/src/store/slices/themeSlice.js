import { createSlice } from "@reduxjs/toolkit";

// Utility function to toggle the dark class on the HTML element
const applyDarkMode = (isDarkMode) => {
  if (isDarkMode) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    isDarkMode: false,
  },
  reducers: {
    // Unified reducer for toggling and setting dark mode
    toggleTheme: (state, action) => {
      state.isDarkMode = action.payload ?? !state.isDarkMode; // Toggle if no payload
      applyDarkMode(state.isDarkMode);
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
