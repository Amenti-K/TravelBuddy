import { FlightProvider } from "../Context/FlightProvider";
import FlightParent from "../Components/flights/FlightParent";

const FlightPage = () => {
  return (
    <FlightProvider>
      <FlightParent />
    </FlightProvider>
  );
};

export default FlightPage;
