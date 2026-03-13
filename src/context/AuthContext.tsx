import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { googleLogout } from '@react-oauth/google';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
    phone?: string;
    company?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
    updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // Configure global Axios headers
    if (token) {
        axios.defaults.headers.common['x-auth-token'] = token;
    } else {
        delete axios.defaults.headers.common['x-auth-token'];
    }

    useEffect(() => {
        const fetchUser = async () => {
            const storedToken = localStorage.getItem('token');
            // Prevent nonsense strings from triggering a fetch
            if (storedToken && storedToken !== 'undefined' && storedToken !== 'null') {
                try {
                    const res = await axios.get('/api/auth/me');
                    if (res.data) {
                        setUser({ ...res.data, id: res.data._id });
                    }
                } catch (err) {
                    console.error("Auth check failed:", err);
                    logout();
                }
            } else {
                // If no token, ensure user is null
                setUser(null);
            }
            setLoading(false);
        };

        fetchUser();
    }, [token]);

    const login = (newToken: string, newUser: any) => {
        if (!newToken || !newUser) {
            console.error("Login called with missing data:", { newToken, newUser });
            return;
        }
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser({ ...newUser, id: newUser.id || newUser._id });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        googleLogout();
        // Force refresh to clear any stale states if necessary? No, state update should suffice.
    };

    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
