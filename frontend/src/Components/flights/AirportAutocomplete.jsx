import { useState, useEffect, useCallback } from "react";
import { Field } from "formik";
import { Autocomplete } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { debounce } from "../../utils/debounce";
import { getAirports } from "../../Api/flight.api";

export const AirportAutocompleteField = ({
  name,
  label,
  placeholder = "Search for an airport...",
  debounceMs = 400,
  ...props
}) => {
  return (
    <Field name={name}>
      {({ field, form, meta }) => {
        const [searchTerm, setSearchTerm] = useState("");
        const [triggerQuery, setTriggerQuery] = useState("");

        // Debounced query setter
        const debouncedSearch = useCallback(
          debounce((query) => {
            setTriggerQuery(query);
          }, debounceMs),
          []
        );

        // Fetch matching airports
        const { data: airports = [], isFetching } = useQuery({
          queryKey: ["airports", triggerQuery],
          queryFn: () => getAirports(triggerQuery),
          enabled: !!triggerQuery,
          staleTime: 5 * 60 * 1000,
          retry: false,
        });

        const handleInputChange = (val) => {
          setSearchTerm(val);
          debouncedSearch(val);
        };

        const handleSelect = (label) => {
          const selected = airports.find((a) => a.label === label);
          if (selected) {
            form.setFieldValue(name, selected.value); // Set IATA code
            setSearchTerm(selected.label); // Show readable label
          } else {
            form.setFieldValue(name, "");
          }
        };

        // Sync label from IATA if form was prefilled
        useEffect(() => {
          if (field.value && airports.length > 0) {
            const match = airports.find((a) => a.value === field.value);
            if (match) {
              setSearchTerm(match.label);
            }
          }
        }, [field.value, airports]);

        return (
          <Autocomplete
            label={label}
            data={airports.map((a) => a.label)}
            placeholder={placeholder}
            value={searchTerm}
            onChange={handleInputChange}
            onOptionSubmit={handleSelect} // ✅ Correct prop
            rightSection={isFetching ? "..." : null}
            error={meta.touched && meta.error ? meta.error : null}
            onBlur={() => form.setFieldTouched(name, true)}
            {...props}
          />
        );
      }}
    </Field>
  );
};
