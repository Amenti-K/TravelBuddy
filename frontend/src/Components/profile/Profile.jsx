import { useSelector } from "react-redux";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Paper,
  Text,
  Stack,
  Loader,
  Center,
  Group,
  Badge,
  Divider,
  Anchor,
  Modal,
} from "@mantine/core";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import {
  FiMapPin,
  FiCalendar,
  FiUser,
  FiEdit2,
  FiShare2,
  FiLink,
} from "react-icons/fi";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaGlobe,
} from "react-icons/fa";
import "react-circular-progressbar/dist/styles.css";
import { getSoloTravelerProfile } from "../../Api/soloTraveler.api";
import { getTravelAgencyProfile } from "../../Api/travelAgency.api";
import { updateTravelAgencyProfile } from "../../Api/travelAgency.api";
import { updateSoloTravelerProfile } from "../../Api/soloTraveler.api";
import EditProfileForm from "./EditProfileForm";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const fetchUserProfile = async (user_type, id) => {
  if (!user_type || !id) throw new Error("Missing user type or ID");

  try {
    if (user_type === "agency") {
      const res = await getTravelAgencyProfile(id);
      return res.profile;
    } else {
      const res = await getSoloTravelerProfile(id);
      return res.profile;
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

const updateUserProfile = async (user_type, profileId, payload) => {
  if (!user_type || !profileId) throw new Error("Missing user type or ID");
  try {
    if (user_type === "agency") {
      const res = await updateTravelAgencyProfile(profileId, payload);
      return res.profile;
    } else {
      const res = await updateSoloTravelerProfile(profileId, payload);
      return res.profile;
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

const Profile = () => {
  const navigate = useNavigate();
  const { user_type, user_id, agency_id } = useSelector(
    (state) => state.auth.userProfile
  );
  const profileId = user_type === "agency" ? agency_id : user_id;
  const [editModalOpen, setEditModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["userProfile", user_type, profileId],
    queryFn: () => fetchUserProfile(user_type, profileId),
    enabled: !!user_type && !!profileId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: true,
  });

  // Mutation for updating user profile
  const updateProfileMutation = useMutation({
    mutationFn: (payload) => updateUserProfile(user_type, profileId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userProfile", user_type, profileId],
      });
      setEditModalOpen(false);
    },
  });
  const handelUpdateMutation = async (payload) => {
    return new Promise((resolve, reject) => {
      updateProfileMutation.mutate(payload, {
        onSuccess: () => {
          setEditModalOpen(false);
          resolve();
        },
        onError: reject,
      });
    });
  };

  if (isLoading) {
    return (
      <Center className="h-screen">
        <Loader size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center className="h-screen">
        <Stack align="center" spacing="md">
          <Text color="red" align="center" size="lg">
            Error loading profile data
          </Text>
          <Button onClick={() => refetch()} color="blue">
            Retry
          </Button>
        </Stack>
      </Center>
    );
  }

  if (!user) {
    return (
      <Center className="h-screen">
        <Stack align="center" spacing="md">
          <Text color="red" align="center" size="lg">
            No profile data found
          </Text>
          <Button onClick={() => navigate("/profile/creation")} color="blue">
            Create Profile
          </Button>
        </Stack>
      </Center>
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
  const trust_score = user.trust_score || 0;

  // Color logic
  const getTrustColor = (score) => {
    if (score <= 40) return "#f87171";
    if (score <= 80) return "#facc15";
    return "#4ade80";
  };

  const getSocialIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case "facebook":
        return <FaFacebook size={20} />;
      case "twitter":
        return <FaTwitter size={20} />;
      case "instagram":
        return <FaInstagram size={20} />;
      case "linkedin":
        return <FaLinkedin size={20} />;
      case "website":
        return <FaGlobe size={20} />;
      default:
        return <FiLink size={20} />;
    }
  };

  return (
    <Center className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 pt-24">
      <Paper
        radius="2xl"
        withBorder
        p="xl"
        w={800}
        className="shadow-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm transition-all duration-300 hover:shadow-3xl border-emerald-100 dark:border-emerald-900 mt-16"
      >
        {/* Header Section with Background Pattern */}
        <div className="relative bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-8 mb-24">
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
            <div className="relative">
              <Avatar
                src={profile_picture || null}
                size={200}
                radius={200}
                className="shadow-2xl border-4 border-white dark:border-gray-800 ring-4 ring-emerald-500/20 dark:ring-emerald-500/30"
              >
                {!profile_picture && fullName[0]?.toUpperCase()}
              </Avatar>
            </div>
          </div>

          <div className="pt-32 text-center">
            <Text
              size="2xl"
              fw={800}
              className="text-gray-800 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600"
            >
              {fullName}
            </Text>
            <Group position="center" spacing="xs" mt={4}>
              <FiMapPin className="text-emerald-500" />
              <Text size="lg" className="text-gray-200 dark:text-gray-300">
                {location}
              </Text>
            </Group>
          </div>
        </div>

        {/* Trust Score Section */}
        <div className="flex justify-center mt-8">
          <div className="w-40 h-40 relative group">
            <CircularProgressbar
              value={trust_score}
              text={`${trust_score}%`}
              styles={buildStyles({
                pathColor: getTrustColor(trust_score),
                textColor: getTrustColor(trust_score),
                trailColor: "#374151", // dark gray for trail in dark mode
                textSize: "24px",
                strokeWidth: 10,
              })}
              className="transform group-hover:scale-105 transition-transform duration-300"
            />
            <Text
              align="center"
              className="text-lg font-semibold text-emerald-400 dark:text-emerald-400 mt-4"
            >
              Trust Score
            </Text>
          </div>
        </div>

        <Divider
          my="xl"
          className="border-emerald-200 dark:border-emerald-700"
        />

        {/* User Details Section */}
        <Stack spacing="xl" className="text-gray-200 dark:text-gray-300">
          {bio && (
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-6 rounded-xl shadow-sm">
              <Text
                size="md"
                className="italic text-gray-300 dark:text-gray-400 leading-relaxed"
              >
                {bio}
              </Text>
            </div>
          )}

          <Group spacing="xl" className="justify-center">
            {gender && (
              <Group
                spacing="xs"
                className="bg-emerald-800/40 dark:bg-emerald-900/40 px-4 py-2 rounded-full"
              >
                <FiUser className="text-emerald-400" />
                <Text size="md" className="text-gray-200 dark:text-gray-300">
                  {gender}
                </Text>
              </Group>
            )}
            {dob && (
              <Group
                spacing="xs"
                className="bg-emerald-800/40 dark:bg-emerald-900/40 px-4 py-2 rounded-full"
              >
                <FiCalendar className="text-emerald-400" />
                <Text size="md" className="text-gray-200 dark:text-gray-300">
                  {dob}
                </Text>
              </Group>
            )}
          </Group>

          {interests.length > 0 && (
            <div className="bg-gray-900/60 dark:bg-gray-800/60 p-6 rounded-xl shadow-sm">
              <Text
                fw={700}
                size="lg"
                mb="md"
                className="text-emerald-400 dark:text-emerald-400"
              >
                Interests
              </Text>
              <Group spacing="xs">
                {interests.map((interest, index) => (
                  <Badge
                    key={index}
                    size="xl"
                    radius="xl"
                    variant="light"
                    className="bg-emerald-900/20 text-emerald-400 px-4 py-2 text-sm font-medium hover:bg-emerald-800/30 dark:hover:bg-emerald-700/30 transition-colors"
                  >
                    {interest}
                  </Badge>
                ))}
              </Group>
            </div>
          )}

          {/* Social Media Section */}
          <div className="bg-gray-900/60 dark:bg-gray-800/60 p-6 rounded-xl shadow-sm">
            <Text
              fw={700}
              size="lg"
              mb="md"
              className="text-emerald-400 dark:text-emerald-400"
            >
              Social Media & Links
            </Text>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {social_media && social_media.length > 0 ? (
                social_media.map((platform, index) => {
                  const platformName = platform.toLowerCase();
                  const platformUrl = user[`${platformName}_url`] || "";

                  return (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 rounded-lg bg-emerald-900/20 dark:bg-emerald-900/30 hover:bg-emerald-800/30 dark:hover:bg-emerald-800/40 transition-colors"
                    >
                      <div className="p-2 rounded-full bg-gray-800 dark:bg-gray-900 shadow-sm">
                        {(() => {
                          switch (platformName) {
                            case "facebook":
                              return (
                                <FaFacebook
                                  size={20}
                                  className="text-blue-600"
                                />
                              );
                            case "twitter":
                              return (
                                <FaTwitter size={20} className="text-sky-500" />
                              );
                            case "instagram":
                              return (
                                <FaInstagram
                                  size={20}
                                  className="text-pink-600"
                                />
                              );
                            case "linkedin":
                              return (
                                <FaLinkedin
                                  size={20}
                                  className="text-blue-700"
                                />
                              );
                            case "website":
                              return (
                                <FaGlobe
                                  size={20}
                                  className="text-emerald-500"
                                />
                              );
                            default:
                              return (
                                <FiLink
                                  size={20}
                                  className="text-emerald-500"
                                />
                              );
                          }
                        })()}
                      </div>
                      <div className="flex-1">
                        <Text
                          size="sm"
                          fw={500}
                          className="text-gray-300 dark:text-gray-400"
                        >
                          {platformName.charAt(0).toUpperCase() +
                            platformName.slice(1)}
                        </Text>
                        {platformUrl ? (
                          <Anchor
                            href={platformUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-emerald-400 dark:text-emerald-400 hover:underline"
                          >
                            {platformUrl}
                          </Anchor>
                        ) : (
                          <Text
                            size="sm"
                            className="text-gray-500 dark:text-gray-400 italic"
                          >
                            Not provided
                          </Text>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-2 text-center py-6">
                  <Text size="sm" className="text-gray-500 dark:text-gray-400">
                    No social media links available
                  </Text>
                </div>
              )}
            </div>
          </div>
        </Stack>

        {/* Action Buttons */}
        <Group position="apart" mt="xl" className="px-4">
          <Button
            variant="light"
            leftSection={<FiEdit2 size={20} />}
            onClick={() => setEditModalOpen(true)}
            className="bg-emerald-900/20 text-emerald-400 hover:bg-emerald-800/30 px-6 py-2 rounded-full text-lg font-medium transition-all duration-300"
          >
            Edit Profile
          </Button>
          <Group spacing="md">
            <Button
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-2 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => navigate("/profile/verification")}
            >
              Verification
            </Button>
          </Group>
        </Group>
      </Paper>
      <Modal
        opened={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Profile"
        size="lg"
        centered
      >
        <EditProfileForm
          userValues={user}
          isAgency={!!user.office_location}
          onSubmit={handelUpdateMutation}
          loading={updateProfileMutation.isLoading}
        />
      </Modal>
    </Center>
  );
};

export default Profile;
