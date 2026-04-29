import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Medal, Star, MapPin, Loader2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';

export default function Leaderboard() {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await fetch('/api/leaderboard?limit=50');
                if (res.ok) {
                    setPlayers(await res.json());
                }
            } catch (err) {
                console.error('Failed to fetch leaderboard:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    return (
        <div className="container mx-auto px-4 py-12 max-w-5xl">
            <div className="text-center mb-12">
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-2xl border border-primary/20 mb-4 glow-primary"
                >
                    <Trophy className="w-10 h-10 text-primary" />
                </motion.div>
                <h1 className="text-4xl font-bold text-white mb-2">Global Leaderboard</h1>
                <p className="text-gray-400 text-lg">The absolute best of the CodeArena</p>
            </div>

            <Card className="overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-6 h-6 text-primary animate-spin" />
                    </div>
                ) : players.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        No players yet. Be the first to compete!
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-dark-bg/80 border-b border-dark-border text-gray-400 text-sm uppercase tracking-wider">
                                    <th className="p-6 font-medium">Rank</th>
                                    <th className="p-6 font-medium">Player</th>
                                    <th className="p-6 font-medium text-right">Wins</th>
                                    <th className="p-6 font-medium text-right">Win Rate</th>
                                    <th className="p-6 font-medium text-right">Matches</th>
                                    <th className="p-6 font-medium text-right hidden sm:table-cell">Region</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-border">
                                {players.map((player, idx) => {
                                    const isYou = user && user.username === player.username;
                                    return (
                                        <motion.tr
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            key={player.username}
                                            className={`group relative transition-colors cursor-pointer ${isYou ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-dark-bg/50'}`}
                                            onClick={() => navigate(`/profile/${player.username}`)}
                                        >
                                            <td className="p-6">
                                                <div className="flex items-center">
                                                    {player.rank === 1 && <Trophy className="w-6 h-6 text-yellow-400 mr-2 glow-text" />}
                                                    {player.rank === 2 && <Medal className="w-6 h-6 text-gray-400 mr-2" />}
                                                    {player.rank === 3 && <Medal className="w-6 h-6 text-amber-700 mr-2" />}
                                                    {player.rank > 3 && <span className="w-6 h-6 flex items-center justify-center font-bold text-gray-500 mr-2">{player.rank}</span>}
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold border
                                                        ${player.rank === 1 ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                                                        : player.rank === 2 ? 'bg-gray-400/10 border-gray-400/30 text-gray-300'
                                                        : player.rank === 3 ? 'bg-amber-700/10 border-amber-700/30 text-amber-600'
                                                        : 'bg-dark-bg border-dark-border text-gray-300'}`}
                                                    >
                                                        {player.username.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className={`font-mono text-lg ${isYou ? 'text-primary font-bold' : 'text-white'}`}>
                                                        {player.username}
                                                        {isYou && <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-sans">YOU</span>}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-6 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Star className="w-4 h-4 text-warning" />
                                                    <span className="font-bold text-xl text-white">{player.wins}</span>
                                                </div>
                                            </td>
                                            <td className="p-6 text-right">
                                                <span className={`font-mono font-bold ${player.winRate >= 70 ? 'text-success' : player.winRate >= 40 ? 'text-amber-400' : 'text-gray-400'}`}>
                                                    {player.winRate}%
                                                </span>
                                            </td>
                                            <td className="p-6 text-right text-gray-400">
                                                {player.matches}
                                            </td>
                                            <td className="p-6 text-right hidden sm:table-cell">
                                                {player.region && (
                                                    <span className="flex items-center justify-end gap-1 text-gray-500 text-sm">
                                                        <MapPin className="w-3 h-3" />
                                                        {player.region}
                                                    </span>
                                                )}
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    );
}
