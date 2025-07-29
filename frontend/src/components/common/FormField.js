import React from 'react';

const FormField = ({ 
  label, 
  type = 'text', 
  name, 
  value, 
  onChange, 
  placeholder, 
  options = [], 
  className = '',
  readOnly = false
}) => {
  const baseInputClasses = readOnly 
    ? "w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-300 cursor-not-allowed"
    : "w-full p-3 rounded-lg bg-gray-800 border border-gray-600 focus:border-purple-500 focus:outline-none text-white";

  const renderField = () => {
    switch (type) {
      case 'select':
        return (
          <select 
            name={name}
            value={value}
            onChange={onChange}
            className={baseInputClasses}
          >
            {options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'textarea':
        return (
          <textarea 
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`${baseInputClasses} h-24 resize-none`}
            readOnly={readOnly}
            rows={4}
          />
        );
      
      default:
        return (
          <input 
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={baseInputClasses}
            readOnly={readOnly}
          />
        );
    }
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium mb-2 text-gray-300">
          {label}
        </label>
      )}
      {renderField()}
    </div>
  );
};

export default FormField;
