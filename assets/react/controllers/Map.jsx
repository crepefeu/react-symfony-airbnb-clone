import React, { useState, useRef, useMemo, useEffect } from 'react';
import { GoogleMap, LoadScript, InfoWindow, OverlayView, Marker, Circle } from '@react-google-maps/api';
import Header from '../components/Header';
import ZoomControl from '../components/ZoomControl';

const LoadingSpinner = () => (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg z-10">
        <div className="flex items-center gap-2">
            <div className="animate-spin h-4 w-4 border-2 border-rose-500 rounded-full border-t-transparent"></div>
            <span className="text-sm text-gray-600">Loading properties...</span>
        </div>
    </div>
);

const PriceMarker = ({ price, isSelected, onClick }) => {
    return (
        <div className="relative w-fit" style={{ transform: 'translate(-50%, -100%)' }}>
            <div
                className={`
                    price-pin cursor-pointer
                    px-4 py-2 rounded-2xl
                    shadow-sm transition-all duration-200
                    ${isSelected 
                        ? 'bg-black text-white scale-110' 
                        : 'bg-white text-gray-800 hover:scale-105'
                    }
                `}
                onClick={onClick}
            >
                <span className="font-semibold text-sm whitespace-nowrap">{price}€</span>
            </div>
            <div 
                className={`absolute left-1/2 -translate-x-1/2
                    pin-triangle border-t-8 transition-all duration-200 shadow-sm
                    ${isSelected ? 'border-t-black' : 'border-t-white'}
                `}
            />
        </div>
    );
};

const Map = () => {
    const [properties, setProperties] = useState([]);
    const [center, setCenter] = useState({
        lat: 48.8566, // Paris coordinates as default
        lng: 2.3522
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
            
            const response = await fetch(`/api/properties/bounds?` + new URLSearchParams({
                north: ne.lat(),
                south: sw.lat(),
                east: ne.lng(),
                west: sw.lng()
            }));
            const data = await response.json();
            setProperties(data.properties);
        } catch (error) {
            console.error('Error loading properties:', error);
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

    const userLocationMarker = useMemo(() => ({
        path: "M12 0C7.802 0 4 3.403 4 7.602C4 11.8 7.469 16.812 12 24C16.531 16.812 20 11.8 20 7.602C20 3.403 16.199 0 12 0Z",
        fillColor: "#3b82f6",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 2,
        scale: 1.5,
    }), []);

    const mapOptions = useMemo(() => ({
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
                east: 180
            }
        },
        zoomControlOptions: {
            position: window.google?.maps?.ControlPosition?.RIGHT_BOTTOM
        },
        mapId: "43f679ecd42ba96e",
        scaleControl: true,
        rotateControl: false,
        panControl: false,
        locationButton: true, // This enables the native location button
        gestureHandling: 'greedy',
    }), []);

    useEffect(() => {
        // Load Inter font
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap';
        link.rel = 'stylesheet';
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
            anchor: new window.google.maps.Point(8, 19)
        });
    };
    return (
        <div className="w-full h-full"> {/* Changed from fragment to div and removed Header */}
            <div className="h-full"> {/* Changed position styling */}
                <LoadScript 
                    googleMapsApiKey={'AIzaSyB1Tdhuiy1tk6QluPWGU7pwMZyotQqbcQA'}
                    mapIds={['43f679ecd42ba96e']}
                >
                    {isLoading && <LoadingSpinner />}
                    <GoogleMap
                        mapContainerClassName="w-full h-full"
                        center={center}
                        zoom={13}
                        onLoad={handleMapLoad}
                        options={
                            mapOptions
                        }
                        onIdle={() => {
                            if (mapRef.current) {
                                const bounds = mapRef.current.getBounds();
                                loadPropertiesInBounds(bounds);
                            }
                        }}
                    >
                        {properties.map(property => (
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
                                    isSelected={selectedProperty?.id === property.id}
                                    onClick={() => handleMarkerClick(property)}
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
                                        onClick={() => window.location.href = `/properties/${selectedProperty.id}`}
                                    >
                                        View Details
                                    </button>
                                </div>
                            </InfoWindow>
                        )}
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
                                    fillColor: '#3b82f6',
                                    fillOpacity: 0.1,
                                    strokeColor: '#3b82f6',
                                    strokeOpacity: 0.3,
                                    strokeWeight: 1,
                                    clickable: false,
                                    zIndex: 999
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

