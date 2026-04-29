import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft, Swords, Trophy, Clock, Code2, CheckCircle2, XCircle,
    AlertTriangle, Timer, Cpu, ChevronDown, ChevronUp, Loader2
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

// ─── Helpers ─────────────────────────────────────────────────────
function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) +
        ' at ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

function formatDuration(start, end) {
    const ms = new Date(end) - new Date(start);
    const mins = Math.floor(ms / 60000);
    if (mins < 60) return `${mins} min`;
    const hrs = Math.floor(mins / 60);
    return `${hrs}h ${mins % 60}m`;
}

const statusConfig = {
    accepted: { icon: CheckCircle2, label: 'Accepted', color: 'text-success', bg: 'bg-success/10 border-success/20' },
    wrong_answer: { icon: XCircle, label: 'Wrong Answer', color: 'text-danger', bg: 'bg-danger/10 border-danger/20' },
    runtime_error: { icon: AlertTriangle, label: 'Runtime Error', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    compile_error: { icon: AlertTriangle, label: 'Compile Error', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
};

const diffColors = {
    easy: 'text-success',
    medium: 'text-amber-400',
    hard: 'text-danger',
};

// ─── Submission Card ─────────────────────────────────────────────
function SubmissionCard({ submission, isYours }) {
    const [expanded, setExpanded] = useState(false);
    const cfg = statusConfig[submission.status] || statusConfig.wrong_answer;
    const StatusIcon = cfg.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl border transition-colors ${isYours ? 'border-primary/20 bg-primary/[0.03]' : 'border-dark-border bg-dark-panel/50'}`}
        >
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left"
            >
                {/* Status icon */}
                <div className={`p-1.5 rounded-lg border ${cfg.bg}`}>
                    <StatusIcon className={`w-4 h-4 ${cfg.color}`} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-white">{submission.user}</span>
                        {isYours && <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/15 text-primary font-medium">You</span>}
                        <span className="text-xs text-gray-600">•</span>
                        <span className="text-xs text-gray-400">{submission.problem}</span>
                        <span className={`text-xs font-medium capitalize ${diffColors[submission.difficulty] || 'text-gray-400'}`}>
                            ({submission.difficulty})
                        </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                        <span className={`text-xs font-medium ${cfg.color}`}>{cfg.label}</span>
                        <span className="text-xs text-gray-600">
                            {submission.testcase.passed}/{submission.testcase.total} passed
                        </span>
                    </div>
                </div>

                {/* Meta */}
                <div className="hidden sm:flex items-center gap-4 text-xs text-gray-500 shrink-0">
                    <div className="flex items-center gap-1" title="Language">
                        <Code2 className="w-3 h-3" />
                        <span className="font-mono">{submission.language}</span>
                    </div>
                    <div className="flex items-center gap-1" title="Execution time">
                        <Timer className="w-3 h-3" />
                        <span>{submission.executionTime}ms</span>
                    </div>
                    <div className="flex items-center gap-1" title="Memory">
                        <Cpu className="w-3 h-3" />
                        <span>{(submission.memoryUsed / 1024).toFixed(1)}KB</span>
                    </div>
                </div>

                {expanded ? <ChevronUp className="w-4 h-4 text-gray-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />}
            </button>

            {/* Code preview */}
            {expanded && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-dark-border/50"
                >
                    <div className="px-4 py-3">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Submitted Code</span>
                            <div className="sm:hidden flex items-center gap-3 text-xs text-gray-500">
                                <span className="font-mono">{submission.language}</span>
                                <span>{submission.executionTime}ms</span>
                                <span>{(submission.memoryUsed / 1024).toFixed(1)}KB</span>
                            </div>
                        </div>
                        <pre className="bg-dark-bg rounded-lg p-4 overflow-x-auto text-xs font-mono text-gray-300 max-h-[300px] overflow-y-auto custom-scrollbar border border-dark-border/50">
                            <code>{submission.code}</code>
                        </pre>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}

// ─── Main Detail Page ────────────────────────────────────────────
export default function MatchDetail() {
    const { matchId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [match, setMatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMatch = async () => {
            try {
                const res = await fetch(`/api/user/me/matches/${matchId}`);
                if (res.ok) {
                    setMatch(await res.json());
                } else {
                    const data = await res.json();
                    setError(data.error || 'Failed to load match');
                }
            } catch (err) {
                setError('Network error');
            } finally {
                setLoading(false);
            }
        };
        fetchMatch();
    }, [matchId]);

    if (!user) return null;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-16 max-w-4xl text-center">
                <Swords className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Match Not Found</h2>
                <p className="text-gray-500 mb-6">{error}</p>
                <Button variant="secondary" onClick={() => navigate(-1)}>Go Back</Button>
            </div>
        );
    }

    const p1 = match.players.player1;
    const p2 = match.players.player2;
    const isWinnerP1 = match.winner?._id === p1._id || match.winner === p1._id;
    const isWinnerP2 = match.winner?._id === p2._id || match.winner === p2._id;

    const matchStatusBadge = {
        completed: { label: 'Completed', cls: 'bg-success/10 text-success border-success/20' },
        ongoing: { label: 'Ongoing', cls: 'bg-primary/10 text-primary border-primary/20' },
        aborted: { label: 'Aborted', cls: 'bg-danger/10 text-danger border-danger/20' },
    };
    const badge = matchStatusBadge[match.status] || matchStatusBadge.completed;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Back + Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="shrink-0">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back
                    </Button>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-2xl font-bold text-white">Match Detail</h1>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badge.cls}`}>
                                {badge.label}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                            <Clock className="w-3 h-3 inline mr-1" />
                            {formatDate(match.createdAt)}
                            {match.status === 'completed' && ` • Duration: ${formatDuration(match.startedAt, match.createdAt)}`}
                        </p>
                    </div>
                </div>

                {/* Scoreboard */}
                <Card className="p-0 overflow-hidden">
                    <div className="bg-gradient-to-r from-primary/5 via-transparent to-primary/5 px-6 py-8">
                        <div className="flex items-center justify-center gap-6 md:gap-12">
                            {/* Player 1 */}
                            <div className={`text-center flex-1 ${isWinnerP1 ? '' : 'opacity-70'}`}>
                                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl font-bold font-mono border-2 mb-3
                                    ${isWinnerP1 ? 'bg-success/10 border-success/40 text-success' : 'bg-dark-bg border-dark-border text-gray-400'}`}>
                                    {p1.username?.charAt(0)?.toUpperCase()}
                                </div>
                                <p className="font-mono text-white font-bold text-lg">{p1.username}</p>
                                {p1.isYou && <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/15 text-primary font-medium">You</span>}
                                {p1.firstName && <p className="text-xs text-gray-500 mt-0.5">{p1.firstName} {p1.lastName}</p>}
                                <p className={`text-3xl font-bold mt-2 font-mono ${isWinnerP1 ? 'text-success' : 'text-white'}`}>
                                    {p1.points}
                                </p>
                                <p className="text-xs text-gray-600 uppercase">points</p>
                                {isWinnerP1 && (
                                    <div className="flex items-center justify-center gap-1 mt-2 text-success">
                                        <Trophy className="w-4 h-4" />
                                        <span className="text-xs font-bold uppercase">Winner</span>
                                    </div>
                                )}
                            </div>

                            {/* VS */}
                            <div className="shrink-0 flex flex-col items-center gap-2">
                                <div className="w-14 h-14 rounded-full bg-dark-bg border border-dark-border flex items-center justify-center">
                                    <Swords className="w-6 h-6 text-primary" />
                                </div>
                                <span className="text-xs text-gray-600 font-bold tracking-widest">VS</span>
                            </div>

                            {/* Player 2 */}
                            <div className={`text-center flex-1 ${isWinnerP2 ? '' : 'opacity-70'}`}>
                                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl font-bold font-mono border-2 mb-3
                                    ${isWinnerP2 ? 'bg-success/10 border-success/40 text-success' : 'bg-dark-bg border-dark-border text-gray-400'}`}>
                                    {p2.username?.charAt(0)?.toUpperCase()}
                                </div>
                                <p className="font-mono text-white font-bold text-lg">{p2.username}</p>
                                {p2.isYou && <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/15 text-primary font-medium">You</span>}
                                {p2.firstName && <p className="text-xs text-gray-500 mt-0.5">{p2.firstName} {p2.lastName}</p>}
                                <p className={`text-3xl font-bold mt-2 font-mono ${isWinnerP2 ? 'text-success' : 'text-white'}`}>
                                    {p2.points}
                                </p>
                                <p className="text-xs text-gray-600 uppercase">points</p>
                                {isWinnerP2 && (
                                    <div className="flex items-center justify-center gap-1 mt-2 text-success">
                                        <Trophy className="w-4 h-4" />
                                        <span className="text-xs font-bold uppercase">Winner</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Problems */}
                {match.problems?.length > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Problems</h3>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {match.problems.map((prob) => (
                                <Card key={prob._id} className="p-4 flex items-center gap-3 hover:border-primary/20 transition-colors">
                                    <div className="p-2 rounded-lg bg-primary/10">
                                        <Code2 className="w-4 h-4 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white truncate">{prob.title}</p>
                                        <p className="text-xs text-gray-500 font-mono">#{prob.problemId}</p>
                                    </div>
                                    <span className={`text-xs font-medium capitalize ${diffColors[prob.difficulty] || 'text-gray-400'}`}>
                                        {prob.difficulty}
                                    </span>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Submissions */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        Submissions ({match.submissions.length})
                    </h3>
                    {match.submissions.length === 0 ? (
                        <Card className="p-8 text-center">
                            <p className="text-gray-500">No submissions for this match</p>
                        </Card>
                    ) : (
                        <div className="space-y-3">
                            {match.submissions.map((sub) => (
                                <SubmissionCard
                                    key={sub.id}
                                    submission={sub}
                                    isYours={sub.userId?.toString() === user?._id || sub.user === user?.username}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
