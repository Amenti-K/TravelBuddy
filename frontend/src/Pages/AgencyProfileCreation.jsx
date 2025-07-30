import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@mantine/core";
import ProfileProgress from "../Components/ProfileProgress";
import ProfileForm from "../Components/profile/ProfileForm";
import Interests from "../Components/profile/Interests";
import { updateAgencyProfile } from "../store/slices/agencyProfileSlice";
import { createTravelAgencyProfile } from "../Api/travelAgency.api";
import { apiAgencyProfileValidationSchema } from "../validations/agencyProfile.validation";
import { updateUserAuthProfile } from "../store/slices/authSlice";

const AgencyProfileCreation = () => {
  const [step, setStep] = useState(2);
  const [formValid, setFormValid] = useState(false);
  const getProfileDataRef = useRef(null);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [agencyProfileDataState, setAgencyProfileDataState] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { agency_id } = useSelector((state) => state.auth.userProfile) || {};
  // const agencyProfileData = useSelector((state) => state.agencyProfile);

  const handleNext = async () => {
    if (step === 2 && getProfileDataRef.current) {
      const formData = getProfileDataRef.current();
      if (formData) {
        let normalizedPicture = null;
        if (formData.profile_picture instanceof FileList) {
          normalizedPicture = formData.profile_picture[0];
        } else if (Array.isArray(formData.profile_picture)) {
          normalizedPicture = formData.profile_picture[0];
        } else {
          normalizedPicture = formData.profile_picture;
        }
        formData.profile_picture = normalizedPicture;
        setAgencyProfileDataState(formData);
        dispatch(updateAgencyProfile(formData));
        setStep(3);
      } else {
        console.log("Form invalid or not ready");
      }
    } else if (step === 3 && selectedInterests.length > 0) {
      try {
        setLoading(true);
        const completeAgencyProfile = {
          ...agencyProfileDataState,
          agency_id,
          interests: selectedInterests.map((interest) =>
            interest.toString().trim()
          ),
          profile_picture: agencyProfileDataState.profile_picture || null,
          social_media: Array.isArray(agencyProfileDataState.social_media)
            ? agencyProfileDataState.social_media.filter(
                (url) => url && url.startsWith("http")
              )
            : [],
        };

        await apiAgencyProfileValidationSchema.validate(completeAgencyProfile, {
          abortEarly: false,
        });
        const resProfile = await createTravelAgencyProfile(
          completeAgencyProfile
        );

        if (resProfile.success) {
          dispatch(updateUserAuthProfile(resProfile.user_profile));
          navigate("/discover");
        } else {
          throw new Error(
            resProfile.message || "Failed to create agency profile"
          );
        }
      } catch (error) {
        console.error("Error creating agency profile:", error);
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
            isAgency // Pass a prop if you want to distinguish agency form fields
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

export default AgencyProfileCreation;
