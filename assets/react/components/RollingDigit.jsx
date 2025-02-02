import React, { useEffect, useState } from 'react';

const RollingDigit = ({ digit, animate }) => {
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const [position, setPosition] = useState(0);

  useEffect(() => {
    if (animate) {
      const rolls = 1; // Number of complete rolls before landing on target
      const duration = 700; // Duration in milliseconds
      const steps = rolls * 10 + (digit - position + 10) % 10;
      const interval = duration / steps;
      
      let currentStep = 0;
      const timer = setInterval(() => {
        setPosition(prev => (prev + 1) % 10);
        currentStep++;
        
        if (currentStep >= steps) {
          clearInterval(timer);
          setPosition(digit);
        }
      }, interval);

      return () => clearInterval(timer);
    } else {
      setPosition(digit);
    }
  }, [digit, animate]);

  return (
    <div className="inline-block h-[1em] overflow-hidden">
      <div
        className="transition-transform duration-75"
        style={{
          transform: `translateY(${-position}em)`
        }}
      >
        {numbers.map((num) => (
          <div key={num} className="h-[1em] leading-none">
            {num}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RollingDigit;
