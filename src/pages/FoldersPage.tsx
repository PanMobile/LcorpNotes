import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {apiFetch} from '../auth/AuthContext';
import type {Folder} from "../models/types.ts";
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Spinner from '../components/ui/Spinner';

export default function FoldersPage() {
    const [folders, setFolders] = useState<Folder[]>([]);

    const [name, setName] = useState('');
    const [editName, setEditName] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFolder, setEditingFolder] = useState<Folder | null>(null);

    const load = async () => {
        setLoading(true);

        try {
            const data = await apiFetch<Folder[]>('/folders');
            const arr = Array.isArray(data) ? data : (data && Array.isArray((data as any).folders) ? (data as any).folders : []);
            setFolders(arr.map((f: any) => ({id: f.id, name: f.name, createdAt: f.createdAt ?? f.createdAt})));
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to load folders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const create = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiFetch('/folders', {method: 'POST', body: JSON.stringify({name})});
            setName('');
            await load();
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to create folder');
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
            await load();
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to update folder');
        }
    };

    const remove = async (id: number) => {
        if (!confirm('Delete this folder and all its notes?')) return;

        try {
            await apiFetch(`/folders/${id}`, {method: 'DELETE'});
            await load();
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to delete folder');
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col items-center gap-3">
                        <Spinner size="lg"/>
                        <p className="text-gray-400">Loading folders...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        My Folders
                    </h2>
                    <p className="mt-3 text-lg text-gray-300">Organize your notes into beautiful folders</p>
                </div>

                {/* Create Folder Form */}
                <form onSubmit={create} className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border border-indigo-500/30">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter folder name..."
                                required
                                className="bg-gray-800/50 border-indigo-500/50 text-white placeholder-gray-400 focus:border-indigo-400 focus:ring-indigo-400/50"
                            />
                        </div>
                        <Button
                            type="submit"
                            variant="primary"
                            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold px-6 shadow-lg shadow-indigo-500/30 transition-all duration-200 hover:shadow-xl hover:shadow-indigo-500/40 flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                            </svg>
                            Create Folder
                        </Button>
                    </div>
                </form>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-900/40 border border-red-500/50 rounded-xl backdrop-blur-sm">
                        <p className="text-red-300 text-sm font-medium">{error}</p>
                    </div>
                )}

                {/* Empty State */}
                {folders.length === 0 ? (
                    <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-2xl shadow-xl p-16 text-center border border-gray-700/50">
                        <div className="flex justify-center mb-6">
                            <div className="p-6 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full">
                                <svg className="w-20 h-20 text-indigo-400" fill="none" viewBox="0 0 24 24"
                                     stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                                    />
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">No folders yet</h3>
                        <p className="text-gray-400 text-lg">Create your first folder to get started organizing your notes</p>
                    </div>
                ) : (
                    /* Folders Grid */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {folders.map((folder) => (
                            <div
                                key={folder.id}
                                className="group bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-700/50 hover:border-indigo-500/50 transform hover:-translate-y-1"
                            >
                                <Link
                                    to={`/folders/${folder.id}`}
                                    className="block p-6 hover:bg-gradient-to-br hover:from-indigo-900/20 hover:to-purple-900/20 transition-all duration-200"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 p-3 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl group-hover:from-indigo-500/30 group-hover:to-purple-500/30 transition-all duration-200">
                                            <svg
                                                className="w-8 h-8 text-indigo-400 group-hover:text-indigo-300 transition-colors"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.5}
                                                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                                                />
                                            </svg>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-bold text-white break-words group-hover:text-indigo-300 transition-colors mb-2">
                                                {folder.name}
                                            </h3>
                                            <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                                                Created {new Date(folder.createdAt).toLocaleDateString('en-GB', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                                <div className="bg-gray-900/40 px-4 py-3 flex items-center justify-end gap-2 border-t border-gray-700/50">
                                    <button
                                        onClick={() => openEditModal(folder)}
                                        className="p-2 text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all duration-200"
                                        title="Edit folder"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => remove(folder.id)}
                                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                                        title="Delete folder"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            <Modal isOpen={isModalOpen} onClose={closeEditModal} title="Edit Folder">
                <form onSubmit={saveEdit} className="space-y-4">
                    <Input
                        label="Folder Name"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        required
                        autoFocus
                    />
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