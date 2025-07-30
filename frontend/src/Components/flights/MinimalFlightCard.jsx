import React from "react";
import { Card, Text, Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { AiOutlineArrowRight, AiOutlineSwap } from "react-icons/ai";

const MinimalFlightCard = ({ minimalFlight }) => {
  const navigate = useNavigate();
  const { searchParameters } = minimalFlight;

  const handleViewDetails = () => {
    navigate("/flights/selected", {
      state: {
        selected: true,
        payload: searchParameters,
      },
    });
  };

  return (
    <Card
      withBorder
      shadow="sm"
      // className="w-full flex flex-row justify-between items-center hover:shadow-md transition-shadow duration-200 bg-white dark:bg-zinc-900"
    >
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col gap-2">
          <Text size="lg" className="flex items-center justify-center gap-2">
            {searchParameters.from}{" "}
            {searchParameters.flightType === 1 ? (
              <AiOutlineArrowRight />
            ) : (
              <AiOutlineSwap />
            )}{" "}
            {searchParameters.to}
          </Text>
          <Text size="sm" color="dimmed">
            {searchParameters.flightType === 1 ? "One Way" : "Round Trip"} .{" "}
            {searchParameters.travelClass === 1 ? "Economy" : "Business"}
          </Text>
        </div>

        <div className="flex flex-col gap-0 items-center">
          <Text size="lg">
            {dayjs(searchParameters.outbound).format("ddd, MMM D")}
          </Text>

          {searchParameters.returnDate && (
            <>
              <Text size="sm" color="dimmed">
                to
              </Text>
              <Text size="lg">
                {dayjs(searchParameters.returnDate).format("ddd, MMM D")}
              </Text>
            </>
          )}
        </div>

        <Button
          variant="outline"
          // color="blue"
          size="sm"
          onClick={handleViewDetails}
          className="hover:text-white"
        >
          View Flight Details
        </Button>
      </div>
    </Card>
  );
};

export default MinimalFlightCard;
