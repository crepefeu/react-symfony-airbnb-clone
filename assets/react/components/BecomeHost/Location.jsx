import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Autocomplete } from '@react-google-maps/api';

const Location = ({ formData, setFormData }) => {
  const [searchBox, setSearchBox] = useState(null);
  const [map, setMap] = useState(null);

  const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    mapId: "43f679ecd42ba96e",
  };

  const handlePlaceSelect = () => {
    if (searchBox) {
      const place = searchBox.getPlace();
      if (place.geometry) {
        const location = {
          address: place.formatted_address,
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
        };

        setFormData({
          ...formData,
          ...location
        });

        map.panTo(place.geometry.location);
        map.setZoom(15);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <LoadScript 
          googleMapsApiKey="AIzaSyB1Tdhuiy1tk6QluPWGU7pwMZyotQqbcQA"
          libraries={["places"]}
        >
          <Autocomplete
            onLoad={box => setSearchBox(box)}
            onPlaceChanged={handlePlaceSelect}
          >
            <input
              type="text"
              placeholder="Enter your address"
              className="w-full p-4 border border-gray-300 rounded-lg"
            />
          </Autocomplete>

          <div className="h-[400px] rounded-lg overflow-hidden">
            <GoogleMap
              mapContainerClassName="w-full h-full"
              center={{ lat: 48.8566, lng: 2.3522 }}
              zoom={13}
              options={mapOptions}
              onLoad={map => setMap(map)}
            >
              {formData.latitude && formData.longitude && (
                <Marker
                  position={{
                    lat: formData.latitude,
                    lng: formData.longitude
                  }}
                />
              )}
            </GoogleMap>
          </div>
        </LoadScript>
      </div>
    </div>
  );
};

export default Location;
