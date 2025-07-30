const FlightFilterAndSearch = () => {
  const { setFilters, setFlights } = useFlight();
  const { flightsResponse, isLoading, error, handleSearch } = useFlightSearch();

  const handleSubmit = async (values) => {
    setFilters(values);
    await handleSearch(values); // assuming this returns flight data
    setFlights(flightsResponse.flights);
  };

  return (
    <Paper>
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
        onSubmit={handleSubmit}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Stack spacing="md">
              <Group>
                <Select
                  name="flightType"
                  data={FLIGHT_TYPES}
                  defaultValue="1"
                  placeholder="Flight type"
                  leftSection={<IoIosJet size={18} />}
                  radius="xl"
                />
                <Select
                  name="travelClass"
                  data={TRAVEL_CLASSES}
                  defaultValue="1"
                  placeholder="Travel class"
                  leftSection={<MdFlightClass size={18} />}
                  radius="xl"
                />
              </Group>

              <div className="flex w-full flex-col md:flex-row justify-between gap-4 pr-8 w-full">
                <div className="flex flex-row gap-0 w-full">
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
                </div>
                <div className="flex flex-row gap-0 w-full">
                  <DateInputField
                    name="outboundDate"
                    placeholder="Outbound date"
                    leftSection={<AiOutlineCalendar size={16} />}
                    size="lg"
                  />
                  <DateInputField
                    name="returnDate"
                    placeholder="Return date"
                    size="lg"
                  />
                </div>
              </div>

              <Group>
                <Select
                  name="stops"
                  data={STOPS_OPTIONS}
                  defaultValue="0"
                  placeholder="Stops"
                  leftSection={<FaMapMarkerAlt size={16} />}
                  radius="xl"
                />
                <MultiSelectField
                  name="airlines"
                  data={AIRLINES}
                  placeholder="Select airlines"
                  leftSection={<MdOutlineAirlines size={16} />}
                  radius="xl"
                />
              </Group>
            </Stack>
            <Divider
              my="xs"
              label={<Button type="submit">Search Flights</Button>}
            />
          </Form>
        )}
      </Formik>
    </Paper>
  );
};

export default FlightFilterAndSearch;
