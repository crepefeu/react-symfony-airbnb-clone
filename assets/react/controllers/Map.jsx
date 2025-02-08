import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  OverlayView,
  Marker,
  Circle,
} from "@react-google-maps/api";
import ZoomControl from "../components/ZoomControl";
import MorphingMarker from "../components/Map/MorphingMarker";

const LoadingSpinner = () => (
  <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg z-10">
    <div className="flex items-center gap-2">
      <div className="animate-spin h-4 w-4 border-2 border-rose-500 rounded-full border-t-transparent"></div>
      <span className="text-sm text-gray-600">Loading properties...</span>
    </div>
  </div>
);

const Map = () => {
  const [properties, setProperties] = useState([]);
  const [center, setCenter] = useState({
    lat: 48.8566, // Paris coordinates as default
    lng: 2.3522,
  });
  const [selectedProperty, setSelectedProperty] = useState(null);
  const mapRef = useRef(null);
  const [markerIcon, setMarkerIcon] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [accuracyCircle, setAccuracyCircle] = useState(null);

  const loadPropertiesInBounds = async (bounds) => {
    if (!bounds) return;

    setIsLoading(true);
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
          })
      );
      const data = await response.json();
      setProperties(data.properties);
    } catch (error) {
      console.error("Error loading properties:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkerClick = (property) => {
    setSelectedProperty(property);
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

  const userLocationMarker = useMemo(
    () => ({
      path: "M12 0C7.802 0 4 3.403 4 7.602C4 11.8 7.469 16.812 12 24C16.531 16.812 20 11.8 20 7.602C20 3.403 16.199 0 12 0Z",
      fillColor: "#3b82f6",
      fillOpacity: 1,
      strokeColor: "#ffffff",
      strokeWeight: 2,
      scale: 1.5,
    }),
    []
  );

  const mapOptions = useMemo(
    () => ({
      disableDefaultUI: true,
      zoomControl: false, // Disable default zoom control
      fullscreenControl: false,
      streetViewControl: false,
      mapTypeControl: false,
      clickableIcons: false,
      restriction: {
        latLngBounds: {
          north: 85,
          south: -85,
          west: -180,
          east: 180,
        },
      },
      zoomControlOptions: {
        position: window.google?.maps?.ControlPosition?.RIGHT_BOTTOM,
      },
      mapId: "43f679ecd42ba96e",
      scaleControl: true,
      rotateControl: false,
      panControl: false,
      gestureHandling: "greedy",
    }),
    []
  );

  useEffect(() => {
    // Load Inter font
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const handleMapLoad = (map) => {
    mapRef.current = map;
    setMarkerIcon({
      path: "M15 8c0 4.5-7 11-7 11S1 12.5 1 8c0-4.1 3.1-7 7-7s7 2.9 7 7z",
      fillColor: "#FF385C",
      fillOpacity: 1,
      strokeColor: "#fff",
      strokeWeight: 1,
      scale: 1.5,
      anchor: new window.google.maps.Point(8, 19),
    });
  };

  const handleMapClick = () => {
    setSelectedProperty(null);
  };

  return (
    <div className="w-full h-full">
      <div className="h-full">
        <LoadScript
          googleMapsApiKey={process.env.GOOGLE_MAPS_API_KEY}
          mapIds={["43f679ecd42ba96e"]}
        >
          {isLoading && <LoadingSpinner />}
          <GoogleMap
            mapContainerClassName="w-full h-full"
            center={center}
            zoom={13}
            onLoad={handleMapLoad}
            options={mapOptions}
            onIdle={() => {
              if (mapRef.current) {
                const bounds = mapRef.current.getBounds();
                loadPropertiesInBounds(bounds);
              }
            }}
            onClick={handleMapClick}
          >
            {properties.map((property) => (
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
                    onClick={() => handleMarkerClick(property)}
                  />
                </div>
              </OverlayView>
            ))}

            {userLocation && (
              <Marker
                position={userLocation}
                icon={userLocationMarker}
                zIndex={1000}
              />
            )}
            {accuracyCircle && (
              <Circle
                center={accuracyCircle.center}
                radius={accuracyCircle.radius}
                options={{
                  fillColor: "#3b82f6",
                  fillOpacity: 0.1,
                  strokeColor: "#3b82f6",
                  strokeOpacity: 0.3,
                  strokeWeight: 1,
                  clickable: false,
                  zIndex: 999,
                }}
              />
            )}
          </GoogleMap>
          <ZoomControl onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
        </LoadScript>
      </div>
    </div>
  );
};

export default Map;
