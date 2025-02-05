import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  GoogleMap,
  LoadScript,
  OverlayView,
} from "@react-google-maps/api";
import MorphingMarker from "../components/Map/MorphingMarker"; // Replace PriceMarker import
import { useCountAnimation } from "../hooks/useCountAnimation";
import HostStats from "../components/Host/HostStats";
import HostSetupSteps from "../components/Host/HostSetupSteps";
import HostFAQ from "../components/Host/HostFAQ";
import RollingDigit from "../components/RollingDigit";
import PropertyDetailsModal from "../components/PropertyDetailsModal";
import ZoomControl from "../components/ZoomControl";
import useAuth from '../hooks/useAuth';  // Add this import at the top
import AuthModal from "../components/AuthModal";

const HostLanding = () => {
  const [nights, setNights] = useState(30);
  const [location, setLocation] = useState({
    lat: 48.8566,
    lng: 2.3522,
    address: "Paris, France",
  });
  const [averagePrice, setAveragePrice] = useState(101);
  const [bedrooms, setBedrooms] = useState(2);
  const [animate, setAnimate] = useState(false);
  const [searchBox, setSearchBox] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nearbyProperties, setNearbyProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isMapMoved, setIsMapMoved] = useState(false);
  const [hasProperties, setHasProperties] = useState(true);
  const mapRef = useRef(null);
  const { token, isAuthenticated } = useAuth();  // Add isAuthenticated
  const [isLogInModalOpen, setIsLogInModalOpen] = useState(false);

  const mapOptions = {
    disableDefaultUI: true,
    zoomControl: false,
    fullscreenControl: false,
    streetViewControl: false,
    mapTypeControl: false,
    clickableIcons: false,
    gestureHandling: "cooperative",
    scrollwheel: false,
    mapId: "43f679ecd42ba96e",
  };

  const potentialEarnings = nights * averagePrice;
  const animatedEarnings = useCountAnimation(potentialEarnings);

  const onLoad = (autocomplete) => {
    setSearchBox(autocomplete);
  };

  const onPlaceChanged = () => {
    if (searchBox) {
      const place = searchBox.getPlace();
      if (place.geometry) {
        const newLocation = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          address: place.formatted_address,
        };
        setLocation(newLocation);
        setIsMapMoved(false); // Reset map moved state when location changes
      }
    }
  };

  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 1000);
    return () => clearTimeout(timer);
  }, [potentialEarnings]);

  const loadPropertiesInBounds = async (bounds) => {
    if (!bounds) return;

    try {
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();

      const response = await fetch(
        `/api/properties/bounds?` +
          new URLSearchParams({
            north: ne.lat(),
            south: sw.lat(),
            east: ne.lng(),
            west: sw.lng(),
            bedrooms: bedrooms, // Filter by number of bedrooms
          })
      );
      const data = await response.json();
      setNearbyProperties(data.properties);

      // Handle average price calculation and no properties case
      if (data.properties && data.properties.length > 0) {
        const avgPrice = Math.round(
          data.properties.reduce((sum, property) => sum + property.price, 0) /
            data.properties.length
        );
        setAveragePrice(avgPrice);
        setHasProperties(true);
      } else {
        // Set default price for area when no properties found
        setAveragePrice(100); // You can adjust this default value
        setHasProperties(false);
      }
    } catch (error) {
      console.error("Error loading properties:", error);
      setHasProperties(false);
      setAveragePrice(100); // Fallback price
    }
  };

  const handleMapLoad = (map) => {
    mapRef.current = map;
    if (map.getBounds()) {
      loadPropertiesInBounds(map.getBounds());
    }
  };

  const handleMapDrag = () => {
    setIsMapMoved(true);
  };

  const handleRefreshPrices = () => {
    if (mapRef.current) {
      // Get the center of the current map view
      const center = mapRef.current.getCenter();

      // Update location with new map center
      setLocation({
        lat: center.lat(),
        lng: center.lng(),
        address: location.address, // Keep existing address
      });

      loadPropertiesInBounds(mapRef.current.getBounds());
      setIsMapMoved(false);
    }
  };

  const formatNumberToArray = (number) => {
    return number.toString().split("").map(Number);
  };

  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.setZoom(mapRef.current.getZoom() + 1);
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.setZoom(mapRef.current.getZoom() - 1);
    }
  };

  const handleMapClick = () => {
    setSelectedProperty(null);
  };

  // Custom pin component for selected location
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

  // Update properties when location changes
  useEffect(() => {
    if (mapRef.current) {
      // Center map on new location
      mapRef.current.panTo(location);

      // Load properties for new location
      loadPropertiesInBounds(mapRef.current.getBounds());
    }
  }, [location]);

  // Update properties when bedrooms change
  useEffect(() => {
    if (mapRef.current && mapRef.current.getBounds()) {
      loadPropertiesInBounds(mapRef.current.getBounds());
    }
  }, [bedrooms]);

  const createNewDraft = async () => {
    try {
      const response = await fetch('/api/drafts/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      
      if (response.ok) {
        // Redirect to the draft page
        window.location.href = `/drafts/${data.draftId}`;
      } else {
        throw new Error(data.error || 'Failed to create draft');
      }
    } catch (error) {
      console.error('Error creating draft:', error);
      alert('Failed to create draft. Please try again.');
    }
  };

  const handleGetStarted = () => {
    if (!isAuthenticated) {
      setIsLogInModalOpen(true);
      return;
    }
    
    // If authenticated, proceed with creating draft
    createNewDraft();
  };

  return (
    <div className="min-h-screen">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-10 h-full flex justify-between items-center">
          <div className="text-rose-500">
            <a href="/" className="flex items-center">
              <svg
                className="h-8 w-auto text-rose-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12.0002 0C5.37037 0 0 5.37037 0 12.0002C0 18.63 5.37037 24.0004 12.0002 24.0004C18.63 24.0004 24.0004 18.63 24.0004 12.0002C24.0004 5.37037 18.63 0 12.0002 0ZM15.8507 16.9001C14.7724 18.6605 12.0002 21.0007 12.0002 21.0007C12.0002 21.0007 9.22797 18.6605 8.14967 16.9001C5.85027 13.2298 7.01842 8.67931 12.0002 8.67931C16.982 8.67931 18.1501 13.2298 15.8507 16.9001Z" />
              </svg>
              <span className="ml-2 text-xl font-semibold text-gray-900">
                HostMe
              </span>
            </a>
          </div>
          <button
            onClick={handleGetStarted}
            className="inline-flex px-6 py-3 rounded-lg bg-rose-500 text-white font-medium hover:bg-rose-600 transition-colors"
          >
            Get started
          </button>
        </div>
      </header>

      {/* Hero Section with Earnings Calculator */}
      <section className="relative bg-white min-h-screen pt-8">
        <LoadScript
          googleMapsApiKey={"AIzaSyB1Tdhuiy1tk6QluPWGU7pwMZyotQqbcQA"}
          mapIds={["43f679ecd42ba96e"]}
          libraries={["places"]}
        >
          <div className="h-screen max-w-7xl mx-auto px-10 py-32">
            <div className="h-full grid md:grid-cols-10 gap-24 items-start">
              {/* Left Column - Earnings Calculator */}
              <div className="md:col-span-4 space-y-8">
                <div className="text-center">
                  <h1 className="text-6xl font-bold mb-6">
                    Your home could earn you{" "}
                    <span className="inline-flex items-center">
                      {formatNumberToArray(potentialEarnings).map(
                        (digit, index) => (
                          <RollingDigit
                            key={index}
                            digit={digit}
                            animate={animate}
                          />
                        )
                      )}
                      <span className="ml-1">€</span>
                    </span>{" "}
                    on Hostme
                  </h1>
                  <p className="text-xl text-gray-600 mt-4">
                    For {nights} nights at {averagePrice}€ per night
                    {!hasProperties && (
                      <span className="block text-sm text-gray-500 mt-2">
                        *Price estimated based on nearby properties in the area
                      </span>
                    )}
                  </p>
                </div>

                {/* Nights Slider */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    How many nights?
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="90"
                    value={nights}
                    onChange={(e) => setNights(parseInt(e.target.value))}
                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer
                      [&::-webkit-slider-thumb]:appearance-none
                      [&::-webkit-slider-thumb]:w-[32px]
                      [&::-webkit-slider-thumb]:h-[32px]
                      [&::-webkit-slider-thumb]:rounded-full
                      [&::-webkit-slider-thumb]:bg-white
                      [&::-webkit-slider-thumb]:border-[3px]
                      [&::-webkit-slider-thumb]:border-gray-400
                      [&::-webkit-slider-thumb]:cursor-pointer
                      [&::-webkit-slider-thumb]:shadow-[0_2px_10px_rgba(0,0,0,0.2)]
                      [&::-webkit-slider-thumb]:hover:border-gray-500
                      [&::-webkit-slider-thumb]:-mt-[15px]
                      [&::-moz-range-thumb]:appearance-none
                      [&::-moz-range-thumb]:w-[32px]
                      [&::-moz-range-thumb]:h-[32px]
                      [&::-moz-range-thumb]:rounded-full
                      [&::-moz-range-thumb]:bg-white
                      [&::-moz-range-thumb]:border-[3px]
                      [&::-moz-range-thumb]:border-gray-400
                      [&::-moz-range-thumb]:cursor-pointer
                      [&::-moz-range-thumb]:shadow-[0_2px_10px_rgba(0,0,0,0.2)]
                      [&::-moz-range-thumb]:hover:border-gray-500
                      [&::-moz-range-thumb]:-mt-[15px]
                      [&::-webkit-slider-runnable-track]:bg-rose-500
                      [&::-webkit-slider-runnable-track]:rounded-full
                      [&::-webkit-slider-runnable-track]:h-1
                      [&::-moz-range-track]:bg-rose-500
                      [&::-moz-range-track]:rounded-full
                      [&::-moz-range-track]:h-1"
                  />
                  <div className="text-sm text-gray-600">
                    Host travelers for {nights} nights
                  </div>
                </div>

                {/* Property Details Button */}
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg hover:border-gray-900 transition-all flex justify-between items-center"
                >
                  <div className="text-left">
                    <div className="text-sm text-gray-600">
                      Location and size
                    </div>
                    <div className="text-base font-medium">
                      {bedrooms} bedroom{bedrooms > 1 ? "s" : ""} ·{" "}
                      {location.address}
                    </div>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              {/* Right Column - Map */}
              <div className="md:col-span-6 w-full h-full rounded-2xl overflow-hidden shadow-2xl relative">
                <GoogleMap
                  mapContainerClassName="w-full h-full"
                  center={location}
                  zoom={13}
                  options={mapOptions}
                  onLoad={handleMapLoad}
                  onIdle={() => {
                    if (mapRef.current) {
                      loadPropertiesInBounds(mapRef.current.getBounds());
                    }
                  }}
                  onDrag={handleMapDrag}
                  onClick={handleMapClick}
                >
                  {/* Add location pin at selected address */}
                  <OverlayView
                    position={location}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                  >
                    <LocationPin />
                  </OverlayView>

                  {nearbyProperties.map((property) => (
                    <OverlayView
                      key={property.id}
                      position={{
                        lat: property.latitude,
                        lng: property.longitude,
                      }}
                      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                      getPixelPositionOffset={(width, height) => ({
                          x: 0,
                          y: 0
                      })}
                    >
                      <div className="absolute top-0 left-0">
                          <MorphingMarker
                              property={property}
                              isSelected={selectedProperty?.id === property.id}
                              onClick={() => setSelectedProperty(property)}
                          />
                      </div>
                    </OverlayView>
                  ))}

                  {/* Remove the InfoWindow component since MorphingMarker handles the display */}
                
                </GoogleMap>

                {/* Add ZoomControl */}
                <ZoomControl
                  onZoomIn={handleZoomIn}
                  onZoomOut={handleZoomOut}
                  className="bottom-5 right-5 top-auto" // Override default positioning
                />

                {/* Refresh button */}
                {isMapMoved && (
                  <button
                    onClick={handleRefreshPrices}
                    className="absolute top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-black text-white rounded-lg shadow-lg hover:bg-gray-950 transition-colors z-10"
                  >
                    Update prices for this area
                  </button>
                )}
              </div>
            </div>
          </div>

          <PropertyDetailsModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            location={location}
            bedrooms={bedrooms}
            onLocationChange={setLocation}
            onBedroomsChange={setBedrooms}
            searchBox={searchBox}
            onSearchBoxLoad={onLoad}
            onPlaceChanged={onPlaceChanged}
          />
        </LoadScript>
      </section>

      <HostSetupSteps />
      <HostStats />
      <HostFAQ />

      {/* Add LogInModal at the end of the component */}
      <AuthModal
        isOpen={isLogInModalOpen}
        onClose={() => setIsLogInModalOpen(false)}
      />
    </div>
  );
};

export default HostLanding;
