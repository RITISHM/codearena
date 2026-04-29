import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Activity, Users, Swords, Send, Clock, TrendingUp,
    CheckCircle2, XCircle, AlertTriangle, UserCheck
} from 'lucide-react';

// ─── Mini Stat ───────────────────────────────────────────────────
function MiniStat({ icon: Icon, label, value, color, delay = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            className="glass-panel rounded-xl p-5 flex items-center gap-4 group hover:border-primary/20 transition-all"
        >
            <div className="p-3 rounded-lg shrink-0" style={{ background: `${color}12` }}>
                <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <div>
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
        </motion.div>
    );
}

// ─── Growth Chart ────────────────────────────────────────────────
function GrowthChart({ data }) {
    if (!data.length) return <p className="text-sm text-gray-600 text-center py-10">No data</p>;
    const max = Math.max(...data.map(d => d.count), 1);

    return (
        <div className="space-y-3">
            {data.map((d, i) => (
                <div key={i} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-20 shrink-0 text-right font-mono">{d.label}</span>
                    <div className="flex-1 h-7 bg-white/[0.03] rounded-lg overflow-hidden relative">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(d.count / max) * 100}%` }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                            className="h-full rounded-lg bg-gradient-to-r from-primary/60 to-primary"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-white">{d.count}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

// ─── Main Activity Page ──────────────────────────────────────────
export default function AdminActivity() {
    const [timeRange, setTimeRange] = useState(7);
    const [activeUsers, setActiveUsers] = useState({ users: [], count: 0 });
    const [growth, setGrowth] = useState([]);
    const [matchStats, setMatchStats] = useState({ ongoing: 0, completed: 0, aborted: 0 });
    const [subStats, setSubStats] = useState({ accepted: 0, wrong_answer: 0, runtime_error: 0, compile_error: 0 });
    const [recentActivity, setRecentActivity] = useState({ recentSubmissions: [], recentMatches: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const [activeRes, growthRes, matchRes, subRes, activityRes] = await Promise.all([
                    fetch(`/api/admin/activity/users?days=${timeRange}`),
                    fetch(`/api/admin/activity/growth?months=12`),
                    fetch('/api/admin/activity/matches'),
                    fetch('/api/admin/activity/submissions'),
                    fetch('/api/admin/activity/recent?limit=20'),
                ]);
                if (activeRes.ok) setActiveUsers(await activeRes.json());
                if (growthRes.ok) setGrowth(await growthRes.json());
                if (matchRes.ok) setMatchStats(await matchRes.json());
                if (subRes.ok) setSubStats(await subRes.json());
                if (activityRes.ok) setRecentActivity(await activityRes.json());
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [timeRange]);

    const totalSubs = Object.values(subStats).reduce((a, b) => a + b, 0);
    const totalMatches = Object.values(matchStats).reduce((a, b) => a + b, 0);

    const statusIcon = {
        accepted: <CheckCircle2 className="w-4 h-4 text-success" />,
        wrong_answer: <XCircle className="w-4 h-4 text-danger" />,
        runtime_error: <AlertTriangle className="w-4 h-4 text-amber-400" />,
        compile_error: <AlertTriangle className="w-4 h-4 text-purple-400" />,
    };

    const statusLabel = {
        accepted: 'Accepted',
        wrong_answer: 'Wrong Answer',
        runtime_error: 'Runtime Error',
        compile_error: 'Compile Error',
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Activity Monitor</h1>
                    <p className="text-sm text-gray-500 mt-1">Real-time platform health and user activity</p>
                </div>
                <div className="flex items-center gap-2">
                    {[7, 30, 90].map((d) => (
                        <button
                            key={d}
                            onClick={() => setTimeRange(d)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${timeRange === d
                                ? 'bg-primary/15 text-primary border border-primary/30'
                                : 'text-gray-500 hover:text-white hover:bg-white/5 border border-transparent'
                                }`}
                        >
                            {d}d
                        </button>
                    ))}
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MiniStat icon={UserCheck} label={`Active Users (${timeRange}d)`} value={activeUsers.count} color="#06b6d4" delay={0} />
                <MiniStat icon={Swords} label="Total Matches" value={totalMatches} color="#f59e0b" delay={0.08} />
                <MiniStat icon={Send} label="Total Submissions" value={totalSubs} color="#2ea043" delay={0.16} />
                <MiniStat icon={Activity} label="Ongoing Matches" value={matchStats.ongoing} color="#a78bfa" delay={0.24} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Growth */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-panel rounded-xl p-6"
                >
                    <div className="flex items-center gap-2 mb-5">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <h3 className="text-sm font-semibold text-white">User Growth (12 months)</h3>
                    </div>
                    <GrowthChart data={growth} />
                </motion.div>

                {/* Submission Breakdown */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-panel rounded-xl p-6"
                >
                    <div className="flex items-center gap-2 mb-5">
                        <Send className="w-4 h-4 text-success" />
                        <h3 className="text-sm font-semibold text-white">Submission Breakdown</h3>
                    </div>
                    <div className="space-y-3">
                        {Object.entries(subStats).map(([key, val]) => (
                            <div key={key} className="flex items-center gap-3">
                                {statusIcon[key]}
                                <span className="text-sm text-gray-400 flex-1">{statusLabel[key]}</span>
                                <span className="text-sm font-medium text-white">{val}</span>
                                <div className="w-24 h-2 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: totalSubs ? `${(val / totalSubs) * 100}%` : '0%' }}
                                        transition={{ duration: 0.6 }}
                                        className="h-full rounded-full"
                                        style={{
                                            background: key === 'accepted' ? '#2ea043' :
                                                key === 'wrong_answer' ? '#f85149' :
                                                    key === 'runtime_error' ? '#f59e0b' : '#a78bfa'
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Active Users List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass-panel rounded-xl p-6"
                >
                    <div className="flex items-center gap-2 mb-5">
                        <Users className="w-4 h-4 text-cyan-400" />
                        <h3 className="text-sm font-semibold text-white">Active Users ({timeRange}d)</h3>
                        <span className="ml-auto text-xs text-gray-500">{activeUsers.count} users</span>
                    </div>
                    {activeUsers.users.length > 0 ? (
                        <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                            {activeUsers.users.map((u) => (
                                <div key={u._id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.03] transition-colors">
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/80 to-blue-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                                        {u.username?.charAt(0)?.toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-white font-medium truncate">{u.username}</p>
                                        <p className="text-xs text-gray-500 truncate">{u.email}</p>
                                    </div>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${u.role === 'admin' ? 'bg-amber-500/15 text-amber-400' : 'bg-primary/15 text-primary'}`}>
                                        {u.role}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-600 text-center py-8">No active users in this period</p>
                    )}
                </motion.div>

                {/* Recent Activity Feed */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="glass-panel rounded-xl p-6"
                >
                    <div className="flex items-center gap-2 mb-5">
                        <Clock className="w-4 h-4 text-amber-400" />
                        <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
                    </div>
                    <div className="space-y-1 max-h-[320px] overflow-y-auto pr-1">
                        {/* Recent Matches */}
                        {recentActivity.recentMatches.map((m, i) => (
                            <div key={`m-${i}`} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.03] transition-colors">
                                <Swords className="w-4 h-4 text-amber-400 shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-white">
                                        <span className="font-medium">{m.players?.player1?.username || '?'}</span>
                                        <span className="text-gray-500 mx-1">vs</span>
                                        <span className="font-medium">{m.players?.player2?.username || '?'}</span>
                                    </p>
                                </div>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${m.status === 'completed' ? 'bg-success/15 text-success' :
                                    m.status === 'ongoing' ? 'bg-amber-500/15 text-amber-400' :
                                        'bg-danger/15 text-danger'
                                    }`}>{m.status}</span>
                                <span className="text-xs text-gray-600 shrink-0">
                                    {m.createdAt ? new Date(m.createdAt).toLocaleDateString() : ''}
                                </span>
                            </div>
                        ))}

                        {/* Recent Submissions */}
                        {recentActivity.recentSubmissions.map((s, i) => (
                            <div key={`s-${i}`} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.03] transition-colors">
                                {statusIcon[s.status] || <Send className="w-4 h-4 text-gray-500 shrink-0" />}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-white truncate">
                                        <span className="font-medium">{s.userId?.username || '?'}</span>
                                        <span className="text-gray-500 mx-1">→</span>
                                        <span className="text-gray-300">{s.problemId?.title || '?'}</span>
                                    </p>
                                </div>
                                <span className="text-xs text-gray-600 shrink-0">
                                    {s.createdAt ? new Date(s.createdAt).toLocaleTimeString() : ''}
                                </span>
                            </div>
                        ))}

                        {recentActivity.recentMatches.length === 0 && recentActivity.recentSubmissions.length === 0 && (
                            <p className="text-sm text-gray-600 text-center py-8">No recent activity</p>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
