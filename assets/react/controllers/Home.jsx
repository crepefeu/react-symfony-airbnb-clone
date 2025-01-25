import React from 'react';
import Map from './Map';
import PropertiesList from '../components/PropertiesList';
import ViewToggle from '../components/ViewToggle';
import Header from '../components/Header';
import { ViewProvider, useView } from '../contexts/ViewContext';

const HomeContent = () => {
    const { isMapView } = useView();

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex-1 relative">
                <div className="absolute inset-x-0 top-0 w-full">
                    {isMapView ? (
                        <div className="fixed top-16 left-0 right-0 bottom-0">
                            <Map />
                        </div>
                    ) : (
                        <div className="min-h-[calc(100vh-64px)] mt-16">
                            <PropertiesList />
                        </div>
                    )}
                </div>
                <ViewToggle />
            </div>
        </div>
    );
};

const Home = () => (
    <ViewProvider>
        <HomeContent />
    </ViewProvider>
);

export default Home;
