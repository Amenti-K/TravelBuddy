import React from "react";
import { Button, Text, Box, Group, Stack } from "@mantine/core";
import ProfileAvatarComp from "../custom/ProfileAvatarComp";

const BookFlight = ({ bookingOption }) => {
  const { separate_tickets, departing, together } = bookingOption;

  const activeOption = separate_tickets ? departing : together;
  const { book_with, airline_logos, local_prices, price, booking_request } =
    activeOption;

  const currency = local_prices?.currency || "USD";
  const localPrice = local_prices?.price || price;

  const handleBooking = () => {
    const { url, post_data } = booking_request;
    const params = new URLSearchParams(post_data);
    const queryString = params.toString();
    const fullUrl = `${url}?${queryString}`;
    window.open(fullUrl, "_blank");
  };

  return (
    <Box
      className="w-full"
      p="md"
      bg="white"
      style={{
        borderRadius: "0.75rem",
        boxShadow:
          "0 1px 3px rgba(0, 0, 0, 0.1), 0 2px 6px rgba(0, 0, 0, 0.08)",
        transition: "box-shadow 0.3s ease",
      }}
    >
      <Group position="apart" align="center" spacing="md" noWrap>
        {/* Airline Info */}
        <Group spacing="sm" noWrap>
          <ProfileAvatarComp name={book_with} picture={airline_logos} />
          <Text size="md" weight={500}>
            Book with {book_with}
          </Text>
        </Group>

        {/* Price and CTA */}
        <Group spacing="lg" align="center" noWrap>
          <Stack spacing={0} align="end">
            <Text size="lg" weight={600}>
              {currency} {localPrice}
            </Text>
            <Text size="xs" color="dimmed">
              Final Price
            </Text>
          </Stack>
          {booking_request && (
            <Button
              variant="outline"
              color="blue"
              size="sm"
              radius="xl"
              onClick={handleBooking}
            >
              Continue
            </Button>
          )}
        </Group>
      </Group>
    </Box>
  );
};

export default BookFlight;
