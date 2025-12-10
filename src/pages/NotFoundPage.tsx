import React from 'react';
import {Link} from 'react-router-dom';
import {HomeLogo} from "../components/logos/notFoundPage/HomeLogo.tsx";
import {SadLogo} from "../components/logos/notFoundPage/SadLogo.tsx";

//Обычная странциа не найдено
const NotFoundPage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-center px-4 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
            </div>

            <div className="relative z-10 max-w-2xl">
                <div className="mb-8 flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                        <div className="relative p-8 bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-full border border-gray-700/50">
                            <SadLogo/>
                        </div>
                    </div>
                </div>
                <h1 className="text-8xl md:text-9xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 animate-pulse">
                    404
                </h1>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Page Not Found
                </h2>
                <p className="text-lg text-gray-300 mb-8 max-w-md mx-auto leading-relaxed">

                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                    <Link to="/folders">
                        <button className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 flex items-center gap-2">
                            <HomeLogo/>
                            Go to Homepage
                        </button>
                    </Link>
                </div>
                <div className="mt-12 p-6 bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-2xl border border-gray-700/50 max-w-md mx-auto">
                    <p className="text-sm text-gray-400 italic">
                        "Kotlin is definitely better than Java, bruh"
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;