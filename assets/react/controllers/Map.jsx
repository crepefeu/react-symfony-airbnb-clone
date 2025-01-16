import React, { useState, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const Map = () => {
    const [properties, setProperties] = useState([]);
    const [center, setCenter] = useState({
        lat: 48.8566, // Paris coordinates as default
        lng: 2.3522
    });
    const [selectedProperty, setSelectedProperty] = useState(null);
    const mapRef = useRef(null);

    const loadPropertiesInBounds = async (bounds) => {
        const response = await fetch(`/api/properties/bounds?` + new URLSearchParams({
            north: bounds.north,
            south: bounds.south,
            east: bounds.east,
            west: bounds.west
        }));
        const data = await response.json();
        setProperties(data.properties);
    };

    const handleMarkerClick = (property) => {
        setSelectedProperty(property);
    };

    return (
        <LoadScript googleMapsApiKey={'AIzaSyB1Tdhuiy1tk6QluPWGU7pwMZyotQqbcQA'}>
            <GoogleMap
                mapContainerClassName="w-full h-[600px]"
                center={center}
                zoom={13}
                onLoad={map => {
                    mapRef.current = map;
                }}
                onIdle={() => {
                    if (mapRef.current) {
                        const bounds = mapRef.current.getBounds();
                        loadPropertiesInBounds(bounds);
                    }
                }}
            >
                {properties.map(property => (
                    <Marker
                        key={property.id}
                        position={{
                            lat: property.latitude,
                            lng: property.longitude
                        }}
                        onClick={() => handleMarkerClick(property)}
                    />
                ))}
                
                {selectedProperty && (
                    <InfoWindow
                        position={{
                            lat: selectedProperty.latitude,
                            lng: selectedProperty.longitude
                        }}
                        onCloseClick={() => setSelectedProperty(null)}
                    >
                        <div className="p-4 max-w-sm">
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
            </GoogleMap>
        </LoadScript>
    );
};

export default Map;
