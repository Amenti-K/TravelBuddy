import React, { useEffect } from "react";
import { Formik } from "formik";
import { profileValidationSchema } from "../../validations/profile.validation";
import { agencyProfileValidationSchema } from "../../validations/agencyProfile.validation";
import {
  TextInputField,
  SelectField,
  ArrayFieldInput,
  TextAreaField,
  LocationAutocompleteField,
  ImageUploadField,
  DateInputField,
} from "../Inputs";

const Agency_Types = [
  { label: "Local", value: "local" },
  { label: "International", value: "international" },
];

const ProfileForm = ({ setFormValid, onDataReady, isAgency }) => {
  const initialValues = isAgency
    ? {
        agency_name: "",
        agency_type: "",
        profile_picture: [],
        bio: "",
        office_location: "",
        social_media: [],
      }
    : {
        first_name: "",
        last_name: "",
        date_of_birth: "",
        gender: "",
        location: "",
        bio: "",
        social_media: [],
        profile_picture: [],
      };

  const validationSchema = isAgency
    ? agencyProfileValidationSchema
    : profileValidationSchema;

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      validateOnBlur
      validateOnChange
      onSubmit={() => {}}
    >
      {({ values, isValid, dirty }) => {
        useEffect(() => {
          const isDataValid = isValid && dirty;
          setFormValid(isDataValid);

          if (onDataReady) {
            onDataReady(() => {
              if (!isDataValid) return null;
              return isAgency
                ? {
                    agency_name: values.agency_name,
                    agency_type: values.agency_type,
                    profile_picture: values.profile_picture?.[0] || null,
                    bio: values.bio || "",
                    office_location: values.office_location,
                    social_media: values.social_media.map((link) =>
                      link.startsWith("http") ? link : `https://${link}`
                    ),
                  }
                : {
                    full_name:
                      `${values.first_name} ${values.last_name}`.trim(),
                    gender: values.gender,
                    date_of_birth: values.date_of_birth,
                    location: values.location,
                    bio: values.bio || "",
                    profile_picture: values.profile_picture?.[0] || null,
                    social_media: values.social_media.map((link) =>
                      link.startsWith("http") ? link : `https://${link}`
                    ),
                  };
            });
          }
        }, [values, isValid, dirty, setFormValid, onDataReady, isAgency]);

        return (
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md space-y-4">
            {/* Profile Picture */}
            <ImageUploadField
              name="profile_picture"
              label="Profile Picture"
              maxFiles={1}
              previewShape="circle"
            />

            {/* Name Fields */}
            {isAgency ? (
              <TextInputField name="agency_name" label="Agency Name" />
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <TextInputField name="first_name" label="First Name" />
                <TextInputField name="last_name" label="Last Name" />
              </div>
            )}

            {/* Other Details */}
            {!isAgency && (
              <DateInputField name="date_of_birth" label="Date of Birth" />
            )}

            {!isAgency && (
              <SelectField
                name="gender"
                label="Gender"
                data={["male", "female"]}
              />
            )}

            <LocationAutocompleteField
              name={isAgency ? "office_location" : "location"}
              label="Location"
            />

            {isAgency && (
              <SelectField
                name="agency_type"
                label="Agency Type"
                data={Agency_Types}
              />
            )}

            <TextAreaField name="bio" label="Bio" />

            <ArrayFieldInput
              name="social_media"
              label="Social Media Links"
              placeholder="Paste or type URL and press Enter"
              allowCustom
            />
          </div>
        );
      }}
    </Formik>
  );
};

export default ProfileForm;
