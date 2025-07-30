import { createSlice } from "@reduxjs/toolkit";
if (localStorage.getItem("user_profile") === "undefined") {
  localStorage.removeItem("user_profile");
}

// Load from localStorage
const storedUserProfile = localStorage.getItem("user_profile");
const storedToken = localStorage.getItem("token");

const initialState = {
  userProfile: storedUserProfile ? JSON.parse(storedUserProfile) : null,
  token: storedToken || null,
  isAuthenticated: !!storedToken && !!storedUserProfile,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const { token, user_profile } = action.payload;
      state.userProfile = user_profile;
      state.token = token;
      state.isAuthenticated = true;

      localStorage.setItem("user_profile", JSON.stringify(user_profile));
      localStorage.setItem("token", token);
    },

    logout: (state) => {
      state.userProfile = null;
      state.token = null;
      state.isAuthenticated = false;

      localStorage.removeItem("user_profile");
      localStorage.removeItem("token");
    },

    updateUserAuthProfile: (state, action) => {
      state.userProfile = action.payload;
      localStorage.setItem("user_profile", JSON.stringify(action.payload));
    },
  },
});

export const { login, logout, updateUserAuthProfile } = authSlice.actions;
export default authSlice.reducer;
