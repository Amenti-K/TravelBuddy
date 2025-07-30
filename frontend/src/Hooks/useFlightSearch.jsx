import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getFlights } from "../Api/flight.api";
import dayjs from "dayjs";

// Util to safely extract `.value` from selected options
const safeValue = (input) => (typeof input === "object" ? input?.value : input);

// Util to check required fields
const isSearchReady = (values) => {
  return (
    values?.departure &&
    values?.destination &&
    values?.outboundDate &&
    values?.returnDate
  );
};

export const useFlightSearch = () => {
  const [searchPayload, setSearchPayload] = useState(null);

  const query = useQuery({
    queryKey: ["flights", searchPayload],
    queryFn: () => getFlights(searchPayload),
    enabled: !!searchPayload, // only runs if payload is set
    staleTime: 1000 * 60 * 10, // cache for 10 minutes
  });

  const handleSearch = (values) => {
    if (!isSearchReady(values)) {
      console.warn("Search aborted 🚫: missing required fields.");
      return;
    }

    const payload = {
      from: values.departure,
      to: values.destination,
      outbound: dayjs(values.outboundDate).format("YYYY-MM-DD"),
      returnDate: dayjs(values.returnDate).format("YYYY-MM-DD"),
      flightType: safeValue(values.flightType),
      travelClass: safeValue(values.travelClass),
      stops: safeValue(values.stops),
    };
    if (Array.isArray(values.airlines) && values.airlines.length > 0) {
      payload.airlines = values.airlines.map(safeValue).join(",");
    }
    setSearchPayload(payload);
  };

  return {
    flightsResponse: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    handleSearch,
  };
};
