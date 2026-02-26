import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Star } from 'lucide-react';
import { Card } from '../components/ui/Card';

export default function Leaderboard() {
    const topPlayers = [
        { rank: 1, username: 'algo_master', rating: 2850, winRate: '92%', matches: 1450 },
        { rank: 2, username: 'ByteRider', rating: 2710, winRate: '88%', matches: 1205 },
        { rank: 3, username: 'SyntaxError', rating: 2680, winRate: '85%', matches: 980 },
        { rank: 4, username: 'dev_ninja', rating: 2420, winRate: '68%', matches: 450 },
        { rank: 5, username: 'NullPointer', rating: 2390, winRate: '71%', matches: 620 },
        { rank: 6, username: 'O(1)_Wizard', rating: 2100, winRate: '60%', matches: 310 },
    ];

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
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-dark-bg/80 border-b border-dark-border text-gray-400 text-sm uppercase tracking-wider">
                                <th className="p-6 font-medium">Rank</th>
                                <th className="p-6 font-medium">Player</th>
                                <th className="p-6 font-medium text-right">Rating</th>
                                <th className="p-6 font-medium text-right">Win Rate</th>
                                <th className="p-6 font-medium text-right">Matches</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-border">
                            {topPlayers.map((player, idx) => (
                                <motion.tr
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    key={player.rank}
                                    className={`group relative transition-colors ${player.username === 'dev_ninja' ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-dark-bg/50'
                                        }`}
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
                                            <div className="w-10 h-10 rounded-full bg-dark-bg border border-dark-border flex items-center justify-center font-mono font-bold text-gray-300">
                                                {player.username.charAt(0).toUpperCase()}
                                            </div>
                                            <span className={`font-mono text-lg ${player.username === 'dev_ninja' ? 'text-primary font-bold' : 'text-white'}`}>
                                                {player.username}
                                                {player.username === 'dev_ninja' && <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-sans">YOU</span>}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-6 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Star className="w-4 h-4 text-warning" />
                                            <span className="font-bold text-xl text-white">{player.rating}</span>
                                        </div>
                                    </td>
                                    <td className="p-6 text-right font-mono text-success">
                                        {player.winRate}
                                    </td>
                                    <td className="p-6 text-right text-gray-400">
                                        {player.matches}
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
