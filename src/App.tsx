import {Link, Navigate, Route, Routes, useLocation} from 'react-router-dom';
import './App.css';

import {apiFetch, AuthProvider, useAuth} from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import FoldersPage from './pages/FoldersPage';
import FolderDetailPage from './pages/FolderDetailPage.tsx';
import FavoritesPage from './pages/FavoritesPage';
import ProfilePage from './pages/ProfilePage';
import type {PrivateRouteProps, ShellProps} from "./models/types.ts";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import {useEffect, useState} from "react";
import {FoldersIcon} from "./components/logos/navigationBar/FoldersIcon.tsx";
import {FavoritesIcon} from "./components/logos/navigationBar/FavoritesIcon.tsx";
import { ProfileIcon } from "./components/logos/navigationBar/ProfileIcon.tsx";
import {LogOutIcon} from "./components/logos/navigationBar/LogOutIcon.tsx";

function PrivateRoute({children}: PrivateRouteProps) {
    const {token} = useAuth();
    return token ? <>{children}</> : <Navigate to="/auth" replace/>;
}

function Shell({children}: ShellProps) {
    //User data
    const {token, user, logout, login} = useAuth();
    const location = useLocation();

    //States
    const [currentUser, setCurrentUser] = useState(user);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Check localStorage or default to dark mode
        const saved = localStorage.getItem('theme');
        return saved ? saved === 'dark' : true;
    });

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    // Fetch updated user data when profile page is visited
    useEffect(() => {
        const fetchUserData = async () => {
            if (token) {
                try {
                    const userData = await apiFetch('/profile');
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    setCurrentUser(userData);
                    // Update the authPage context with latest user data
                    if (userData && token) {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        login(token, userData);
                    }
                } catch (error) {
                    console.error('Failed to fetch user data:', error);
                }
            }
        };

        // Refresh user data when returning from profile page
        if (location.pathname !== '/profile') {
            fetchUserData();
        }
    }, [location.pathname]);

    const isActive = (path: string) =>
        location.pathname === path || location.pathname.startsWith(path);

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {/* Navigation */}
            <nav className={`shadow-lg border-b backdrop-blur-sm sticky top-0 z-50 transition-colors duration-300 ${
                isDarkMode
                    ? 'bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700/50'
                    : 'bg-white border-gray-200'
            }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">

                        <div className="flex items-center gap-8">
                            <Link
                                to="/folders"
                                className="flex items-center gap-2 group">
                                <span
                                    className="text-xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-pink-700 transition-all">
                                    LCorpNotes
                                </span>
                            </Link>

                            <div className="hidden md:flex items-center gap-2">
                                <Link
                                    to="/folders"
                                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                                        isActive('/folders')
                                            ? 'bg-indigo-500/20 text-indigo-300 shadow-lg shadow-indigo-500/20'
                                            : isDarkMode
                                                ? 'text-gray-300 hover:text-indigo-300 hover:bg-indigo-500/10'
                                                : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                                    }`}>
                                    <div className="flex items-center gap-2">
                                        <FoldersIcon/>
                                        Folders
                                    </div>
                                </Link>
                                <Link
                                    to="/favorites"
                                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                                        isActive('/favorites')
                                            ? 'bg-yellow-500/20 text-yellow-300 shadow-lg shadow-yellow-500/20'
                                            : isDarkMode
                                                ? 'text-gray-300 hover:text-yellow-300 hover:bg-yellow-500/10'
                                                : 'text-gray-700 hover:text-yellow-600 hover:bg-yellow-50'
                                    }`}>
                                    <div className="flex items-center gap-2">
                                        <FavoritesIcon/>
                                        Favorites
                                    </div>
                                </Link>
                                <Link
                                    to="/profile"
                                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                                        isActive('/profile')
                                            ? 'bg-purple-500/20 text-purple-300 shadow-lg shadow-purple-500/20'
                                            : isDarkMode
                                                ? 'text-gray-300 hover:text-purple-300 hover:bg-purple-500/10'
                                                : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                                    }`}>
                                    <div className="flex items-center gap-2">
                                        <ProfileIcon/>
                                        Profile
                                    </div>
                                </Link>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={toggleTheme}
                                className="p-2 text-gray-300 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-xl transition-all group"
                                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                            >
                                {isDarkMode ? (
                                    // Sun icon for light mode
                                    <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                                    </svg>
                                ) : (
                                    // Moon icon for dark mode
                                    <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                                    </svg>
                                )}
                            </button>

                            {(currentUser || user) && (
                                <div
                                    className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-800/60 rounded-lg border border-gray-700/50">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    <span className="text-sm text-gray-300 font-medium">
                                        {currentUser?.name || user?.name}
                                    </span>
                                </div>
                            )}
                            {token ? (
                                <button
                                    onClick={logout}
                                    className="px-4 py-2 text-gray-300 hover:text-red-300 hover:bg-red-500/10 rounded-xl font-medium transition-all flex items-center gap-2 group">
                                    <LogOutIcon/>
                                    Logout
                                </button>
                            ) : (
                                <Link
                                    to="/auth"
                                    className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/30">
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main content */}
            <main className="min-h-[calc(100vh-4rem)]">{children}</main>
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/auth" element={<AuthPage/>}/>
                <Route
                    path="/folders"
                    element={
                        <PrivateRoute>
                            <Shell>
                                <FoldersPage/>
                            </Shell>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/folders/:id"
                    element={
                        <PrivateRoute>
                            <Shell>
                                <FolderDetailPage/>
                            </Shell>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/favorites"
                    element={
                        <PrivateRoute>
                            <Shell>
                                <FavoritesPage/>
                            </Shell>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <PrivateRoute>
                            <Shell>
                                <ProfilePage/>
                            </Shell>
                        </PrivateRoute>
                    }
                />
                <Route path="/" element={<Navigate to="/folders" replace/>}/>
                <Route path="*" element={<NotFoundPage/>}/>
            </Routes>
        </AuthProvider>
    );
}

export default App;