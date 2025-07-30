import { Text, Stack, Box } from "@mantine/core";
import FlightCard from "./FlightCard";
import { useFlight } from "../../Context/FlightProvider";

// Renders a list of flight cards
const FlightListChild = ({ flights }) => {
  return (
    <Stack spacing="md">
      {flights.map((flight, i) => (
        <FlightCard key={i} data={flight} />
      ))}
    </Stack>
  );
};

const FlightsList = ({ flights }) => {
  const { returning } = useFlight();

  const noResults =
    flights.other.length === 0 && flights.best.length === 0;

  if (noResults) {
    return (
      <Box className="w-full text-center py-6">
        <Text size="xl" fw={600}>
          No options matching your search
        </Text>
        <Text size="md" color="dimmed" mt={4}>
          Try changing your dates or destination to see results
        </Text>
      </Box>
    );
  }

  return (
    <Stack spacing="lg">
      {returning ? (
        <>
          <Text size="xl" fw={600}>
            Returning Flights
          </Text>
          <FlightListChild flights={flights.other} />
        </>
      ) : (
        <>
          {flights.best && flights.best.length > 0 && (
            <>
              <Text size="xl" fw={600}>
                Best Departing Flights
              </Text>
              <FlightListChild flights={flights.best} />
            </>
          )}
          <Text size="xl" fw={600}>
            Other Departing Flights
          </Text>
          <FlightListChild flights={flights.other} />
        </>
      )}
    </Stack>
  );
};

export default FlightsList;
