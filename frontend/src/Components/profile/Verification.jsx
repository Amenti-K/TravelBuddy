import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Paper,
  Text,
  Button,
  Stack,
  Group,
  Image,
  FileButton,
  Alert,
  Loader,
  Center,
  Badge,
} from "@mantine/core";
import { FiUpload, FiCheck, FiAlertCircle, FiClock, FiX } from "react-icons/fi";
import { useMutation, useQuery } from "@tanstack/react-query";
import { uploadVerificationImages, getVerificationStatus } from "../../Api/verification.api";
import { convertToFormData, validateFileSize, validateFileType, handleApiError } from "../../utils/helper.api";

const Verification = () => {
  const navigate = useNavigate();
  const [primaryImage, setPrimaryImage] = useState(null);
  const [secondaryImage, setSecondaryImage] = useState(null);
  const [error, setError] = useState("");

  // Fetch existing verification status
  const { data: verificationStatus, isLoading: isLoadingStatus } = useQuery({
    queryKey: ["verificationStatus"],
    queryFn: async () => {
      const response = await fetch("/api/verification/status", {
        credentials: "include",
      });
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error("Failed to fetch verification status");
      }
      return response.json();
    },
  });

  const { mutate: submitVerification, isLoading } = useMutation({
    mutationFn: (formData) => uploadVerificationImages(formData),
    onSuccess: () => {
      navigate("/profile");
    },
    onError: (error) => {
      if (error.message?.includes("pending verification request")) {
        setError("You already have a pending verification request. Please wait for it to be reviewed.");
      } else {
        setError(handleApiError(error));
      }
    },
  });

  const handleSubmit = () => {
    if (!primaryImage) {
      setError("Primary image is required");
      return;
    }

    // Create FormData object
    const formData = new FormData();
    
    // Append files to FormData
    formData.append("primary_image", primaryImage);
    if (secondaryImage) {
      formData.append("secondary_image", secondaryImage);
    }

    // Log FormData contents for debugging
    console.log("FormData contents:");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    submitVerification(formData);
  };

  const handleImageChange = (file, type) => {
    if (file) {
      if (!validateFileSize(file)) {
        setError("Image size should be less than 5MB");
        return;
      }
      if (!validateFileType(file)) {
        setError("Please upload a valid image file (JPEG, PNG, JPG)");
        return;
      }
      setError("");
      if (type === "primary") {
        setPrimaryImage(file);
      } else {
        setSecondaryImage(file);
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge color="yellow" size="lg" leftSection={<FiClock size={14} />}>
            Pending Review
          </Badge>
        );
      case "approved":
        return (
          <Badge color="green" size="lg" leftSection={<FiCheck size={14} />}>
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge color="red" size="lg" leftSection={<FiX size={14} />}>
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  if (isLoadingStatus) {
    return (
      <Center className="min-h-screen">
        <Loader size="xl" />
      </Center>
    );
  }

  // If there's an existing verification, show its status
  if (verificationStatus?.verification) {
    const { verification } = verificationStatus;
    return (
      <Center className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-teal-900 p-4">
        <Paper
          radius="xl"
          withBorder
          p="xl"
          w={600}
          className="shadow-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm"
        >
          <Stack spacing="xl">
            <Text
              size="2xl"
              fw={700}
              className="text-center text-emerald-600 dark:text-emerald-400"
            >
              Verification Status
            </Text>

            <div className="text-center">
              {getStatusBadge(verification.status)}
            </div>

            {verification.status === "pending" && (
              <Alert
                icon={<FiClock size={16} />}
                title="Verification Pending"
                color="yellow"
                variant="light"
              >
                Your verification request is being reviewed. We'll notify you once it's complete.
              </Alert>
            )}

            {verification.status === "rejected" && (
              <Alert
                icon={<FiX size={16} />}
                title="Verification Rejected"
                color="red"
                variant="light"
              >
                {verification.rejection_reason || "Your verification request was rejected. Please try again with clearer images."}
              </Alert>
            )}

            {verification.status === "approved" && (
              <Alert
                icon={<FiCheck size={16} />}
                title="Verification Approved"
                color="green"
                variant="light"
              >
                Your account has been verified successfully!
              </Alert>
            )}

            <Group position="center" mt="xl">
              <Button
                variant="light"
                onClick={() => navigate("/profile")}
                className="text-gray-600 dark:text-gray-300"
              >
                Back to Profile
              </Button>
              {verification.status === "rejected" && (
                <Button
                  onClick={() => window.location.reload()}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                >
                  Try Again
                </Button>
              )}
            </Group>
          </Stack>
        </Paper>
      </Center>
    );
  }

  // If no existing verification, show the upload form
  return (
    <Center className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-teal-900 p-4">
      <Paper
        radius="xl"
        withBorder
        p="xl"
        w={600}
        className="shadow-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm"
      >
        <Stack spacing="xl">
          <Text
            size="2xl"
            fw={700}
            className="text-center text-emerald-600 dark:text-emerald-400"
          >
            Identity Verification
          </Text>

          <Text size="sm" className="text-gray-600 dark:text-gray-300">
            Please upload clear images of your identification documents for verification.
            The primary image is required, while the secondary image is optional.
          </Text>

          {error && (
            <Alert
              icon={<FiAlertCircle size={16} />}
              title="Error"
              color="red"
              variant="filled"
            >
              {error}
            </Alert>
          )}

          <Stack spacing="md">
            {/* Primary Image Upload */}
            <div className="space-y-2">
              <Text fw={500} size="sm">
                Primary Image (Required)
              </Text>
              <div className="border-2 border-dashed border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
                {primaryImage ? (
                  <div className="relative">
                    <Image
                      src={URL.createObjectURL(primaryImage)}
                      alt="Primary verification"
                      className="rounded-lg"
                    />
                    <Button
                      variant="light"
                      color="red"
                      size="xs"
                      className="absolute top-2 right-2"
                      onClick={() => setPrimaryImage(null)}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <FileButton
                    onChange={(file) => handleImageChange(file, "primary")}
                    accept="image/*"
                  >
                    {(props) => (
                      <Button
                        {...props}
                        variant="light"
                        leftIcon={<FiUpload size={20} />}
                        className="w-full"
                      >
                        Upload Primary Image
                      </Button>
                    )}
                  </FileButton>
                )}
              </div>
            </div>

            {/* Secondary Image Upload */}
            <div className="space-y-2">
              <Text fw={500} size="sm">
                Secondary Image (Optional)
              </Text>
              <div className="border-2 border-dashed border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
                {secondaryImage ? (
                  <div className="relative">
                    <Image
                      src={URL.createObjectURL(secondaryImage)}
                      alt="Secondary verification"
                      className="rounded-lg"
                    />
                    <Button
                      variant="light"
                      color="red"
                      size="xs"
                      className="absolute top-2 right-2"
                      onClick={() => setSecondaryImage(null)}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <FileButton
                    onChange={(file) => handleImageChange(file, "secondary")}
                    accept="image/*"
                  >
                    {(props) => (
                      <Button
                        {...props}
                        variant="light"
                        leftIcon={<FiUpload size={20} />}
                        className="w-full"
                      >
                        Upload Secondary Image
                      </Button>
                    )}
                  </FileButton>
                )}
              </div>
            </div>
          </Stack>

          <Group position="apart" mt="xl">
            <Button
              variant="light"
              onClick={() => navigate("/profile")}
              className="text-gray-600 dark:text-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!primaryImage || isLoading}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
              leftIcon={isLoading ? <Loader size="sm" /> : <FiCheck size={20} />}
            >
              {isLoading ? "Submitting..." : "Submit for Verification"}
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Center>
  );
};

export default Verification; 