import React from 'react';

const Description = ({ formData, setFormData }) => {
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setFormData({
      ...formData,
      title: newTitle
    });
  };

  const handleDescriptionChange = (e) => {
    const newDescription = e.target.value;
    setFormData({
      ...formData,
      description: newDescription
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title
        </label>
        <input
          type="text"
          value={formData.title || ''}
          onChange={handleTitleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          placeholder="Enter a catchy title for your place"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={formData.description || ''}
          onChange={handleDescriptionChange}
          rows={6}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          placeholder="Describe what makes your place special"
        />
      </div>
    </div>
  );
};

export default Description;
