import React, {type ReactNode} from 'react';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({children}) => {
    return (
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white">
            {children}
        </main>
    );
};

export default Layout;