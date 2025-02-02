import React from 'react';

const Description = ({ formData, setFormData }) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-gray-700 mb-2">Create your title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Cozy apartment in the heart of Paris"
          className="w-full p-4 border border-gray-300 rounded-lg focus:border-gray-500 focus:ring-0"
          maxLength={50}
        />
        <p className="text-sm text-gray-500 mt-2">
          {50 - (formData.title?.length || 0)} characters remaining
        </p>
      </div>

      <div>
        <label className="block text-gray-700 mb-2">Write your description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Tell guests what makes your place special..."
          className="w-full p-4 border border-gray-300 rounded-lg h-40 focus:border-gray-500 focus:ring-0"
          maxLength={500}
        />
        <p className="text-sm text-gray-500 mt-2">
          {500 - (formData.description?.length || 0)} characters remaining
        </p>
      </div>
    </div>
  );
};

export default Description;
