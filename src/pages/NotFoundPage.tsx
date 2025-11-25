import React from 'react';
import {Link} from 'react-router-dom';

const NotFoundPage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-center px-4 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-2xl">
                {/* 404 Icon */}
                <div className="mb-8 flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                        <div className="relative p-8 bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-full border border-gray-700/50">
                            <svg className="w-24 h-24 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </div>
                    </div>
                </div>

                {/* 404 Text */}
                <h1 className="text-8xl md:text-9xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 animate-pulse">
                    404
                </h1>

                {/* Page Not Found */}
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Page Not Found
                </h2>

                {/* Description */}
                <p className="text-lg text-gray-300 mb-8 max-w-md mx-auto leading-relaxed">
                    Oops! The page you're looking for seems to have vanished into the digital void. It might have been moved, deleted, or never existed.
                </p>

                {/* Helpful Links */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                    <Link to="/">
                        <button className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                            </svg>
                            Go to Homepage
                        </button>
                    </Link>

                    <Link to="/folders">
                        <button className="px-8 py-4 border-2 border-indigo-500/50 text-indigo-400 font-semibold rounded-xl hover:bg-indigo-500/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
                            </svg>
                            View My Folders
                        </button>
                    </Link>
                </div>

                {/* Fun Error Message */}
                <div className="mt-12 p-6 bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-2xl border border-gray-700/50 max-w-md mx-auto">
                    <p className="text-sm text-gray-400 italic">
                        "Not all those who wander are lost... but this page definitely is."
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;