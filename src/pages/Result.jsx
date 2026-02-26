import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Clock, Target, Home, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function Result() {
    const navigate = useNavigate();

    // Mock Data
    const result = {
        isWinner: true,
        myScore: 300,
        opponentScore: 150,
        timeTaken: '08:45',
        accuracy: '100%',
        opponentName: 'ByteRider'
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl flex items-center justify-center min-h-[calc(100vh-64px)]">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="w-full"
            >
                <div className="text-center mb-10 relative">
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 blur-[100px] rounded-full z-0 pointer-events-none
            ${result.isWinner ? 'bg-success/30' : 'bg-danger/30'}
          `}></div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative z-10"
                    >
                        <div className={`inline-flex p-6 rounded-full mb-6 relative overflow-hidden
              ${result.isWinner ? 'bg-success/20 border-2 border-success/50 glow-success' : 'bg-danger/20 border-2 border-danger/50 glow-danger'}
            `}>
                            <Trophy className={`w-16 h-16 ${result.isWinner ? 'text-success' : 'text-danger'}`} />
                        </div>
                        <h1 className="text-5xl font-black text-white mb-2 tracking-tight">
                            {result.isWinner ? 'Victory!' : 'Defeat'}
                        </h1>
                        <p className="text-xl text-gray-400">Match against <span className="text-white font-mono">{result.opponentName}</span></p>
                    </motion.div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 relative z-10">
                    {/* Score Comparison */}
                    <Card className="p-8">
                        <h3 className="text-lg font-bold text-gray-400 mb-6 uppercase tracking-widest text-center">Final Score</h3>
                        <div className="flex items-center justify-center gap-8">
                            <div className="text-center">
                                <span className="text-sm text-gray-400 block mb-2 uppercase tracking-wider font-bold">You</span>
                                <span className={`text-5xl font-black ${result.isWinner ? 'text-success glow-text' : 'text-white'}`}>
                                    {result.myScore}
                                </span>
                            </div>
                            <div className="text-4xl text-dark-border font-light">VS</div>
                            <div className="text-center">
                                <span className="text-sm text-gray-400 block mb-2 uppercase tracking-wider font-bold">Opponent</span>
                                <span className={`text-5xl font-black ${!result.isWinner ? 'text-success glow-text' : 'text-white'}`}>
                                    {result.opponentScore}
                                </span>
                            </div>
                        </div>
                    </Card>

                    {/* Statistics */}
                    <Card className="p-8 flex flex-col justify-center">
                        <h3 className="text-lg font-bold text-gray-400 mb-6 uppercase tracking-widest">Match Stats</h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 text-gray-300">
                                    <Clock className="w-5 h-5 text-primary" />
                                    <span className="font-medium text-lg">Time Taken</span>
                                </div>
                                <span className="text-xl font-bold font-mono text-white">{result.timeTaken}</span>
                            </div>

                            <div className="w-full h-px bg-dark-border"></div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 text-gray-300">
                                    <Target className="w-5 h-5 text-secondary" />
                                    <span className="font-medium text-lg">Accuracy</span>
                                </div>
                                <span className="text-xl font-bold font-mono text-white">{result.accuracy}</span>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="flex justify-center gap-6 mt-10 relative z-10">
                    <Button variant="secondary" size="lg" onClick={() => navigate('/dashboard')} className="w-48">
                        <Home className="w-5 h-5 mr-2" />
                        Dashboard
                    </Button>
                    <Button variant="primary" size="lg" onClick={() => navigate('/dashboard')} className="w-48">
                        <RotateCcw className="w-5 h-5 mr-2" />
                        Play Again
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
