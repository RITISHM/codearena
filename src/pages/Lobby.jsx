import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Copy, Users, Settings, Play, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function Lobby() {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);

    // Mock state
    const isHost = true;
    const players = [
        { id: 1, name: 'dev_ninja', isHost: true, status: 'Ready', avatar: 'DN' },
        { id: 2, name: 'ByteRider', isHost: false, status: 'Ready', avatar: 'BR' }
    ];

    const handleCopy = () => {
        navigator.clipboard.writeText(roomId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleStartMatch = () => {
        navigate(`/arena/${roomId}`);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="text-center mb-8">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-flex items-center gap-3 bg-dark-panel border border-dark-border px-6 py-3 rounded-2xl mb-4"
                >
                    <span className="text-gray-400">Room Code:</span>
                    <span className="text-2xl font-mono font-bold tracking-widest text-primary glow-text">{roomId}</span>
                    <button
                        onClick={handleCopy}
                        className="ml-2 p-2 hover:bg-dark-bg rounded-lg transition-colors text-gray-400 hover:text-white"
                        title="Copy Code"
                    >
                        {copied ? <CheckCircle2 className="w-5 h-5 text-success" /> : <Copy className="w-5 h-5" />}
                    </button>
                </motion.div>
                <p className="text-gray-400">Waiting for players to get ready...</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Players Column */}
                <div className="md:col-span-2 space-y-4">
                    <Card className="p-6">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary" />
                            Players (2/2)
                        </h2>

                        <div className="space-y-4">
                            {players.map((player) => (
                                <motion.div
                                    key={player.id}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    className="flex items-center justify-between p-4 bg-dark-bg border border-dark-border rounded-xl"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-lg
                      ${player.isHost ? 'bg-primary/20 text-primary border border-primary/30 glow-primary' : 'bg-secondary/20 text-secondary border border-secondary/30'}
                    `}>
                                            {player.avatar}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-white text-lg">{player.name}</span>
                                                {player.isHost && (
                                                    <span className="text-[10px] uppercase font-bold bg-primary/20 text-primary px-2 py-0.5 rounded-full">Host</span>
                                                )}
                                            </div>
                                            <span className="text-success text-sm flex items-center gap-1">
                                                <div className="w-2 h-2 rounded-full bg-success glow-success"></div>
                                                {player.status}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {players.length < 2 && (
                                <div className="flex items-center justify-center p-8 bg-dark-bg/50 border border-dark-border border-dashed rounded-xl">
                                    <span className="text-gray-500 animate-pulse">Waiting for opponent...</span>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Settings Column */}
                <div className="space-y-6">
                    <Card className="p-6">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Settings className="w-5 h-5 text-secondary" />
                            Match Settings
                        </h2>

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Topic</label>
                                <select
                                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                                    disabled={!isHost}
                                >
                                    <option>Arrays & Hashing</option>
                                    <option>Two Pointers</option>
                                    <option>Sliding Window</option>
                                    <option>Dynamic Programming</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Difficulty</label>
                                <select
                                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                                    disabled={!isHost}
                                    defaultValue="Medium"
                                >
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Number of Problems</label>
                                <select
                                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                                    disabled={!isHost}
                                    defaultValue="3"
                                >
                                    <option value="1">1 Problem (Blitz)</option>
                                    <option value="3">3 Problems (Standard)</option>
                                    <option value="5">5 Problems (Marathon)</option>
                                </select>
                            </div>

                            {!isHost && (
                                <div className="flex items-start gap-2 text-warning text-sm p-3 bg-warning/10 rounded-lg">
                                    <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                                    <p>Only the host can change these settings.</p>
                                </div>
                            )}
                        </div>
                    </Card>

                    {isHost ? (
                        <Button onClick={handleStartMatch} className="w-full py-4 text-lg font-bold group" size="lg">
                            <Play className="w-5 h-5 mr-2 fill-current" />
                            Start Match
                        </Button>
                    ) : (
                        <div className="text-center p-4 bg-dark-panel rounded-xl border border-dark-border">
                            <p className="text-gray-400 text-sm">Waiting for host to start...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
