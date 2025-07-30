import { useState } from "react";
import {
  Card,
  Text,
  Image,
  Collapse,
  Divider,
  Badge,
  Group,
  Button,
  Stack,
  Box,
} from "@mantine/core";
import {
  FaChevronDown,
  FaChevronUp,
  FaPlaneDeparture,
  FaPlaneArrival,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import ProfileAvatarComponent from "../custom/ProfileAvatarComp";
import { useFlight } from "../../Context/FlightProvider";

export default function FlightCard({ data, selected = false }) {
  const navigate = useNavigate();
  const { returning, setReturning, handleFlightSelect } = useFlight();
  const [expanded, setExpanded] = useState(false);
  const firstFlight = data.flights[0];
  const lastFlight = data.flights[data.flights.length - 1];

  const getTime = (iso) => dayjs(iso).format("HH:mm");
  const getDay = (iso) => dayjs(iso).format("ddd, MMM D");
  const getDurationText = (mins) => `${Math.floor(mins / 60)}h ${mins % 60}m`;

  const handleSelectFlight = async () => {
    const token = data.departure_token || data.booking_token;
    let finalLeg = false;
    if (data.departure_token) {
      await handleFlightSelect(finalLeg, token);
      setReturning(true);
    } else if (data.booking_token) {
      setReturning(false);
      finalLeg = true;
      await handleFlightSelect(finalLeg, token);
    }
  };

  const layoversCount = Array.isArray(data.layovers) ? data.layovers.length : 0;

  return (
    <Card
      withBorder
      shadow="sm"
      p="md"
      radius="md"
      className="w-full hover:shadow-md transition-shadow duration-200"
    >
      {/* Header summary - clickable */}
      <Box
        sx={{ cursor: "pointer" }}
        onClick={() => setExpanded((o) => !o)}
        role="button"
        aria-expanded={expanded}
        aria-label="Toggle flight details"
      >
        <Group position="apart" align="center" spacing="md" noWrap>
          <Group spacing="sm" align="center" noWrap>
            <ProfileAvatarComponent
              name={data.airline}
              picture={data.airline_logo}
              size={40}
            />
<Stack spacing="xs" sx={{ minWidth: 150 }}>

              <Text weight={600} size="lg" lineClamp={1}>
                {expanded
                  ? `${returning ? "Return" : "Departure"} · ${getDay(
                      firstFlight.departure_airport.time
                    )}`
                  : `${getTime(firstFlight.departure_airport.time)} - ${getTime(
                      lastFlight.arrival_airport.time
                    )}`}
              </Text>
              <Text size="sm" color="dimmed" weight={500} lineClamp={1}>
                {firstFlight.airline}
              </Text>
            </Stack>
          </Group>

          {!expanded && (
            <Stack spacing={0} align="center" sx={{ minWidth: 100 }}>
              <Text size="lg" weight={700}>
                {getDurationText(data.total_duration)}
              </Text>
              <Text size="sm" color="dimmed" weight={600}>
                {firstFlight.departure_airport.id} → {lastFlight.arrival_airport.id}
              </Text>
            </Stack>
          )}

          {!expanded && (
            <Stack spacing={0} align="center" sx={{ minWidth: 100 }}>
              {layoversCount > 0 ? (
                <>
                  <Text size="lg" weight={700}>
                    {layoversCount} {layoversCount === 1 ? "Stop" : "Stops"}
                  </Text>
                  <Text size="sm" color="dimmed" sx={{ whiteSpace: "nowrap" }}>
                    {data.layovers
                      .map((l) => l.id)
                      .join(", ")}
                  </Text>
                </>
              ) : (
                <Text size="lg" weight={700}>
                  Non-stop
                </Text>
              )}
            </Stack>
          )}

          <Group spacing="xs" noWrap align="center" sx={{ minWidth: 130 }}>
            {!selected && expanded && (
              <Button
                variant="outline"
                color="blue"
                size="xs"
                onClick={handleSelectFlight}
              >
                Select Flight
              </Button>
            )}

            {!selected && (
              <Stack spacing={2} align="flex-end" sx={{ minWidth: 80 }}>
                <Text color="green" weight={700} size="md">
                  USD {data.price}
                </Text>
                <Badge color="gray" variant="light" size="sm" sx={{ userSelect: "none" }}>
                  {data.type}
                </Badge>
              </Stack>
            )}

            {expanded ? <FaChevronUp size={18} /> : <FaChevronDown size={18} />}
          </Group>
        </Group>
      </Box>

      {/* Expanded details */}
      <Collapse in={expanded} mt="md">
        <Divider my="sm" />
        {data.flights.map((flight, idx) => (
          <Box key={idx} mb="md" px="sm">
            <Group align="flex-start" noWrap>
              <Image
                src={flight.airline_logo}
                alt={`${flight.airline} logo`}
                width={28}
                height={28}
                fit="contain"
                withPlaceholder
                radius="sm"
              />

              <Stack spacing={4} sx={{ flex: 1 }}>
                {/* Vertical divider line */}
                <Divider
                  orientation="vertical"
                  size="xl"
                  sx={{ height: "100%", marginLeft: 6, marginRight: 12 }}
                />

                {/* Departure */}
                <Stack spacing={1}>
                  <Group spacing={6} align="center" noWrap>
                    <FaPlaneDeparture size={14} />
                    <Text size="md" weight={600}>
                      {getTime(flight.departure_airport.time)} ·{" "}
                      {flight.departure_airport.name} ({flight.departure_airport.id})
                    </Text>
                  </Group>
                  <Text size="sm" color="yellow" weight={500}>
                    Travel time: {getDurationText(flight.duration)}
                    {flight.overnight ? " · Overnight" : ""}
                  </Text>

                  {/* Arrival */}
                  <Group spacing={6} align="center" noWrap>
                    <FaPlaneArrival size={14} />
                    <Text size="md" weight={600}>
                      {getTime(flight.arrival_airport.time)} · {flight.arrival_airport.name} (
                      {flight.arrival_airport.id})
                    </Text>
                  </Group>
                </Stack>

                {/* Flight details */}
                <Text size="xs" color="dimmed" mt={4} lineClamp={1}>
                  {flight.airline} · {flight.travel_class} · {flight.airplane} · {flight.flight_number}
                </Text>
              </Stack>
            </Group>

            {/* Extensions */}
            {flight.extensions?.map((ext, i) => (
              <Text key={i} size="xs" color="dimmed" mt={4} ml={36}>
                • {ext}
              </Text>
            ))}

            {/* Layover info */}
            {Array.isArray(data.layovers) && data.layovers[idx] && (
              <Box textAlign="center" my="sm">
                <Divider my="xs" />
                <Text size="sm" color="yellow" weight={600}>
                  Layover: {getDurationText(data.layovers[idx].duration)} in{" "}
                  {data.layovers[idx].name}
                  {data.layovers[idx].overnight ? " · Overnight" : ""}
                </Text>
                <Divider my="xs" />
              </Box>
            )}
          </Box>
        ))}

        {/* Footer Extensions */}
        {data.extensions?.length > 0 && (
          <>
            <Divider my="xs" />
            <Text size="xs" color="dimmed" px="sm" mt="sm">
              {data.extensions.map((e, idx) => (
                <span key={idx}>• {e} </span>
              ))}
            </Text>
          </>
        )}
      </Collapse>
    </Card>
  );
}
