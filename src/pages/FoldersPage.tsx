import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {apiFetch} from '../context/AuthContext';
import {useTheme} from '../context/ThemeContext';
import type {Folder} from "../models/types.ts";
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Spinner from '../components/ui/Spinner';
import {EditLogo} from "../components/logos/shared/EditLogo.tsx";
import {DeleteLogo} from "../components/logos/shared/DeleteLogo.tsx";
import {CreateLogo} from "../components/logos/shared/CreateLogo.tsx";
import {FolderLogo} from "../components/logos/foldersPage/FolderLogo.tsx";
import {FolderCardLogo} from "../components/logos/foldersPage/FolderCardLogo.tsx";

export default function FoldersPage() {
    const {isDarkMode} = useTheme();
    const [folders, setFolders] = useState<Folder[]>([]);
    const [name, setName] = useState('');
    const [editName, setEditName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFolder, setEditingFolder] = useState<Folder | null>(null);

    const loadFolders = async () => {
        setLoading(true);
        try {
            const data = await apiFetch<Folder[]>('/folders');
            const arr = Array.isArray(data) ? data : (data && Array.isArray((data as any).folders) ? (data as any).folders : []);
            setFolders(arr.map((f: Folder) => ({id: f.id, name: f.name, createdAt: f.createdAt ?? f.createdAt})));
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to load folders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFolders();
    }, []);

    const createFolder = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiFetch('/folders', {method: 'POST', body: JSON.stringify({name})});
            setName('');
            await loadFolders();
        } catch (error) {
            setError((error as Error).message);
        }
    };

    const openEditModal = (folder: Folder) => {
        setEditingFolder(folder);
        setEditName(folder.name);
        setIsModalOpen(true);
    };

    const closeEditModal = () => {
        setIsModalOpen(false);
        setEditingFolder(null);
        setEditName('');
    };

    const saveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingFolder) return;
        try {
            await apiFetch(`/folders/${editingFolder.id}`, {
                method: 'PUT',
                body: JSON.stringify({name: editName}),
            });
            closeEditModal();
            await loadFolders();
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to update folder');
        }
    };

    const deleteFolder = async (id: number) => {
        if (!confirm('Delete this folder and all its notes?')) return;
        try {
            await apiFetch(`/folders/${id}`, {method: 'DELETE'});
            await loadFolders();
        } catch (error) {
            setError((error as Error).message);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col items-center gap-3">
                        <Spinner size="lg"/>
                        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Loading folders...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        My Folders
                    </h2>
                    <p className={`mt-3 text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Organize your notes into beautiful folders
                    </p>
                </div>

                <form onSubmit={createFolder}
                      className={`rounded-2xl shadow-xl p-6 mb-8 border transition-colors ${
                          isDarkMode
                              ? 'bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-sm border-indigo-500/30'
                              : 'bg-white border-indigo-200'
                      }`}>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter folder name..."
                                required
                                className={isDarkMode ? 'bg-gray-800/50 border-indigo-500/50 text-white placeholder-gray-400 focus:border-indigo-400 focus:ring-indigo-400/50' : 'bg-gray-50 border-indigo-300 text-gray-900 placeholder-gray-500'}
                            />
                        </div>
                        <Button
                            type="submit"
                            variant="primary"
                            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold px-6 shadow-lg shadow-indigo-500/30 transition-all duration-200 hover:shadow-xl hover:shadow-indigo-500/40 flex items-center gap-2">
                            <CreateLogo/>
                            Create Folder
                        </Button>
                    </div>
                </form>

                {error && (
                    <div className={`mb-6 p-4 rounded-xl backdrop-blur-sm border ${
                        isDarkMode ? 'bg-red-900/40 border-red-500/50' : 'bg-red-50 border-red-200'
                    }`}>
                        <p className={`text-sm font-medium ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>{error}</p>
                    </div>
                )}

                {folders.length === 0 ? (
                    <div className={`rounded-2xl shadow-xl p-16 text-center border transition-colors ${
                        isDarkMode
                            ? 'bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border-gray-700/50'
                            : 'bg-white border-gray-200'
                    }`}>
                        <div className="flex justify-center mb-6">
                            <div className="p-6 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full">
                                <FolderLogo/>
                            </div>
                        </div>
                        <h3 className={`text-2xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            No folders yet
                        </h3>
                        <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Create your first folder to get started organizing your notes
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {folders.map((folder) => (
                            <div
                                key={folder.id}
                                className={`group rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border transform hover:-translate-y-1 ${
                                    isDarkMode
                                        ? 'bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border-gray-700/50 hover:border-indigo-500/50'
                                        : 'bg-white border-gray-200 hover:border-indigo-300'
                                }`}>
                                <Link
                                    to={`/folders/${folder.id}`}
                                    className={`block p-6 transition-all duration-200 ${
                                        isDarkMode ? 'hover:bg-gradient-to-br hover:from-indigo-900/20 hover:to-purple-900/20' : 'hover:bg-indigo-50/50'
                                    }`}>
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 p-3 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl group-hover:from-indigo-500/30 group-hover:to-purple-500/30 transition-all duration-200">
                                            <FolderCardLogo/>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className={`text-lg font-bold break-words group-hover:text-indigo-300 transition-colors mb-2 ${
                                                isDarkMode ? 'text-white' : 'text-gray-900'
                                            }`}>
                                                {folder.name}
                                            </h3>
                                            <p className={`text-xs transition-colors ${
                                                isDarkMode ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-600 group-hover:text-gray-700'
                                            }`}>
                                                Created {new Date(folder.createdAt).toLocaleDateString('en-GB', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                                <div className={`px-4 py-3 flex items-center justify-end gap-2 border-t ${
                                    isDarkMode ? 'bg-gray-900/40 border-gray-700/50' : 'bg-gray-50 border-gray-200'
                                }`}>
                                    <button
                                        onClick={() => openEditModal(folder)}
                                        className={`p-2 rounded-lg transition-all duration-200 ${
                                            isDarkMode ? 'text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10' : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-100'
                                        }`}
                                        title="Edit folder">
                                        <EditLogo/>
                                    </button>
                                    <button
                                        onClick={() => deleteFolder(folder.id)}
                                        className={`p-2 rounded-lg transition-all duration-200 ${
                                            isDarkMode ? 'text-gray-400 hover:text-red-400 hover:bg-red-500/10' : 'text-gray-600 hover:text-red-600 hover:bg-red-100'
                                        }`}
                                        title="Delete folder">
                                        <DeleteLogo/>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={closeEditModal} title="Edit Folder">
                <form onSubmit={saveEdit} className="space-y-4">
                    <Input
                        label="Folder Name"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        required
                        autoFocus/>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="secondary" onClick={closeEditModal}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary">
                            Save Changes
                        </Button>
                    </div>
                </form>
            </Modal>
        </Layout>
    );
}