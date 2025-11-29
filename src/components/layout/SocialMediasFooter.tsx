import {useTheme} from '../../context/ThemeContext';
import {BsGithub, BsTelegram, BsWhatsapp} from "react-icons/bs";

export function SocialMediasFooter() {
    const {isDarkMode} = useTheme();

    return (
        <footer className={`transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
        } border-t`}>
            <div className="w-full max-w-7xl mx-auto px-4 py-8">
                <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1 gap-8">
                    <div>
                        <a
                            href="https://library-of-ruina.fandom.com/wiki/Lobotomy_Corporation"
                            className="flex items-center gap-2 group"
                            target="_blank"
                            rel="noopener noreferrer">
                            <span className={`text-xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-pink-700 transition-all`}>
                                LCorpNotes
                            </span>
                        </a>
                        <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            A (not) unique fullstack website 😍!
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-8 sm:mt-0 sm:grid-cols-3 sm:gap-6">
                        <div>
                            <h3 className={`mb-4 text-sm font-semibold uppercase ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                                Frontend
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <a
                                        href="https://www.typescriptlang.org/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`text-sm transition-colors ${
                                            isDarkMode
                                                ? 'text-gray-400 hover:text-indigo-400'
                                                : 'text-gray-600 hover:text-indigo-600'
                                        }`}>
                                        TypeScript
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://flowbite-react.com/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`text-sm transition-colors ${
                                            isDarkMode
                                                ? 'text-gray-400 hover:text-indigo-400'
                                                : 'text-gray-600 hover:text-indigo-600'
                                        }`}>
                                        Flowbite-React
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://tailwindcss.com/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`text-sm transition-colors ${
                                            isDarkMode
                                                ? 'text-gray-400 hover:text-indigo-400'
                                                : 'text-gray-600 hover:text-indigo-600'
                                        }`}>
                                        Tailwind CSS
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className={`mb-4 text-sm font-semibold uppercase ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                                Backend
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <a
                                        href="https://www.python.org/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`text-sm transition-colors ${
                                            isDarkMode
                                                ? 'text-gray-400 hover:text-indigo-400'
                                                : 'text-gray-600 hover:text-indigo-600'
                                        }`}>
                                        Python
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://flask.palletsprojects.com/en/stable/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`text-sm transition-colors ${
                                            isDarkMode
                                                ? 'text-gray-400 hover:text-indigo-400'
                                                : 'text-gray-600 hover:text-indigo-600'
                                        }`}>
                                        Flask
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://sqlite.org/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`text-sm transition-colors ${
                                            isDarkMode
                                                ? 'text-gray-400 hover:text-indigo-400'
                                                : 'text-gray-600 hover:text-indigo-600'
                                        }`}>
                                        SQLite
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className={`mb-4 text-sm font-semibold uppercase ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                                Psychicend
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <a
                                        href="https://www.catholicgallery.org/prayers/prayers-to-jesus/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`text-sm transition-colors ${
                                            isDarkMode
                                                ? 'text-gray-400 hover:text-indigo-400'
                                                : 'text-gray-600 hover:text-indigo-600'
                                        }`}>
                                        Prayers to Jesus
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://www.linearity.io/blog/anime-quotes/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`text-sm transition-colors ${
                                            isDarkMode
                                                ? 'text-gray-400 hover:text-indigo-400'
                                                : 'text-gray-600 hover:text-indigo-600'
                                        }`}>
                                        Anime Motivational Quotes
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://marvel.fandom.com/wiki/Peter_Parker_(Earth-616)"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`text-sm transition-colors ${
                                            isDarkMode
                                                ? 'text-gray-400 hover:text-indigo-400'
                                                : 'text-gray-600 hover:text-indigo-600'
                                        }`}>
                                        Peter Parker
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className={`my-6 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}></div>

                <div className="w-full sm:flex sm:items-center sm:justify-between">
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        © 2025{' '}
                        <a
                            href="https://library-of-ruina.fandom.com/wiki/Lobotomy_Corporation"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`transition-colors ${
                                isDarkMode
                                    ? 'hover:text-indigo-400'
                                    : 'hover:text-indigo-600'
                            }`}>
                            All Rights Are Not Reserved. Lobotomy Corporation is just a game reference™
                        </a>
                    </p>
                    <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
                        <a
                            href="https://t.me/NagaoWi"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`transition-colors ${
                                isDarkMode
                                    ? 'text-gray-400 hover:text-indigo-400'
                                    : 'text-gray-600 hover:text-indigo-600'
                            }`}
                            aria-label="Telegram">
                            <BsTelegram size={20} />
                        </a>
                        <a
                            href="https://wa.me/79649377791"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`transition-colors ${
                                isDarkMode
                                    ? 'text-gray-400 hover:text-indigo-400'
                                    : 'text-gray-600 hover:text-indigo-600'
                            }`}
                            aria-label="WhatsApp">
                            <BsWhatsapp size={20} />
                        </a>
                        <a
                            href="https://github.com/PanMobile"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`transition-colors ${
                                isDarkMode
                                    ? 'text-gray-400 hover:text-indigo-400'
                                    : 'text-gray-600 hover:text-indigo-600'
                            }`}
                            aria-label="GitHub">
                            <BsGithub size={20} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}