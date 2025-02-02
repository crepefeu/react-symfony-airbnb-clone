import React, { useState } from 'react';
import { GoogleMap, LoadScript, OverlayView } from '@react-google-maps/api';
import { Autocomplete } from '@react-google-maps/api';
import ZoomControl from '../ZoomControl';

const Location = ({ formData, setFormData }) => {
  const [searchBox, setSearchBox] = useState(null);
  const [map, setMap] = useState(null);
  const [center, setCenter] = useState({
    lat: formData.latitude || 48.8566,
    lng: formData.longitude || 2.3522
  });

  const mapOptions = {
    disableDefaultUI: true,
    zoomControl: false, // Disable default zoom control
    mapId: "43f679ecd42ba96e",
  };

  // Add LocationPin component
  const LocationPin = () => (
    <div className="relative">
      <div className="w-12 h-12 -translate-x-1/2 -translate-y-1/2">
        <div className="w-full h-full bg-rose-500 rounded-full flex items-center justify-center shadow-lg">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 text-white" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
      </div>
    </div>
  );

  const extractAddressComponents = (place) => {
    // Initialize address object with empty values
    const addressData = {
      streetNumber: '',
      streetName: '',
      route: '',
      neighborhood: '',
      locality: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      countryCode: '',
      formattedAddress: place.formatted_address
    };

    // Log the full place object for debugging
    console.log('Google Place object:', place);

    // Extract each component
    place.address_components.forEach(component => {
      const types = component.types;

      // Log each component for debugging
      console.log('Address component:', component);

      switch (true) {
        case types.includes('street_number'):
          addressData.streetNumber = component.long_name;
          break;
        case types.includes('route'):
          addressData.route = component.long_name;
          break;
        case types.includes('sublocality'):
        case types.includes('neighborhood'):
          addressData.neighborhood = component.long_name;
          break;
        case types.includes('locality'):
          addressData.locality = component.long_name;
          addressData.city = component.long_name;
          break;
        case types.includes('administrative_area_level_1'):
          addressData.state = component.long_name;
          break;
        case types.includes('postal_code'):
          addressData.postalCode = component.long_name;
          break;
        case types.includes('country'):
          addressData.country = component.long_name;
          addressData.countryCode = component.short_name;
          break;
      }
    });

    // Combine street number and route for full street name
    addressData.streetName = [addressData.streetNumber, addressData.route]
      .filter(Boolean)
      .join(' ');

    // Use neighborhood as city if city is empty
    if (!addressData.city && addressData.neighborhood) {
      addressData.city = addressData.neighborhood;
    }

    // Log final processed address
    console.log('Processed address:', addressData);

    return {
      streetName: addressData.streetName,
      streetNumber: addressData.streetNumber,
      city: addressData.locality,
      state: addressData.state,
      zipcode: addressData.postalCode,
      country: addressData.country,
      formattedAddress: addressData.formattedAddress,
    };
  };

  const handlePlaceSelect = () => {
    if (searchBox) {
      const place = searchBox.getPlace();
      if (place.geometry) {
        const addressComponents = extractAddressComponents(place);
        
        // Log the final data being set
        console.log('Setting form data with:', {
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
          address: addressComponents
        });

        setFormData({
          ...formData,
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
          address: addressComponents
        });

        setCenter({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        });

        if (map) {
          const zoomLevel = getZoomLevelForPlace(place);
          map.setZoom(zoomLevel);
        }
      }
    }
  };

  // Helper function to determine zoom level based on place type
  const getZoomLevelForPlace = (place) => {
    if (place.types) {
      if (place.types.includes('street_address') || place.types.includes('premise')) {
        return 17;
      } else if (place.types.includes('sublocality') || place.types.includes('neighborhood')) {
        return 15;
      } else if (place.types.includes('locality')) {
        return 13;
      }
    }
    return 13; // default zoom level
  };

  const handleZoomIn = () => {
    if (map) {
      map.setZoom(map.getZoom() + 1);
    }
  };

  const handleZoomOut = () => {
    if (map) {
      map.setZoom(map.getZoom() - 1);
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

          <div className="h-[400px] rounded-lg overflow-hidden relative">
            <GoogleMap
              mapContainerClassName="w-full h-full"
              center={center}
              zoom={13}
              options={mapOptions}
              onLoad={map => setMap(map)}
            >
              {formData.latitude && formData.longitude && (
                <OverlayView
                  position={{
                    lat: formData.latitude,
                    lng: formData.longitude
                  }}
                  mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                >
                  <LocationPin />
                </OverlayView>
              )}
            </GoogleMap>
            
            <ZoomControl 
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              className="right-5 top-5"
            />
          </div>
        </LoadScript>
      </div>
    </div>
  );
};

export default Location;
