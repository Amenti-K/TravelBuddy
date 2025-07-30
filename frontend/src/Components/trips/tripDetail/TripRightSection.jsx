import React, { useState } from "react";
import TripMapAndActions from "./rightSection/TripMapAndActions";
import ChatRoom from "../../chat/ChatRoom";
import Requests from "./rightSection/Requests";

const TripRightSection = ({
  callerType,
  tripId,
  trip,
  onJoinTrip,
  onCancelRequest,
  startingLocation,
  destinationLocation,
}) => {
  const [selectedTab, setSelectedTab] = useState("map");

  const renderTabButtons = () => {
    const buttons = [];

    if (["participant", "organizer"].includes(callerType)) {
      buttons.push({ id: "map", label: "Map" });
      buttons.push({ id: "chat", label: "Chat" });
    }

    if (callerType === "organizer") {
      buttons.push({ id: "requests", label: "Requests" });
    }

    return (
      <div className="flex space-x-2 mb-4">
        {buttons.map((btn) => (
          <button
            key={btn.id}
            className={`px-3 py-1 rounded-lg text-sm font-medium ${
              selectedTab === btn.id
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
            }`}
            onClick={() => setSelectedTab(btn.id)}
          >
            {btn.label}
          </button>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    if (callerType === "none" || callerType === "pending") {
      return (
        <TripMapAndActions
          pictures={trip.trip_pictures}
          callerType={callerType}
          tripId={tripId}
          startingLocation={startingLocation}
          destinationLocation={destinationLocation}
        />
      );
    }

    switch (selectedTab) {
      case "map":
        return (
          <TripMapAndActions
            pictures={trip.trip_pictures}
            callerType={callerType}
            tripId={tripId}
            startingLocation={startingLocation}
            destinationLocation={destinationLocation}
          />
        );
      case "chat":
        return <ChatRoom tripId={trip.tripId} />;
      case "requests":
        return <Requests tripId={tripId} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-full sticky top-0 self-start h-fit md:min-h-screen bg-white p-4 border-t lg:border-t-0 lg:border-l border-gray-200">
      {["participant", "organizer"].includes(callerType) && renderTabButtons()}
      {renderContent()}
    </div>
  );
};

export default TripRightSection;
