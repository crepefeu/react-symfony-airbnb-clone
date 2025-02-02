import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const Photos = ({ formData, setFormData }) => {
  const onDrop = useCallback((acceptedFiles) => {
    const newPhotos = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setFormData({
      ...formData,
      photos: [...formData.photos, ...newPhotos]
    });
  }, [formData, setFormData]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {'image/*': []},
    multiple: true
  });

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-rose-500 bg-rose-50' : 'border-gray-300 hover:border-gray-400'}`}
      >
        <input {...getInputProps()} />
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
        </svg>
        <p className="mt-4 text-gray-600">
          {isDragActive ? 'Drop the files here' : 'Drag & drop photos here, or click to select'}
        </p>
      </div>

      {formData.photos.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {formData.photos.map((photo, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
              <img
                src={photo.preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => {
                  const newPhotos = [...formData.photos];
                  newPhotos.splice(index, 1);
                  setFormData({ ...formData, photos: newPhotos });
                }}
                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
              >
                <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Photos;
