import React from 'react';

const HostSetupSteps = () => {
  const steps = [
    {
      title: 'Tell us about your place',
      description: 'Share some basic info, like where it is and how many guests can stay.',
      icon: '🏠'
    },
    {
      title: 'Make it stand out',
      description: "Add 5 or more photos plus a title and description—we'll help you out.",
      icon: '📸'
    },
    {
      title: 'Finish up and publish',
      description: 'Set a starting price and publish your listing.',
      icon: '✨'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-semibold mb-16 text-center">
          It's easy to get started on HostMe
        </h2>
        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HostSetupSteps;
