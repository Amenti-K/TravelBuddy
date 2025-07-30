import React, { useCallback, useRef } from "react";
import TripsCard from "./TripsCard";
import { SimpleGrid, Alert, Center, Loader, Text } from "@mantine/core";
import { TripsCardSkeleton } from "../common/Skeletons";

const TripsList = ({
  trips,
  isLoading,
  isError,
  fetchNextPage,
  hasMore,
  isFetchingNextPage,
  selectable,
}) => {
  const observer = useRef();

  const lastElementRef = useCallback(
    (node) => {
      if (isLoading || isFetchingNextPage || !hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, isFetchingNextPage, hasMore]
  );

  const tripsSkeletons = Array.from({ length: 4 }).map((_, index) => (
    <TripsCardSkeleton key={index} />
  ));

  const tripsList = trips?.map((trip, index) => {
    if (index === trips?.length - 1) {
      return (
        <div key={trip?._id} ref={lastElementRef}>
          <TripsCard id={trip?._id} selectable={selectable} {...trip} />
        </div>
      );
    }
    return (
      <TripsCard
        key={trip?._id}
        id={trip?._id}
        selectable={selectable}
        {...trip}
      />
    );
  });

  return (
    <>
      {/* Error alert above skeletons */}
      {isError && (
        <Alert color="red" title="Failed to load trips" mb="md">
          An error occurred while trying to fetch trips.
        </Alert>
      )}

      {/* No trips found message */}
      {!isLoading && trips.length === 0 && (
        <Center py="lg">
          <Text size="lg" color="dimmed">
            No trips found.
          </Text>
        </Center>
      )}

      {/* Trips Grid */}
      <SimpleGrid cols={{ base: 2, sm: 2, md: 3, lg: 4 }} spacing="md">
        {isLoading && trips.length === 0 ? tripsSkeletons : tripsList}
      </SimpleGrid>

      {/* Loader at the bottom if more trips are being fetched */}
      {isFetchingNextPage && (
        <Center mt="md">
          <Loader size="sm" />
        </Center>
      )}
    </>
  );
};

export default TripsList;
