import React, { useState } from "react";
import {
  Button,
  Image,
  SimpleGrid,
  Title,
  Text,
  Group,
  Stack,
  Loader,
} from "@mantine/core";
import { FaMapMarkedAlt, FaImages, FaComments } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requestToJoin, leaveTrip } from "../../../../Api/tripParticipants.api";

const TripMapAndActions = ({
  pictures = [],
  callerType,
  tripId,
  onOpenChat,
}) => {
  const [showMap, setShowMap] = useState(false);
  const queryClient = useQueryClient();

  // Mutations for join, cancel, and leave trip
  const joinTripMutation = useMutation({
    mutationFn: () => requestToJoin(tripId),
    onSuccess: () => {
      queryClient.invalidateQueries(["tripRes", tripId]);
    },
  });

  const cancelOrLeaveRequestMutation = useMutation({
    mutationFn: () => leaveTrip(tripId),
    onSuccess: () => {
      queryClient.invalidateQueries(["tripRes", tripId]);
    },
  });

  // Determine button label, action, icon, color, loading, and error based on callerType
  const getButtonConfig = () => {
    switch (callerType) {
      case "organizer":
      case "participant":
        return {
          label: "Open Chat",
          action: onOpenChat,
          icon: <FaComments />,
          color: "blue",
          loading: false,
          error: null,
        };
      case "pending":
        return {
          label: cancelOrLeaveRequestMutation.isLoading ? (
            <Loader size="sm" color="red" />
          ) : cancelOrLeaveRequestMutation.isError ? (
            "Error"
          ) : (
            "Cancel Request"
          ),
          action: () => cancelOrLeaveRequestMutation.mutate(),
          icon: null,
          color: "red",
          loading: cancelOrLeaveRequestMutation.isLoading,
          error: cancelOrLeaveRequestMutation.isError,
        };
      case "none":
      default:
        return {
          label: joinTripMutation.isLoading ? (
            <Loader size="xs" color="green" />
          ) : joinTripMutation.isError ? (
            "Error"
          ) : (
            "Join Trip"
          ),
          action: () => joinTripMutation.mutate(),
          icon: null,
          color: "green",
          loading: joinTripMutation.isLoading,
          error: joinTripMutation.isError,
        };
    }
  };

  const { label, action, icon, color, loading } = getButtonConfig();

  return (
    <div className="flex flex-col items-center h-full bg-gray-100 dark:bg-gray-800 p-4 shadow-md border dark:border-gray-700">
      {/* Toggle Section */}
      <Group position="apart" className="mb-4 w-full">
        <Title order={4} className="text-gray-800 dark:text-white">
          {showMap ? "Trip Map" : "Trip Pictures"}
        </Title>
        <Button
          variant="light"
          color="blue"
          size="xs"
          onClick={() => setShowMap((prev) => !prev)}
          leftSection={showMap ? <FaImages /> : <FaMapMarkedAlt />}
        >
          {showMap ? "Show Pictures" : "Show Map"}
        </Button>
      </Group>

      {/* Content Section */}
      <div className="flex-1 overflow-y-auto w-full">
        {showMap ? (
          <div className="flex items-center justify-center h-full">
            <Text className="text-gray-600 dark:text-gray-300 italic">
              Map view is under development.
            </Text>
          </div>
        ) : (
          <SimpleGrid cols={2} spacing="xs">
            {/* {pictures.map((url, idx) => (
              <Image
                key={idx}
                src={url}
                alt={`Trip picture ${idx + 1}`}
                className="rounded-md object-cover"
                radius="md"
                withPlaceholder
              />
            ))} */}
          </SimpleGrid>
        )}
      </div>

      {/* Action Button */}
      <Stack spacing="sm" className="mt-4 w-full">
        <Button
          variant="filled"
          color={color}
          size="md"
          fullWidth
          onClick={action}
          leftSection={icon}
          className="text-white"
          loading={loading}
        >
          {label}
        </Button>
      </Stack>
    </div>
  );
};

export default TripMapAndActions;
