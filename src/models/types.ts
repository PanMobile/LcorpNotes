import React from "react";


export interface User {
    id: number;
    email: string;
    name: string;
}


export interface Folder {
    id: number;
    name: string;
    createdAt: string;
}


export interface Note {
    id: number;
    title: string;
    content: string;
    isFavorite: boolean;
    folderId: number | null;
    updatedAt: string;
}

export interface Profile {
    id: number;
    email: string;
    name: string;
}


export interface AuthContextType {
    user: User | null;
    token: string;
    login: (newToken: string, newUser: User) => void;
    logout: () => void;
}


export interface PrivateRouteProps {
    children: React.ReactNode;
}

export interface ShellProps {
    children: React.ReactNode;
}