const Trip = require("../models/Trip.model");
const TripParticipants = require("../models/TripParticipants.model");
const SoloTraveler = require("../models/SoloTraveler.model");
const TravelAgency = require("../models/TravelAgency.model");
const MinimalFlights = require("../models/Flight/MinimalFlights.model");
const {
  getMinimalUserProfile,
  findAndMinimal,
} = require("../utils/userProfile");
const { createTripGroupChat } = require("../utils/chatServiceHelper");

// Create a new trip
exports.createTrip = async (req, res) => {
  try {
    const userExists =
      (await SoloTraveler.userExists(req.body.organizer_id)) ||
      (await TravelAgency.agencyExists(req.body.organizer_id));
    if (!userExists) return res.status(404).json({ message: "User not found" });
    const uploadedTripPictures = [];
    let uploadErrors = [];
    // Parse potential array or JSON fields
    const formattedData = {
      ...req.body,
      path: Array.isArray(req.body.path)
        ? req.body.path
        : JSON.parse(req.body.path || "[]"),
      category: Array.isArray(req.body.category)
        ? req.body.category
        : JSON.parse(req.body.category || "[]"),
      activities: Array.isArray(req.body.activities)
        ? req.body.activities
        : JSON.parse(req.body.activities || "[]"),
      transportation: Array.isArray(req.body.transportation)
        ? req.body.transportation
        : JSON.parse(req.body.transportation || "[]"),
      packing_list: Array.isArray(req.body.packing_list)
        ? req.body.packing_list
        : JSON.parse(req.body.packing_list || "[]"),
      required_documents: Array.isArray(req.body.required_documents)
        ? req.body.required_documents
        : JSON.parse(req.body.required_documents || "[]"),
    };

    if (req.files?.trip_pictures) {
      try {
        for (const file of req.files?.trip_pictures) {
          uploadedTripPictures.push(file.path);
        }
        formattedData.trip_pictures = uploadedTripPictures;
      } catch {
        uploadErrors.push(
          "Failed to upload new profile picture. Try again later."
        );
      }
    }

    // Create the trip with all data
    const trip = await Trip.create(formattedData);
    const participants = await TripParticipants.create({
      trip_id: trip._id,
      participants: [],
    });
    await createTripGroupChat(trip);

    const response = {
      success: true,
      message: "Trip created successfully",
      trip: await trip.getFullDetails(),
      participants: participants?.participants || [],
    };
    if (uploadErrors.length > 0) {
      response.warning = uploadErrors;
    }

    res.status(201).json(response);
  } catch (error) {
    for (const file of uploadedTripPictures) {
      try {
        await deleteImage(file);
      } catch (err) {
        console.error(`Failed to delete ${file}: ${err.message}`);
      }
    }

    res.status(500).json({ message: error.message });
  }
};

