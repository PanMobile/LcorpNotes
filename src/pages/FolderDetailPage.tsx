import React, {useCallback, useEffect, useState} from 'react';
import {useParams, Link} from 'react-router-dom';
import {apiFetch} from '../context/AuthContext';
import {useTheme} from '../context/ThemeContext';
import type {Note} from "../models/types.ts";
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Spinner from '../components/ui/Spinner';
import {CreateLogo} from "../components/logos/shared/CreateLogo.tsx";
import {BackToFoldersLogo} from "../components/logos/folderDetailPage/BackToFoldersLogo.tsx";
import {FolderNoteLogo} from "../components/logos/folderDetailPage/FolderNoteLogo.tsx";
import {UpdatedTimeLogo} from "../components/logos/shared/UpdatedTimeLogo.tsx";
import {EditLogo} from "../components/logos/shared/EditLogo.tsx";
import {DeleteLogo} from "../components/logos/shared/DeleteLogo.tsx";
import {IsFavoriteLogo} from "../components/logos/folderDetailPage/IsFavoriteLogo.tsx";

export default function FolderDetailPage() {
    //Тема
    const {isDarkMode} = useTheme();
    //Параметр айдишки
    const {id} = useParams<{ id: string }>();
    const folderId = Number(id);

    //Стейты
    const [notes, setNotes] = useState<Note[]>([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNote, setEditingNote] = useState<Note | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');

    //Главная функция загрузки папки
    const loadFolder = useCallback(async () => {
        setLoading(true);
        try {
            const data = await apiFetch<Note[]>(`/notes?folderId=${folderId}`);
            setNotes(data);
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setLoading(false);
        }
    }, [folderId]);

    useEffect(() => {
        loadFolder();
    }, [folderId, loadFolder]);

    //Функция созадния заметки
    const createNote = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiFetch('/notes', {
                method: 'POST',
                body: JSON.stringify({title, content, folderId: folderId}),
            });
            setTitle('');
            setContent('');
            await loadFolder();
        } catch (error) {
            setError((error as Error).message);
        }
    };

    //Доп окно поверху
    const openEditModal = (note: Note) => {
        setEditingNote(note);
        setEditTitle(note.title);
        setEditContent(note.content);
        setIsModalOpen(true);
    };

    //Доп окно поверху тоже, но закрыть
    const closeEditModal = () => {
        setIsModalOpen(false);
        setEditingNote(null);
        setEditTitle('');
        setEditContent('');
    };

    //Функция сохранения редактирования
    const saveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingNote) return;
        try {
            await apiFetch(`/notes/${editingNote.id}`, {
                method: 'PUT',
                body: JSON.stringify({title: editTitle, content: editContent}),
            });
            closeEditModal();
            await loadFolder();
        } catch (error) {
            setError((error as Error).message);
        }
    };

    //Функция удаления заметки
    const removeNote = async (id: number) => {
        if (!confirm('Delete this note?')) return;
        try {
            await apiFetch(`/notes/${id}`, {method: 'DELETE'});
            await loadFolder();
        } catch (error) {
            setError((error as Error).message);
        }
    };

    //Переключалка любимого
    const toggleFav = async (note: Note) => {
        try {
            await apiFetch(`/notes/${note.id}/favorite`, {method: 'POST'});
            await loadFolder();
        } catch (error) {
            setError((error as Error).message);
        }
    };

    //Разметка если загрузка
    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col items-center gap-3">
                        <Spinner size="lg"/>
                        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Loading notes...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    //Разметка
    return (
        <Layout>
            <div className="max-w-7xl mx-auto">
                <Link
                    to="/folders"
                    className={`inline-flex items-center gap-2 mb-6 font-medium transition-colors group ${
                        isDarkMode
                            ? 'text-indigo-400 hover:text-indigo-300'
                            : 'text-indigo-600 hover:text-indigo-700'
                    }`}>
                    <BackToFoldersLogo/>
                    Back to Folders
                </Link>

                <div className="mb-8">
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        Folder Notes
                    </h2>
                    <p className={`mt-3 text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Manage and organize your notes
                    </p>
                </div>

                <form onSubmit={createNote}
                      className={`rounded-2xl shadow-xl p-6 mb-8 border transition-colors ${
                          isDarkMode
                              ? 'bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border-gray-700/50'
                              : 'bg-white border-cyan-200'
                      }`}>
                    <div className="space-y-4">
                        <Input
                            label="Note Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter note title..."
                            required
                            className={isDarkMode ? 'bg-gray-900/60 border-gray-600/50 text-white placeholder-gray-500' : 'bg-gray-50 border-cyan-300 text-gray-900 placeholder-gray-500'}
                        />
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>Content</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Write your note content here..."
                                rows={3}
                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition resize-none ${
                                    isDarkMode
                                        ? 'bg-gray-900/60 border-gray-600/50 text-white placeholder-gray-500'
                                        : 'bg-gray-50 border-cyan-300 text-gray-900 placeholder-gray-500'
                                }`}
                            />
                        </div>
                        <Button
                            type="submit"
                            variant="primary"
                            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold shadow-lg shadow-cyan-500/30">
                            <CreateLogo/>
                            Add Note
                        </Button>
                    </div>
                </form>

                {error && (
                    <div className={`mb-6 p-4 rounded-xl backdrop-blur-sm border ${
                        isDarkMode ? 'bg-red-900/40 border-red-500/50' : 'bg-red-50 border-red-200'
                    }`}>
                        <p className={`text-sm font-medium ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>
                            {error}
                        </p>
                    </div>
                )}

                {notes.length === 0 ? (
                    <div className={`rounded-2xl shadow-xl p-16 text-center border transition-colors ${
                        isDarkMode
                            ? 'bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border-gray-700/50'
                            : 'bg-white border-gray-200'
                    }`}>
                        <div className="flex justify-center mb-6">
                            <div className="p-6 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full">
                                <FolderNoteLogo/>
                            </div>
                        </div>
                        <h3 className={`text-2xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            No notes yet
                        </h3>
                        <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Create your first note to get started
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {notes.map((note) => (
                            <div
                                key={note.id}
                                className={`group rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border transform hover:-translate-y-1 ${
                                    isDarkMode
                                        ? 'bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border-gray-700/50 hover:border-cyan-500/50'
                                        : 'bg-white border-gray-200 hover:border-cyan-400'
                                }`}>
                                <div className="p-6">
                                    <h3 className={`text-lg font-bold mb-3 break-words transition-colors ${
                                        isDarkMode
                                            ? 'text-white group-hover:text-cyan-300'
                                            : 'text-gray-900 group-hover:text-cyan-600'
                                    }`}>
                                        {note.title}
                                    </h3>
                                    <p className={`text-sm whitespace-pre-wrap break-words line-clamp-3 leading-relaxed ${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                        {note.content || 'No content'}
                                    </p>
                                    <div className={`mt-4 pt-4 border-t ${
                                        isDarkMode ? 'border-gray-700/50' : 'border-gray-200'
                                    }`}>
                                        <div className={`flex items-center gap-2 text-xs ${
                                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                        }`}>
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
                                <div className={`px-4 py-3 flex items-center justify-end gap-2 border-t ${
                                    isDarkMode ? 'bg-gray-900/40 border-gray-700/50' : 'bg-gray-50 border-gray-200'
                                }`}>
                                    <button
                                        onClick={() => toggleFav(note)}
                                        className={`p-2 rounded-lg transition-all duration-200 ${
                                            note.isFavorite
                                                ? isDarkMode
                                                    ? 'text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 hover:scale-110'
                                                    : 'text-yellow-500 hover:text-yellow-600 hover:bg-yellow-100 hover:scale-110'
                                                : isDarkMode
                                                    ? 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10'
                                                    : 'text-gray-500 hover:text-yellow-500 hover:bg-yellow-100'
                                        }`}
                                        title={note.isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
                                        <IsFavoriteLogo isFavorite={note.isFavorite}/>
                                    </button>
                                    <button
                                        onClick={() => openEditModal(note)}
                                        className={`p-2 rounded-lg transition-all duration-200 ${
                                            isDarkMode
                                                ? 'text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10'
                                                : 'text-gray-600 hover:text-cyan-600 hover:bg-cyan-100'
                                        }`}
                                        title="Edit note">
                                        <EditLogo/>
                                    </button>
                                    <button
                                        onClick={() => removeNote(note.id)}
                                        className={`p-2 rounded-lg transition-all duration-200 ${
                                            isDarkMode
                                                ? 'text-gray-400 hover:text-red-400 hover:bg-red-500/10'
                                                : 'text-gray-600 hover:text-red-600 hover:bg-red-100'
                                        }`}
                                        title="Delete note">
                                        <DeleteLogo/>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

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
                        <label className={`block text-sm font-medium mb-2 ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>Content</label>
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            rows={6}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition resize-none ${
                                isDarkMode
                                    ? 'bg-gray-900/60 border-gray-600/50 text-white placeholder-gray-500'
                                    : 'bg-gray-50 border-cyan-300 text-gray-900 placeholder-gray-500'
                            }`}
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