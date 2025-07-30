import React, { useState, useEffect } from "react";
import { Field, FieldArray } from "formik";
import {
  TextInput,
  Textarea,
  Select,
  Pill,
  PillsInput,
  InputLabel,
  CloseButton,
  Autocomplete,
  Checkbox,
  Button,
  Group,
  MultiSelect,
} from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { DatePicker, DateInput } from "@mantine/dates";
import { fetchLocations } from "../utils/locationService";

export const TextInputField = ({ name, label, ...props }) => (
  <Field name={name}>
    {({ field, form, meta }) => (
      <TextInput
        {...field}
        {...props}
        label={label}
        value={field.value}
        onChange={(e) => form.setFieldValue(name, e.currentTarget.value)}
        error={meta.touched && meta.error ? meta.error : null}
      />
    )}
  </Field>
);

export const ImageUploadField = ({
  name,
  label,
  maxFiles = 1,
  accept = ["image/*"],
  previewShape = "square",
}) => {
  return (
    <Field name={name}>
      {({ field, form }) => {
        const [previews, setPreviews] = useState([]);

        const handleDrop = (files) => {
          const validFiles = Array.from(files).filter((file) => {
            if (file.size > 5 * 1024 ** 2) {
              alert("File size should be less than 5MB.");
              return false;
            }
            return true;
          });

          const limitedFiles = [...(field.value || []), ...validFiles].slice(
            0,
            maxFiles
          );
          form.setFieldValue(name, limitedFiles); // store only File(s)

          // generate previews just for UI
          const previewUrls = limitedFiles.map((file) =>
            typeof file === "string" ? file : URL.createObjectURL(file)
          );
          setPreviews(previewUrls);
        };

        const removeImage = (index) => {
          const newFiles = [...(field.value || [])];
          newFiles.splice(index, 1);
          form.setFieldValue(name, newFiles);

          const newPreviews = [...previews];
          newPreviews.splice(index, 1);
          setPreviews(newPreviews);
        };

        const isCircle = previewShape === "circle";

        return (
          <div className="mb-4">
            <label className="mb-2 block font-semibold">{label}</label>
            <Dropzone
              onDrop={handleDrop}
              accept={accept}
              multiple={maxFiles > 1}
              maxSize={5 * 1024 ** 2}
              className="border-2 border-dashed rounded-md flex flex-col items-center justify-center"
            >
              {field.value?.length ? (
                <div className="mt-4 flex gap-4 flex-wrap z-2">
                  {previews.map((src, index) => (
                    <div key={index} className="relative">
                      <img
                        src={src}
                        alt={`Preview ${index}`}
                        className={`object-cover ${
                          isCircle
                            ? "rounded-full w-24 h-24"
                            : index === 0 && previews.length > 1
                            ? "w-40 h-40"
                            : "w-24 h-24"
                        }`}
                      />
                      <CloseButton
                        onClick={() => removeImage(index)}
                        className="absolute -top-8 left-1 z-10 bg-gray-200"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 text-center">
                    Drag images here or click to select
                  </p>
                  <small className="text-gray-400">
                    ({field.value?.length || 0} / {maxFiles} images, 5MB max
                    each)
                  </small>
                </div>
              )}
            </Dropzone>
          </div>
        );
      }}
    </Field>
  );
};

export const SelectField = ({ name, label, data, ...props }) => (
  <Field name={name}>
    {({ field, form, meta }) => (
      <Select
        {...field}
        {...props}
        label={label}
        data={data}
        // placeholder={`Select ${label?.toLowerCase()}`}
        value={field.value}
        onChange={(value) => form.setFieldValue(name, value)}
        error={meta.touched && meta.error}
      />
    )}
  </Field>
);

export const TextAreaField = ({ name, label, ...props }) => (
  <Field name={name}>
    {({ field, form, meta }) => (
      <Textarea
        {...field}
        minRows={3}
        {...props}
        label={label}
        autosize
        value={field.value}
        onChange={(e) => form.setFieldValue(name, e.currentTarget.value)}
        error={meta.touched && meta.error ? meta.error : null}
      />
    )}
  </Field>
);

export const LocationAutocompleteField = ({ name, label, ...props }) => {
  const [options, setOptions] = useState([]);

  const handleChange = async (value, form) => {
    form.setFieldValue(name, value);
    const locations = await fetchLocations(value);
    setOptions(locations);
  };

  return (
    <Field name={name}>
      {({ field, form, meta }) => (
        <Autocomplete
          {...props}
          label={label}
          value={field.value}
          onChange={(value) => handleChange(value, form)}
          data={options.map((loc) => loc.label)} // Use unique labels
          placeholder="Search for a location..."
          error={meta.touched && meta.error ? meta.error : null}
        />
      )}
    </Field>
  );
};

export const DateRangePickerField = ({
  name,
  label,
  starting_date,
  ending_date,
}) => (
  <Field name={name}>
    {({ field, form, meta }) => {
      // Get values from Formik
      const startDate = form.values[starting_date] || null;
      const endDate = form.values[ending_date] || null;

      return (
        <DatePicker
          type="range"
          value={field.value?.length ? field.value : [startDate, endDate]}
          onChange={(dates) => {
            if (dates?.length === 2) {
              form.setFieldValue(name, dates); // Store the full range
              form.setFieldValue(starting_date, dates[0] || ""); // Sync with departure_date
              form.setFieldValue(ending_date, dates[1] || ""); // Sync with returning_date
            }
          }}
          label={label}
          error={meta.touched && meta.error ? meta.error : null}
        />
      );
    }}
  </Field>
);

export const DateInputField = ({ name, label, ...props }) => (
  <Field name={name}>
    {({ field, form, meta }) => (
      <DateInput
        {...props}
        label={label}
        clearable
        value={field.value}
        onChange={(date) => form.setFieldValue(name, date)}
        error={meta.touched && meta.error ? meta.error : null}
      />
    )}
  </Field>
);

export const CheckboxField = ({ name, label, ...props }) => (
  <Field name={name}>
    {({ field, form, meta }) => (
      <Checkbox
        {...field}
        {...props}
        label={label}
        checked={field.value}
        onChange={(event) => form.setFieldValue(name, event.target.checked)}
        error={meta.touched && meta.error ? meta.error : null}
      />
    )}
  </Field>
);

export const ArrayFieldInput = ({
  name,
  label,
  placeholder = "Type and press Enter...",
  options = [],
  allowCustom = true,
  ordered = false,
  maxItems,
}) => {
  return (
    <Field name={name}>
      {({ field, form }) => {
        const values = field.value || [];
        const [input, setInput] = useState("");

        const addValue = (val) => {
          const trimmed = val.trim();
          if (
            trimmed &&
            !values.includes(trimmed) &&
            (!maxItems || values.length < maxItems)
          ) {
            form.setFieldValue(name, [...values, trimmed]);
            setInput("");
          }
        };

        const removeValue = (val) => {
          form.setFieldValue(
            name,
            values.filter((v) => v !== val)
          );
        };

        const handleKeyDown = (e) => {
          if (["Enter", "Tab"].includes(e.key)) {
            e.preventDefault();
            if (allowCustom) addValue(input);
            else if (options.includes(input)) addValue(input);
          } else if (
            e.key === "Backspace" &&
            input.length === 0 &&
            values.length > 0
          ) {
            removeValue(values[values.length - 1]);
          }
        };

        const handleOptionSelect = (val) => {
          addValue(val);
        };

        const InputField = options.length ? (
          <Autocomplete
            data={options}
            value={input}
            onChange={setInput}
            onKeyDown={handleKeyDown}
            onOptionSubmit={handleOptionSelect}
            placeholder={placeholder}
            className="min-w-[200px]"
            // withinportal={false}
          />
        ) : (
          <PillsInput.Field
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
          />
        );

        return (
          <PillsInput>
            {label ? <InputLabel className="mb-1">{label}</InputLabel> : <></>}
            <Pill.Group>
              {values.map((item, idx) => (
                <Pill
                  key={item}
                  withRemoveButton
                  onRemove={() => removeValue(item)}
                  className="flex items-center gap-1"
                >
                  {ordered && (
                    <span className="text-xs text-gray-400">{idx + 1}.</span>
                  )}
                  {item}
                </Pill>
              ))}
              {InputField}
            </Pill.Group>
          </PillsInput>
        );
      }}
    </Field>
  );
};

export const MultiSelectField = ({
  name,
  label,
  data = [],
  placeholder = "Select options...",
  allowCustom = true,
  ...props
}) => {
  // Normalize data: accept array of strings or array of { label, value }
  const normalizedData = data.map((item) =>
    typeof item === "string" ? { label: item, value: item } : item
  );

  return (
    <Field name={name}>
      {({ field, form, meta }) => (
        <MultiSelect
          {...field}
          label={label}
          data={normalizedData}
          placeholder={placeholder}
          value={field.value || []}
          onChange={(value) => form.setFieldValue(name, value)}
          error={meta.touched && meta.error ? meta.error : null}
          {...props}
        />
      )}
    </Field>
  );
};

export const RepeaterField = ({ name, label, renderItem, emptyItem }) => (
  <FieldArray name={name}>
    {({ push, remove, form }) => (
      <div className="border rounded p-4 relative mb-4">
        <div className="flex justify-between items-start mb-2">
          <InputLabel className="mb-1 font-semibold text-sm text-gray-700">
            {label}
          </InputLabel>
        </div>
        <div className="space-y-3">
          {form.values[name]?.map((item, index) => (
            <div key={index} className="flex w-full gap-x-2 justify-between">
              {renderItem(index)}
              <Button color="red" size="xs" onClick={() => remove(index)}>
                Remove
              </Button>
            </div>
          ))}
        </div>
        <div className="mt-3 text-right">
          <Button
            size="xs"
            onClick={() =>
              push(typeof emptyItem === "function" ? emptyItem() : emptyItem)
            }
          >
            Add {label}
          </Button>
        </div>
      </div>
    )}
  </FieldArray>
);

export const BreakdownFields = ({ baseName }) => (
  <>
    <TextInputField
      name={`${baseName}.transportation`}
      label="Transportation"
      type="number"
      className="flex gap-x-4"
    />
    <TextInputField
      name={`${baseName}.accommodation`}
      label="Accommodation"
      type="number"
      className="flex gap-x-4"
    />
    <TextInputField
      name={`${baseName}.meals`}
      label="Meals"
      type="number"
      className="flex gap-x-4"
    />
    <TextInputField
      name={`${baseName}.activities`}
      label="Activities"
      type="number"
      className="flex gap-x-4"
    />
    <TextInputField
      name={`${baseName}.miscellaneous`}
      label="Miscellaneous"
      type="number"
      className="flex gap-x-4"
    />
  </>
);

export const ToggleSection = ({ label, children, initiallyOpen = false }) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen);

  return (
    <div className="border rounded p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-sm text-gray-700">{label}</h3>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-sm text-blue-600"
        >
          {isOpen ? "Hide" : "Show"}
        </button>
      </div>
      {isOpen && <div className="space-y-2">{children}</div>}
    </div>
  );
};
