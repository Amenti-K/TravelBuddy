import { useState } from "react";
import { Formik, Form, Field } from "formik";
import {
  Select,
  Box,
  Group,
  Stack,
  Paper,
  Button,
  Divider,
  useMantineTheme,
} from "@mantine/core";
import { AiOutlineCalendar } from "react-icons/ai";
import { FaPlaneDeparture, FaPlaneArrival, FaMapMarkerAlt } from "react-icons/fa";
import { MdFlightClass, MdOutlineAirlines } from "react-icons/md";
import { IoIosJet } from "react-icons/io";
import {
  FLIGHT_TYPES,
  TRAVEL_CLASSES,
  STOPS_OPTIONS,
  AIRLINES,
} from "../../Constants/flightOptions";
import { DateInputField, MultiSelectField } from "../Inputs";
import { AirportAutocompleteField } from "./AirportAutocomplete";
import FlightsList from "./FlightsList";
import { useFlight } from "../../Context/FlightProvider";

const FlightParent = () => {
  const { flightsResponse, isLoading, handleSearch } = useFlight();
  const [filters, setFilters] = useState({});
  const theme = useMantineTheme();

  return (
    <Box px={{ base: 6, md: 12, lg: 24, xl: 32 }}>
      <Paper shadow="sm" radius="md" p="md">
        <Formik
          initialValues={{
            flightType: "1",
            travelClass: "1",
            departure: null,
            destination: null,
            outboundDate: null,
            returnDate: null,
            stops: "0",
            airlines: [],
          }}
          onSubmit={(values) => {
            setFilters(values);
            handleSearch(values);
          }}
        >
          {({ values, handleSubmit, setFieldValue }) => (
            <Form onSubmit={handleSubmit}>
              <Stack spacing="md">
                {/* Flight Type & Travel Class */}
                <Group grow>
                  <Field name="flightType">
                    {({ field }) => (
                      <Select
                        {...field}
                        data={FLIGHT_TYPES}
                        placeholder="Flight type"
                        leftSection={<IoIosJet size={18} />}
                        radius="xl"
                        onChange={(val) => setFieldValue("flightType", val)}
                        value={values.flightType}
                      />
                    )}
                  </Field>
                  <Field name="travelClass">
                    {({ field }) => (
                      <Select
                        {...field}
                        data={TRAVEL_CLASSES}
                        placeholder="Travel class"
                        leftSection={<MdFlightClass size={18} />}
                        radius="xl"
                        onChange={(val) => setFieldValue("travelClass", val)}
                        value={values.travelClass}
                      />
                    )}
                  </Field>
                </Group>

                {/* Departure & Destination */}
                <Group grow spacing="sm" noWrap>
                  <AirportAutocompleteField
                    name="departure"
                    placeholder="Departure city or airport"
                    leftSection={<FaPlaneDeparture size={16} />}
                    size="lg"
                  />
                  <AirportAutocompleteField
                    name="destination"
                    placeholder="Destination city or airport"
                    rightSection={<FaPlaneArrival size={16} />}
                    size="lg"
                  />
                </Group>

                {/* Outbound & Return Date */}
                <Group grow spacing="sm" noWrap>
                  <DateInputField
                    name="outboundDate"
                    placeholder="Outbound date"
                    leftSection={<AiOutlineCalendar size={16} />}
                    size="lg"
                    minDate={new Date()}
                  />
                  <DateInputField
                    name="returnDate"
                    placeholder="Return date"
                    size="lg"
                    disabled={values.flightType !== "1"}
                    minDate={values.outboundDate ? new Date(values.outboundDate) : new Date()}
                  />
                </Group>

                {/* Stops & Airlines */}
                <Group grow>
                  <Field name="stops">
                    {({ field }) => (
                      <Select
                        {...field}
                        data={STOPS_OPTIONS}
                        placeholder="Stops"
                        leftSection={<FaMapMarkerAlt size={16} />}
                        radius="xl"
                        onChange={(val) => setFieldValue("stops", val)}
                        value={values.stops}
                      />
                    )}
                  </Field>
                  <MultiSelectField
                    name="airlines"
                    data={AIRLINES}
                    placeholder="Select airlines"
                    leftSection={<MdOutlineAirlines size={16} />}
                    radius="xl"
                  />
                </Group>

                {/* Submit Button */}
                <Button
                  type="submit"
                  fullWidth
                  size="md"
                  loading={isLoading}
                  loaderPosition="right"
                  mt="md"
                >
                  Search Flights
                </Button>
              </Stack>
            </Form>
          )}
        </Formik>
      </Paper>

      {/* Flights List */}
      {flightsResponse?.flights && (
        <Box mt="lg">
          <FlightsList filter={filters} flights={flightsResponse.flights} />
        </Box>
      )}
    </Box>
  );
};

export default FlightParent;
