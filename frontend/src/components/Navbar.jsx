import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Code2, Trophy, User, Shield } from 'lucide-react';
import { Button } from './ui/Button';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout, isAdmin } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const isAuthPage = location.pathname === '/login' || location.pathname === '/signup' ;

    if (isAuthPage) return null; // Don't show navbar on auth screens or landing page

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-dark-border bg-dark-bg/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <Code2 className="w-6 h-6 text-primary group-hover:glow-primary transition-shadow" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white group-hover:text-primary transition-colors">
                        Code<span className="text-primary">Arena</span>
                    </span>
                </Link>

                {user && (
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center mr-4">
                            <span className="text-sm text-gray-400">Welcome, </span>
                            <span className="text-sm font-bold text-primary ml-1">{user.username}</span>
                        </div>
                        {isAdmin && (
                            <Link to="/admin">
                                <Button variant="ghost" size="sm" className="hidden sm:flex gap-2 text-amber-400 hover:text-amber-300">
                                    <Shield className="w-4 h-4" />
                                    Admin
                                </Button>
                            </Link>
                        )}
                        <Link to="/leaderboard">
                            <Button variant="ghost" size="sm" className="hidden sm:flex gap-2">
                                <Trophy className="w-4 h-4" />
                                Leaderboard
                            </Button>
                        </Link>
                        <Link to={`/profile/${user.username}`}>
                            <Button variant="ghost" size="sm" className="hidden sm:flex gap-2">
                                <User className="w-4 h-4" />
                                Profile
                            </Button>
                        </Link>
                        <Button variant="secondary" size="sm" onClick={handleLogout}>
                            Sign Out
                        </Button>
                    </div>
                )}
                {/*if user is not authenticated the this nav bar will be showed*/}
                {!user && ( 
                    <div className="flex items-center gap-4">
                        <Link to="/leaderboard">
                            <Button variant="ghost" size="sm" className="hidden sm:flex gap-2">
                                <Trophy className="w-4 h-4" />
                                Leaderboard
                            </Button>
                        </Link>
                        <Link to="/login">
                        <Button variant="secondary" size="sm" >
                            Log in
                        </Button></Link>
                        
                    </div>
                )}
            </div>
        </nav>
    );
}
