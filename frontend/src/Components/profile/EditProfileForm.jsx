import React from "react";
import { Formik, Form } from "formik";
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
import { Button, Group } from "@mantine/core";

const Agency_Types = [
  { label: "Local", value: "local" },
  { label: "International", value: "international" },
];

function parseDates(obj, keys = ["date_of_birth"]) {
  const result = { ...obj };
  keys.forEach((key) => {
    if (result[key] && typeof result[key] === "string") {
      const d = new Date(result[key]);
      if (!isNaN(d)) result[key] = d;
    }
  });
  return result;
}

const EditProfileForm = ({
  userValues,
  isAgency,
  onSubmit,
  loading = false,
}) => {
  // Prepare initial values based on user type and incoming data
  const initialValues = isAgency
    ? {
        agency_name: userValues.agency_name || "",
        agency_type: userValues.agency_type || "",
        profile_picture: userValues.profile_picture
          ? [userValues.profile_picture]
          : [],
        bio: userValues.bio || "",
        office_location: userValues.office_location || "",
        social_media: userValues.social_media || [],
      }
    : {
        first_name: userValues.full_name
          ? userValues.full_name.split(" ")[0]
          : userValues.first_name || "",
        last_name: userValues.full_name
          ? userValues.full_name.split(" ").slice(1).join(" ")
          : userValues.last_name || "",
        date_of_birth: userValues.date_of_birth
          ? parseDates({ date_of_birth: userValues.date_of_birth })
              .date_of_birth
          : "",
        gender: userValues.gender || "",
        location: userValues.location || "",
        bio: userValues.bio || "",
        social_media: userValues.social_media || [],
        profile_picture: userValues.profile_picture
          ? [userValues.profile_picture]
          : [],
      };

  const validationSchema = isAgency
    ? agencyProfileValidationSchema
    : profileValidationSchema;

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize
      validateOnBlur
      validateOnChange
      onSubmit={async (values, { setSubmitting }) => {
        let payload;
        if (isAgency) {
          payload = {
            agency_name: values.agency_name,
            agency_type: values.agency_type,
            profile_picture: values.profile_picture?.[0] || null,
            bio: values.bio || "",
            office_location: values.office_location,
            social_media: values.social_media.map((link) =>
              link.startsWith("http") ? link : `https://${link}`
            ),
          };
        } else {
          payload = {
            full_name: `${values.first_name} ${values.last_name}`.trim(),
            gender: values.gender,
            date_of_birth: values.date_of_birth,
            location: values.location,
            bio: values.bio || "",
            profile_picture: values.profile_picture?.[0] || null,
            social_media: values.social_media.map((link) =>
              link.startsWith("http") ? link : `https://${link}`
            ),
          };
        }
        await onSubmit(payload);
        setSubmitting(false);
      }}
    >
      {({ isValid, dirty, isSubmitting }) => (
        <Form>
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md space-y-4">
            <ImageUploadField
              name="profile_picture"
              label="Profile Picture"
              maxFiles={1}
              previewShape="circle"
            />
            {isAgency ? (
              <TextInputField name="agency_name" label="Agency Name" />
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <TextInputField name="first_name" label="First Name" />
                <TextInputField name="last_name" label="Last Name" />
              </div>
            )}
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
            <Group position="right" mt="md">
              <Button
                type="submit"
                color="blue"
                disabled={!isValid || !dirty || isSubmitting || loading}
                loading={isSubmitting || loading}
              >
                Update Profile
              </Button>
            </Group>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default EditProfileForm;
