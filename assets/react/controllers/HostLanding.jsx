import React, { useState, useEffect, useRef, useMemo } from 'react';
import { GoogleMap, LoadScript, OverlayView, InfoWindow } from '@react-google-maps/api';
import PriceMarker from '../components/Map/PriceMarker';
import { useCountAnimation } from '../hooks/useCountAnimation';
import HostStats from '../components/Host/HostStats';
import HostSetupSteps from '../components/Host/HostSetupSteps';
import HostFAQ from '../components/Host/HostFAQ';
import RollingDigit from '../components/RollingDigit';
import PropertyDetailsModal from '../components/PropertyDetailsModal';
import ZoomControl from '../components/ZoomControl';

const HostLanding = () => {
  const [nights, setNights] = useState(30);
  const [location, setLocation] = useState({
    lat: 48.8566,
    lng: 2.3522,
    address: 'Paris, France'
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
          address: place.formatted_address
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
      
      const response = await fetch(`/api/properties/bounds?` + new URLSearchParams({
        north: ne.lat(),
        south: sw.lat(),
        east: ne.lng(),
        west: sw.lng(),
        bedrooms: bedrooms // Filter by number of bedrooms
      }));
      const data = await response.json();
      setNearbyProperties(data.properties);

      // Handle average price calculation and no properties case
      if (data.properties && data.properties.length > 0) {
        const avgPrice = Math.round(
          data.properties.reduce((sum, property) => sum + property.price, 0) / data.properties.length
        );
        setAveragePrice(avgPrice);
        setHasProperties(true);
      } else {
        // Set default price for area when no properties found
        setAveragePrice(100); // You can adjust this default value
        setHasProperties(false);
      }
    } catch (error) {
      console.error('Error loading properties:', error);
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
        address: location.address // Keep existing address
      });
      
      loadPropertiesInBounds(mapRef.current.getBounds());
      setIsMapMoved(false);
    }
  };

  const formatNumberToArray = (number) => {
    return number.toString().split('').map(Number);
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

  return (
    <div className="min-h-screen">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-10 h-full flex justify-between items-center">
          <div className="text-rose-500">
            <svg className="w-8 h-8" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-label="Airbnb homepage">
              <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.01.415.001.228c0 4.062-2.877 6.478-6.357 6.478-2.224 0-4.556-1.258-6.709-3.386l-.257-.26-.172-.179h-.011l-.176.185c-2.044 2.1-4.267 3.42-6.414 3.615l-.28.019-.267.006C5.377 31 2.5 28.584 2.5 24.522l.005-.469c.026-.928.23-1.768.83-3.244l.216-.524c.966-2.298 6.083-12.989 7.707-16.034C12.537 1.963 13.992 1 16 1zm0 2c-1.239 0-2.053.539-2.987 2.21l-.523 1.008c-1.926 3.776-6.06 12.43-7.031 14.692l-.345.836c-.427 1.071-.573 1.655-.605 2.24l-.009.33v.206C4.5 27.395 6.411 29 8.857 29c1.773 0 3.87-1.236 5.831-3.354-2.295-2.938-3.855-6.45-3.855-8.91 0-2.913 1.933-5.386 5.178-5.386 3.245 0 5.178 2.473 5.178 5.385 0 2.456-1.555 5.96-3.843 8.895 2.061 2.115 4.162 3.37 5.834 3.37 2.446 0 4.357-1.605 4.357-4.478l-.002-.211c-.026-.788-.233-1.448-.601-2.269l-.335-.814-7.044-14.76C18.053 3.539 17.24 3 16 3zm0 13.5c-2.317 0-3.178 1.727-3.178 3.385 0 1.992 1.59 5.181 3.178 7.615 1.588-2.434 3.178-5.623 3.178-7.615 0-1.658-.861-3.385-3.178-3.385z" fill="currentColor" fillRule="evenodd"/>
            </svg>
          </div>
          <a
            href="/become-a-host/start"
            className="inline-flex px-6 py-3 rounded-lg bg-rose-500 text-white font-medium hover:bg-rose-600 transition-colors"
          >
            Get started
          </a>
        </div>
      </header>

      {/* Hero Section with Earnings Calculator */}
      <section className="relative bg-white min-h-screen pt-8">
        <LoadScript 
          googleMapsApiKey={'AIzaSyB1Tdhuiy1tk6QluPWGU7pwMZyotQqbcQA'}
          mapIds={['43f679ecd42ba96e']}
          libraries={["places"]}
        >
          <div className="h-screen max-w-7xl mx-auto px-10 py-32">
            <div className="h-full grid md:grid-cols-10 gap-24 items-start">
              {/* Left Column - Earnings Calculator */}
              <div className="md:col-span-4 space-y-8">
                <div className="text-center">
                  <h1 className="text-6xl font-bold mb-6">
                    Votre logement pourrait vous rapporter{' '}
                    <span className="inline-flex items-center">
                      {formatNumberToArray(potentialEarnings).map((digit, index) => (
                        <RollingDigit 
                          key={index} 
                          digit={digit} 
                          animate={animate}
                        />
                      ))}
                      <span className="ml-1">€</span>
                    </span>
                    {' '}sur Airbnb
                  </h1>
                  <p className="text-xl text-gray-600 mt-4">
                    Pour {nights} nuits à {averagePrice}€ par nuit
                    {!hasProperties && (
                      <span className="block text-sm text-gray-500 mt-2">
                        *Prix estimé basé sur les moyennes de la région
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
                    <div className="text-sm text-gray-600">Location and size</div>
                    <div className="text-base font-medium">
                      {bedrooms} bedroom{bedrooms > 1 ? 's' : ''} · {location.address}
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
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
                >
                  {/* Add location pin at selected address */}
                  <OverlayView
                    position={location}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                  >
                    <LocationPin />
                  </OverlayView>

                  {nearbyProperties.map(property => (
                    <OverlayView
                      key={property.id}
                      position={{
                        lat: property.latitude,
                        lng: property.longitude
                      }}
                      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                    >
                      <PriceMarker
                        price={property.price}
                        imageUrl={property.images[0]?.url}
                        isSelected={selectedProperty?.id === property.id}
                        onClick={() => setSelectedProperty(property)}
                      />
                    </OverlayView>
                  ))}

                  {selectedProperty && (
                    <InfoWindow
                      position={{
                        lat: selectedProperty.latitude + 0.0060,
                        lng: selectedProperty.longitude
                      }}
                      onCloseClick={() => setSelectedProperty(null)}
                    >
                      <div className="p-4 max-w-sm min-w-80 rounded-xl shadow-lg bg-white">
                        {selectedProperty.propertyMedias?.length > 0 && (
                          <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                            <img 
                              src={selectedProperty.propertyMedias[0].url} 
                              alt={selectedProperty.title}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                        )}
                        <h3 className="text-lg font-bold mb-2">{selectedProperty.title}</h3>
                        <p className="text-gray-600 mb-2">{selectedProperty.price}€ / night</p>
                        <p className="text-sm mb-2">
                          {selectedProperty.bedrooms} beds • {selectedProperty.bathrooms} baths
                        </p>
                        <div className="text-sm text-gray-500">
                          {selectedProperty.address.city}, {selectedProperty.address.country}
                        </div>
                        <button 
                          className="mt-3 bg-rose-500 text-white px-4 py-2 rounded-lg w-full hover:bg-rose-600"
                          onClick={() => window.location.href = `/property/${selectedProperty.id}`}
                        >
                          View Details
                        </button>
                      </div>
                    </InfoWindow>
                  )}
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
    </div>
  );
};

export default HostLanding;
