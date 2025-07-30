import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user_id: "",
  full_name: "",
  gender: "",
  date_of_birth: null,
  profile_picture: null,
  bio: "",
  location: "",
  social_media: [],
  interests: [],
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    updateProfile: (state, action) => {
      return {
        ...state,
        ...action.payload,
        // Ensure proper data types
        social_media: Array.isArray(action.payload.social_media)
          ? action.payload.social_media
          : [],
        date_of_birth: action.payload.date_of_birth || null,
        profile_picture: action.payload.profile_picture || null,
      };
    },
    addInterests: (state, action) => {
      state.interests = action.payload;
    },
    resetProfile: () => initialState,
  },
});

export const { updateProfile, addInterests, resetProfile } =
  profileSlice.actions;
export default profileSlice.reducer;
