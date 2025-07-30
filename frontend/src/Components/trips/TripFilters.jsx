import React, { useState } from "react";
import {
  Checkbox,
  NumberInput,
  Stack,
  Group,
  Paper,
  Divider,
  Button,
  Collapse,
} from "@mantine/core";
import { Formik, Form } from "formik";
import { LocationAutocompleteField, DateInputField } from "../Inputs";
import { tripFilterSchema } from "../../validations/trip.validation";
import { DateInput } from "@mantine/dates";

const categories = [
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

const transportModes = ["car", "train", "plane"];

const TripFilters = ({ updateQuery }) => {
  const [filtersVisible, setFiltersVisible] = useState(false);

  // Helper to toggle values in array fields
  const toggleArrayValue = (array, value) =>
    array.includes(value)
      ? array.filter((v) => v !== value)
      : [...array, value];

  return (
    <Formik
      initialValues={{
        destination: "",
        departure_date: "",
        returning_date: "",
        flexible_dates: false,
        participants: "",
        category: [],
        transportation: [],
      }}
      validationSchema={tripFilterSchema}
      onSubmit={() => {}} // Not used, we update on change
    >
      {({ values, setFieldValue }) => (
        <Form>
          <div className="flex gap-4 items-end justify-around">
            <div className="flex flex-col md:flex-row w-full justify-between">
              <LocationAutocompleteField
                name="destination"
                label="Destination"
                value={values.destination}
                onChange={(val) => {
                  setFieldValue("destination", val);
                }}
                onSubmit={(val) => {
                  updateQuery({ ...values, destination: val });
                }}
                onOptionSelected={(val) => {
                  updateQuery({ ...values, destination: val });
                }}
              />
              <div className="flex w-full md:w-2/3 justify-between">
                <DateInput
                  name="departure_date"
                  label="Departure Date"
                  value={values.departure_date || null}
                  onChange={(date) => {
                    setFieldValue("departure_date", date);
                    updateQuery({ ...values, departure_date: date });
                  }}
                  placeholder="Departure Date"
                  clearable
                />
                <DateInput
                  name="returning_date"
                  label="Returning Date"
                  value={values.returning_date || null}
                  onChange={(date) => {
                    setFieldValue("returning_date", date);
                    updateQuery({ ...values, returning_date: date });
                  }}
                  placeholder="Returning Date"
                  clearable
                />
              </div>
            </div>
            <Button
              onClick={(e) => {
                e.preventDefault();
                setFiltersVisible((prev) => !prev);
              }}
            >
              {filtersVisible ? "Hide Filters" : "More Filters"}
            </Button>
          </div>
          <Collapse in={filtersVisible} transitionDuration={300}>
            <Paper radius="md" shadow="sm" p="lg">
              <Stack spacing="lg">
                <div className="flex gap-2">
                  <NumberInput
                    value={values.participants}
                    onChange={(val) => {
                      setFieldValue("participants", val);
                      updateQuery({ ...values, participants: val });
                    }}
                    defaultValue={0}
                    min={1}
                    placeholder="Number of participants"
                  />
                  <Checkbox
                    label="Flexible Dates"
                    checked={values.flexible_dates}
                    onChange={(e) => {
                      setFieldValue("flexible_dates", e.target.checked);
                      updateQuery({
                        ...values,
                        flexible_dates: e.target.checked,
                      });
                    }}
                  />
                </div>
                <Divider label="Category" labelPosition="center" />

                <Group spacing="md" mt="sm">
                  {categories.map((cat) => (
                    <Checkbox
                      key={cat.value}
                      label={cat.label}
                      checked={values.category.includes(cat.value)}
                      onChange={() => {
                        const newCategory = toggleArrayValue(
                          values.category,
                          cat.value
                        );
                        setFieldValue("category", newCategory);
                        updateQuery({ ...values, category: newCategory });
                      }}
                    />
                  ))}
                </Group>

                <Divider label="Transportation" labelPosition="center" />

                <Group spacing="md" mt="sm">
                  {transportModes.map((mode) => (
                    <Checkbox
                      key={mode}
                      label={mode.charAt(0).toUpperCase() + mode.slice(1)}
                      checked={values.transportation.includes(mode)}
                      onChange={() => {
                        const newTransport = toggleArrayValue(
                          values.transportation,
                          mode
                        );
                        setFieldValue("transportation", newTransport);
                        updateQuery({
                          ...values,
                          transportation: newTransport,
                        });
                      }}
                    />
                  ))}
                </Group>
              </Stack>
            </Paper>
          </Collapse>
        </Form>
      )}
    </Formik>
  );
};

export default TripFilters;
