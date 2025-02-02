import React from 'react';
import PropTypes from 'prop-types';

const PriceMarker = ({ price, isSelected, onClick }) => {
  return (
    <div className="relative inline-block" style={{ transform: 'translate(-50%, -100%)' }}>
      <button
        onClick={onClick}
        className={`
          relative
          transition-all duration-200 ease-in-out
          px-5 py-2.5 text-base
          rounded-2xl
          shadow-md hover:shadow-lg
          ${isSelected
            ? 'bg-black text-white scale-110'
            : 'bg-white text-gray-900 hover:scale-105'
          }
        `}
      >
        <span className="font-semibold whitespace-nowrap">
          {price}€
        </span>
      </button>
      {/* Arrow */}
      <div 
        className={`
          absolute -bottom-2 left-1/2 
          w-4 h-4 
          -translate-x-1/2 
          rotate-45
          ${isSelected ? 'bg-black' : 'bg-white'}
        `} 
        style={{
          boxShadow: '2px 2px 2px rgba(0,0,0,0.1)'
        }}
      />
    </div>
  );
};

PriceMarker.propTypes = {
  price: PropTypes.number.isRequired,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func,
};

PriceMarker.defaultProps = {
  isSelected: false,
  onClick: () => {},
};

export default PriceMarker;
