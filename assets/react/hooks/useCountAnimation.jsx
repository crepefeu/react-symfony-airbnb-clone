import { useState, useEffect } from 'react';

export const useCountAnimation = (targetValue, duration = 1000, steps = 30) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startValue = count;
    const increment = (targetValue - startValue) / steps;
    const stepTime = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const newValue = startValue + (increment * currentStep);
      
      if (currentStep === steps) {
        setCount(targetValue);
        clearInterval(timer);
      } else {
        setCount(Math.round(newValue));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [targetValue]);

  return count;
};