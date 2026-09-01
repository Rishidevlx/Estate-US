import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const InputField = ({ label, id, type = 'text', value, onChange, placeholder, required }) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[0.95rem] font-medium text-[#113C2B]">
        {label}
      </label>
      <div className="relative flex items-center">
        <input
          type={inputType}
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full p-4 border border-gray-300 rounded-md text-base transition-all duration-300 bg-gray-50 focus:outline-none focus:border-[#113C2B] focus:bg-white focus:ring-[3px] focus:ring-[#113C2B]/10 pr-12"
        />
        {isPassword && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-4 text-gray-500 hover:text-[#113C2B] transition-colors focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default InputField;
