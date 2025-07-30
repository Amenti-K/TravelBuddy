import { useState } from "react";
import { Autocomplete } from "@react-google-maps/api";

const LocationInput = ({ onSelectLocation }) => {
  const [autocomplete, setAutocomplete] = useState(null);

  const handlePlaceSelect = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      const locationName = place.formatted_address; // Gets full address
      onSelectLocation(locationName);
    }
  };

  return (
    <Autocomplete onLoad={setAutocomplete} onPlaceChanged={handlePlaceSelect}>
      <input type="text" placeholder="Enter your location..." />
    </Autocomplete>
  );
};

export default LocationInput;
