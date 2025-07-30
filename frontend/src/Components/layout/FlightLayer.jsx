import { Outlet } from "react-router-dom";
import { ProtectedRoute } from "../../App";
import { FlightProvider } from "../../Context/FlightProvider";

const FlightLayer = () => {
  return (
    <ProtectedRoute>
      <FlightProvider>
        <Outlet />
      </FlightProvider>
    </ProtectedRoute>
  );
};

export default FlightLayer;
