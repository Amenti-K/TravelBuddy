import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AiOutlineSwap, AiOutlineArrowRight } from "react-icons/ai";
import { Text, Skeleton, Button, Modal, Stack, Box, Group, Divider } from "@mantine/core";
import FlightCard from "./FlightCard";
import BookFlight from "./BookFlight";
import TripSelector from "./TripSelector";
import { getSelectedFlights, saveSelectedFlights } from "../../Api/flight.api";

const SelectedFlight = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selected = false, payload } = location.state || {};
  const [modalOpened, setModalOpened] = useState(false);

  useEffect(() => {
    if (!payload?.bookingToken) {
      navigate(-1);
    }
  }, [payload]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["selectedFlights", payload],
    queryFn: () => getSelectedFlights(payload),
    enabled: !!payload,
  });

  const saveSelectedFlightsMutation = useMutation({
    mutationFn: ({ tripId, searchParameters }) =>
      saveSelectedFlights({ tripId, searchParameters }),
    onSuccess: (res) => {
      if (res.success === true) {
        setModalOpened(false);
        navigate(`/my-trips/${tripId}`);
      }
    },
  });

  const selectedFlights = data?.selectedFlights ?? [];
  const bookingOptions = data?.bookingOptions ?? [];
  const baggagePrices = data?.baggagePrices ?? {};
  const priceInsights = data?.priceInsights ?? {};

  const firstFlight = selectedFlights[0]?.flights?.[0];
  const lastFlight = selectedFlights[selectedFlights.length - 1]?.flights?.[0];

  const handleConfirmTrip = (tripId) => {
    if (!tripId || !payload) return;
    saveSelectedFlightsMutation.mutate({
      tripId,
      searchParameters: payload,
    });
  };

  if (isLoading) {
    return (
      <Box px={{ base: 16, md: 48 }} py="md">
        <Text size="lg">Loading selected flight data...</Text>
        <Skeleton height={100} mt="sm" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p="md">
        <Text c="red">Failed to load selected flight data.</Text>
      </Box>
    );
  }

  return (
    <Box px={{ base: 16, md: 48 }} py="md">
      {/* Header */}
      <Group position="apart" align="flex-start" mb="md" wrap="nowrap">
        <Stack spacing={2}>
          <Group spacing="xs">
            <Text size="xl" fw={600}>
              {firstFlight?.departure_airport?.id ?? "--"}
            </Text>
            {payload?.type === "2" ? (
              <AiOutlineArrowRight size={20} color="#228be6" />
            ) : (
              <AiOutlineSwap size={20} color="#228be6" />
            )}
            <Text size="xl" fw={600}>
              {lastFlight?.departure_airport?.id ?? "--"}
            </Text>
          </Group>
          <Text size="sm" c="dimmed">
            {selectedFlights[0]?.type ?? "--"} • {firstFlight?.travel_class ?? "--"}
          </Text>
        </Stack>

        <Group spacing="xl">
          {selected && (
            <Button
              variant="outline"
              color="blue"
              size="xs"
              onClick={() => setModalOpened(true)}
              disabled={!selectedFlights.length}
            >
              Continue
            </Button>
          )}

          {priceInsights.lowest_price && (
            <Stack spacing={2} align="end">
              <Text size="xl" fw={700} c="green">
                USD {priceInsights.lowest_price}
              </Text>
              <Text size="sm" c="dimmed">
                Lowest total price
              </Text>
            </Stack>
          )}
        </Group>
      </Group>

      <Divider my="md" />

      {/* Selected Flights */}
      <Box mb="lg">
        <Text size="lg" fw={600} mb={8}>
          Selected Flights
        </Text>
        <Stack spacing="md">
          {selectedFlights.length ? (
            selectedFlights.map((flight, i) => (
              <FlightCard key={i} data={flight} selected />
            ))
          ) : (
            <Text>No flights selected.</Text>
          )}
        </Stack>
      </Box>

      {/* Booking Options */}
      <Box>
        <Text size="lg" fw={600} mb={8}>
          Booking Options
        </Text>
        <Stack spacing="md">
          {bookingOptions.length ? (
            bookingOptions.map((option, i) => (
              <BookFlight key={i} bookingOption={option} />
            ))
          ) : (
            <Text>No booking options available.</Text>
          )}
        </Stack>
      </Box>

      {/* Trip Selector Modal */}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Attach flight to trip"
        size="xl"
        centered
      >
        <TripSelector onConfirm={handleConfirmTrip} />
      </Modal>
    </Box>
  );
};

export default SelectedFlight;
