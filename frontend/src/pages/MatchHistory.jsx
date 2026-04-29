import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, ChevronLeft, ChevronRight, Swords, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

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

function outcomeBadge(outcome) {
    const styles = {
        Win: 'bg-success/10 text-success border-success/20',
        Loss: 'bg-danger/10 text-danger border-danger/20',
        Aborted: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        Ongoing: 'bg-primary/10 text-primary border-primary/20',
    };
    return styles[outcome] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
}

export default function MatchHistory() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [matches, setMatches] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const limit = 10;

    const fetchMatches = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/user/me/matches/all?page=${page}&limit=${limit}`);
            if (res.ok) {
                const data = await res.json();
                setMatches(data.matches);
                setTotalPages(data.totalPages);
                setTotal(data.total);
            }
        } catch (err) {
            console.error('Failed to fetch matches:', err);
            toast.error('Failed to load match history');
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => { fetchMatches(); }, [fetchMatches]);

    if (!user) return null;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="shrink-0">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Trophy className="w-6 h-6 text-primary" />
                            Match History
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">{total} matches played</p>
                    </div>
                </div>

                {/* Match Cards */}
                <Card className="divide-y divide-dark-border overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-6 h-6 text-primary animate-spin" />
                        </div>
                    ) : matches.length === 0 ? (
                        <div className="text-center py-20">
                            <Swords className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                            <p className="text-gray-500">No matches yet. Start a battle!</p>
                            <Button variant="primary" size="sm" className="mt-4" onClick={() => navigate('/dashboard')}>
                                Go to Dashboard
                            </Button>
                        </div>
                    ) : (
                        matches.map((match, i) => (
                            <motion.div
                                key={match.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.04 }}
                                className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors cursor-pointer"
                                onClick={() => navigate(`/matches/${match.id}`)}
                            >
                                {/* Opponent avatar */}
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center font-mono text-sm border border-dark-border shrink-0">
                                    {match.opponent?.charAt(0)?.toUpperCase()}
                                </div>

                                {/* Match info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-mono text-white font-medium">{match.opponent}</span>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${outcomeBadge(match.outcome)}`}>
                                            {match.outcome}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-0.5">{timeAgo(match.date)}</p>
                                </div>

                                {/* Score */}
                                <div className="text-right shrink-0">
                                    <div className="flex items-center gap-1.5">
                                        <span className={`font-mono text-lg font-bold ${match.outcome === 'Win' ? 'text-success' : match.outcome === 'Loss' ? 'text-danger' : 'text-gray-400'}`}>
                                            {match.score}
                                        </span>
                                        <span className="text-gray-600 text-sm">-</span>
                                        <span className="font-mono text-lg text-gray-500">{match.opponentScore}</span>
                                    </div>
                                    <p className="text-[10px] text-gray-600 uppercase tracking-wider">Points</p>
                                </div>
                            </motion.div>
                        ))
                    )}
                </Card>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            Page {page} of {totalPages}
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page <= 1}
                            >
                                <ChevronLeft className="w-4 h-4 mr-1" /> Prev
                            </Button>

                            {/* Page numbers */}
                            <div className="hidden sm:flex items-center gap-1">
                                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (page <= 3) {
                                        pageNum = i + 1;
                                    } else if (page >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = page - 2 + i;
                                    }
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setPage(pageNum)}
                                            className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${pageNum === page
                                                ? 'bg-primary/15 text-primary border border-primary/30'
                                                : 'text-gray-500 hover:text-white hover:bg-white/5'
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page >= totalPages}
                            >
                                Next <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
