import React, { useState } from "react";
import { Formik, Form } from "formik";
import { Button, Loader, Timeline, MultiSelect } from "@mantine/core";
import { tripValidationSchema } from "../../validations/trip.validation";
import {
  TextInputField,
  TextAreaField,
  LocationAutocompleteField,
  DateRangePickerField,
  SelectField,
  DateInputField,
  CheckboxField,
  ArrayFieldInput,
  ImageUploadField,
  BreakdownFields,
  RepeaterField,
  ToggleSection,
  MultiSelectField,
} from "../Inputs";

const defaultValues = {
  trip_name: "",
  trip_description: "",
  departure_date: "",
  returning_date: "",
  flexible_dates: false,
  starting_location: "",
  destination: "",
  path: [],
  max_participants: "",
  trip_status: "coming soon",
};

const CATAGORIES = [
  { label: "Adventure", value: "adventure" },
  { label: "Cultural", value: "cultural" },
  { label: "Relaxation", value: "relaxation" },
  { label: "Beach", value: "beach" },
  { label: "Camping", value: "camping" },
  { label: "Wildlife", value: "wildlife" },
  { label: "Luxury", value: "luxury" },
  { label: "Snow", value: "snow" },
  { label: "Extreme", value: "extreme" },
  { label: "Road Trip", value: "roadtrip" },
];

function parseDates(obj, keys = ["departure_date", "returning_date"]) {
  const result = { ...obj };
  keys.forEach((key) => {
    if (result[key] && typeof result[key] === "string") {
      const d = new Date(result[key]);
      if (!isNaN(d)) result[key] = d;
    }
  });
  return result;
}

const TripForm = ({ initialValues, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const isEditMode = Boolean(initialValues?.trip_name);
  const formDetails = isEditMode ? parseDates(initialValues) : defaultValues;

  return (
    <Formik
      initialValues={formDetails}
      validationSchema={tripValidationSchema}
      validateOnBlur
      validateOnChange
      onSubmit={async (values, { setSubmitting }) => {
        setLoading(true);
        await onSubmit(values);
        setLoading(false);
        setSubmitting(false);
      }}
    >
      {({ isSubmitting, values, setFieldValue, isValid, dirty }) => (
       <Form className="space-y-6 p-6 bg-white rounded-xl shadow-md">
  {/* Trip Info */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="md:col-span-2 space-y-4">
      <TextInputField name="trip_name" label="Trip Name" />
      <TextAreaField name="trip_description" label="Description" minRows={3} />
    </div>
    <div className="space-y-4">
      <SelectField
        name="trip_status"
        label="Status"
        data={["coming soon", "ongoing", "completed"]}
      />
      <TextInputField
        name="max_participants"
        label="Max Participants"
        type="number"
        placeholder="Enter number"
      />
      <CheckboxField name="flexible_dates" label="Flexible Dates" />
    </div>
  </div>

  {/* Locations and Dates */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="bg-blue-50 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-2">Trip Route</h3>
      <Timeline active={2} bulletSize={18} lineWidth={2} align="right">
        <Timeline.Item title="Starting Location">
          <LocationAutocompleteField name="starting_location" />
        </Timeline.Item>
        <Timeline.Item title="Via (Path)">
          <ArrayFieldInput
            name="path"
            placeholder="Add city name"
            allowCustom
            ordered
          />
        </Timeline.Item>
        <Timeline.Item title="Destination">
          <LocationAutocompleteField name="destination" />
        </Timeline.Item>
      </Timeline>
    </div>

    <div className="bg-blue-50 rounded-lg p-4 flex flex-col justify-center space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DateInputField
          name="departure_date"
          label="Departure Date"
          value={values.departure_date || null}
          onChange={(date) => setFieldValue("departure_date", date)}
          placeholder="Departure Date"
        />
        <DateInputField
          name="returning_date"
          label="Returning Date"
          value={values.returning_date || null}
          onChange={(date) => setFieldValue("returning_date", date)}
          placeholder="Returning Date"
        />
      </div>
      <DateRangePickerField
        name="date range"
        value={[values.departure_date, values.returning_date]}
        starting_date="departure_date"
        ending_date="returning_date"
      />
    </div>
  </div>

  {/* Media and Categories */}
  <ImageUploadField
    name="trip_pictures"
    label="Trip Pictures"
    maxFiles={5}
    previewShape="square"
  />
  <MultiSelectField
    label="Categories"
    name="category"
    placeholder="Select categories..."
    data={CATAGORIES}
    clearable
  />

  {/* Activities */}
  <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
    <RepeaterField
      name="activities"
      label="Activities"
      emptyItem={{
        name: "",
        description: "",
        location: "",
        optional: false,
      }}
      renderItem={(index) => (
        <div className="flex flex-col gap-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextInputField
              name={`activities[${index}].name`}
              placeholder="Activity Name"
            />
            <TextInputField
              name={`activities[${index}].location`}
              placeholder="Location"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <TextAreaField
              name={`activities[${index}].description`}
              placeholder="Description"
              className="sm:col-span-2"
              minRows={1}
            />
            <CheckboxField
              name={`activities[${index}].optional`}
              label="Optional"
            />
          </div>
        </div>
      )}
    />
  </div>

  {/* Expenses */}
  <div className="border rounded-lg p-4 shadow-sm bg-white">
    <TextInputField
      name="expenses.estimated_per_person"
      label="Estimated Cost Per Person"
      type="number"
      helpertext="Recommended for solo travelers"
    />
    <ToggleSection label="Detailed Breakdown">
      <BreakdownFields baseName="expenses.breakdown" />
    </ToggleSection>
  </div>

  {/* Packing List */}
  <RepeaterField
    name="packing_list"
    label="Packing List"
    emptyItem={{ item: "", category: "" }}
    renderItem={(i) => (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextInputField
          name={`packing_list[${i}].item`}
          placeholder="Item"
        />
        <SelectField
          name={`packing_list[${i}].category`}
          placeholder="Type"
          data={[
            "clothing",
            "toiletries",
            "documents",
            "electronics",
            "miscellaneous",
          ]}
        />
      </div>
    )}
  />

  {/* Agency Fee Includes */}
  <RepeaterField
    name="agency_fee.includes"
    label="What the Agency Fee Includes"
    emptyItem=""
    renderItem={(index) => (
      <TextInputField
        name={`agency_fee.includes[${index}]`}
        placeholder="e.g. Airport pickup"
      />
    )}
  />

  {/* Required Documents */}
  <RepeaterField
    name="required_documents"
    label="Travel Documents Checklist"
    emptyItem={{
      document_name: "",
      required_for_entry: false,
      required_for_trip: false,
    }}
    renderItem={(index) => (
      <div className="space-y-2">
        <TextInputField
          name={`required_documents[${index}].document_name`}
          placeholder="Document Name"
        />
        <div className="flex gap-x-4">
          <CheckboxField
            name={`required_documents[${index}].required_for_entry`}
            label="Required for Entry"
          />
          <CheckboxField
            name={`required_documents[${index}].required_for_trip`}
            label="Required for Trip"
          />
        </div>
      </div>
    )}
  />

  {/* Submit Button */}
  <div className="pt-4 flex justify-end">
    <Button
      type="submit"
      disabled={isSubmitting || !isValid || !dirty}
      color={isSubmitting || !isValid || !dirty ? "gray" : "blue"}
      size="md"
      radius="xl"
    >
      {loading
        ? "Submitting..."
        : isEditMode
        ? "Update Trip"
        : "Create Trip"}
    </Button>
  </div>
</Form>

      )}
    </Formik>
  );
};

export default TripForm;
