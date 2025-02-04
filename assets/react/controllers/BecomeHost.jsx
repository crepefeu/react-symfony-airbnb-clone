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

const mapApiDataToFormData = (apiData) => {
  if (!apiData) return null;
  
  // Ensure numeric values are properly initialized
  const numericDefaults = {
    price: '',
    guests: 1,
    bedrooms: 1,
    bathrooms: 1
  };

  return {
    propertyType: apiData.propertyType || '',
    latitude: apiData.latitude || null,
    longitude: apiData.longitude || null,
    address: apiData.address || {
      streetName: '',
      streetNumber: '',
      city: '',
      state: '',
      zipcode: '',
      country: 'France'
    },
    // Use default values for numeric fields if undefined or null
    guests: apiData.guests !== undefined ? Number(apiData.guests) : numericDefaults.guests,
    bedrooms: apiData.bedrooms !== undefined ? Number(apiData.bedrooms) : numericDefaults.bedrooms,
    bathrooms: apiData.bathrooms !== undefined ? Number(apiData.bathrooms) : numericDefaults.bathrooms,
    price: apiData.price !== undefined ? Number(apiData.price) : numericDefaults.price,
    amenities: apiData.amenities || [],
    photos: apiData.photos || [],
    title: apiData.title || '',
    description: apiData.description || '',
  };
};

