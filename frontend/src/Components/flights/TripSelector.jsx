import { useState } from "react";
import { useSelector } from "react-redux";
import { Text, Button, Modal } from "@mantine/core";
import TripsList from "../../Components/trips/TripsList";
import { usePaginatedTrips } from "../../Hooks/usePaginatedTrips";

const TripSelector = ({ onConfirm }) => {
  const { user_id } = useSelector((state) => state.auth.userProfile);
  const [selectedTripId, setSelectedTripId] = useState(null);
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePaginatedTrips({ type: "myTrips", userId: user_id });

  const trips = data?.pages.flatMap((page) => page.trips) || [];
  const onSelectTrip = (tripId) => {
    setSelectedTripId(tripId);
  };
  const selectabele = {
    selectable: true,
    onSelectTrip: (tripId) => onSelectTrip(tripId),
    selectedTripId,
  };
  const handleSave = () => {
    if (!selectedTripId) return;
    onConfirm(selectedTripId);
  };
  return (
    <div className="flex flex-col dark:bg-zinc-900 h-full">
      {/* Scrollable area */}
      <div className="flex-1 overflow-y-auto px-2 py-4">
        <TripsList
          trips={trips}
          isLoading={isLoading}
          isError={isError}
          fetchNextPage={fetchNextPage}
          hasMore={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          selectable={selectabele}
        />
      </div>

      {/* Sticky button */}
      <div className="sticky bottom-0 bg-white dark:bg-zinc-900 p-4 border-t border-zinc-300 dark:border-zinc-700">
        <Button
          onClick={handleSave}
          disabled={!selectedTripId}
          fullWidth
          color="blue"
          mt="md"
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default TripSelector;
