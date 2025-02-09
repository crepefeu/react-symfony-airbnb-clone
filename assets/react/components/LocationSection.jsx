import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import {
  GoogleMap,
  LoadScript,
  Circle,
  OverlayView,
} from "@react-google-maps/api";
import ZoomControl from "./ZoomControl";

const LocationSection = ({ latitude, longitude, city, country }) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [map, setMap] = useState(null);

  const mapOptions = useMemo(
    () => ({
      disableDefaultUI: true,
      zoomControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      mapTypeControl: false,
      clickableIcons: false,
      gestureHandling: "cooperative",
      scrollwheel: false,
      mapId: "43f679ecd42ba96e",
    }),
    []
  );

  const center = useMemo(
    () => ({
      lat: latitude,
      lng: longitude,
    }),
    [latitude, longitude]
  );

  const containerStyle = {
    width: "100%",
    height: "400px",
    borderRadius: "0.5rem",
  };

  // Add street view control after map is loaded
  React.useEffect(() => {
    if (map && window.google) {
      map.setOptions({
        streetViewControl: true,
        streetViewControlOptions: {
          position: window.google.maps.ControlPosition.TOP_RIGHT,
        },
      });

      // Disable scroll zoom hint
      const mapDiv = map.getDiv();
      const silentClick = (e) => {
        if (e.target.classList.contains("gm-style")) {
          e.stopPropagation();
        }
      };
      mapDiv.addEventListener("click", silentClick);

      return () => {
        mapDiv.removeEventListener("click", silentClick);
      };
    }
  }, [map]);

  // Add custom styles for the street view control
  React.useEffect(() => {
    if (map) {
      // Add custom styles to street view control
      const stylesheet = document.createElement("style");
      stylesheet.textContent = `
        .gm-svpc {
          background-color: white !important;
          border-radius: 8px !important;
          width: 40px !important;
          height: 40px !important;
          box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px !important;
          margin: 10px 40px 10px 10px !important;
          cursor: grab !important;
          left: -20px !important;
        }
        .gm-svpc:active {
          cursor: grabbing !important;
        }
        /* Hide zoom gesture hint */
        .gm-style-moc {
          display: none !important;
        }
      `;
      document.head.appendChild(stylesheet);

      return () => {
        document.head.removeChild(stylesheet);
      };
    }
  }, [map]);
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
    <div className="py-6 border-t border-gray-200">
      <h2 className="text-2xl mb-4">Where is the property located?</h2>
      <p className="text-gray-600 mb-4">
        {city}, {country}
      </p>

      <div className="relative rounded-lg overflow-hidden z-0">
        {" "}
        {/* Updated z-index */}
        <LoadScript
          googleMapsApiKey={process.env.GOOGLE_MAPS_API_KEY}
          mapIds={["43f679ecd42ba96e"]}
        >
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={14}
            options={mapOptions}
            onLoad={(map) => setMap(map)}
          >
            <Circle
              center={center}
              radius={500}
              options={{
                fillColor: "#FF385C",
                fillOpacity: 0.15,
                strokeColor: "#FF385C",
                strokeOpacity: 0.3,
                strokeWeight: 2,
                clickable: false,
              }}
            />
            <OverlayView
              position={center}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <div
                onMouseEnter={() => setIsTooltipVisible(true)}
                onMouseLeave={() => setIsTooltipVisible(false)}
                className="relative group"
              >
                <div className="w-12 h-12 -translate-x-1/2 -translate-y-1/2 [perspective:1000px]">
                  <div className="relative w-full h-full transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                    {/* Front side */}
                    <div className="absolute w-full h-full bg-rose-500 rounded-full flex items-center justify-center shadow-lg [backface-visibility:hidden]">
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
                    {/* Back side */}
                    <div className="absolute w-full h-full bg-rose-500 rounded-full flex items-center justify-center shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)]">
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
                          d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {isTooltipVisible && (
                  <div className="absolute bottom-24 left-1/2 -translate-x-1/2 mt-2 p-3 bg-white border rounded-lg shadow-xl text-sm w-64 text-center">
                    The exact location will be communicated after the
                    reservation
                  </div>
                )}
              </div>
            </OverlayView>
          </GoogleMap>
          <ZoomControl onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
        </LoadScript>
      </div>
    </div>
  );
};

LocationSection.propTypes = {
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  city: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
};

export default LocationSection;
