import React, { useState } from "react";
import { Card, Image, Text, Badge, Group } from "@mantine/core";
import { useNavigate, useLocation } from "react-router-dom";
import dayjs from "dayjs";

const categoriesMap = {
  adventure: { emoji: "🏞️", label: "Adventure" },
  beach: { emoji: "🏖️", label: "Beach" },
  historical: { emoji: "🏰", label: "Historical" },
  nature: { emoji: "🌿", label: "Nature" },
  luxury: { emoji: "💎", label: "Luxury" },
  budget: { emoji: "💰", label: "Budget" },
};

const TripsCard = ({
  id,
  trip_name,
  trip_description,
  destination,
  departure_date,
  returning_date,
  agency_fee,
  category,
  trip_pictures,
  selectable = { selectable: false, onSelectTrip: () => {} },
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const image = Array.isArray(trip_pictures)
    ? trip_pictures.length > 0
      ? trip_pictures[0]
      : "https://res.cloudinary.com/dhgcbrxbw/image/upload/v1742637666/cld-sample-2.jpg"
    : "https://res.cloudinary.com/dhgcbrxbw/image/upload/v1742637666/cld-sample-2.jpg";

  const handleClick = () => {
    if (selectable.selectable && selectable.onSelectTrip) {
      selectable.onSelectTrip(id);
      return;
    } else {
      const baseRoute = location.pathname.includes("my-trips")
        ? "/my-trips"
        : "/discover";
      navigate(`${baseRoute}/${id}`);
    }
  };

  const duration = dayjs(returning_date).diff(dayjs(departure_date), "day");
  const formattedDeparture = dayjs(departure_date).format("DD-MM");

  return (
    <Card
      shadow="md"
      radius="md"
      p="md"
      className={`${
        selectable.selectedTripId === id ? "border-5 border-blue-400" : ""
      } flex-1 cursor-pointer transition-transform hover:scale-[1.02] max-w-sm w-full`}
      onClick={handleClick}
    >
      <Card.Section>
        <Image
          src={image}
          alt={trip_name}
          className="w-full object-cover rounded-t-md h-[30vw] max-h-[200px] min-h-[140px]"
          radius="md"
        />
      </Card.Section>

      <Card.Section className="p-2 sm:p-4 py-2">
        <Group
          justify="space-between"
          className="flex justify-between items-center"
        >
          <h1 className="text-sm sm:text-base md:text-lg  truncate">
            {trip_name}
          </h1>
          {agency_fee > 0 && (
            <Badge size="lg" variant="light">
              ${agency_fee}
            </Badge>
          )}
        </Group>
        <Group>
          <h4 className="text-xs sm:text-sm text-right text-gray-600">To</h4>
          <Badge size="md" variant="light">
            {destination}
          </Badge>
        </Group>

        <h2 className="text-xs sm:text-sm text-gray-600 line-clamp-2">
          {trip_description}
        </h2>

        <h2 className="text-xs sm:text-sm text-gray-900 mt-2">
          From <span className="font-medium">{formattedDeparture}</span> for{" "}
          {duration} days
        </h2>

        {Array.isArray(category) && category.length > 0 && (
          <Group gap={6} mt={3} className="flex flex-wrap gap-2">
            {category.map((cat) =>
              categoriesMap[cat.toLowerCase()] ? (
                <Badge
                  key={cat}
                  variant="light"
                  size="sm"
                  leftSection={categoriesMap[cat.toLowerCase()].emoji}
                >
                  {categoriesMap[cat.toLowerCase()].label}
                </Badge>
              ) : null
            )}
          </Group>
        )}
      </Card.Section>
    </Card>
  );
};

export default TripsCard;
