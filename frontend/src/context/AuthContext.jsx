import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const formatUser = (data) => ({
        ...data,
        id: data._id,
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        username: data.username || '',
        email: data.email || '',
        dob: data.dob,
        role: data.role || 'user',
        winRate: data.matches ? `${Math.round((data.win / data.matches) * 100)}%` : '0%',
        location: data.region || 'Earth',
        joinDate: data.joined ? new Date(data.joined).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recently'
    });

    useEffect(() => {
        const checkSession = async () => {
            try {
                const res = await fetch('/api/user/me');
                if (res.ok) {
                    const data = await res.json();
                    setUser(formatUser(data));
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error("Session check failed", err);
            } finally {
                setLoading(false);
            }
        };
        checkSession();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            if (res.ok) {
                const userRes = await fetch('/api/user/me');
                if (userRes.ok) {
                    const userData = await userRes.json();
                    const formattedUser = formatUser(userData);
                    setUser(formattedUser);
                    // Return role so the login page can redirect admin to /admin
                    return { success: true, role: formattedUser.role };
                }
                return { success: true, role: 'user' };
            }
            return { success: false, error: data.error || 'Invalid credentials' };
        } catch (err) {
            return { success: false, error: 'Network error' };
        }
    };

    const signup = async (username, email, password, firstName, lastName, region, dob) => {
        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    username, 
                    email, 
                    password, 
                    firstName, 
                    lastName,
                    region,
                    dob
                })
            });

            const data = await res.json();
            if (res.ok) {
                // The signup endpoint currently returns the user formatted in basic way.
                // We fetch the full profile from /api/user/me after signup to be safe
                const userRes = await fetch('/api/user/me');
                if (userRes.ok) {
                    const userData = await userRes.json();
                    setUser(formatUser(userData));
                } else {
                    setUser(formatUser(data.user));
                }
                return { success: true };
            }
            return { success: false, error: data.error || 'Signup failed' };
        } catch (err) {
            return { success: false, error: 'Network error' };
        }
    };

    const updateProfile = async (updates) => {
        if (!user) return { success: false, error: 'Not logged in' };
        
        try {
            const res = await fetch('/api/user/me', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });

            if (res.ok) {
                const data = await res.json();
                setUser(formatUser(data)); 
                return { success: true };
            }
            return { success: false, error: 'Update failed' };
        } catch (err) {
            return { success: false, error: 'Network error' };
        }
    };

    const logout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
        } catch (err) {
            console.error(err);
        }
        setUser(null);
    };

    const isAdmin = user?.role === 'admin';

    const value = {
        user,
        loading,
        login,
        signup,
        logout,
        updateProfile,
        isAdmin
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
