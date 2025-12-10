import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth, apiFetch} from '../context/AuthContext';
import {useTheme} from '../context/ThemeContext';
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
    //тема
    const {isDarkMode} = useTheme();
    //Пользователь стафф
    const navigate = useNavigate();
    const {user, logout} = useAuth();

    //стейты
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

    //загрузка данных пользователя
    const loadProfile = async () => {
        try {
            const data = await apiFetch<Profile>('/profile');
            setProfile(data);
            setName(data.name);
        } catch (error) {
            setError((error as Error).message);
        }
    };

    //Загружаем данные профиля
    useEffect(() => {
        loadProfile();
    }, []);

    //Смена имени
    const updateName = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdatingName(true);
        try {
            await apiFetch('/profile', {method: 'PUT', body: JSON.stringify({name})});
            setMessage('Profile updated successfully!');
            loadProfile();
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setIsUpdatingName(false);
        }
    };

    //Смена пароля
    const changePassword = async (e: React.FormEvent) => {
        e.preventDefault();
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
            setError((error as Error).message);
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
        } catch (error) {
            setError((error as Error).message);
        }
    };

    //функция для выхода
    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    if (!profile) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-400/20 border-t-indigo-400"></div>
                        <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Loading profile...
                        </p>
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
                        <p className={`mt-3 text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Manage your account information
                        </p>
                    </div>

                    {error && (
                        <div className={`mb-6 p-4 rounded-xl backdrop-blur-sm flex items-center gap-3 border ${
                            isDarkMode ? 'bg-red-900/40 border-red-500/50' : 'bg-red-50 border-red-200'
                        }`}>
                            <ErrorLogo/>
                            <p className={`text-sm font-medium ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>
                                {error}
                            </p>
                        </div>
                    )}

                    {message && (
                        <div className={`mb-6 p-4 rounded-xl backdrop-blur-sm flex items-center gap-3 border ${
                            isDarkMode ? 'bg-green-900/40 border-green-500/50' : 'bg-green-50 border-green-200'
                        }`}>
                            <MessageLogo/>
                            <p className={`text-sm font-medium ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
                                {message}
                            </p>
                        </div>
                    )}

                    <div className={`rounded-2xl shadow-xl p-6 mb-6 border transition-colors ${
                        isDarkMode
                            ? 'bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border-gray-700/50'
                            : 'bg-white border-gray-200'
                    }`}>
                        <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                            <InfoLogo/>
                            Account Information
                        </h3>
                        <div className="space-y-4">
                            <div className={`flex items-center p-3 rounded-lg ${
                                isDarkMode ? 'bg-gray-900/40' : 'bg-gray-50'
                            }`}>
                                <span className={`text-sm font-medium w-24 ${
                                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                }`}>Email:</span>
                                <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {profile.email}
                                </span>
                            </div>
                            <div className={`flex items-center p-3 rounded-lg ${
                                isDarkMode ? 'bg-gray-900/40' : 'bg-gray-50'
                            }`}>
                                <span className={`text-sm font-medium w-24 ${
                                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                }`}>Name:</span>
                                <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {profile.name}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className={`rounded-2xl shadow-xl p-6 mb-6 border transition-colors ${
                        isDarkMode
                            ? 'bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border-gray-700/50'
                            : 'bg-white border-gray-200'
                    }`}>
                        <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                            <UpdateNameLogo/>
                            Update Name
                        </h3>
                        <form onSubmit={updateName} className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${
                                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                }`}>Your Name</label>
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none transition ${
                                        isDarkMode
                                            ? 'bg-gray-900/60 border-gray-600/50 text-white placeholder-gray-500'
                                            : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                                    }`}
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

                    <div className={`rounded-2xl shadow-xl p-6 mb-6 border transition-colors ${
                        isDarkMode
                            ? 'bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border-gray-700/50'
                            : 'bg-white border-gray-200'
                    }`}>
                        <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                            <LockLogo/>
                            Change Password
                        </h3>
                        {!showPasswordForm ? (
                            <button
                                onClick={() => setShowPasswordForm(true)}
                                className={`px-6 py-3 border-2 font-semibold rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                    isDarkMode
                                        ? 'border-blue-500/50 text-blue-400 hover:bg-blue-500/10 focus:ring-blue-500/50'
                                        : 'border-blue-500 text-blue-600 hover:bg-blue-50 focus:ring-blue-500'
                                }`}>
                                Change Password
                            </button>
                        ) : (
                            <form onSubmit={changePassword} className="space-y-4">
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                    }`}>Current Password</label>
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition ${
                                            isDarkMode
                                                ? 'bg-gray-900/60 border-gray-600/50 text-white placeholder-gray-500'
                                                : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                                        }`}
                                        required/>
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                    }`}>New Password</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition ${
                                            isDarkMode
                                                ? 'bg-gray-900/60 border-gray-600/50 text-white placeholder-gray-500'
                                                : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                                        }`}
                                        required/>
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                    }`}>Confirm New Password</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition ${
                                            isDarkMode
                                                ? 'bg-gray-900/60 border-gray-600/50 text-white placeholder-gray-500'
                                                : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                                        }`}
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
                                        className={`px-6 py-3 border-2 font-semibold rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                            isDarkMode
                                                ? 'border-gray-600/50 text-gray-300 hover:bg-gray-700/30 focus:ring-gray-500/50'
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-400'
                                        }`}>
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

                    <div className={`rounded-2xl shadow-xl p-6 border transition-colors ${
                        isDarkMode
                            ? 'bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border-gray-700/50'
                            : 'bg-white border-gray-200'
                    }`}>
                        <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                            <GearAccountSettingsLogo/>
                            Account Actions
                        </h3>
                        <div className="space-y-4">
                            <div className={`flex items-center justify-between p-5 rounded-xl border transition-all ${
                                isDarkMode
                                    ? 'bg-gray-900/40 border-gray-700/50 hover:border-yellow-500/30'
                                    : 'bg-gray-50 border-gray-200 hover:border-yellow-400'
                            }`}>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-yellow-500/10 rounded-lg">
                                        <LogOutLogo/>
                                    </div>
                                    <div>
                                        <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                            Sign Out
                                        </p>
                                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Sign out from your current session
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className={`px-6 py-3 border-2 font-semibold rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                        isDarkMode
                                            ? 'bg-yellow-600/20 text-yellow-400 border-yellow-500/50 hover:bg-yellow-600/30 focus:ring-yellow-500/50'
                                            : 'bg-yellow-50 text-yellow-700 border-yellow-400 hover:bg-yellow-100 focus:ring-yellow-500'
                                    }`}>
                                    Sign Out
                                </button>
                            </div>

                            <div className={`flex items-center justify-between p-5 rounded-xl border transition-all ${
                                isDarkMode
                                    ? 'bg-red-950/40 border-red-500/50 hover:border-red-500/70'
                                    : 'bg-red-50 border-red-200 hover:border-red-300'
                            }`}>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-500/20 rounded-lg">
                                        <WarningLogo/>
                                    </div>
                                    <div>
                                        <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                            Delete Account
                                        </p>
                                        <p className={`text-sm ${isDarkMode ? 'text-red-300' : 'text-red-600'}`}>
                                            Permanently delete your account and all data
                                        </p>
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