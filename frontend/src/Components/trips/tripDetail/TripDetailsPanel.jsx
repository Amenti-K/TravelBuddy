import React, { useState, useRef, useEffect } from "react";
import {
  Container,
  SimpleGrid,
  Image,
  Text,
  Group,
  Stack,
  Timeline,
  Checkbox,
  Badge,
  Divider,
  Collapse,
  UnstyledButton,
  Card,
  Title,
  Space,
  Button,
} from "@mantine/core";
import {
  FaUsers,
  FaMapMarkedAlt,
  FaFlag,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClock,
  FaChevronDown,
  FaPlane,
} from "react-icons/fa";
import {
  FiCalendar,
  FiMapPin,
  FiUsers,
  FiDollarSign,
  FiCamera,
  FiPackage,
  FiFileText,
  FiClock,
  FiNavigation,
  FiStar,
  FiCheck,
} from "react-icons/fi";
import {
  IoLocationOutline,
  IoTimeOutline,
  IoBedOutline,
  IoRestaurantOutline,
} from "react-icons/io5";
import { BsDot } from "react-icons/bs";
import dayjs from "dayjs";

import UserCard from "../../UserCard";
import MinimalFlightCard from "../../flights/MinimalFlightCard";

const TripDetailsPanel = ({ trip, organizer, minimalFlight }) => {
  console.log(trip);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [routeHeight, setRouteHeight] = useState(null);
  const routeRef = useRef(null);

  // Set the Date card height equal to Route card height
  useEffect(() => {
    if (routeRef.current) {
      setRouteHeight(routeRef.current.clientHeight);
    }
  }, [trip.path]);

  const getStatusColor = (status) => {
    switch (status) {
      case "ongoing":
        return "bg-success text-success-foreground";
      case "completed":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-primary text-primary-foreground";
    }
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      adventure: <FiNavigation className="w-4 h-4" />,
      beach: <IoLocationOutline className="w-4 h-4" />,
      luxury: <FiStar className="w-4 h-4" />,
      cultural: <FiCamera className="w-4 h-4" />,
    };
    return iconMap[category] || <FiMapPin className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary via-primary-glow to-accent">
        <div className="container mx-auto px-4 py-16">
          {trip.trip_pictures && trip.trip_pictures.length > 0 && (
            <SimpleGrid
              cols={Math.min(trip.trip_pictures.length, 5)}
              spacing="md"
              breakpoints={[
                { maxWidth: "md", cols: 2 },
                { maxWidth: "sm", cols: 1 },
              ]}
              className="mb-8"
            >
              {trip.trip_pictures.map((picture, index) => (
                <Image
                  key={index}
                  src={picture}
                  alt={`Trip picture ${index + 1}`}
                  radius="md"
                  withplaceholder
                  height={180}
                  fit="cover"
                  className="object-cover"
                />
              ))}
            </SimpleGrid>
          )}
          <div className="max-w-4xl mx-auto text-center text-primary-foreground">
            <Badge
              className={`mb-4 ${getStatusColor(trip.trip_status)} border-0`}
            >
              {trip.trip_status.replace("_", " ").toUpperCase()}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {trip.trip_name}
            </h1>
            {trip.trip_description && (
              <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
                {trip.trip_description}
              </p>
            )}
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trip Overview */}
            <Card
              shadow="lg"
              radius="md"
              className="border-0 bg-gradient-to-br from-card to-secondary/10"
            >
              <Card.Section>
                <Group p="md">
                  <FiMapPin className="text-primary" />
                  <Title order={3}>Trip Overview</Title>
                </Group>
              </Card.Section>
              <Card.Section p="md">
                <SimpleGrid
                  cols={2}
                  spacing="md"
                  breakpoints={[{ maxWidth: "md", cols: 1 }]}
                >
                  <Group className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                    <FiCalendar className="text-primary flex-shrink-0" />
                    <div>
                      <Text size="sm" color="dimmed">
                        Departure
                      </Text>
                      <Text weight={500}>
                        {dayjs(trip.departure_date).format("MMM D, YYYY")}
                      </Text>
                    </div>
                  </Group>
                  <Group className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                    <FiCalendar className="text-primary flex-shrink-0" />
                    <div>
                      <Text size="sm" color="dimmed">
                        Return
                      </Text>
                      <Text weight={500}>
                        {dayjs(trip.returning_date).format("MMM D, YYYY")}
                      </Text>
                    </div>
                  </Group>
                  <Group className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                    <IoLocationOutline className="text-primary flex-shrink-0" />
                    <div>
                      <Text size="sm" color="dimmed">
                        From
                      </Text>
                      <Text weight={500}>{trip.starting_location}</Text>
                    </div>
                  </Group>
                  <Group className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                    <FiMapPin className="text-primary flex-shrink-0" />
                    <div>
                      <Text size="sm" color="dimmed">
                        To
                      </Text>
                      <Text weight={500}>{trip.destination}</Text>
                    </div>
                  </Group>
                </SimpleGrid>

                {trip.flexible_dates && (
                  <Group
                    spacing={6}
                    mt="sm"
                    className="text-sm text-muted-foreground"
                  >
                    <FiClock className="text-primary" />
                    <Text size="sm" color="dimmed">
                      Flexible dates available
                    </Text>
                  </Group>
                )}

                {trip.category && trip.category.length > 0 && (
                  <div>
                    <Text size="sm" color="dimmed" mb={4}>
                      Categories
                    </Text>
                    <Group spacing={8}>
                      {trip.category.map((cat) => (
                        <Badge
                          key={cat}
                          variant="light"
                          color="secondary"
                          className="flex items-center gap-1"
                        >
                          {getCategoryIcon(cat)}
                          {cat}
                        </Badge>
                      ))}
                    </Group>
                  </div>
                )}
              </Card.Section>
            </Card>

            {/* Activities */}
            {trip.activities && trip.activities.length > 0 && (
              <Card shadow="lg" radius="md" className="border-0">
                <Card.Section>
                  <Group p="md">
                    <FiStar className="text-primary" />
                    <Title order={3}>Activities & Attractions</Title>
                  </Group>
                </Card.Section>
                <Card.Section p="md">
                  <Stack spacing="md">
                    {trip.activities.map((activity, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg border border-border/50 hover:shadow-md transition-shadow"
                      >
                        <Group position="apart" mb={6}>
                          <Text weight={600} size="lg">
                            {activity.name}
                          </Text>
                          {activity.optional && (
                            <Badge variant="outline" size="xs">
                              Optional
                            </Badge>
                          )}
                        </Group>
                        {activity.description && (
                          <Text color="dimmed" mb={6}>
                            {activity.description}
                          </Text>
                        )}
                        <Group
                          spacing={16}
                          className="text-sm text-muted-foreground"
                        >
                          {activity.location && (
                            <Group spacing={4}>
                              <IoLocationOutline />
                              <span>{activity.location}</span>
                            </Group>
                          )}
                          {activity.time && (
                            <Group spacing={4}>
                              <IoTimeOutline />
                              <span>{activity.time}</span>
                            </Group>
                          )}
                        </Group>
                      </div>
                    ))}
                  </Stack>
                </Card.Section>
              </Card>
            )}

            {/* Transportation */}
            {trip.transportation && trip.transportation.length > 0 && (
              <Card shadow="lg" radius="md" className="border-0">
                <Card.Section>
                  <Group p="md">
                    <FaPlane className="text-primary" />
                    <Title order={3}>Transportation</Title>
                  </Group>
                </Card.Section>
                <Card.Section p="md">
                  <Stack spacing="md">
                    {trip.transportation.map((transport, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg bg-secondary/30 border border-border/30"
                      >
                        <Group position="apart" mb={6}>
                          <Badge variant="outline" className="capitalize">
                            {transport.type.replace("_", " ")}
                          </Badge>
                          {transport.provider && (
                            <Text size="sm" weight={500}>
                              {transport.provider}
                            </Text>
                          )}
                        </Group>
                        {transport.details && (
                          <Text color="dimmed">{transport.details}</Text>
                        )}
                      </div>
                    ))}
                  </Stack>
                </Card.Section>
              </Card>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Pricing */}
            {trip.expenses && (
              <Card
                shadow="lg"
                radius="md"
                className="border-0 bg-gradient-to-br from-accent/5 to-accent/10"
              >
                <Card.Section>
                  <Group p="md">
                    <FiDollarSign className="text-accent" />
                    <Title order={3}>Pricing</Title>
                  </Group>
                </Card.Section>
                <Card.Section p="md">
                  <div className="text-center mb-4">
                    <Text size="xl" weight={700} color="accent">
                      ${trip.expenses.estimated_per_person}
                    </Text>
                    <Text size="sm" color="dimmed">
                      per person
                    </Text>
                  </div>
                  {trip.expenses.breakdown && (
                    <div className="space-y-2">
                      <Divider />
                      <div className="space-y-2 text-sm">
                        {trip.expenses.breakdown.transportation && (
                          <Group position="apart">
                            <span>Transportation</span>
                            <span>
                              ${trip.expenses.breakdown.transportation}
                            </span>
                          </Group>
                        )}
                        {trip.expenses.breakdown.accommodation && (
                          <Group position="apart">
                            <span>Accommodation</span>
                            <span>
                              ${trip.expenses.breakdown.accommodation}
                            </span>
                          </Group>
                        )}
                        {trip.expenses.breakdown.meals && (
                          <Group position="apart">
                            <span>Meals</span>
                            <span>${trip.expenses.breakdown.meals}</span>
                          </Group>
                        )}
                        {trip.expenses.breakdown.activities && (
                          <Group position="apart">
                            <span>Activities</span>
                            <span>${trip.expenses.breakdown.activities}</span>
                          </Group>
                        )}
                      </div>
                    </div>
                  )}
                  <Button fullWidth mt="md" color="accent">
                    Book This Trip
                  </Button>
                </Card.Section>
              </Card>
            )}

            {/* Trip Info */}
            <Card shadow="lg" radius="md" className="border-0">
              <Card.Section>
                <Group p="md">
                  <FiUsers className="text-primary" />
                  <Title order={3}>Trip Information</Title>
                </Group>
              </Card.Section>
              <Card.Section p="md">
                {trip.max_participants && (
                  <Group position="apart">
                    <Text color="dimmed">Max Participants</Text>
                    <Text weight={600}>{trip.max_participants}</Text>
                  </Group>
                )}

                {trip.path && trip.path.length > 0 && (
                  <div>
                    <Text size="sm" color="dimmed" mb={4}>
                      Route
                    </Text>
                    <Stack spacing={4}>
                      {trip.path.map((location, index) => (
                        <Group key={index} spacing={8} className="text-sm">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          {location}
                        </Group>
                      ))}
                    </Stack>
                  </div>
                )}
              </Card.Section>
            </Card>

            {/* Packing List */}
            {trip.packing_list && trip.packing_list.length > 0 && (
              <Card shadow="lg" radius="md" className="border-0">
                <Card.Section>
                  <Group p="md">
                    <FiPackage className="text-primary" />
                    <Title order={3}>Packing List</Title>
                  </Group>
                </Card.Section>
                <Card.Section p="md">
                  <Stack spacing="md">
                    {[
                      "clothing",
                      "toiletries",
                      "documents",
                      "electronics",
                      "miscellaneous",
                    ].map((category) => {
                      const items = trip.packing_list?.filter(
                        (item) => item.category === category
                      );
                      if (!items || items.length === 0) return null;

                      return (
                        <div key={category}>
                          <Text
                            weight={500}
                            size="sm"
                            mb={4}
                            className="capitalize"
                          >
                            {category}
                          </Text>
                          <Stack spacing={4}>
                            {items.map((item, index) => (
                              <Group
                                key={index}
                                spacing={8}
                                className="text-sm"
                              >
                                <FiCheck className="w-3 h-3 text-primary" />
                                {item.item}
                              </Group>
                            ))}
                          </Stack>
                        </div>
                      );
                    })}
                  </Stack>
                </Card.Section>
              </Card>
            )}

            {/* Required Documents */}
            {trip.required_documents && trip.required_documents.length > 0 && (
              <Card shadow="lg" radius="md" className="border-0">
                <Card.Section>
                  <Group p="md">
                    <FiFileText className="text-primary" />
                    <Title order={3}>Required Documents</Title>
                  </Group>
                </Card.Section>
                <Card.Section p="md">
                  <Stack spacing={8}>
                    {trip.required_documents.map((doc, index) => (
                      <Group
                        key={index}
                        position="apart"
                        className="p-2 rounded border border-border/30"
                      >
                        <Text size="sm">{doc.document_name}</Text>
                        <Group spacing={4}>
                          {doc.required_for_entry && (
                            <Badge variant="outline" size="xs">
                              Entry
                            </Badge>
                          )}
                          {doc.required_for_trip && (
                            <Badge variant="outline" size="xs">
                              Trip
                            </Badge>
                          )}
                        </Group>
                      </Group>
                    ))}
                  </Stack>
                </Card.Section>
              </Card>
            )}
            {minimalFlight && (
              <MinimalFlightCard minimalFlight={minimalFlight} />
            )}
            <UserCard user={organizer} type="detailed" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetailsPanel;
