import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing session on mount
        const sessionUser = localStorage.getItem('codearena_session');
        if (sessionUser) {
            setUser(JSON.parse(sessionUser));
        }
        setLoading(false);
    }, []);

    const login = (email, password) => {
        const users = JSON.parse(localStorage.getItem('codearena_users') || '[]');
        const existingUser = users.find(u => u.email === email && u.password === password);

        if (existingUser) {
            // Remove password from session payload
            const { password: _, ...sessionData } = existingUser;
            localStorage.setItem('codearena_session', JSON.stringify(sessionData));
            setUser(sessionData);
            return { success: true };
        }
        return { success: false, error: 'Invalid email or password' };
    };

    const signup = (username, email, password) => {
        const users = JSON.parse(localStorage.getItem('codearena_users') || '[]');

        if (users.some(u => u.email === email)) {
            return { success: false, error: 'Email already exists' };
        }
        if (users.some(u => u.username === username)) {
            return { success: false, error: 'Username already taken' };
        }

        const newUser = {
            id: Date.now().toString(),
            username,
            email,
            password,
            location: 'Earth',
            github: '',
            rating: 1200,
            matches: 0,
            winRate: '0%'
        };

        users.push(newUser);
        localStorage.setItem('codearena_users', JSON.stringify(users));

        // Auto-login after signup
        const { password: _, ...sessionData } = newUser;
        localStorage.setItem('codearena_session', JSON.stringify(sessionData));
        setUser(sessionData);

        return { success: true };
    };

    const updateProfile = (updates) => {
        if (!user) return { success: false, error: 'Not logged in' };

        const users = JSON.parse(localStorage.getItem('codearena_users') || '[]');
        const userIndex = users.findIndex(u => u.id === user.id);

        if (userIndex !== -1) {
            const updatedUser = { ...users[userIndex], ...updates };
            users[userIndex] = updatedUser;
            localStorage.setItem('codearena_users', JSON.stringify(users));

            const { password: _, ...sessionData } = updatedUser;
            localStorage.setItem('codearena_session', JSON.stringify(sessionData));
            setUser(sessionData);
            return { success: true };
        }
        return { success: false, error: 'User not found in database' };
    };

    const logout = () => {
        localStorage.removeItem('codearena_session');
        setUser(null);
    };

    const value = {
        user,
        loading,
        login,
        signup,
        logout,
        updateProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