const BecomeHost = ({ draftId: initialDraftId = null }) => {
  const { user, token } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [draftId, setDraftId] = useState(initialDraftId);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    propertyType: '',
    latitude: null,
    longitude: null,
    address: {
      streetName: '',
      streetNumber: '',
      city: '',
      state: '',
      zipcode: '',
      country: 'France'
    },
    guests: 1,
    bedrooms: 1,
    bathrooms: 1,
    amenities: [],
    photos: [],
    title: '',
    description: '',
    price: '',
  });
  const [completedSteps, setCompletedSteps] = useState([]);

  // Initialize state from API
  useEffect(() => {
    const loadDraft = async () => {
      const pathDraftId = window.location.pathname.split('/').pop();
      
      if (pathDraftId && pathDraftId !== 'become-a-host') {
        setDraftId(pathDraftId); // Set draftId first
      }

      if (!pathDraftId || pathDraftId === 'become-a-host') {
        // Create new draft if we don't have one
        try {
          const response = await fetch('/property-drafts/api/create', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          const data = await response.json();
          setDraftId(data.draftId);
          window.history.replaceState({}, '', `/property-drafts/become-a-host/${data.draftId}`);
        } catch (error) {
          console.error('Error creating draft:', error);
        }
        setIsLoading(false);
        return;
      }

      try {
        const [draftResponse, amenitiesResponse] = await Promise.all([
          fetch(`/property-drafts/api/${pathDraftId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            }
          }),
          fetch('/api/amenities')
        ]);

        if (!draftResponse.ok) {
          throw new Error('Failed to load draft');
        }

        const [draftData, amenitiesData] = await Promise.all([
          draftResponse.json(),
          amenitiesResponse.json()
        ]);

        // Merge amenities data with draft data
        const mappedFormData = {
          ...mapApiDataToFormData(draftData.data),
          amenitiesData: amenitiesData.amenities
        };

        setStep(draftData.currentStep || 1);
        setFormData(mappedFormData);
        setDraftId(draftData.id);
      } catch (error) {
        console.error('Error loading draft:', error);
        setError('Failed to load your draft. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      loadDraft();
    } else {
      setIsLoading(false);
    }
  }, [token]);

  // Add manual save function
  const handleManualSave = async () => {
    if (!draftId) return;
    
    setIsSaving(true);
    setSaveStatus('Saving...');
    
    try {
      const response = await fetch('/property-drafts/api/save', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          draftId,
          formData,
          currentStep: step
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save draft');
      }

      setSaveStatus('Draft saved');
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (error) {
      console.error('Error saving draft:', error);
      setSaveStatus('Error saving');
    } finally {
      setIsSaving(false);
    }
  };

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
      amenities: formData.amenities, // This will now be an array of IDs
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

  // Auto-save draft when form data changes
  useEffect(() => {
    const saveDraft = async () => {
      if (!token || !formData || !draftId) return;

      try {
        const response = await fetch('/property-drafts/api/save', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            draftId,
            formData,
            currentStep: step
          }),
        });

        if (!response.ok) {
          console.error('Error saving draft:', await response.json());
        }
      } catch (error) {
        console.error('Error saving draft:', error);
      }
    };

    const timeoutId = setTimeout(saveDraft, 1000);
    return () => clearTimeout(timeoutId);
  }, [formData, step, token, draftId]);

  const handleSubmit = async () => {
    try {
        // Ensure price is a number before submitting
        const formDataToSubmit = {
            ...formData,
            price: parseInt(formData.price) || 0
        };

        console.log('Submitting data:', formDataToSubmit); // Debug log

        const response = await fetch(`/property-drafts/api/${draftId}/publish`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataToSubmit)
        });

        const data = await response.json();

        if (response.ok) {
            window.location.href = `/property/${data.propertyId}`;
        } else {
            alert(data.error || 'Error creating property. Please try again.');
        }
    } catch (error) {
        console.error('Error creating property:', error);
        alert(error.message || 'An unexpected error occurred. Please try again.');
    }
};

  // Add cleanup on component unmount (optional)
  useEffect(() => {
    return () => {
      // Cleanup is now handled by the API
    };
  }, []);

  const steps = [
    { 
      title: 'What type of place will you host?', 
      subtitle: 'Choose the option that best describes your place',
      component: 'PropertyType' 
    },
    { 
      title: "Where's your place located?", 
      subtitle: 'Enter your exact address so guests can find your place',
      component: "Location" 
    },
    { 
      title: 'How many guests can your place accommodate?', 
      subtitle: 'Make sure you have enough space for your guests to be comfortable',
      component: 'Capacity' 
    },
    { 
      title: 'What amenities do you offer?', 
      subtitle: 'Select all the amenities available at your place',
      component: 'Amenities' 
    },
    { 
      title: "Let's add some photos of your place", 
      subtitle: 'Start with your best shot - drag photos to reorder them',
      component: "Photos" 
    },
    { 
      title: "Create your description", 
      subtitle: 'Write a clear summary to help guests know what to expect',
      component: "Description" 
    },
    { 
      title: 'Now, set your price', 
      subtitle: 'You can always change it later and offer special deals',
      component: 'Price' 
    },
    { 
      title: 'Review your listing', 
      subtitle: 'Make sure everything looks good before publishing',
      component: 'Review' 
    },
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
    // Save before moving to next step
    handleManualSave().then(() => {
      if (step < steps.length) {
        setStep(step + 1);
      } else {
        handleSubmit();
      }
    });
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
        return <Photos formData={formData} setFormData={setFormData} draftId={draftId} />;
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

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your draft...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-rose-600 text-white px-6 py-3 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
      {/* Header with save button */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              {/* Logo or back button could go here */}
              <a href="/property-drafts/become-a-host" className="text-gray-400 hover:text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </a>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">{saveStatus}</span>
              <button
                onClick={handleManualSave}
                disabled={isSaving}
                className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 ${
                  isSaving 
                    ? 'bg-gray-100 text-gray-400' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                  <polyline points="17 21 17 13 7 13 7 21"/>
                  <polyline points="7 3 7 8 15 8"/>
                </svg>
                Save draft
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add top padding to account for fixed header */}
      <div className="pt-16">
        {/* Step Navigation */}
        <StepNavigation 
          steps={steps} 
          currentStep={step} 
          onStepClick={handleStepClick}
          completedSteps={completedSteps}
        />

        {/* Main content - Updated max-width and padding */}
        <div className="max-w-3xl mx-auto px-6 py-16">
          <div className="mx-auto">
            <h1 className="text-3xl font-semibold mb-2">{steps[step - 1].title}</h1>
            <p className="text-gray-500 mb-8">{steps[step - 1].subtitle}</p>

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
            <div className="h-1 bg-gray-200">              <div                 className="h-full bg-rose-600 transition-all duration-500"
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
    </div>
  );
};

export default BecomeHost;
