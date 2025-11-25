import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth, apiFetch} from '../auth/AuthContext';
import type {Profile} from "../models/types.ts";


export default function ProfilePage() {
    const navigate = useNavigate();
    const {user, logout} = useAuth();

    const [profile, setProfile] = useState<Profile | null>(user);
    const [name, setName] = useState(user?.name || '');
    const [isUpdatingName, setIsUpdatingName] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const load = async () => {
        try {
            const data = await apiFetch<Profile>('/profile');
            setProfile(data);
            setName(data.name);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to load profile');
        }
    };

    useEffect(() => {
        load();
    }, []);

    const updateName = async (error: React.FormEvent) => {
        error.preventDefault();
        setIsUpdatingName(true);

        try {
            await apiFetch('/profile', {method: 'PUT', body: JSON.stringify({name})});
            setMessage('Profile updated successfully!');
            load();
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to update profile');
        } finally {
            setIsUpdatingName(false);
        }
    };

    const changePassword = async (error: React.FormEvent) => {
        error.preventDefault();

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setIsUpdatingPassword(true);
        try {
            await apiFetch('/profile/change-password', {
                method: 'POST',
                body: JSON.stringify({current_password: currentPassword, new_password: newPassword}),
            });
            setMessage('Password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setShowPasswordForm(false);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to change password');
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    const deleteAccount = async () => {
        if (!confirm('Delete your account? This cannot be undone. All your folders and notes will be permanently deleted.'))
            return;

        try {
            await apiFetch('/profile', {method: 'DELETE'});
            logout();
            navigate('/auth');
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to delete account');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    if (!profile) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-400/20 border-t-indigo-400"></div>
                    <p className="text-gray-300 font-medium">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Profile Settings
                    </h2>
                    <p className="mt-3 text-lg text-gray-300">Manage your account and preferences</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-900/40 border border-red-500/50 rounded-xl backdrop-blur-sm flex items-center gap-3">
                        <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <p className="text-red-300 text-sm font-medium">{error}</p>
                    </div>
                )}

                {/* Success Message */}
                {message && (
                    <div className="mb-6 p-4 bg-green-900/40 border border-green-500/50 rounded-xl backdrop-blur-sm flex items-center gap-3">
                        <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none"
                             viewBox="0 0 24 24"
                             stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <p className="text-green-300 text-sm font-medium">{message}</p>
                    </div>
                )}

                {/* Account Information */}
                <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6 border border-gray-700/50">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                        </svg>
                        Account Information
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center p-3 bg-gray-900/40 rounded-lg">
                            <span className="text-sm font-medium text-gray-400 w-24">Email:</span>
                            <span className="text-white font-medium">{profile.email}</span>
                        </div>
                        <div className="flex items-center p-3 bg-gray-900/40 rounded-lg">
                            <span className="text-sm font-medium text-gray-400 w-24">Name:</span>
                            <span className="text-white font-medium">{profile.name}</span>
                        </div>
                    </div>
                </div>

                {/* Update Name */}
                <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6 border border-gray-700/50">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                        Update Name
                    </h3>
                    <form onSubmit={updateName} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Your Name</label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-900/60 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none transition text-white placeholder-gray-500"
                                required
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isUpdatingName}
                                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-500/30"
                            >
                                {isUpdatingName ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Change Password */}
                <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6 border border-gray-700/50">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                        </svg>
                        Change Password
                    </h3>
                    {!showPasswordForm ? (
                        <button
                            onClick={() => setShowPasswordForm(true)}
                            className="px-6 py-3 border-2 border-blue-500/50 text-blue-400 font-semibold rounded-xl hover:bg-blue-500/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        >
                            Change Password
                        </button>
                    ) : (
                        <form onSubmit={changePassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-900/60 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition text-white placeholder-gray-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-900/60 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition text-white placeholder-gray-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-900/60 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition text-white placeholder-gray-500"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowPasswordForm(false);
                                        setCurrentPassword('');
                                        setNewPassword('');
                                        setConfirmPassword('');
                                        setError('');
                                    }}
                                    className="px-6 py-3 border-2 border-gray-600/50 text-gray-300 font-semibold rounded-xl hover:bg-gray-700/30 focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUpdatingPassword}
                                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/30"
                                >
                                    {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Account Actions */}
                <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-700/50">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <svg className="w-6 h-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        Account Actions
                    </h3>
                    <div className="space-y-4">
                        {/* Sign Out */}
                        <div className="flex items-center justify-between p-5 bg-gray-900/40 rounded-xl border border-gray-700/50 hover:border-yellow-500/30 transition-all">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-yellow-500/10 rounded-lg">
                                    <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-white">Sign Out</p>
                                    <p className="text-sm text-gray-400">Sign out from your current session</p>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="px-6 py-3 bg-yellow-600/20 text-yellow-400 border-2 border-yellow-500/50 font-semibold rounded-xl hover:bg-yellow-600/30 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all"
                            >
                                Sign Out
                            </button>
                        </div>

                        {/* Delete Account */}
                        <div className="flex items-center justify-between p-5 bg-red-950/40 rounded-xl border border-red-500/50 hover:border-red-500/70 transition-all">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-500/20 rounded-lg">
                                    <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-white">Delete Account</p>
                                    <p className="text-sm text-red-300">Permanently delete your account and all data</p>
                                </div>
                            </div>
                            <button
                                onClick={deleteAccount}
                                className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all shadow-lg shadow-red-500/30"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}