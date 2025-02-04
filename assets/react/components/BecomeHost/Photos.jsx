import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import PhotoUploadModal from './PhotoUploadModal';
import useAuth from '../../hooks/useAuth';

const Photos = ({ formData, setFormData, draftId }) => {
  const { token } = useAuth();
  const [selectedTileIndex, setSelectedTileIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const photos = Array.from(formData.photos);
    const [reorderedItem] = photos.splice(result.source.index, 1);
    photos.splice(result.destination.index, 0, reorderedItem);

    setFormData({ ...formData, photos: photos });
  };

  const handlePhotoUpload = (photo, shouldSave = false) => {
    const newPhotos = [...formData.photos];
    if (selectedTileIndex !== null) {
      newPhotos[selectedTileIndex] = photo;
    } else {
      newPhotos.push(photo);
    }

    // Use a callback to ensure we trigger handleManualSave after state update
    setFormData(prevFormData => {
      const newFormData = {
        ...prevFormData,
        photos: newPhotos
      };

      if (shouldSave) {
        // Trigger auto-save through parent component
        handleManualSave(newFormData);
      }

      return newFormData;
    });
  };

  // Add handleManualSave function
  const handleManualSave = async (newFormData) => {
    try {
      const response = await fetch('/api/drafts/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          draftId,
          formData: newFormData,
          currentStep: 5 // Photos step
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save draft');
      }
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  };

  const handleModalOpen = (index) => {
    setSelectedTileIndex(index);
    setIsModalOpen(true);
  };

  const handleRemovePhoto = (e, index) => {
    e.stopPropagation(); // Prevent opening the upload modal
    const newPhotos = [...formData.photos];
    newPhotos.splice(index, 1);
    setFormData({ ...formData, photos: newPhotos });
  };

  const renderPhotoTile = (index) => {
    const photo = formData.photos[index];
    const isEmpty = !photo;
    const isCoverPhoto = index === 0;
    const isAddMoreTile = index === 4;

    if (isAddMoreTile && !photo) {
      return (
        <div 
          className="aspect-[4/3] rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-400 cursor-pointer transition-all duration-200"
          onClick={() => handleModalOpen(null)}
        >
          <div className="h-full flex flex-col items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-600">Add more</span>
          </div>
        </div>
      );
    }

    return (
      <div 
        className={`relative cursor-pointer overflow-hidden group
          ${isEmpty ? 'bg-gray-50 border-2 border-dashed border-gray-300 hover:border-gray-400' : 'border-transparent'}
          ${isCoverPhoto ? 'aspect-[2/1]' : 'aspect-[4/3]'}
          rounded-xl transition-all duration-200 hover:opacity-90`}
        onClick={() => handleModalOpen(index)}
      >
        {photo ? (
          <>
            <img 
              src={photo.preview} 
              alt={`Photo ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {isCoverPhoto && (
              <div className="absolute top-2 left-2 px-2 py-1 bg-black bg-opacity-60 rounded-md">
                <span className="text-white text-sm font-medium flex items-center gap-1">
                  Cover photo
                </span>
              </div>
            )}
            <button
              onClick={(e) => handleRemovePhoto(e, index)}
              className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <svg 
              className="w-8 h-8 text-gray-400" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" 
              />
            </svg>
            {isCoverPhoto && (
              <div className="text-center mt-2">
                <span className="text-sm font-medium block">Add cover photo</span>
                <span className="text-xs text-gray-600">This will be the first photo guests see</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="photos" direction="vertical">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-2"
            >
              {/* Cover photo */}
              <Draggable
                key="photo-0"
                draggableId="photo-0"
                index={0}
                isDragDisabled={!formData.photos[0]}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    {renderPhotoTile(0)}
                  </div>
                )}
              </Draggable>

              {/* Grid of photos */}
              <div className="grid grid-cols-2 gap-2">
                {[...Array(Math.max(4, formData.photos.length))].map((_, i) => {
                  const index = i + 1;
                  const isLastTile = index === Math.max(4, formData.photos.length);

                  if (isLastTile && formData.photos.length >= 4) {
                    return renderPhotoTile(index);
                  }

                  return (
                    <Draggable
                      key={`photo-${index}`}
                      draggableId={`photo-${index}`}
                      index={index}
                      isDragDisabled={!formData.photos[index]}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {renderPhotoTile(index)}
                        </div>
                      )}
                    </Draggable>
                  );
                })}
              </div>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <PhotoUploadModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTileIndex(null);
        }}
        onUpload={handlePhotoUpload}
        existingPhoto={selectedTileIndex !== null ? formData.photos[selectedTileIndex] : null}
      />
    </>
  );
};

export default Photos;
