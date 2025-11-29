import React, {type ReactNode} from 'react';
import {useTheme} from "../../context/ThemeContext.tsx";

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({children}) => {
    const {isDarkMode} = useTheme();

    return (
        <main className={`flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
            {children}
        </main>
    );
};

export default Layout;