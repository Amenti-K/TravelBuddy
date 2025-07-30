import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  agency_id: "",
  agency_name: "",
  agency_type: "",
  profile_picture: null,
  bio: "",
  office_location: "",
  social_media: [],
  interests: [],
};

const agencyProfileSlice = createSlice({
  name: "agencyProfile",
  initialState,
  reducers: {
    updateAgencyProfile: (state, action) => {
      return {
        ...state,
        ...action.payload,
        // Ensure proper data types
        social_media: Array.isArray(action.payload.social_media)
          ? action.payload.social_media
          : [],
        profile_picture: action.payload.profile_picture || null,
      };
    },
    addAgencyInterests: (state, action) => {
      state.interests = action.payload;
    },
    resetAgencyProfile: () => initialState,
  },
});

export const { updateAgencyProfile, addAgencyInterests, resetAgencyProfile } =
  agencyProfileSlice.actions;

export default agencyProfileSlice.reducer;
