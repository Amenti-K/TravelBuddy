import React from "react";
import { Avatar } from "@mantine/core";

const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  return parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}` : parts[0][0];
};

const ProfileAvatarComp = ({ name, picture }) => {
  return (
    <>
      {picture ? (
        <Avatar src={picture} alt={name} radius="xl" size="md" />
      ) : (
        <Avatar radius="xl" size="md" color="blue">
          {getInitials(name).toUpperCase()}
        </Avatar>
      )}
    </>
  );
};
export default ProfileAvatarComp;
