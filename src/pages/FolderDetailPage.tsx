import React, {useCallback, useEffect, useState} from 'react';
import {useParams, Link} from 'react-router-dom';
import {apiFetch} from '../auth/AuthContext';
import type {Note} from "../models/types.ts";
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Spinner from '../components/ui/Spinner';
import {AddNotePlusLogo} from "../components/logos/AddNotePlusLogo.tsx";
import {BackToFoldersArrowLogo} from "../components/logos/BackToFoldersArrowLogo.tsx";
import {FolderNoteLogo} from "../components/logos/FolderNoteLogo.tsx";
import {UpdatedTimeLogo} from "../components/logos/UpdatedTimeLogo.tsx";

export default function FolderDetailPage() {
    const {id} = useParams<{ id: string }>();
    const folderId = Number(id);

    const [notes, setNotes] = useState<Note[]>([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNote, setEditingNote] = useState<Note | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');

    const load = useCallback(async () => {
        setLoading(true);

        try {
            const data = await apiFetch<Note[]>(`/notes?folderId=${folderId}`);
            setNotes(data);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-expect-error
        } catch (error: Error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, [folderId]);

    useEffect(() => {
        load();
    }, [folderId, load]);

    const create = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiFetch('/notes', {
                method: 'POST',
                body: JSON.stringify({title, content, folderId: folderId}),
            });
            setTitle('');
            setContent('');
            await load();
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-expect-error
        } catch (error: Error) {
            setError(error.message);
        }
    };

    const openEditModal = (note: Note) => {
        setEditingNote(note);
        setEditTitle(note.title);
        setEditContent(note.content);
        setIsModalOpen(true);
    };

    const closeEditModal = () => {
        setIsModalOpen(false);
        setEditingNote(null);
        setEditTitle('');
        setEditContent('');
    };

    const saveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingNote) return;

        try {
            await apiFetch(`/notes/${editingNote.id}`, {
                method: 'PUT',
                body: JSON.stringify({title: editTitle, content: editContent}),
            });
            closeEditModal();
            await load();
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-expect-error
        } catch (error: Error) {
            setError(error.message);
        }
    };

    const remove = async (id: number) => {
        if (!confirm('Delete this note?')) return;
        try {
            await apiFetch(`/notes/${id}`, {method: 'DELETE'});
            await load();
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-expect-error
        } catch (error: Error) {
            setError(error.message);
        }
    };

    const toggleFav = async (note: Note) => {
        try {
            await apiFetch(`/notes/${note.id}/favorite`, {method: 'POST'});
            await load();
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-expect-error
        } catch (error: Error) {
            setError(error.message);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col items-center gap-3">
                        <Spinner size="lg"/>
                        <p className="text-gray-400">Loading notes...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-7xl mx-auto">
                {/* Back Button */}
                <Link
                    to="/folders"
                    className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 mb-6 font-medium transition-colors group">
                    <BackToFoldersArrowLogo/>
                    Back to Folders
                </Link>

                {/* Header Section */}
                <div className="mb-8">
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        Folder Notes
                    </h2>
                    <p className="mt-3 text-lg text-gray-300">Manage and organize your notes</p>
                </div>

                {/* Create Note Form */}
                <form onSubmit={create}
                      className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border border-gray-700/50">
                    <div className="space-y-4">
                        <Input
                            label="Note Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter note title..."
                            required
                            className="bg-gray-900/60 border-gray-600/50 text-white placeholder-gray-500"
                        />
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Write your note content here..."
                                rows={3}
                                className="w-full px-4 py-3 bg-gray-900/60 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition resize-none text-white placeholder-gray-500"
                            />
                        </div>
                        <Button
                            type="submit"
                            variant="primary"
                            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold shadow-lg shadow-cyan-500/30">
                            <AddNotePlusLogo/>
                            Add Note
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
                {notes.length === 0 ? (
                    <div
                        className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-2xl shadow-xl p-16 text-center border border-gray-700/50">
                        <div className="flex justify-center mb-6">
                            <div className="p-6 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full">
                                <FolderNoteLogo/>
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">No notes yet</h3>
                        <p className="text-gray-400 text-lg">Create your first note to get started</p>
                    </div>
                ) : (
                    /* Notes Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {notes.map((note) => (
                            <div
                                key={note.id}
                                className="group bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-700/50 hover:border-cyan-500/50 transform hover:-translate-y-1"
                            >
                                <div className="p-6">
                                    <h3 className="text-lg font-bold text-white mb-3 break-words group-hover:text-cyan-300 transition-colors">
                                        {note.title}
                                    </h3>
                                    <p className="text-gray-300 text-sm whitespace-pre-wrap break-words line-clamp-3 leading-relaxed">
                                        {note.content || 'No content'}
                                    </p>
                                    <div className="mt-4 pt-4 border-t border-gray-700/50">
                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                            <UpdatedTimeLogo/>
                                            <span>
                                                Updated {new Date(note.updatedAt).toLocaleDateString('en-GB', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="bg-gray-900/40 px-4 py-3 flex items-center justify-end gap-2 border-t border-gray-700/50">
                                    <button
                                        onClick={() => toggleFav(note)}
                                        className={`p-2 rounded-lg transition-all duration-200 ${
                                            note.isFavorite
                                                ? 'text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 hover:scale-110'
                                                : 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10'
                                        }`}
                                        title={note.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                                    >
                                        <svg className="w-5 h-5" fill={note.isFavorite ? 'currentColor' : 'none'}
                                             viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => openEditModal(note)}
                                        className="p-2 text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all duration-200"
                                        title="Edit note"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => remove(note.id)}
                                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                                        title="Delete note"
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
            <Modal isOpen={isModalOpen} onClose={closeEditModal} title="Edit Note">
                <form onSubmit={saveEdit} className="space-y-4">
                    <Input
                        label="Title"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        required
                        autoFocus
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            rows={6}
                            className="w-full px-4 py-3 bg-gray-900/60 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition resize-none text-white placeholder-gray-500"
                        />
                    </div>
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