import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import PropertyType from '../components/BecomeHost/PropertyType';
import Location from '../components/BecomeHost/Location';
import Capacity from '../components/BecomeHost/Capacity';
import Photos from '../components/BecomeHost/Photos';
import Description from '../components/BecomeHost/Description';
import Price from '../components/BecomeHost/Price';
import Review from '../components/BecomeHost/Review';

const BecomeHost = () => {
  const { user, token } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    propertyType: '',
    location: '',
    guests: 1,
    bedrooms: 1,
    bathrooms: 1,
    amenities: [],
    photos: [],
    title: '',
    description: '',
    price: '',
  });

  const steps = [
    { title: 'What type of place will you host?', component: 'PropertyType' },
    { title: "Where's your place located?', component: 'Location" },
    { title: 'How many guests can your place accommodate?', component: 'Capacity' },
    { title: "Let's add some photos of your place', component: 'Photos" },
    { title: 'Create your description', component: 'Description' },
    { title: 'Now, set your price', component: 'Price' },
    { title: 'Review your listing', component: 'Review' },
  ];

  const handleNext = () => {
    if (step < steps.length) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        window.location.href = '/hosting';
      }
    } catch (error) {
      console.error('Error creating property:', error);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <PropertyType formData={formData} setFormData={setFormData} />;
      case 2:
        return <Location formData={formData} setFormData={setFormData} />;
      case 3:
        return <Capacity formData={formData} setFormData={setFormData} />;
      case 4:
        return <Photos formData={formData} setFormData={setFormData} />;
      case 5:
        return <Description formData={formData} setFormData={setFormData} />;
      case 6:
        return <Price formData={formData} setFormData={setFormData} />;
      case 7:
        return <Review formData={formData} />;
      default:
        return null;
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Please log in to become a host</h1>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-rose-600 text-white px-6 py-3 rounded-lg"
          >
            Log in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200">
        <div 
          className="h-full bg-rose-600 transition-all duration-500"
          style={{ width: `${(step / steps.length) * 100}%` }}
        />
      </div>

      {/* Main content */}
      <div className="max-w-screen-xl mx-auto px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-semibold mb-8">{steps[step - 1].title}</h1>

          {/* Step content */}
          <div className="mb-8">
            {renderStepContent()}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="px-6 py-3 border border-gray-300 rounded-lg"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="ml-auto px-6 py-3 bg-rose-600 text-white rounded-lg"
            >
              {step === steps.length ? 'Publish listing' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeHost;
