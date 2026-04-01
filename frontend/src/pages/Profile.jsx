import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { User, Activity, MapPin, Calendar, GitBranch, Edit2, Check, X } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
    const { username } = useParams();
    const { user, updateProfile } = useAuth();

    // Check if viewing own profile
    const isOwnProfile = username === 'me' || (user && user.username === username);
    const displayUser = isOwnProfile && user ? user : {
        username: username !== 'me' ? username : 'Guest',
        rating: 1200,
        winRate: '0%',
        matches: 0,
        location: 'Earth',
        github: '',
        joinDate: 'Oct 2024'
    };

    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        location: displayUser.location || '',
        github: displayUser.github || ''
    });

    const handleSave = () => {
        if (isOwnProfile && updateProfile) {
            updateProfile(editData);
        }
        setIsEditing(false);
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
                            <span className="text-gray-400 mb-6 px-3 py-1 bg-dark-bg rounded-full text-sm border border-dark-border">
                                Master
                            </span>

                            <div className="w-full space-y-3 text-left">
                                {isEditing ? (
                                    <div className="space-y-3 border border-primary/30 bg-primary/5 p-4 rounded-xl">
                                        <div>
                                            <label className="text-xs text-primary mb-1 block">Location</label>
                                            <div className="flex items-center gap-2 bg-dark-bg p-2 rounded border border-dark-border">
                                                <MapPin className="w-4 h-4 text-gray-500" />
                                                <input
                                                    type="text"
                                                    value={editData.location}
                                                    onChange={e => setEditData({ ...editData, location: e.target.value })}
                                                    className="bg-transparent text-sm text-white w-full focus:outline-none"
                                                    placeholder="City, Country"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs text-primary mb-1 block">GitHub Handle</label>
                                            <div className="flex items-center gap-2 bg-dark-bg p-2 rounded border border-dark-border">
                                                <GitBranch className="w-4 h-4 text-gray-500" />
                                                <input
                                                    type="text"
                                                    value={editData.github}
                                                    onChange={e => setEditData({ ...editData, github: e.target.value })}
                                                    className="bg-transparent text-sm text-white w-full focus:outline-none"
                                                    placeholder="username"
                                                />
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
                                            <MapPin className="w-5 h-5 text-gray-500" />
                                            <span>{displayUser.location || 'Unknown'}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-300">
                                            <Calendar className="w-5 h-5 text-gray-500" />
                                            <span>Joined {displayUser.joinDate || 'Recently'}</span>
                                        </div>
                                        {displayUser.github && (
                                            <div className="flex items-center gap-3 text-gray-300">
                                                <GitBranch className="w-5 h-5 text-gray-500" />
                                                <a href={`https://github.com/${displayUser.github}`} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
                                                    github.com/{displayUser.github}
                                                </a>
                                            </div>
                                        )}
                                        {isOwnProfile && (
                                            <Button variant="secondary" size="sm" className="w-full mt-4" onClick={() => setIsEditing(true)}>
                                                <Edit2 className="w-4 h-4 mr-2" />
                                                Edit Profile
                                            </Button>
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
                            <span className="block text-4xl font-bold text-white">{displayUser.rating}</span>
                        </Card>
                        <Card className="p-6 text-center border-t-4 border-t-success">
                            <span className="block text-gray-400 text-sm uppercase mb-2">Win Rate</span>
                            <span className="block text-4xl font-bold text-success">{displayUser.winRate}</span>
                        </Card>
                        <Card className="p-6 text-center border-t-4 border-t-secondary">
                            <span className="block text-gray-400 text-sm uppercase mb-2">Matches</span>
                            <span className="block text-4xl font-bold text-white">{displayUser.matches}</span>
                        </Card>
                    </div>

                    <Card className="p-6 mt-8">
                        <h3 className="text-lg font-bold text-white mb-6">Recent Activity heatmap</h3>
                        <div className="flex flex-wrap gap-2">
                            {Array.from({ length: 60 }).map((_, i) => {
                                const active = Math.random();
                                let colorClass = 'bg-dark-bg border-dark-border';
                                if (active > 0.8) colorClass = 'bg-primary border-primary glow-primary';
                                else if (active > 0.5) colorClass = 'bg-primary/50 border-primary/50';
                                else if (active > 0.2) colorClass = 'bg-primary/20 border-primary/20';

                                return (
                                    <div
                                        key={i}
                                        className={`w-5 h-5 rounded-sm border ${colorClass} transition-all hover:scale-125 hover:z-10`}
                                        title="Activity"
                                    />
                                );
                            })}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