// Get trip details (using params)
exports.getTrip = async (req, res) => {
  try {
    const { trip_id } = req.params;
    const user = req.user;
    const user_id = user._id.toString();

    const trip = await Trip.findById(trip_id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    const isOrganizer = trip.organizer_id.toString() === user_id;

    const participantsData = await TripParticipants.findOne({ trip_id });
    const participants = participantsData?.participants || [];
    const approvedParticipants = participants.filter(
      (p) => p.status === "approved"
    );

    const userParticipant = participants.find(
      (p) => p.user_id.toString() === user_id
    );
    const isApprovedParticipant = userParticipant?.status === "approved";
    const isPendingParticipant = userParticipant?.status === "pending";

    const minimalFlight = isOrganizer
      ? await MinimalFlights.findOne({
          tripId: trip._id,
        })
      : null;

    // Determine what data to send based on user role
    let responseTrip = isOrganizer
      ? {
          caller_type: "organizer",
          trip: await trip.getFullDetails(),
          organizer: await findAndMinimal(trip.organizer_id),
          participants: approvedParticipants,
          participantCount: approvedParticipants.length,
          minimalFlight: minimalFlight || null,
        }
      : isApprovedParticipant
      ? {
          caller_type: "participant",
          trip: trip,
          organizer: await findAndMinimal(trip.organizer_id),
          participantCount: approvedParticipants.length,
        }
      : {
          caller_type: isPendingParticipant ? "pending" : "none",
          trip: await trip.getLessDetails(),
          organizer: await findAndMinimal(trip.organizer_id),
          participantCount: approvedParticipants.length,
        };

    res.json(responseTrip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get trips created by a user (using query instead of body)
exports.getMyCreatedTrips = async (req, res) => {
  try {
    const user_id = req.user._id;
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);
    const skip = (page - 1) * limit;

    if (!user_id)
      return res.status(400).json({ message: "User ID is required" });

    const trips = await Trip.getTrips(
      { organizer_id: user_id },
      { skip, limit }
    );
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.discoverOrFindTrips = async (req, res) => {
  try {
    const userAuthInfo = req.user;
    const { page, limit = 5, ...queryFilters } = req.query;
    const skip = (page - 1) * limit;

    const userProfile = await getMinimalUserProfile(userAuthInfo);
    let filters = queryFilters;
    // Only apply personalization if no query filters are given
    if (Object.keys(queryFilters).length === 0 && userProfile) {
      filters = {
        category: userProfile.interests || [],
        destination: userProfile.location || userProfile.office_location,
        starting_location: userProfile.location || userProfile.office_location,
        path: [userProfile.location || userProfile.office_location],
      };
    }

    const options = {
      discover: true,
      skip,
      limit: Number(limit),
    };

    const trips = await Trip.getTrips(filters, options);
    return res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update trip details
exports.updateTrip = async (req, res) => {
  try {
    const { trip_id } = req.params;
    const { trip_pictures } = req.body;

    const existingTrip = await Trip.findById(trip_id);
    if (!existingTrip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    let updatedTripPictures = existingTrip.trip_pictures || [];
    if (req.files?.trip_pictures) {
      const newFiles = req.files.trip_pictures.map((file) => file.path);
      updatedTripPictures = [...updatedTripPictures, ...newFiles]; // Add new images
    }
    if (trip_pictures) {
      // Logic to include the new profile array
      updatedTripPictures = trip_pictures.filter(
        (pic) => updatedTripPictures.includes(pic) || /^https?:\/\//.test(pic)
      );
    }
    for (const pic of existingTrip.trip_pictures) {
      if (!updatedTripPictures.includes(pic)) {
        await deleteImage(pic);
      }
    }

    // Parse potential array or JSON fields
    const formattedData = {
      ...req.body,
      trip_pictures: updatedTripPictures,
      path: Array.isArray(req.body.path)
        ? req.body.path
        : JSON.parse(req.body.path || "[]"),
      category: Array.isArray(req.body.category)
        ? req.body.category
        : JSON.parse(req.body.category || "[]"),
      activities: Array.isArray(req.body.activities)
        ? req.body.activities
        : JSON.parse(req.body.activities || "[]"),
      transportation: Array.isArray(req.body.transportation)
        ? req.body.transportation
        : JSON.parse(req.body.transportation || "[]"),
      packing_list: Array.isArray(req.body.packing_list)
        ? req.body.packing_list
        : JSON.parse(req.body.packing_list || "[]"),
      required_documents: Array.isArray(req.body.required_documents)
        ? req.body.required_documents
        : JSON.parse(req.body.required_documents || "[]"),
    };

    // Update the trip and return the new version
    const updatedTrip = await Trip.findByIdAndUpdate(trip_id, formattedData, {
      new: true,
    });

    res.json(updatedTrip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete trip (using params)
exports.deleteTrip = async (req, res) => {
  try {
    const { trip_id } = req.params;

    const trip = await Trip.findById(trip_id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    for (const image of trip.trip_pictures) {
      await deleteImage(image);
    }

    await Trip.findByIdAndDelete(trip_id);
    await TripParticipants.findOneAndDelete({ trip_id });

    res.json({ message: "Trip deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
