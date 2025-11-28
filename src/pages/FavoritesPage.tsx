import {useEffect, useState} from 'react';
import {apiFetch} from '../auth/AuthContext';
import type {Note} from "../models/types.ts";
import {FavoriteStarLogo} from "../components/logos/favoritesPage/FavoriteStarLogo.tsx";
import {FavoriteRemoveStarLogo} from "../components/logos/favoritesPage/FavoriteRemoveStarLogo.tsx";
import {UpdatedTimeLogo} from "../components/logos/shared/UpdatedTimeLogo.tsx";
import {FavoriteFolderLogo} from "../components/logos/favoritesPage/FavoriteFolderLogo.tsx";
import {useNavigate} from "react-router-dom";
import {ViewNoteArrowLogo} from "../components/logos/favoritesPage/ViewNoteArrowLogo.tsx";


export default function FavoritesPage() {
    //Navigate function
    const navigate = useNavigate();

    //States
    const [folders, setFolders] = useState<{ id: number; name: string }[]>([]);
    const [notes, setNotes] = useState<Note[]>([]);

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const loadFavNotes = async () => {
        setLoading(true);

        try {
            const allNotes = await apiFetch<Note[]>('/notes');
            setNotes(allNotes.filter((note) => note.isFavorite));
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-expect-error
        } catch (error: Error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const loadFolders = async () => {
        try {
            const allFolders = await apiFetch<{ id: number; name: string }[]>('/folders');
            setFolders(allFolders);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-expect-error
        } catch (error: Error) {
            console.error('Error fetching folders:', error.message);
        }
    };


    useEffect(() => {
        loadFavNotes();
        loadFolders();
    }, []);

    //Showing only favorite notes
    const toggleFavorite = async (noteId: number) => {
        try {
            await apiFetch(`/notes/${noteId}/favorite`, {method: 'POST'});
            setNotes(notes.filter((n) => n.id !== noteId));
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-expect-error
        } catch (error: Error) {
            setError(error.message);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div
                        className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400/20 border-t-yellow-400"></div>
                    <p className="text-gray-300 font-medium">Loading favorites...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 bg-clip-text text-transparent">
                        Favorite Notes
                    </h2>
                    <p className="mt-3 text-lg text-gray-300">Your starred notes in one place (this page)</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-900/40 border border-red-500/50 rounded-xl backdrop-blur-sm">
                        <p className="text-red-300 text-sm font-medium">{error}</p>
                    </div>
                )}

                {notes.length === 0 ? (
                    <div
                        className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-2xl shadow-xl p-16 text-center border border-gray-700/50">
                        <div className="flex justify-center mb-6">
                            <div className="p-6 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full">
                                <FavoriteStarLogo/>
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">No favorite notes yet</h3>
                        <p className="text-gray-400 text-lg">Star notes to see them here</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {notes.map((note) => (
                            <div
                                key={note.id}
                                className="group bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-700/50 hover:border-yellow-500/50 transform hover:-translate-y-1">
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="text-lg font-bold text-white flex-1 break-words group-hover:text-yellow-300 transition-colors">
                                            {note.title}
                                        </h3>
                                        <button
                                            onClick={() => toggleFavorite(note.id)}
                                            className="flex-shrink-0 ml-2 p-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 rounded-lg transition-all duration-200 hover:scale-110"
                                            title="Remove from favorites">
                                            <FavoriteRemoveStarLogo/>
                                        </button>
                                    </div>
                                    <p className="text-gray-300 text-sm line-clamp-3 whitespace-pre-wrap break-words leading-relaxed">
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
                                <div className="bg-gray-900/40 px-6 py-3 border-t border-gray-700/50">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-medium text-indigo-400 flex items-center gap-1">
                                            <FavoriteFolderLogo/>
                                            {note.folderId
                                                ? folders.find(f => f.id === note.folderId)?.name || `Folder #${note.folderId}`
                                                : "No folder"}
                                        </span>
                                        <button
                                            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium hover:gap-2 transition-all duration-200 flex items-center gap-1 group/btn"
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
        </div>
    );
}