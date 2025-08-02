import React from 'react';

interface InputFieldProps {
  type: string;
  name: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  type,
  name,
  placeholder,
  value,
  onChange,
  required = true,
}) => (
  <div className="mb-4">
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-gray-400 text-gray-700 placeholder-gray-400"
    />
  </div>
);

export default InputField;