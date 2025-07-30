const axios = require("axios");
const fs = require("fs");
const path = require("path");
const Flights = require("../models/Flight/Flights.model");
const MinimalFlightsModel = require("../models/Flight/MinimalFlights.model");
const API_KEY = process.env.AVIATIONSTACK_API_KEY;
const SERP_API_KEY = process.env.SERP_API_KEY;

const airportsFile = path.join(__dirname, "../data/airports_clean.json");
let airports = [];
// Load the JSON data once when the server starts
try {
  const rawData = fs.readFileSync(airportsFile, "utf8");
  airports = JSON.parse(rawData);
} catch (err) {
  console.error("Failed to load airports data:", err.message);
}

// Get airports for airport autocomplete
exports.getAirports = (req, res) => {
  const query = req.query.q?.toLowerCase() || "";

  if (!query) {
    return res.status(400).json({ error: "Query parameter 'q' is required." });
  }

  const matches = airports
    .filter((airport) => {
      const name = airport.name?.toLowerCase() || "";
      const municipality = airport.municipality?.toLowerCase() || "";
      return name.includes(query) || municipality.includes(query);
    })
    .slice(0, 5)
    .map((airport) => ({
      label: `${airport.name} (${airport.iata_code})`,
      value: airport.iata_code,
    }));

  res.json(matches);
};

// Get flight form serpAPI
exports.getFlights = async (req, res) => {
  const {
    from,
    to,
    outbound,
    returnDate,
    flightType,
    travelClass,
    stops,
    airlines,
    departureToken,
  } = req.query;
  try {
    console.log(outbound, returnDate, flightType, departureToken);
    const response = await axios.get("https://serpapi.com/search.json", {
      params: {
        engine: "google_flights",
        departure_id: from.toUpperCase(),
        arrival_id: to.toUpperCase(),
        outbound_date: outbound,
        return_date: returnDate || undefined,
        type: flightType || "1",
        travel_class: travelClass || "1",
        include_airlines: airlines || undefined,
        stops: stops || "0",
        departure_token: departureToken || undefined,
        currency: "USD",
        hl: "en",
        api_key: SERP_API_KEY,
      },
    });
    console.log("SerpAPI response received.", response.data.search_parameters);
    console.log("=======================================");
    const data = response.data;
    const frontEndResponse = {
      status: data?.search_metadata?.status || "Error",
      total:
        (Array.isArray(data.best_flights) ? data.best_flights.length : 0) +
        (Array.isArray(data.other_flights) ? data.other_flights.length : 0),
      flights: {
        best: data?.best_flights || [],
        other: data?.other_flights || [],
      },
      price_insights: {
        lowest_price: data?.price_insights?.lowest_price || 0,
        price_level: data?.price_insights?.price_level || "not_available",
        typical_price_range: data?.price_insights?.typical_price_range || [],
      },
    };

    if (frontEndResponse.status !== "Success") {
      return res.status(404).json({
        status: frontEndResponse.status,
        error: "No flights found",
        debug: {
          serp_raw: data,
        },
      });
    }
    console.log("status: ", frontEndResponse.status);
    res.json(frontEndResponse);
  } catch (error) {
    console.error("SerpAPI Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch flight data" });
  }
};

exports.getSelectedFlights = async (req, res) => {
  const {
    from,
    to,
    outbound,
    returnDate,
    flightType,
    travelClass,
    stops,
    airlines,
    bookingToken,
  } = req.query;
  try {
    console.log(outbound, returnDate, flightType, bookingToken);
    const response = await axios.get("https://serpapi.com/search.json", {
      params: {
        engine: "google_flights",
        departure_id: from.toUpperCase(),
        arrival_id: to.toUpperCase(),
        outbound_date: outbound,
        return_date: returnDate || undefined,
        type: flightType || "1",
        travel_class: travelClass || "1",
        include_airlines: airlines || undefined,
        stops: stops || "0",
        booking_token: bookingToken || undefined,
        currency: "USD",
        hl: "en",
        api_key: SERP_API_KEY,
      },
    });
    console.log("SerpAPI response received.", response.data.search_parameters);
    console.log("=======================================");
    const data = response.data;
    const frontEndResponse = {
      status: data?.search_metadata?.status || "Error",
      selectedFlights: data?.selected_flights || [],
      bookingOptions: data?.booking_options || [],
      baggagePrices: data?.baggage_prices || {},
      priceInsights: data?.price_insights || {},
    };

    if (frontEndResponse.status !== "Success") {
      return res.status(404).json({
        status: frontEndResponse.status,
        error: "No flights found",
        debug: {
          serp_raw: data,
        },
      });
    }

    res.json(frontEndResponse);
  } catch (error) {
    console.error("SerpAPI Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch flight data" });
  }
};

exports.saveSelectedFlights = async (req, res) => {
  try {
    const { tripId, searchParameters } = req.body;
    console.log("backend reached trip id: ", tripId);
    console.log("selectedFlights: ", searchParameters);
    if (!tripId || !searchParameters) {
      return res.status(400).json({
        success: false,
        error: "Trip ID and parametersbooking options are required.",
      });
    }

    const savedFlight = await MinimalFlightsModel.create({
      tripId,
      searchParameters,
    });
    if (savedFlight) {
      console.log("BE saved");
    } else {
      console.log("BE failed to save");
    }

    return res.status(201).json({
      success: true,
      message: "Selected flights saved successfully.",
      data: savedFlight,
    });
  } catch (error) {
    console.error("Error saving selected flights:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while saving selected flights." });
  }
};
