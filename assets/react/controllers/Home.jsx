import React from 'react';
import Map from './Map';
import PropertiesList from '../components/PropertiesList';
import ViewToggle from '../components/ViewToggle';
import Layout from '../components/Layout';
import { ViewProvider, useView } from '../contexts/ViewContext';

const HomeContent = () => {
    const { isMapView } = useView();
    
    const breadcrumbs = !isMapView ? [
        { label: 'List View' }
    ] : null;

    return (
        <Layout breadcrumbs={breadcrumbs}>
            {isMapView ? (
                <div className="fixed inset-0 mt-16">
                    <Map />
                </div>
            ) : (
                <div className="mx-auto h-full overflow-y-auto pb-16 px-8 mt-6">
                    <PropertiesList />
                </div>
            )}
            <ViewToggle />
        </Layout>
    );
};

const Home = () => (
    <ViewProvider>
        <HomeContent />
    </ViewProvider>
);

export default Home;
