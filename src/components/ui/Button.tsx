import React, {type ButtonHTMLAttributes} from 'react';
import {useTheme} from '../../context/ThemeContext';
import Spinner from './Spinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
    isLoading?: boolean;
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
                                           children,
                                           variant = 'primary',
                                           isLoading = false,
                                           className = '',
                                           ...props
                                       }) => {
    const {isDarkMode} = useTheme();
    const baseClasses = 'inline-flex items-center justify-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

    const getVariantClasses = () => {
        switch (variant) {
            case 'primary':
                return 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500';
            case 'secondary':
                return isDarkMode
                    ? 'bg-gray-700 text-white border-gray-600 hover:bg-gray-600 focus:ring-indigo-500'
                    : 'bg-gray-100 text-gray-900 border-gray-300 hover:bg-gray-200 focus:ring-indigo-500';
            case 'danger':
                return 'bg-red-600 text-white border-red-600 hover:bg-red-700 focus:ring-red-500';
            default:
                return '';
        }
    };

    return (
        <button
            className={`${baseClasses} ${getVariantClasses()} ${className}`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? <Spinner size="sm"/> : children}
        </button>
    );
};

export default Button;