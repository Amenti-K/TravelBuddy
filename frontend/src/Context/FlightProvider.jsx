import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { getFlights } from "../Api/flight.api";

const FlightContext = createContext();
const safeValue = (input) => (typeof input === "object" ? input?.value : input);
const isSearchReady = (values) => {
  return (
    values?.departure &&
    values?.destination &&
    values?.outboundDate &&
    (values?.type === "1" ? values?.returnDate : true)
  );
};
export const useFlight = () => useContext(FlightContext);
export const FlightProvider = ({ children }) => {
  const navigate = useNavigate();
  const [returning, setReturning] = useState(false);
  const [searchPayload, setSearchPayload] = useState(null);

  const query = useQuery({
    queryKey: ["flights", searchPayload],
    queryFn: () => getFlights(searchPayload),
    enabled: !!searchPayload,
    staleTime: 1000 * 60 * 10,
  });

  const handleSearch = (values) => {
    setReturning(false);
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
  const handleFlightSelect = (finalLeg = true, token) => {
    const updatedPayload = finalLeg
      ? {
          ...searchPayload,
          bookingToken: token,
        }
      : {
          ...searchPayload,
          departureToken: token,
        };
    if (finalLeg) {
      navigate("/flights/selected", {
        state: {
          payload: updatedPayload,
        },
      });
    } else {
      setSearchPayload(updatedPayload);
    }
  };

  const resetSelection = () => {
    setDepartureToken(null);
    setBookingToken(null);
  };

  return (
    <FlightContext.Provider
      value={{
        returning,
        setReturning,
        handleSearch,
        handleFlightSelect,
        resetSelection,
        flightsResponse: query.data || null,
        isLoading: query.isLoading || null,
        error: query.error || null,
        refetch: query.refetch || null,
      }}
    >
      {children}
    </FlightContext.Provider>
  );
};
