import React from 'react';

const QuantitySelector = ({ value = 1, onChange, min = 1, max = 20 }) => {
  const handleDecrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div className="custom-qty-selector" onClick={(e) => e.stopPropagation()}>
      <button type="button" onClick={handleDecrement} disabled={value <= min}>
        <i className="fas fa-minus" style={{ fontSize: '10px' }}></i>
      </button>
      <span>{value}</span>
      <button type="button" onClick={handleIncrement} disabled={value >= max}>
        <i className="fas fa-plus" style={{ fontSize: '10px' }}></i>
      </button>
    </div>
  );
};

export default QuantitySelector;
