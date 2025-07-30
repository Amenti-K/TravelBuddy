import React, { useEffect, useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Loader, Paper, Text, Tooltip } from "@mantine/core";
import { FiCheck, FiX } from "react-icons/fi";
import {
  getTripParticipants,
  updateParticipantStatus,
  leaveTrip,
} from "../../../../Api/tripParticipants.api";
import ProfileAvatarComp from "../../../custom/ProfileAvatarComp";

const Requests = ({ tripId }) => {
  const queryClient = useQueryClient();
  const [tripParticipants, setTripParticipants] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Fetch participants with useEffect
  useEffect(() => {
    if (!tripId) return;
    setLoading(true);
    setFetchError(null);
    getTripParticipants(tripId)
      .then((data) => {
        setTripParticipants(data?.tripParticipants || { participants: [] });
        setLoading(false);
      })
      .catch((err) => {
        setFetchError("Error loading requests. Please try again later.");
        setLoading(false);
      });
  }, [tripId]);

  // Accept mutation
  const acceptRequest = useMutation({
    mutationFn: ({ userId }) =>
      updateParticipantStatus(tripId, userId, "approved"),
    onSuccess: () => {
      queryClient.invalidateQueries(["tripRes", tripId]);
      // Refetch participants after mutation
      getTripParticipants(tripId).then((data) =>
        setTripParticipants(data?.tripParticipants || { participants: [] })
      );
    },
  });

  // Reject mutation
  const rejectRequest = useMutation({
    mutationFn: ({ userId }) => leaveTrip(tripId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries(["tripRes", tripId]);
      // Refetch participants after mutation
      getTripParticipants(tripId).then((data) =>
        setTripParticipants(data?.tripParticipants || { participants: [] })
      );
    },
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader size="lg" />
      </div>
    );
  }

  if (fetchError || !tripParticipants) {
    return (
      <div className="text-red-500 text-center mt-4">
        {fetchError || "Error loading requests. Please try again later."}
      </div>
    );
  }

  if (
    !tripParticipants.participants ||
    tripParticipants.participants.length === 0
  ) {
    return (
      <div className="text-gray-500 text-center mt-4">
        No pending requests at the moment.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 overflow-y-auto ">
      {tripParticipants.participants.map((user) => (
        <Paper
          key={user.id}
          shadow="sm"
          radius="md"
          className="flex items-center justify-between p-2 bg-white border border-gray-200"
        >
          <div className="flex gap-x-2">
            <ProfileAvatarComp
              name={user?.full_name}
              picture={user?.profile_picture}
            />
            <div>
              <Text fw={600}>{user?.full_name}</Text>
              <Text size="xs" mt={2}>
                {user?.trust_score} %
              </Text>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Tooltip label="Accept" position="top" withArrow>
              <button
                className="text-green-600 hover:bg-green-100 p-2 rounded-full transition"
                disabled={acceptRequest.isPending}
                onClick={() => acceptRequest.mutate({ userId: user.user_id })}
              >
                <FiCheck size={18} />
              </button>
            </Tooltip>
            <Tooltip label="Reject" position="top" withArrow>
              <button
                className="text-red-600 hover:bg-red-100 p-2 rounded-full transition"
                disabled={rejectRequest.isPending}
                onClick={() => rejectRequest.mutate({ userId: user.user_id })}
              >
                <FiX size={18} />
              </button>
            </Tooltip>
          </div>
        </Paper>
      ))}
    </div>
  );
};

export default Requests;
