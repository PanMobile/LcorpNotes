import React, {type ReactNode} from 'react';
import {X} from 'lucide-react';
import {useTheme} from '../../context/ThemeContext';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({isOpen, onClose, title, children}) => {
    const {isDarkMode} = useTheme();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 transition-opacity"
             onClick={onClose}>
            <div
                className={`rounded-lg shadow-xl w-full max-w-md m-4 transform transition-all border ${
                    isDarkMode
                        ? 'bg-gray-800 border-gray-700'
                        : 'bg-white border-gray-200'
                }`}
                onClick={e => e.stopPropagation()}>
                <div className={`flex justify-between items-center p-4 border-b ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-200'
                }`}>
                    <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className={`transition-colors ${
                            isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'
                        }`}>
                        <X size={24}/>
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;