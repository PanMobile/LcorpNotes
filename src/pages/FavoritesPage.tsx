import {useEffect, useState} from 'react';
import {apiFetch} from '../context/AuthContext';
import {useTheme} from '../context/ThemeContext';
import type {Note} from "../models/types.ts";
import {FavoriteStarLogo} from "../components/logos/favoritesPage/FavoriteStarLogo.tsx";
import {FavoriteRemoveStarLogo} from "../components/logos/favoritesPage/FavoriteRemoveStarLogo.tsx";
import {UpdatedTimeLogo} from "../components/logos/shared/UpdatedTimeLogo.tsx";
import {FavoriteFolderLogo} from "../components/logos/favoritesPage/FavoriteFolderLogo.tsx";
import {useNavigate} from "react-router-dom";
import {ViewNoteArrowLogo} from "../components/logos/favoritesPage/ViewNoteArrowLogo.tsx";
import Layout from "../components/layout/Layout.tsx";

export default function FavoritesPage() {
    const {isDarkMode} = useTheme();
    const navigate = useNavigate();

    const [folders, setFolders] = useState<{ id: number; name: string }[]>([]);
    const [notes, setNotes] = useState<Note[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const loadFavNotes = async () => {
        setLoading(true);
        try {
            const allNotes = await apiFetch<Note[]>('/notes');
            setNotes(allNotes.filter((note) => note.isFavorite));
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const loadFolders = async () => {
        try {
            const allFolders = await apiFetch<{ id: number; name: string }[]>('/folders');
            setFolders(allFolders);
        } catch (error) {
            console.error('Error fetching folders:', (error as Error).message);
        }
    };

    useEffect(() => {
        loadFavNotes();
        loadFolders();
    }, []);

    const toggleFavorite = async (noteId: number) => {
        try {
            await apiFetch(`/notes/${noteId}/favorite`, {method: 'POST'});
            setNotes(notes.filter((n) => n.id !== noteId));
        } catch (error) {
            setError((error as Error).message);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400/20 border-t-yellow-400"></div>
                        <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Loading favorites...
                        </p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 bg-clip-text text-transparent">
                        Favorite Notes
                    </h2>
                    <p className={`mt-3 text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Your starred notes in one place
                    </p>
                </div>

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
                            <div className="p-6 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full">
                                <FavoriteStarLogo/>
                            </div>
                        </div>
                        <h3 className={`text-2xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            No favorite notes yet
                        </h3>
                        <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Star notes to see them here
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {notes.map((note) => (
                            <div
                                key={note.id}
                                className={`group rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border transform hover:-translate-y-1 ${
                                    isDarkMode
                                        ? 'bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border-gray-700/50 hover:border-yellow-500/50'
                                        : 'bg-white border-gray-200 hover:border-yellow-400'
                                }`}>
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className={`text-lg font-bold flex-1 break-words transition-colors ${
                                            isDarkMode
                                                ? 'text-white group-hover:text-yellow-300'
                                                : 'text-gray-900 group-hover:text-yellow-600'
                                        }`}>
                                            {note.title}
                                        </h3>
                                        <button
                                            onClick={() => toggleFavorite(note.id)}
                                            className={`flex-shrink-0 ml-2 p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                                                isDarkMode
                                                    ? 'text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10'
                                                    : 'text-yellow-500 hover:text-yellow-600 hover:bg-yellow-100'
                                            }`}
                                            title="Remove from favorites">
                                            <FavoriteRemoveStarLogo/>
                                        </button>
                                    </div>
                                    <p className={`text-sm line-clamp-3 whitespace-pre-wrap break-words leading-relaxed ${
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
                                <div className={`px-6 py-3 border-t ${
                                    isDarkMode ? 'bg-gray-900/40 border-gray-700/50' : 'bg-gray-50 border-gray-200'
                                }`}>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-medium text-indigo-400 flex items-center gap-1">
                                            <FavoriteFolderLogo/>
                                            {note.folderId
                                                ? folders.find(f => f.id === note.folderId)?.name || `Folder #${note.folderId}`
                                                : "No folder"}
                                        </span>
                                        <button
                                            className={`text-xs font-medium transition-all duration-200 flex items-center gap-1 group/btn ${
                                                isDarkMode
                                                    ? 'text-indigo-400 hover:text-indigo-300'
                                                    : 'text-indigo-600 hover:text-indigo-700'
                                            }`}
                                            onClick={() => navigate(`/folders/${note.folderId}`)}>
                                            View
                                            <ViewNoteArrowLogo/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}