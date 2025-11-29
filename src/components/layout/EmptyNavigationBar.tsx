import {Link} from 'react-router-dom';
import {useTheme} from '../../context/ThemeContext';

export function EmptyNavigationBar() {
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
                            <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </nav>
    );
}