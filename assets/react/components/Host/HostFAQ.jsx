import React, { useState } from 'react';

const HostFAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  
  const faqs = [
    {
      question: "Is my place suitable for HostMe?",
      answer: "All kinds of places are welcome on HostMe - apartments, houses, rooms, unique spaces, and more!"
    },
    {
      question: "How much control do I have over my bookings?",
      answer: "You have full control over your calendar, prices, house rules, and how you interact with guests."
    },
    {
      question: "How much should I interact with guests?",
      answer: "It's up to you! Some hosts prefer to greet their guests in person, while others only communicate through the app."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-semibold mb-16 text-center">
          Common questions about hosting
        </h2>
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200">
              <button
                className="w-full py-6 flex justify-between items-center text-left"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="text-lg font-medium">{faq.question}</span>
                <svg
                  className={`w-6 h-6 transform transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {openIndex === index && (
                <div className="pb-6 text-gray-600">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HostFAQ;
