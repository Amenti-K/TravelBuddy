import { useState } from "react";
import { useSelector } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTrip } from "../Api/trips.api";
import { Text, Button, Modal } from "@mantine/core";
import TripForm from "../Components/trips/TripForm";
import TripsList from "../Components/trips/TripsList";
import { BsPlusCircle } from "react-icons/bs";
import { usePaginatedTrips } from "../Hooks/usePaginatedTrips";

const MyTrips = () => {
  const { user_type, user_id, agency_id } = useSelector(
    (state) => state.auth.userProfile
  );
  const organizerId = user_type === "agency" ? agency_id : user_id;
  const [modalOpened, setModalOpened] = useState(false);
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePaginatedTrips({ type: "myTrips", organizerId: organizerId });

  const trips = data?.pages.flatMap((page) => page.trips) || [];

  const mutation = useMutation({
    mutationFn: createTrip,
    onSuccess: () => {
      queryClient.invalidateQueries(["myTrips", organizerId]);
      setModalOpened(false);
    },
  });

  const handleSubmit = async (values) => {
    const payload = {
      ...values,
      departure_date: new Date(values.departure_date)
        .toISOString()
        .split("T")[0],
      returning_date: new Date(values.returning_date)
        .toISOString()
        .split("T")[0],
      organizer_id: organizerId,
    };
    await mutation.mutateAsync(payload);
  };

  return (
    <div size="lg" py="xl" className="p-6 px-6 md:px-12 lg:px-24 xl:px-32">
      <div className="flex justify-between mb-6">
        <Text size="xl" weight={500}>
          My Trips
        </Text>
        <Button
          variant="outline"
          radius="xl"
          onClick={() => setModalOpened(true)}
          px={4}
        >
          Create Trip <BsPlusCircle size="25px" className="ml-2" />
        </Button>
      </div>

      <TripsList
        trips={trips}
        isLoading={isLoading}
        isError={isError}
        fetchNextPage={fetchNextPage}
        hasMore={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Create a New Trip"
        size="100% md:75%"
      >
        <TripForm initialValues={{}} onSubmit={handleSubmit} />
      </Modal>
    </div>
  );
};

export default MyTrips;
