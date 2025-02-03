import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import PropertyType from '../components/BecomeHost/PropertyType';
import Location from '../components/BecomeHost/Location';
import Capacity from '../components/BecomeHost/Capacity';
import Photos from '../components/BecomeHost/Photos';
import Description from '../components/BecomeHost/Description';
import Price from '../components/BecomeHost/Price';
import Review from '../components/BecomeHost/Review';
import Amenities from '../components/BecomeHost/Amenities';

const StepNavigation = ({ steps, currentStep, onStepClick, completedSteps }) => {
  return (
    <div className="fixed left-8 top-1/2 transform -translate-y-1/2 space-y-4">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = completedSteps.includes(stepNumber);
        
        return (
          <div 
            key={index}
            className="group flex items-center gap-3 cursor-pointer"
            onClick={() => onStepClick(stepNumber)}
          >
            <div 
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                isCompleted 
                  ? 'bg-green-500' 
                  : currentStep === stepNumber
                    ? 'bg-rose-600 scale-125'
                    : 'bg-gray-300 group-hover:bg-gray-400'
              }`}
            />
            <div 
              className={`text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                isCompleted 
                  ? 'text-green-500'
                  : currentStep === stepNumber 
                    ? 'text-rose-600 font-medium' 
                    : 'text-gray-600'
              }`}
            >
              {step.title}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const BecomeHost = () => {
  const { user, token } = useAuth();
  
  // Initialize state from localStorage or default values
  const [step, setStep] = useState(() => {
    const saved = localStorage.getItem('hostingStep');
    return saved ? parseInt(saved) : 1;
  });

  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('hostingFormData');
    return saved ? JSON.parse(saved) : {
      propertyType: '',
      location: '',
      guests: 1,
      bedrooms: 1,
      bathrooms: 1,
      amenities: [],
      amenitiesData: [], // Add this line
      photos: [],
      title: '',
      description: '',
      price: '',
    };
  });

  const [completedSteps, setCompletedSteps] = useState(() => {
    const saved = localStorage.getItem('completedSteps');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('hostingStep', step);
    localStorage.setItem('hostingFormData', JSON.stringify(formData));
    localStorage.setItem('completedSteps', JSON.stringify(completedSteps));
  }, [step, formData, completedSteps]);

  // Cleanup localStorage when form is submitted
  const prepareFormDataForSubmission = () => {
    const formDataToSubmit = new FormData();

    const propertyData = {
      title: formData.title,
      description: formData.description,
      price: parseInt(formData.price),
      propertyType: formData.propertyType,
      maxGuests: parseInt(formData.guests),
      bedrooms: parseInt(formData.bedrooms),
      bathrooms: parseInt(formData.bathrooms),
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      amenities: formData.amenities, // Add this line to include amenities
      address: typeof formData.address === 'string' 
        ? {
            streetName: formData.address,
            city: '',
            state: '',
            zipcode: '',
            country: 'France'
          }
        : formData.address
    };

    // Debug log to verify amenities are included
    console.log('Property data being sent:', propertyData);

    formDataToSubmit.append('property', JSON.stringify(propertyData));

    // Handle photos
    formData.photos.forEach((photo, index) => {
      formDataToSubmit.append(`photos[]`, photo);
    });

    return formDataToSubmit;
  };

  const handleSubmit = async () => {
    try {
      // Validate all required fields
      if (!isAllStepsComplete()) {
        alert('Please complete all required fields before publishing');
        return;
      }

      const formDataToSubmit = prepareFormDataForSubmission();

      const response = await fetch('/api/properties/create', { 
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSubmit,
      });

      const data = await response.json();

      if (response.ok) {
        // Clear localStorage
        localStorage.removeItem('hostingStep');
        localStorage.removeItem('hostingFormData');
        localStorage.removeItem('completedSteps');

        // Redirect to the new property page
        window.location.href = `/property/${data.id}`;
      } else {
        // Handle specific error messages from the server
        alert(data.message || 'Error creating property. Please try again.');
      }
    } catch (error) {
      console.error('Error creating property:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  const isAllStepsComplete = () => {
    return (
      !!formData.propertyType &&
      !!formData.latitude &&
      !!formData.longitude &&
      !!formData.address &&
      !!formData.guests &&
      !!formData.bedrooms &&
      !!formData.bathrooms &&
      formData.photos.length > 0 &&
      !!formData.title &&
      !!formData.description &&
      !!formData.price
    );
  };

  // Add cleanup on component unmount (optional)
  useEffect(() => {
    return () => {
      // Uncomment the following lines if you want to clear data when leaving the page
      localStorage.removeItem('hostingStep');
      localStorage.removeItem('hostingFormData');
    };
  }, []);

  const steps = [
    { title: 'What type of place will you host?', component: 'PropertyType' },
    { title: "Where's your place located?", component: "Location" },
    { title: 'How many guests can your place accommodate?', component: 'Capacity' },
    { title: 'What amenities do you offer?', component: 'Amenities' }, // Add new step
    { title: "Let's add some photos of your place", component: "Photos" },
    { title: "Create your description", component: "Description" },
    { title: 'Now, set your price', component: 'Price' },
    { title: 'Review your listing', component: 'Review' },
  ];

  const isStepComplete = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        return !!formData.propertyType;
      case 2:
        return !!formData.latitude && !!formData.longitude;
      case 3:
        return !!formData.guests && !!formData.bedrooms && !!formData.bathrooms;
      case 4:
        return formData.amenities.length > 0;
      case 5:
        return formData.photos.length > 0;
      case 6:
        return !!formData.title && !!formData.description;
      case 7:
        return !!formData.price;
      case 8:
        return true; // Review step is always accessible if previous steps are complete
      default:
        return false;
    }
  };

  const updateCompletedSteps = () => {
    const completed = [];
    for (let i = 1; i <= steps.length; i++) {
      if (isStepComplete(i)) {
        completed.push(i);
      }
    }
    setCompletedSteps(completed);
  };

  // Check for completed steps whenever formData changes
  useEffect(() => {
    updateCompletedSteps();
  }, [formData]);

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

  const handleStepClick = (newStep) => {
    // Allow navigation to any step
    setStep(newStep);
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
        return <Amenities formData={formData} setFormData={setFormData} />;
      case 5:
        return <Photos formData={formData} setFormData={setFormData} />;
      case 6:
        return <Description formData={formData} setFormData={setFormData} />;
      case 7:
        return <Price formData={formData} setFormData={setFormData} />;
      case 8:
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
    <div className="min-h-screen pb-20">
      {/* Step Navigation */}
      <StepNavigation 
        steps={steps} 
        currentStep={step} 
        onStepClick={handleStepClick}
        completedSteps={completedSteps}
      />

      {/* Main content */}
      <div className="max-w-screen-xl mx-auto px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-semibold mb-8">{steps[step - 1].title}</h1>

          {/* Step content */}
          <div className="mb-8">
            {renderStepContent()}
          </div>
        </div>
      </div>

      {/* Fixed footer with progress bar and navigation buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
        <div className="mx-auto">
          {/* Progress bar */}
          <div className="h-1 bg-gray-200">
            <div 
              className="h-full bg-rose-600 transition-all duration-500"
              style={{ width: `${(step / steps.length) * 100}%` }}
            />
          </div>
          
          {/* Navigation buttons */}
          <div className="max-w-2xl mx-auto px-6">
            <div className="py-4 flex justify-between items-center">
              {step > 1 ? (
                <button
                  onClick={handleBack}
                  className="px-6 py-3 hover:bg-gray-50 rounded-lg flex items-center gap-2 text-gray-900"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m15 18-6-6 6-6"/>
                  </svg>
                  Back
                </button>
              ) : (
                <div></div>
              )}
              <button
                onClick={handleNext}
                className="ml-auto px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg flex items-center gap-2"
              >
                {step === steps.length ? 'Publish listing' : (
                  <>
                    Next
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m9 18 6-6-6-6"/>
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeHost;
