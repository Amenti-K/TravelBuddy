import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ScrollArea,
  Container,
  Button,
  Text,
  Modal,
  Loader,
} from "@mantine/core";
import TripDetailsPanel from "./TripDetailsPanel";
import TripRightSection from "./TripRightSection";
import TripForm from "../TripForm";
import { getTrip, updateTrip } from "../../../Api/trips.api";
import { leaveTrip, requestToJoin } from "../../../Api/tripParticipants.api";

const TripDetailPage = () => {
  const { id: tripId } = useParams();
  const queryClient = useQueryClient();

  // State for toggling chat and modal
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [modalOpened, setModalOpened] = useState(false);

  // Fetch trip details
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["tripRes", tripId],
    queryFn: () => getTrip(tripId),
    staleTime: 1000 * 60 * 5,
    select: (data) => ({
      caller_type: data.caller_type,
      trip: data.trip,
      organizer: data.organizer,
      minimalFlight: data.minimalFlight || null,
    }),
  });

  // Destructure query data
  const { caller_type, trip, organizer, minimalFlight } = data || {};

  const editTripMutation = useMutation({
    mutationFn: (updatedTrip) => updateTrip(tripId, updatedTrip),
    onSuccess: () => {
      queryClient.invalidateQueries(["tripRes", tripId]);
    },
    onError: (error) => {
      console.error("Error updating trip:", error);
      // Add toast notification or error handling here
    },
  });

  // Handlers for child components
  // const handleLeaveTrip = () => cancelOrLeaveRequestMutation.mutate();
  // const toggleChat = () => setIsChatOpen((prev) => !prev);

  // Handle trip form submission
  const handleSubmit = async (values) => {
    const payload = {
      ...values,
      departure_date: values.departure_date
        ? new Date(values.departure_date).toISOString().split("T")[0]
        : undefined,
      returning_date: values.returning_date
        ? new Date(values.returning_date).toISOString().split("T")[0]
        : undefined,
    };
    await editTripMutation.mutateAsync(payload);
    setModalOpened(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Text color="red">Failed to load trip details. Please try again.</Text>
        <Button onClick={refetch}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-100 text-gray-900 px-4 py-6 gap-y-6">
      {/* Left Section - Main Content */}
      <ScrollArea className="w-full md:w-2/3 h-full pr-4">
        <Container size="md" className="flex justify-between items-center mb-6">
          <Text size="xl" fw={600} className="text-gray-800">
            {trip.trip_name}
          </Text>

          {caller_type === "organizer" && (
            <Button
              variant="outline"
              radius="xl"
              onClick={() => setModalOpened(true)}
              className="ml-4"
            >
              Edit Trip
            </Button>
          )}
        </Container>

        <TripDetailsPanel
          trip={trip}
          organizer={organizer}
          minimalFlight={minimalFlight}
        />
      </ScrollArea>

      {/* Right Section - Sidebar */}
      <div className="w-full md:w-1/3">
        <TripRightSection
          callerType={caller_type}
          tripId={tripId}
          trip={trip}
          startingLocation={trip.starting_location}
          destinationLocation={trip.destination}
        />
      </div>

      {/* Edit Trip Modal */}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Edit Trip"
        size="lg"
        centered
        scrollAreaComponent={ScrollArea.Autosize}
        overlayProps={{ opacity: 0.55, blur: 3 }}
      >
        <TripForm initialValues={trip} onSubmit={handleSubmit} />
      </Modal>
    </div>
  );
};

export default TripDetailPage;
