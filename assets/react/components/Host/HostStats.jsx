import React from 'react';

const HostStats = () => {
  const stats = [
    { number: '4M+', label: 'Global Hosts' },
    { number: '$9.6K', label: 'Average annual host earnings' },
    { number: '1.4B', label: 'Guest arrivals to date' },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 text-center">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className="text-5xl font-bold mb-2">{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HostStats;
