import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Paper,
  Text,
  Stack,
  Loader,
  Center,
  Progress,
} from "@mantine/core";
import { getSoloTravelerProfile } from "../Api/soloTraveler.api";
import { getTravelAgencyProfile } from "../Api/travelAgency.api";

const fetchUserProfile = async (user_type, id) => {
  if (!user_type || !id) throw new Error("Missing user type or ID");

  if (user_type === "agency") {
    const res = await getTravelAgencyProfile(id);
    return res.profile;
  } else {
    const res = await getSoloTravelerProfile(id);
    return res.profile;
  }
};

const Confirmation = () => {
  const navigate = useNavigate();
  const { user_type, user_id, agency_id } = useSelector(
    (state) => state.auth.userProfile
  );
  const profileId = user_type === "agency" ? agency_id : user_id;

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userProfile", user_type, profileId],
    queryFn: () => fetchUserProfile(user_type, profileId),
    enabled: !!user_type && !!profileId,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <Center style={{ height: "100vh" }}>
        <Loader />
      </Center>
    );
  }

  if (error || !user) {
    return (
      <Text c="red" ta="center" mt="md">
        type {user_type} id {profileId}
        Error fetching user data or no user found.
      </Text>
    );
  }

  // Normalize fields
  const fullName = user.full_name || user.agency_name || "Unknown Name";
  const location =
    user.location || user.office_location || "Location not available";
  const gender = user.gender;
  const dob = user.date_of_birth;
  const bio = user.bio;
  const profile_picture = user.profile_picture;
  const interests = user.interests || [];
  const social_media = user.social_media || [];
  const trust_score = user.trust_score || 0; // assume number 0-100

  return (
    <Center style={{ height: "100vh" }}>
      <Paper
        radius="md"
        withBorder
        p="lg"
        bg="var(--mantine-color-body)"
        w={400}
      >
        {/* Profile Picture */}
        <Avatar src={profile_picture || null} size={120} radius={120} mx="auto">
          {!profile_picture && fullName[0]?.toUpperCase()}
        </Avatar>

        {/* Name & Location */}
        <Text ta="center" fz="lg" fw={500} mt="md">
          {fullName}
        </Text>
        <Text ta="center" c="dimmed" fz="sm">
          {location}
        </Text>

        {/* Trust Score */}
        <Stack spacing={4} mt="md">
          <Text ta="center" fz="sm">
            Trust Score: {trust_score}%
          </Text>
          <Progress value={trust_score} size="sm" />
        </Stack>

        {/* User Details */}
        <Stack spacing="xs" mt="md">
          {gender && (
            <Text>
              <strong>Gender:</strong> {gender}
            </Text>
          )}
          {dob && (
            <Text>
              <strong>Date of Birth:</strong> {dob}
            </Text>
          )}
          {bio && (
            <Text>
              <strong>Bio:</strong> {bio}
            </Text>
          )}
          <Text>
            <strong>Interests:</strong>{" "}
            {interests.length > 0 ? interests.join(", ") : "None"}
          </Text>
          {social_media.length > 0 && (
            <Text>
              <strong>Social Media:</strong> {social_media.join(", ")}
            </Text>
          )}
        </Stack>
        {/* Buttons */}
        <Button
          variant="default"
          fullWidth
          mt="md"
          onClick={() => navigate("/profile/interests")}
        >
          Back
        </Button>
        <Button
          color="blue"
          fullWidth
          mt="sm"
          onClick={() => navigate("/dashboard")}
        >
          Go to Dashboard
        </Button>
      </Paper>
    </Center>
  );
};

export default Confirmation;
