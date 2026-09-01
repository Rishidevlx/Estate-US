import React from 'react';

const Button = ({ children, type = 'button', onClick, className = '' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-[#113C2B] text-white border-none p-4 rounded-md text-lg font-semibold cursor-pointer transition-all duration-300 mt-4 hover:bg-[#0b271c] hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(17,60,43,0.2)] ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
