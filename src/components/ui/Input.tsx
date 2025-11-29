import React, {type InputHTMLAttributes} from 'react';
import {useTheme} from '../../context/ThemeContext';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input: React.FC<InputProps> = ({label, id, error, className, ...props}) => {
    const {isDarkMode} = useTheme();

    return (
        <div>
            {label && (
                <label
                    htmlFor={id}
                    className={`block text-sm font-medium mb-1 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                    {label}
                </label>
            )}
            <input
                id={id}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                    isDarkMode
                        ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } ${className}`}
                {...props}
            />
            {error && (
                <p className={`mt-1 text-xs ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                    {error}
                </p>
            )}
        </div>
    );
};

export default Input;