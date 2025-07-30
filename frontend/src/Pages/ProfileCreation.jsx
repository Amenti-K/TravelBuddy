import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProfileProgress from "../Components/ProfileProgress";
import ProfileForm from "../Components/profile/ProfileForm";
import Interests from "../Components/profile/Interests";
import { useDispatch } from "react-redux";
import { updateProfile } from "../store/slices/profileSlice";
import { createSoloTravelerProfile } from "../Api/soloTraveler.api";
import { Button } from "@mantine/core";
import { apiProfileValidationSchema } from "../validations/profile.validation";
import { updateUserAuthProfile } from "../store/slices/authSlice";

const ProfileCreation = () => {
  const [step, setStep] = useState(2);
  const [formValid, setFormValid] = useState(false);
  const getProfileDataRef = useRef(null);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user_id } = useSelector((state) => state.auth.userProfile) || {};
  const profileData = useSelector((state) => state.profile);

  const handleNext = async () => {
    if (step === 2 && getProfileDataRef.current) {
      const profileData = getProfileDataRef.current();
      if (profileData) {
        let normalizedPicture = null;
        if (profileData.profile_picture instanceof FileList) {
          normalizedPicture = profileData.profile_picture[0];
        } else if (Array.isArray(profileData.profile_picture)) {
          normalizedPicture = profileData.profile_picture[0];
        } else {
          normalizedPicture = profileData.profile_picture;
        }
        profileData.profile_picture = normalizedPicture;
        dispatch(updateProfile(profileData));
        setStep(3);
      } else {
        console.log("Form invalid or not ready");
      }
    } else if (step === 3 && selectedInterests.length > 0) {
      try {
        setLoading(true);
        const completeProfile = {
          ...profileData,
          user_id,
          interests: selectedInterests.map((interest) =>
            interest.toString().trim()
          ),
          date_of_birth: new Date(profileData.date_of_birth)
            .toISOString()
            .split("T")[0],
          profile_picture: profileData.profile_picture || null,
          social_media: Array.isArray(profileData.social_media)
            ? profileData.social_media.filter(
                (url) => url && url.startsWith("http")
              )
            : [],
        };

        await apiProfileValidationSchema.validate(completeProfile, {
          abortEarly: false,
        });

        const resProfile = await createSoloTravelerProfile(completeProfile);

        if (resProfile.success) {
          dispatch(updateUserAuthProfile(resProfile.user_profile));
          navigate("/dicover");
        } else {
          throw new Error(resProfile.message || "Failed to create profile");
        }
      } catch (error) {
        console.error("Error creating profile:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen">
      <div className="pt-6 sm:pt-8 px-4 sm:px-8 md:px-16">
        <ProfileProgress step={step} />
      </div>

      {/* Content Section - Centers Form/Interests */}
      <div className="flex-grow flex justify-center items-center px-4 sm:px-8 md:px-16 pb-24">
        {step === 2 && (
          <ProfileForm
            setFormValid={setFormValid}
            onDataReady={(getterFn) => {
              getProfileDataRef.current = getterFn;
            }}
          />
        )}
        {step === 3 && (
          <Interests setSelectedInterests={setSelectedInterests} />
        )}
      </div>

      {/* Sticky Footer Navigation */}
      <div className="fixed bottom-0 left-0 w-full bg-white shadow-md p-4 sm:p-6 flex justify-between items-center">
        <Button
          disabled={step === 2}
          onClick={() => setStep(step - 1)}
          color={step === 3 ? "blue" : "gray"}
        >
          Previous
        </Button>

        <Button
          onClick={handleNext}
          disabled={
            loading ||
            (step === 2 && !formValid) ||
            (step === 3 && selectedInterests.length === 0)
          }
          color={
            (step === 2 && formValid) ||
            (step === 3 && selectedInterests.length > 0)
              ? "blue"
              : "gray"
          }
          className="ml-auto"
        >
          {loading ? "Processing..." : step === 3 ? "Complete Profile" : "Next"}
        </Button>
      </div>
    </div>
  );
};

export default ProfileCreation;
