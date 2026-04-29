import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Activity, MapPin, Calendar, GitBranch, Edit2, Check, X, Mail, Trash2, Trophy, Swords, Loader2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

const COUNTRIES = [
    "Australia", "Brazil", "Canada", "China", "France", "Germany", "India",
    "Italy", "Japan", "Mexico", "Netherlands", "Russia", "Singapore",
    "South Korea", "Spain", "Sweden", "Switzerland", "United Kingdom",
    "United States", "Other"
];

export default function Profile() {
    const { username } = useParams();
    const navigate = useNavigate();
    const { user, updateProfile, logout } = useAuth();
    const [activities, setActivities] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [recentMatches, setRecentMatches] = useState([]);
    const [matchesLoading, setMatchesLoading] = useState(true);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');
    const [deleteError, setDeleteError] = useState('');

    // Check if viewing own profile
    const isOwnProfile = username === 'me' || (user && user.username === username);
    const displayUser = isOwnProfile && user ? user : {
        username: username !== 'me' ? username : 'Guest',
        email: '',
        firstName: '',
        lastName: '',
        rating: 1200,
        winRate: '0%',
        matches: 0,
        location: 'Earth',
        github: '',
        joinDate: 'Oct 2024'
    };

    const currentYear = new Date().getFullYear();
    const joinYear = displayUser.joinDate !== 'Recently' && displayUser.joinDate ? parseInt(displayUser.joinDate.split(' ')[1]) || currentYear : currentYear;
    const availableYears = [];
    for (let y = currentYear; y >= joinYear; y--) {
        availableYears.push(y);
    }

    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        firstName: displayUser.firstName || '',
        lastName: displayUser.lastName || '',
        dob: displayUser.dob ? new Date(displayUser.dob).toISOString().split('T')[0] : '',
        location: displayUser.location || '',
        github: displayUser.github || ''
    });

    useEffect(() => {
        if (isEditing) {
            setEditData({
                firstName: displayUser.firstName || '',
                lastName: displayUser.lastName || '',
                dob: displayUser.dob ? new Date(displayUser.dob).toISOString().split('T')[0] : '',
                location: displayUser.location || '',
                github: displayUser.github || ''
            });
        }
    }, [isEditing, displayUser]);
