import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { useNetworkStatus } from "./utils/useNetworkStatus.js";
import OfflineBanner from "./Components/common/OfflineBanner.jsx";
import ErrorPage from "./Components/common/ErrorPage.jsx";
import Layout from "./Components/layout/Layout.jsx";
import ChatLayer from "./Components/layout/ChatLayer.jsx";
import AuthPage from "./Pages/AuthPage.jsx";
import ProfileCreation from "./Pages/ProfileCreation.jsx";
import AgencyProfileCreation from "./Pages/AgencyProfileCreation.jsx";
import WelcomePage from "./Pages/WelcomePage.jsx";
import MyTrips from "./Pages/MyTrips.jsx";
import Discover from "./Pages/Discover.jsx";
import TripDetailPage from "./Components/trips/tripDetail/TripDetailPage.jsx";
import ChatsPage from "./Pages/ChatsPage.jsx";
import SignIn from "./Components/auth/SignIn.jsx";
import FlightPage from "./Pages/FlightPage.jsx";
import SelectedFlight from "./Components/flights/SelectedFlight.jsx";
import FlightLayer from "./Components/layout/FlightLayer.jsx";
import Profile from "./Components/profile/Profile.jsx";
import Verification from "./Components/profile/Verification.jsx";

// Reusable Protected Route Component
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

function App() {
  const isOnline = useNetworkStatus();

  return (
    <Router>
      {!isOnline && <OfflineBanner />}
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/profile-solo" element={<ProfileCreation />} />
        <Route path="/profile-agency" element={<AgencyProfileCreation />} />
        {/* <Route path="/profile/confirmation" element={<Confirmation />} /> */}

        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <WelcomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/verification"
            element={
              <ProtectedRoute>
                <Verification />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-trips"
            element={
              <ProtectedRoute>
                <MyTrips />
              </ProtectedRoute>
            }
          />
          <Route
            path="/discover"
            element={
              <ProtectedRoute>
                <Discover />
              </ProtectedRoute>
            }
          />
          <Route element={<ChatLayer />}>
            <Route path="/discover/:id" element={<TripDetailPage />} />
            <Route path="/my-trips/:id" element={<TripDetailPage />} />
            <Route path="chats" element={<ChatsPage />} />
          </Route>
          <Route element={<FlightLayer />}>
            <Route path="/flights" element={<FlightPage />} />
            <Route path="/flights/selected" element={<SelectedFlight />} />
          </Route>
          <Route path="/error/:type" element={<ErrorPage />} />
          <Route path="*" element={<Navigate to="/error/404" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
