import React, { useState } from "react";
import { useSelector } from "react-redux";
import { usePaginatedTrips } from "../Hooks/usePaginatedTrips";
import TripsList from "../Components/trips/TripsList";
import TripFilters from "../Components/trips/TripFilters";
import { Divider } from "@mantine/core";

const Discover = () => {
  const { user_type, user_id, agency_id } = useSelector(
    (state) => state.auth.userProfile
  );
  const userId = user_type === "agency" ? agency_id : user_id;
  const [queryFilters, setQueryFilters] = useState({});

  const updateQuery = (values) => {
    const formatted = { ...values };

    if (formatted.departure_date)
      formatted.departure_date = new Date(formatted.departure_date)
        .toISOString()
        .split("T")[0];
    if (formatted.returning_date)
      formatted.returning_date = new Date(formatted.returning_date)
        .toISOString()
        .split("T")[0];

    setQueryFilters(formatted);
  };

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePaginatedTrips({ type: "discover", queryFilters, userId: userId });

  const allTrips = data?.pages?.flatMap((page) => page.trips) || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 sm:px-6 md:px-12 lg:px-24 py-10">
      {/* Filter Section */}
      <div className="bg-white shadow-xl rounded-2xl p-8 mb-10 border border-blue-100">
        <h1 className="text-3xl font-extrabold text-blue-700 mb-6">
          Discover Your Next Adventure
        </h1>
        <TripFilters updateQuery={updateQuery} />
      </div>

      {/* Trips Section */}
      <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
        <TripsList
          trips={allTrips}
          isLoading={isLoading}
          isError={isError}
          fetchNextPage={fetchNextPage}
          hasMore={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>
    </div>
  );
};

export default Discover;
