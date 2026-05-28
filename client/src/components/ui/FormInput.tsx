import { type InputHTMLAttributes } from 'react';
import { type UseFormRegisterReturn } from 'react-hook-form';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  registration: UseFormRegisterReturn;
  rightElement?: React.ReactNode; // for "Forgot password?" link
}

export default function FormInput({
  label,
  error,
  registration,
  rightElement,
  ...props
}: FormInputProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label className="block text-sm">{label}</label>
        {rightElement}
      </div>
      <input
        className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 transition
          ${error
            ? 'border-red-400 focus:ring-red-400'
            : 'border-gray-200 focus:ring-gray-400'
          }`}
        {...registration}
        {...props}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}