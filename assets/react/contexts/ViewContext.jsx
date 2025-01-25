import React, { createContext, useContext, useState } from 'react';

const ViewContext = createContext();

export const ViewProvider = ({ children }) => {
    const [isMapView, setIsMapView] = useState(false);

    return (
        <ViewContext.Provider value={{ isMapView, setIsMapView }}>
            {children}
        </ViewContext.Provider>
    );
};

export const useView = () => useContext(ViewContext);
