import {Link} from 'react-router-dom';
import {useTheme} from '../../context/ThemeContext';
import {SunLightThemeLogo} from "../logos/shared/SunLightThemeLogo.tsx";
import {MoonDarkThemeLogo} from "../logos/shared/MoonDarkThemeLogo.tsx";

export function StandardNavigationBar() {
    const {isDarkMode, toggleTheme} = useTheme();

    return (
        <nav className={`shadow-lg border-b backdrop-blur-sm sticky top-0 z-50 transition-colors duration-300 ${
            isDarkMode
                ? 'bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700/50'
                : 'bg-white border-gray-200'
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/auth" className="flex items-center gap-2 group">
                        <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-pink-700 transition-all">
                            LCorpNotes
                        </span>
                    </Link>

                    <button
                        onClick={toggleTheme}
                        className={`p-2 rounded-xl transition-all group ${
                            isDarkMode
                                ? 'text-gray-300 hover:text-indigo-300 hover:bg-indigo-500/10'
                                : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                        }`}
                        title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
                        {isDarkMode ? (
                            <SunLightThemeLogo/>
                        ) : (
                            <MoonDarkThemeLogo/>
                        )}
                    </button>
                </div>
            </div>
        </nav>
    );
}