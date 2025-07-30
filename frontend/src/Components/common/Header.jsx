import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Burger,
  Button,
  Divider,
  Drawer,
  Group,
  ScrollArea,
  Text,
  ActionIcon,
  HoverCard,
  Stack,
} from "@mantine/core";
import { FaSun, FaMoon } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../../store/slices/themeSlice";
import ProfileAvatarComp from "../custom/ProfileAvatarComp";
import { logout } from "../../store/slices/authSlice";

const Header = () => {
  const [drawerOpened, setDrawerOpened] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const { isAuthenticated, userProfile } = useSelector((state) => state.auth);

  const links = [
    { name: "Discover", path: "/discover" },
    { name: "My Trips", path: "/my-trips" },
    { name: "Chats", path: "/chats" },
    { name: "Flights", path: "/flights" },
  ];

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Box>
      <header className="flex w-full h-16 shadow-md items-center justify-between px-6 md:px-12 lg:px-24 xl:px-32 py-6 bg-gray-100 dark:bg-gray-800">
        {/* Logo */}
        <Text
          weight={700}
          size={24}
          className="whitespace-nowrap text-gray-800 dark:text-white"
        >
          TRAVEL BUDDY
        </Text>

        {/* Navigation Links */}
        <div className="hidden sm:flex items-center sm:space-x-4 md:space-x-8">
          {links.map((link) => (
            <div key={link.name} className="relative">
              <Link
                to={link.path}
                className={`text-lg font-medium ${
                  location.pathname === link.path
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-300"
                } hover:text-blue-800 dark:hover:text-blue-500`}
              >
                {link.name}
              </Link>
              {location.pathname === link.path && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 dark:bg-blue-400 rounded"></div>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center space-x-4">
          <ActionIcon
            variant="outline"
            color={isDarkMode ? "yellow" : "blue"}
            onClick={() => dispatch(toggleTheme())}
            size="lg"
          >
            {isDarkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
          </ActionIcon>
          <HoverCard
            width={600}
            position="bottom"
            radius="md"
            shadow="md"
            withinPortal
          >
            <HoverCard.Target>
              <span>
                <ProfileAvatarComp
                  name={userProfile?.full_name}
                  picture={userProfile?.profile_picture}
                />
              </span>
            </HoverCard.Target>

            <HoverCard.Dropdown style={{ overflow: "hidden", maxWidth: 300 }}>
              <Stack spacing={4} className="min-w-fit">
                <Group>
                  <ProfileAvatarComp
                    name={userProfile?.full_name}
                    picture={userProfile?.profile_picture}
                  />
                  <div>
                    <Text fw={600}>{userProfile?.full_name}</Text>
                    <Text size="xs" c="dimmed">
                      {userProfile?.email}
                    </Text>
                  </div>
                  <Text size="xs" mt={2}>
                    {userProfile?.trust_score} %
                  </Text>
                </Group>

                <Button
                  variant="subtle"
                  size="xs"
                  onClick={() => navigate("/profile")}
                >
                  Profile
                </Button>

                <Button
                  variant="subtle"
                  size="xs"
                  color="red"
                  onClick={handleLogout}
                >
                  Log out
                </Button>
              </Stack>
            </HoverCard.Dropdown>
          </HoverCard>
        </div>

        {/* Mobile Menu Toggle */}
        <Burger
          opened={drawerOpened}
          onClick={() => setDrawerOpened(!drawerOpened)}
          className="sm:hidden"
          aria-label="Toggle navigation"
        />
      </header>

      {/* Mobile Drawer */}
      <Drawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        size="100%"
        padding="md"
        title="Navigation"
        className="sm:hidden"
        zIndex={1000000}
      >
        <ScrollArea
          style={{ height: "calc(100vh - 80px)" }}
          mx="-md"
          className="flex flex-col px-10"
        >
          <Divider my="sm" />
          <div className="flex flex-col h-full gap-y-4">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-lg font-medium ${
                  location.pathname === link.path
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-300"
                } hover:text-blue-800 dark:hover:text-blue-500`}
                onClick={() => setDrawerOpened(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <Divider my="sm" />
          <Stack spacing={4}>
            <Button
              variant="subtle"
              size="xs"
              // leftSection={<Settings size={16} />}
              onClick={() => {}}
            >
              Profile
            </Button>

            <Button
              variant="subtle"
              size="xs"
              color="red"
              // leftSection={<Logout size={16} />}
              onClick={handleLogout}
            >
              Log out
            </Button>
            <Group>
              <ProfileAvatarComp
                name={userProfile?.full_name}
                picture={userProfile?.profile_picture}
              />
              <div>
                <Text fw={600}>{userProfile?.full_name}</Text>
                <Text size="xs" c="dimmed">
                  {userProfile?.email}
                </Text>
              </div>
            </Group>
          </Stack>
        </ScrollArea>
      </Drawer>
    </Box>
  );
};

export default Header;
