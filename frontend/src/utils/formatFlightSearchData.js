import dayjs from "dayjs";

/**
 * @param {object} values - Raw Formik form values
 * @returns {object} - Formatted flight search payload
 */
export function formatFlightSearchData(values) {
  return {
    flightType: values.flightType,
    travelClass: values.travelClass,
    departure: values.departure?.iata || "", // assume object with .iata
    destination: values.destination?.iata || "",
    outboundDate: values.outboundDate
      ? dayjs(values.outboundDate).format("YYYY-MM-DD")
      : "",
    returnDate: values.returnDate
      ? dayjs(values.returnDate).format("YYYY-MM-DD")
      : "",
    stops: values.stops,
    airlines: values.airlines.map((a) => a.value), // or assume it's array of strings
  };
}
