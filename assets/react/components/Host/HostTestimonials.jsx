import React from 'react';

const HostTestimonials = () => {
  const testimonials = [
    {
      quote: "Hosting has helped me become financially independent and live an exciting life.",
      author: "Sarah J.",
      location: "Host in London",
      image: "/images/testimonial1.jpg"
    },
    {
      quote: "We've met amazing people and created lasting friendships through hosting.",
      author: "Michel & Marie",
      location: "Hosts in Paris",
      image: "/images/testimonial2.jpg"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-semibold mb-16 text-center">
          Hear from our hosts
        </h2>
        <div className="grid md:grid-cols-2 gap-12">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-sm">
              <blockquote className="text-xl mb-6">"{testimonial.quote}"</blockquote>
              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-gray-600">{testimonial.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HostTestimonials;
