import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth, apiFetch} from '../context/AuthContext';
import type {Profile} from "../models/types.ts";
import {ErrorLogo} from "../components/logos/profilePage/ErrorLogo.tsx";
import {MessageLogo} from "../components/logos/profilePage/MessageLogo.tsx";
import {InfoLogo} from "../components/logos/profilePage/InfoLogo.tsx";
import {UpdateNameLogo} from "../components/logos/profilePage/UpdateNameLogo.tsx";
import {LockLogo} from "../components/logos/profilePage/LockLogo.tsx";
import {GearAccountSettingsLogo} from "../components/logos/profilePage/GearAccountSettingsLogo.tsx";
import {LogOutLogo} from "../components/logos/profilePage/LogOutLogo.tsx";
import {WarningLogo} from "../components/logos/profilePage/WarningLogo.tsx";
import Layout from "../components/layout/Layout.tsx";


export default function ProfilePage() {
    //Getting info from context'ed user
    const navigate = useNavigate();
    const {user, logout} = useAuth();

    //States
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

    const loadProfile = async () => {
        try {
            const data = await apiFetch<Profile>('/profile');
            setProfile(data);
            setName(data.name);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-expect-error
        } catch (error: Error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    const updateName = async (error: React.FormEvent) => {
        error.preventDefault();
        setIsUpdatingName(true);

        try {
            await apiFetch('/profile', {method: 'PUT', body: JSON.stringify({name})});
            setMessage('Profile updated successfully!');
            loadProfile();
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-expect-error
        } catch (error: Error) {
            setError(error.message);
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
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-expect-error
        } catch (error: Error) {
            setError(error.message);
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    const deleteAccount = async () => {
        if (!confirm('Delete your account? This cannot be undone. All your foldersPage and notes will be permanently deleted.'))
            return;

        try {
            await apiFetch('/profile', {method: 'DELETE'});
            logout();
            navigate('/auth');
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-expect-error
        } catch (error: Error) {
            setError(error.message);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    if (!profile) {
        return (
            <Layout>
                <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <div
                            className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-400/20 border-t-indigo-400"></div>
                        <p className="text-gray-300 font-medium">Loading profile...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen py-8">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-8">
                        <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Profile Settings
                        </h2>
                        <p className="mt-3 text-lg text-gray-300">Manage your account information</p>
                    </div>

                    {error && (
                        <div
                            className="mb-6 p-4 bg-red-900/40 border border-red-500/50 rounded-xl backdrop-blur-sm flex items-center gap-3">
                            <ErrorLogo/>
                            <p className="text-red-300 text-sm font-medium">{error}</p>
                        </div>
                    )}

                    {message && (
                        <div
                            className="mb-6 p-4 bg-green-900/40 border border-green-500/50 rounded-xl backdrop-blur-sm flex items-center gap-3">
                            <MessageLogo/>
                            <p className="text-green-300 text-sm font-medium">{message}</p>
                        </div>
                    )}

                    <div
                        className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6 border border-gray-700/50">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <InfoLogo/>
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

                    <div
                        className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6 border border-gray-700/50">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <UpdateNameLogo/>
                            Update Name
                        </h3>
                        <form onSubmit={updateName} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Your Name</label>
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-900/60 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none transition text-white placeholder-gray-500"
                                    required/>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isUpdatingName}
                                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-500/30">
                                    {isUpdatingName ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div
                        className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6 border border-gray-700/50">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <LockLogo/>
                            Change Password
                        </h3>
                        {!showPasswordForm ? (
                            <button
                                onClick={() => setShowPasswordForm(true)}
                                className="px-6 py-3 border-2 border-blue-500/50 text-blue-400 font-semibold rounded-xl hover:bg-blue-500/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all">
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
                                        required/>
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
                                        required/>
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
                                        required/>
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
                                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/30">
                                        {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    <div
                        className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-700/50">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <GearAccountSettingsLogo/>
                            Account Actions
                        </h3>
                        <div className="space-y-4">
                            <div
                                className="flex items-center justify-between p-5 bg-gray-900/40 rounded-xl border border-gray-700/50 hover:border-yellow-500/30 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-yellow-500/10 rounded-lg">
                                        <LogOutLogo/>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">Sign Out</p>
                                        <p className="text-sm text-gray-400">Sign out from your current session</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="px-6 py-3 bg-yellow-600/20 text-yellow-400 border-2 border-yellow-500/50 font-semibold rounded-xl hover:bg-yellow-600/30 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all">
                                    Sign Out
                                </button>
                            </div>

                            <div
                                className="flex items-center justify-between p-5 bg-red-950/40 rounded-xl border border-red-500/50 hover:border-red-500/70 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-500/20 rounded-lg">
                                        <WarningLogo/>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">Delete Account</p>
                                        <p className="text-sm text-red-300">Permanently delete your account and all
                                            data</p>
                                    </div>
                                </div>
                                <button
                                    onClick={deleteAccount}
                                    className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all shadow-lg shadow-red-500/30">
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}