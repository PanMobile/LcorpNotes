import React from "react";

//Python User model
export interface User {
    id: number;
    email: string;
    name: string;
}

//Python Folder model
export interface Folder {
    id: number;
    name: string;
    createdAt: string; // ISO datetime string
}

//Python Note model
export interface Note {
    id: number;
    title: string;
    content: string;
    isFavorite: boolean;
    folderId: number | null;
    updatedAt: string; // ISO datetime string
}

export interface Profile {
    id: number;
    email: string;
    name: string;
}

// Context types
export interface AuthContextType {
    user: User | null;
    token: string;
    login: (newToken: string, newUser: User) => void;
    logout: () => void;
}

//Props
export interface PrivateRouteProps {
    children: React.ReactNode;
}

export interface ShellProps {
    children: React.ReactNode;
}