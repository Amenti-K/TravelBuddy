import React from "react";
import { Card, Text, Badge, Group, Stack, Progress } from "@mantine/core";
import { FaMapMarkerAlt, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import ProfileAvatarComp from "./custom/ProfileAvatarComp";

const UserCard = ({
  user,
  type = "detailed",
  alignment = "left",
  show = true,
}) => {
  if (!show) return null;
  const userID = user.user_id || user.agency_id;
  return (
    <Link to={`/users/${userID}`} className="no-underline text-inherit w-full">
      <Card
        withBorder
        radius="md"
        shadow="sm"
        className="w-full max-w-md bg-white transition duration-300 cursor-pointer hover:shadow-md"
      >
        <Group
          align="flex-start"
          className={`gap-4 ${type === "compact" ? "items-center" : ""}`}
        >
          <ProfileAvatarComp
            name={user.full_name}
            picture={user.profile_picture}
          />
          <Stack
            spacing={type === "compact" ? 2 : "xs"}
            className={`flex-1 ${
              alignment === "center" ? "text-center items-center" : ""
            }`}
          >
            <Text size={type === "compact" ? "sm" : "lg"} weight={600} className="text-gray-900">
              {user.full_name}
            </Text>

            {user.location && type !== "compact" && (
              <Group spacing={6} className="text-sm text-gray-600">
                <FaMapMarkerAlt className="text-red-600" />
                <span>{user.location}</span>
              </Group>
            )}

            {user.bio && type !== "compact" && (
              <Text size="sm" className="text-gray-700">
                {user.bio}
              </Text>
            )}

            {user.interests && type !== "compact" && (
              <Group spacing={6} wrap="wrap">
                {user.interests.map((interest, idx) => (
                  <Badge key={idx} color="blue" variant="light">
                    {interest}
                  </Badge>
                ))}
              </Group>
            )}

            {typeof user.trust_score === "number" && type !== "compact" && (
              <div className="w-full">
                <Group spacing={6} className="text-sm text-gray-600 mb-1">
                  <FaStar className="text-yellow-500" />
                  <Text size="sm">Trust Score: {user.trust_score}%</Text>
                </Group>
                <Progress
                  value={user.trust_score}
                  size="xs"
                  color="yellow"
                  radius="xl"
                />
              </div>
            )}
          </Stack>
        </Group>
      </Card>
    </Link>
  );
};

export default UserCard;
