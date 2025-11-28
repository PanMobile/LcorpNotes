import {Link, Navigate, Route, Routes, useLocation} from 'react-router-dom';
import './App.css';

import {apiFetch, AuthProvider, useAuth} from './auth/AuthContext';
import AuthPage from './pages/AuthPage';
import FoldersPage from './pages/FoldersPage';
import FolderDetailPage from './pages/FolderDetailPage.tsx';
import FavoritesPage from './pages/FavoritesPage';
import ProfilePage from './pages/ProfilePage';
import type {PrivateRouteProps, ShellProps} from "./models/types.ts";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import {useEffect, useState} from "react";

function PrivateRoute({children}: PrivateRouteProps) {
    const {token} = useAuth();
    return token ? <>{children}</> : <Navigate to="/auth" replace/>;
}

function Shell({children}: ShellProps) {
    const {token, user, logout, login} = useAuth();
    const location = useLocation();
    const [currentUser, setCurrentUser] = useState(user);

    // Fetch updated user data when profile page is visited
    useEffect(() => {
        const fetchUserData = async () => {
            if (token) {
                try {
                    const userData = await apiFetch('/profile');
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    setCurrentUser(userData);
                    // Update the auth context with latest user data
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

    const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path);

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Navigation */}
            <nav className="bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg border-b border-gray-700/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo/Brand */}
                        <div className="flex items-center gap-8">
                            <Link
                                to="/folders"
                                className="flex items-center gap-2 group"
                            >
                                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg shadow-indigo-500/30 group-hover:shadow-xl group-hover:shadow-indigo-500/40 transition-all">
                                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                    </svg>
                                </div>
                                <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent group-hover:from-indigo-300 group-hover:to-purple-300 transition-all">
                                    LCorpNotes
                                </span>
                            </Link>

                            {/* Nav Links */}
                            <div className="hidden md:flex items-center gap-2">
                                <Link
                                    to="/folders"
                                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                                        isActive('/folders')
                                            ? 'bg-indigo-500/20 text-indigo-300 shadow-lg shadow-indigo-500/20'
                                            : 'text-gray-300 hover:text-indigo-300 hover:bg-indigo-500/10'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
                                        </svg>
                                        Folders
                                    </div>
                                </Link>
                                <Link
                                    to="/favorites"
                                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                                        isActive('/favorites')
                                            ? 'bg-yellow-500/20 text-yellow-300 shadow-lg shadow-yellow-500/20'
                                            : 'text-gray-300 hover:text-yellow-300 hover:bg-yellow-500/10'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                                        </svg>
                                        Favorites
                                    </div>
                                </Link>
                                <Link
                                    to="/profile"
                                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                                        isActive('/profile')
                                            ? 'bg-purple-500/20 text-purple-300 shadow-lg shadow-purple-500/20'
                                            : 'text-gray-300 hover:text-purple-300 hover:bg-purple-500/10'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                        </svg>
                                        Profile
                                    </div>
                                </Link>
                            </div>
                        </div>

                        {/* User section */}
                        <div className="flex items-center gap-4">
                            {(currentUser || user) && (
                                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-800/60 rounded-lg border border-gray-700/50">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    <span className="text-sm text-gray-300 font-medium">
                                        {currentUser?.name || user?.name}
                                    </span>
                                </div>
                            )}
                            {token ? (
                                <button
                                    onClick={logout}
                                    className="px-4 py-2 text-gray-300 hover:text-red-300 hover:bg-red-500/10 rounded-xl font-medium transition-all flex items-center gap-2 group"
                                >
                                    <svg className="w-4 h-4 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                                    </svg>
                                    Logout
                                </button>
                            ) : (
                                <Link
                                    to="/auth"
                                    className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/30"
                                >
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