// ... [fetching activity effect] ...
    useEffect(() => {
        if (isOwnProfile) {
            const fetchActivity = async () => {
                try {
                    const res = await fetch(`/api/user/me/activity/${selectedYear}`);
                    if (res.ok) {
                        const data = await res.json();
                        setActivities(data);
                    }
                } catch (err) {
                    console.error("Failed to fetch activity", err);
                }
            };
            fetchActivity();
        }
    }, [isOwnProfile, selectedYear]);

    // Fetch recent matches
    useEffect(() => {
        if (isOwnProfile) {
            const fetchMatches = async () => {
                setMatchesLoading(true);
                try {
                    const res = await fetch('/api/user/me/matches?limit=5');
                    if (res.ok) {
                        const data = await res.json();
                        setRecentMatches(data);
                    }
                } catch (err) {
                    console.error('Failed to fetch matches:', err);
                } finally {
                    setMatchesLoading(false);
                }
            };
            fetchMatches();
        } else {
            setMatchesLoading(false);
        }
    }, [isOwnProfile]);

    const handleSave = () => {
        if (isOwnProfile && updateProfile) {
            updateProfile({
                username: displayUser.username,
                firstname: editData.firstName,
                lastname: editData.lastName,
                dob: editData.dob,
                region: editData.location,
                github: editData.github
            });
        }
        setIsEditing(false);
    };

    const handleDeleteAccount = async () => {
        setDeleteError('');
        try {
            const res = await fetch('/api/user/me', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: deletePassword })
            });
            const data = await res.json();
            
            if (res.ok) {
                await logout();
                navigate('/');
            } else {
                setDeleteError(data.error || 'Failed to delete account');
            }
        } catch (err) {
            setDeleteError('Network error');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="grid md:grid-cols-3 gap-8">
                {/* Left Col: Profile Info */}
                <div className="md:col-span-1 space-y-6">
                    <Card className="p-8 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-primary/20 to-purple-500/20 z-0"></div>

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-32 h-32 rounded-full border-4 border-dark-bg bg-dark-panel flex items-center justify-center text-5xl font-mono text-primary shadow-xl glow-primary mb-4">
                                {displayUser.username.charAt(0).toUpperCase()}
                            </div>
                            <h1 className="text-2xl font-bold text-white mb-1 font-mono">{displayUser.username}</h1>
                            {displayUser.firstName && <span className="text-gray-400 text-sm block mb-2">{displayUser.firstName} {displayUser.lastName}</span>}
                            <span className="text-gray-400 mb-6 px-3 py-1 bg-dark-bg rounded-full text-sm border border-dark-border capitalize">
                                {displayUser.level || 'beginner'}
                            </span>

                            <div className="w-full space-y-3 text-left w-full mt-4">
                                {isEditing ? (
                                    // ... [existing edit mode code] ...
                                    <div className="space-y-3 border border-primary/30 bg-primary/5 p-4 rounded-xl">
                                        <div className="opacity-50 space-y-1">
                                            <label className="text-[10px] uppercase tracking-wider text-gray-500 block">Username (Locked)</label>
                                            <input type="text" value={displayUser.username} readOnly className="bg-transparent text-sm text-gray-400 w-full focus:outline-none" />
                                        </div>
                                        <div className="opacity-50 space-y-1">
                                            <label className="text-[10px] uppercase tracking-wider text-gray-500 block">Email (Locked)</label>
                                            <input type="email" value={displayUser.email} readOnly className="bg-transparent text-sm text-gray-400 w-full focus:outline-none" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="text-[10px] uppercase tracking-wider text-primary mb-1 block">First Name</label>
                                                <input type="text" value={editData.firstName} onChange={e => setEditData({...editData, firstName: e.target.value})} className="bg-dark-bg border border-dark-border p-2 rounded text-sm text-white w-full focus:ring-1 focus:ring-primary outline-none" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] uppercase tracking-wider text-primary mb-1 block">Last Name</label>
                                                <input type="text" value={editData.lastName} onChange={e => setEditData({...editData, lastName: e.target.value})} className="bg-dark-bg border border-dark-border p-2 rounded text-sm text-white w-full focus:ring-1 focus:ring-primary outline-none" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase tracking-wider text-primary mb-1 block">Date of Birth</label>
                                            <input type="date" value={editData.dob} onChange={e => setEditData({...editData, dob: e.target.value})} className="bg-dark-bg border border-dark-border p-2 rounded text-sm text-white w-full focus:ring-1 focus:ring-primary outline-none [&::-webkit-calendar-picker-indicator]:invert" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase tracking-wider text-primary mb-1 block">Location / Region</label>
                                            <div className="flex items-center gap-2 bg-dark-bg p-2 rounded border border-dark-border">
                                                <MapPin className="w-4 h-4 text-gray-500" />
                                                <select 
                                                    value={editData.location} 
                                                    onChange={e => setEditData({ ...editData, location: e.target.value })} 
                                                    className="bg-transparent text-sm text-white w-full focus:outline-none cursor-pointer"
                                                >
                                                    <option value="" disabled>Select Country</option>
                                                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase tracking-wider text-primary mb-1 block">GitHub Handle</label>
                                            <div className="flex items-center gap-2 bg-dark-bg p-2 rounded border border-dark-border">
                                                <GitBranch className="w-4 h-4 text-gray-500" />
                                                <input type="text" value={editData.github} onChange={e => setEditData({ ...editData, github: e.target.value })} className="bg-transparent text-sm text-white w-full focus:outline-none" placeholder="username" />
                                            </div>
                                        </div>
                                        <div className="flex gap-2 pt-2">
                                            <Button size="sm" variant="success" className="flex-1 py-1" onClick={handleSave}>
                                                <Check className="w-4 h-4 mr-1" /> Save
                                            </Button>
                                            <Button size="sm" variant="secondary" className="flex-1 py-1" onClick={() => setIsEditing(false)}>
                                                <X className="w-4 h-4 mr-1" /> Cancel
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-3 text-gray-300">
                                            <Mail className="w-5 h-5 text-gray-500 shrink-0" />
                                            <span className="truncate">{displayUser.email || 'No email provided'}</span>
                                        </div>
                                        {displayUser.dob && (
                                            <div className="flex items-center gap-3 text-gray-300">
                                                <User className="w-5 h-5 text-gray-500 shrink-0" />
                                                <span>Born {new Date(displayUser.dob).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-3 text-gray-300">
                                            <MapPin className="w-5 h-5 text-gray-500 shrink-0" />
                                            <span>{displayUser.location || 'Unknown location'}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-300">
                                            <Calendar className="w-5 h-5 text-gray-500 shrink-0" />
                                            <span>Joined {displayUser.joinDate || 'Recently'}</span>
                                        </div>
                                        {displayUser.github && (
                                            <div className="flex items-center gap-3 text-gray-300">
                                                <GitBranch className="w-5 h-5 text-gray-500 shrink-0" />
                                                <a href={`https://github.com/${displayUser.github}`} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors truncate">
                                                    github.com/{displayUser.github}
                                                </a>
                                            </div>
                                        )}
                                        {isOwnProfile && (
                                            <div className="pt-2 space-y-2">
                                                <Button variant="secondary" size="sm" className="w-full" onClick={() => setIsEditing(true)}>
                                                    <Edit2 className="w-4 h-4 mr-2" />
                                                    Edit Profile
                                                </Button>
                                                <Button variant="danger" size="sm" className="w-full bg-red-900/30 text-red-500 hover:bg-red-900/50 border border-red-900/50" onClick={() => setIsDeleteModalOpen(true)}>
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Delete Account
                                                </Button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Col: Stats & History */}
                <div className="md:col-span-2 space-y-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Activity className="w-6 h-6 text-primary" />
                        Performance Overview
                    </h2>

                    <div className="grid grid-cols-3 gap-4">
                        <Card className="p-6 text-center border-t-4 border-t-primary">
                            <span className="block text-gray-400 text-sm uppercase mb-2">Rating</span>
                            <span className="block text-4xl font-bold text-white">{displayUser.rating || 1200}</span>
                        </Card>
                        <Card className="p-6 text-center border-t-4 border-t-success">
                            <span className="block text-gray-400 text-sm uppercase mb-2">Win Rate</span>
                            <span className="block text-4xl font-bold text-success">{displayUser.winRate || '0%'}</span>
                        </Card>
                        <Card className="p-6 text-center border-t-4 border-t-secondary">
                            <span className="block text-gray-400 text-sm uppercase mb-2">Matches</span>
                            <span className="block text-4xl font-bold text-white">{displayUser.matches || 0}</span>
                        </Card>
                    </div>

                    <Card className="p-6 mt-8">
                        <div className="flex flex-wrap gap-4 justify-between items-end mb-6 text-gray-400 text-sm">
                            <div className="flex items-center gap-2 text-white">
                                <span className="text-2xl font-bold">{activities.length}</span>
                                <span className="text-gray-400 mt-1">activities in {selectedYear}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="hidden sm:inline">Total active days: <span className="text-white font-bold">{new Set(activities.map(a => new Date(a.date).toDateString())).size}</span></span>
                                <select 
                                    value={selectedYear} 
                                    onChange={e => setSelectedYear(parseInt(e.target.value))}
                                    className="bg-dark-bg border border-dark-border text-white text-sm rounded-md px-3 py-1.5 focus:outline-none focus:border-primary font-mono cursor-pointer"
                                >
                                    {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="overflow-x-auto pb-4 custom-scrollbar">
                            <div className="flex gap-[10px] w-max">
                                {(() => {
                                    const year = selectedYear;
                                    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                                    const activitySet = new Set(activities.map(a => new Date(a.date).toDateString()));

                                    return Array.from({ length: 12 }).map((_, m) => {
                                        const startDay = new Date(year, m, 1).getDay();
                                        const daysInMonth = new Date(year, m + 1, 0).getDate();
                                        const monthCells = [];
                                        
                                        // Padding for start of month
                                        for (let i = 0; i < startDay; i++) monthCells.push(null);
                                        // Days in month
                                        for (let i = 1; i <= daysInMonth; i++) monthCells.push(new Date(year, m, i));

                                        return (
                                            <div key={m} className="flex flex-col gap-2">
                                                <div 
                                                    className="grid gap-[4px]"
                                                    style={{ 
                                                        gridTemplateRows: 'repeat(7, 1fr)', 
                                                        gridAutoFlow: 'column'
                                                    }}
                                                >
                                                    {monthCells.map((date, i) => {
                                                        if (!date) return <div key={`empty-${i}`} className="w-[14px] h-[14px] rounded-[3px]" />;
                                                        
                                                        const isActive = activitySet.has(date.toDateString());
                                                        const cellClass = isActive 
                                                            ? 'bg-[#2cbb5d]' // LeetCode green
                                                            : 'bg-[#2d2d2d] hover:bg-[#3d3d3d]'; // LeetCode empty block

                                                        return (
                                                            <div
                                                                key={i}
                                                                className={`w-[14px] h-[14px] rounded-[3px] transition-colors ${cellClass}`}
                                                                title={`${isActive ? 'Active' : 'No Activity'} on ${date.toLocaleDateString()}`}
                                                            />
                                                        );
                                                    })}
                                                </div>
                                                <span className="text-xs text-gray-400 text-center">{monthNames[m]}</span>
                                            </div>
                                        );
                                    });
                                })()}
                            </div>
                        </div>
                    </Card>

                    {/* Recent Matches */}
                    <Card className="p-6 mt-6">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-primary" />
                                Recent Matches
                            </h3>
                            <Button variant="ghost" size="sm" onClick={() => navigate('/matches')}>
                                View All
                            </Button>
                        </div>

                        {matchesLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-5 h-5 text-primary animate-spin" />
                            </div>
                        ) : recentMatches.length === 0 ? (
                            <div className="text-center py-8">
                                <Swords className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                                <p className="text-gray-500 text-sm">No matches played yet</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {recentMatches.map((match) => (
                                    <div key={match.id} className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => navigate(`/matches/${match.id}`)}>
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center font-mono text-xs border border-dark-border shrink-0">
                                            {match.opponent?.charAt(0)?.toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <span className="font-mono text-white text-sm font-medium">{match.opponent}</span>
                                            <p className="text-xs text-gray-600">
                                                {(() => {
                                                    const seconds = Math.floor((Date.now() - new Date(match.date).getTime()) / 1000);
                                                    if (seconds < 60) return 'Just now';
                                                    const minutes = Math.floor(seconds / 60);
                                                    if (minutes < 60) return `${minutes}m ago`;
                                                    const hours = Math.floor(minutes / 60);
                                                    if (hours < 24) return `${hours}h ago`;
                                                    const days = Math.floor(hours / 24);
                                                    if (days === 1) return 'Yesterday';
                                                    if (days < 30) return `${days}d ago`;
                                                    return new Date(match.date).toLocaleDateString();
                                                })()}
                                            </p>
                                        </div>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                                            ${match.outcome === 'Win' ? 'bg-success/10 text-success border-success/20'
                                            : match.outcome === 'Loss' ? 'bg-danger/10 text-danger border-danger/20'
                                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}
                                        `}>
                                            {match.outcome}
                                        </span>
                                        <span className={`font-mono text-sm font-bold ${match.outcome === 'Win' ? 'text-success' : match.outcome === 'Loss' ? 'text-danger' : 'text-gray-400'}`}>
                                            {match.outcome === 'Win' ? '+' : match.outcome === 'Loss' ? '-' : ''}{match.score}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>
            </div>

            {/* Delete Account Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-dark-panel border border-dark-border p-6 rounded-xl w-full max-w-sm shadow-2xl">
                        <h3 className="text-xl font-bold text-red-500 mb-2 flex items-center gap-2">
                            <Trash2 className="w-5 h-5" /> Delete Account
                        </h3>
                        <p className="text-gray-400 text-sm mb-4">
                            This action is permanent and cannot be undone. All your match history and data will be lost. Please enter your password to confirm.
                        </p>
                        
                        {deleteError && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-2 rounded mb-4">
                                {deleteError}
                            </div>
                        )}

                        <div className="mb-6">
                            <input 
                                type="password" 
                                placeholder="Enter password" 
                                value={deletePassword}
                                onChange={(e) => setDeletePassword(e.target.value)}
                                className="w-full bg-dark-bg border border-dark-border p-2.5 rounded text-sm text-white focus:ring-1 focus:ring-red-500 outline-none"
                            />
                        </div>

                        <div className="flex gap-3">
                            <Button 
                                className="flex-1 bg-dark-bg hover:bg-gray-800 border border-dark-border" 
                                onClick={() => {
                                    setIsDeleteModalOpen(false);
                                    setDeletePassword('');
                                    setDeleteError('');
                                }}
                            >
                                Cancel
                            </Button>
                            <Button 
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white border-0" 
                                onClick={handleDeleteAccount}
                                disabled={!deletePassword}
                            >
                                Confirm
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
