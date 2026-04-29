import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusCircle, LogIn, Swords, Trophy, Activity, Hash, ArrowRight, Loader2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

// Format date to relative time string
function timeAgo(dateStr) {
    const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'Yesterday';
    if (days < 30) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString();
}

export default function Dashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [roomCode, setRoomCode] = useState('');
    const [recentMatches, setRecentMatches] = useState([]);
    const [matchesLoading, setMatchesLoading] = useState(true);

    useEffect(() => {
        const fetchMatches = async () => {
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
    }, []);

    const handleJoinRoom = (e) => {
        e.preventDefault();
        if (roomCode.trim()) {
            navigate(`/lobby/${roomCode.toUpperCase()}`);
        }
    };

    const createRoom = () => {
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        navigate(`/lobby/${code}`);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
    };

    if (!user) return null;

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-8"
            >
                {/* Welcome Banner */}
                <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-primary/10 to-transparent p-6 rounded-2xl border border-primary/20">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Welcome back, <span className="text-primary font-mono glow-text">{user.username}</span></h1>
                        <p className="text-gray-400 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-green-400" />
                            Ready for your next battle?
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <div className="text-center bg-dark-bg p-3 rounded-lg border border-dark-border">
                            <div className="text-2xl font-bold text-white">{user.rating}</div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide">Rating</div>
                        </div>
                        <div className="text-center bg-dark-bg p-3 rounded-lg border border-dark-border">
                            <div className="text-2xl font-bold text-success">{user.winRate}</div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide">Win Rate</div>
                        </div>
                    </div>
                </motion.div>

                {/* Action Panel */}
                <div className="grid md:grid-cols-2 gap-6">
                    <motion.div variants={itemVariants}>
                        <Card className="p-8 h-full relative overflow-hidden group hover:border-primary/50 transition-colors">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>

                            <div className="flex flex-col h-full justify-between">
                                <div>
                                    <div className="p-3 bg-primary/10 inline-block rounded-xl mb-4">
                                        <Swords className="w-8 h-8 text-primary" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Host a Battle</h2>
                                    <p className="text-gray-400 mb-8">Create a private room, set the rules, and invite an opponent to battle.</p>
                                </div>

                                <Button onClick={createRoom} className="w-full text-lg py-4 group/btn" size="lg">
                                    <PlusCircle className="w-5 h-5 mr-2" />
                                    Create Room
                                    <ArrowRight className="w-5 h-5 ml-auto opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" />
                                </Button>
                            </div>
                        </Card>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Card className="p-8 h-full relative overflow-hidden group hover:border-secondary/50 transition-colors">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-3xl group-hover:bg-secondary/10 transition-colors"></div>

                            <div className="flex flex-col h-full justify-between">
                                <div>
                                    <div className="p-3 bg-dark-bg border border-dark-border inline-block rounded-xl mb-4">
                                        <LogIn className="w-8 h-8 text-gray-300" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Join a Battle</h2>
                                    <p className="text-gray-400 mb-8">Enter a room code provided by your opponent to join their lobby.</p>
                                </div>

                                <form onSubmit={handleJoinRoom} className="space-y-4">
                                    <div className="relative">
                                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input
                                            type="text"
                                            placeholder="ENTER ROOM CODE"
                                            value={roomCode}
                                            onChange={(e) => setRoomCode(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 bg-dark-bg border border-dark-border rounded-xl text-white font-mono text-lg uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-gray-600"
                                        />
                                    </div>
                                    <Button variant="secondary" type="submit" className="w-full text-lg py-4" disabled={!roomCode.trim()}>
                                        Join Room
                                    </Button>
                                </form>
                            </div>
                        </Card>
                    </motion.div>
                </div>

                {/* Recent Matches */}
                <motion.div variants={itemVariants}>
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-primary" />
                                Recent Matches
                            </h3>
                            <Button variant="ghost" size="sm" onClick={() => navigate('/matches')}>
                                View All
                            </Button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-dark-border text-gray-500 text-sm">
                                        <th className="pb-3 font-medium">Opponent</th>
                                        <th className="pb-3 font-medium">Result</th>
                                        <th className="pb-3 font-medium text-right">Score</th>
                                        <th className="pb-3 font-medium text-right">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-dark-border">
                                    {matchesLoading ? (
                                        <tr>
                                            <td colSpan="4" className="py-10 text-center">
                                                <Loader2 className="w-5 h-5 text-primary animate-spin mx-auto" />
                                            </td>
                                        </tr>
                                    ) : recentMatches.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="py-10 text-center text-gray-600">
                                                No matches yet. Start a battle!
                                            </td>
                                        </tr>
                                    ) : (
                                        recentMatches.map((match) => (
                                            <tr key={match.id} className="hover:bg-dark-bg/50 transition-colors group">
                                                <td className="py-4 flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center font-mono text-xs border border-dark-border">
                                                        {match.opponent?.charAt(0)?.toUpperCase()}
                                                    </div>
                                                    <span className="font-mono text-gray-200">{match.opponent}</span>
                                                </td>
                                                <td className="py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                                                        ${match.outcome === 'Win' ? 'bg-success/10 text-success border-success/20 glow-success'
                                                        : match.outcome === 'Loss' ? 'bg-danger/10 text-danger border-danger/20'
                                                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}
                                                    `}>
                                                        {match.outcome}
                                                    </span>
                                                </td>
                                                <td className="py-4 text-right font-mono text-gray-300">
                                                    {match.outcome === 'Win' ? '+' : match.outcome === 'Loss' ? '-' : ''}{match.score}
                                                </td>
                                                <td className="py-4 text-right text-gray-500 text-sm">
                                                    {timeAgo(match.date)}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </motion.div>

            </motion.div>
        </div>
    );
}
