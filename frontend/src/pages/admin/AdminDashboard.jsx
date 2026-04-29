import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import {
    Users, FileCode2, Swords, Send, TrendingUp, UserCheck,
    ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, XCircle, AlertTriangle
} from 'lucide-react';

// ─── Animated Counter ────────────────────────────────────────────
function AnimatedNumber({ value, duration = 1200 }) {
    const [display, setDisplay] = useState(0);
    useEffect(() => {
        let start = 0;
        const end = Number(value) || 0;
        if (end === 0) { setDisplay(0); return; }
        const increment = end / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= end) { setDisplay(end); clearInterval(timer); }
            else setDisplay(Math.floor(start));
        }, 16);
        return () => clearInterval(timer);
    }, [value, duration]);
    return <span>{display.toLocaleString()}</span>;
}

// ─── Mini Bar Chart (canvas-free, pure divs) ────────────────────
function MiniBarChart({ data, color = '#58a6ff' }) {
    const max = Math.max(...data.map(d => d.count), 1);
    return (
        <div className="flex items-end gap-1.5 h-24 mt-4">
            {data.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(d.count / max) * 100}%` }}
                        transition={{ duration: 0.6, delay: i * 0.08, ease: 'easeOut' }}
                        className="w-full rounded-t-sm min-h-[2px]"
                        style={{ background: `linear-gradient(to top, ${color}40, ${color})` }}
                    />
                    <span className="text-[10px] text-gray-500 truncate w-full text-center">
                        {d.label?.split('-')[1] || ''}
                    </span>
                </div>
            ))}
        </div>
    );
}

// ─── Donut Chart (SVG) ──────────────────────────────────────────
function DonutChart({ segments, size = 120 }) {
    const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
    let cumulative = 0;
    const radius = 44;
    const circumference = 2 * Math.PI * radius;

    return (
        <div className="flex items-center gap-6">
            <svg width={size} height={size} viewBox="0 0 100 100" className="shrink-0">
                <circle cx="50" cy="50" r={radius} fill="none" stroke="#1e2530" strokeWidth="10" />
                {segments.map((seg, i) => {
                    const pct = seg.value / total;
                    const offset = circumference * (1 - pct);
                    const rotation = (cumulative / total) * 360 - 90;
                    cumulative += seg.value;
                    return (
                        <circle
                            key={i}
                            cx="50" cy="50" r={radius}
                            fill="none"
                            stroke={seg.color}
                            strokeWidth="10"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                            transform={`rotate(${rotation} 50 50)`}
                            className="transition-all duration-700"
                        />
                    );
                })}
                <text x="50" y="50" textAnchor="middle" dominantBaseline="central" fill="white" fontSize="14" fontWeight="bold">
                    {total}
                </text>
            </svg>
            <div className="flex flex-col gap-2">
                {segments.map((seg, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: seg.color }} />
                        <span className="text-gray-400">{seg.label}</span>
                        <span className="text-white font-medium ml-auto">{seg.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Stat Card ───────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color, delay = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className="glass-panel rounded-xl p-5 relative overflow-hidden group hover:border-primary/30 transition-all duration-300"
        >
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-[40px] opacity-20 group-hover:opacity-30 transition-opacity" style={{ background: color }} />
            <div className="flex items-start justify-between relative z-10">
                <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">{label}</p>
                    <p className="text-3xl font-bold text-white">
                        <AnimatedNumber value={value} />
                    </p>
                </div>
                <div className="p-2.5 rounded-lg" style={{ background: `${color}15` }}>
                    <Icon className="w-5 h-5" style={{ color }} />
                </div>
            </div>
        </motion.div>
    );
}

// ─── Main Dashboard ──────────────────────────────────────────────
export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [growth, setGrowth] = useState([]);
    const [matchStats, setMatchStats] = useState({ ongoing: 0, completed: 0, aborted: 0 });
    const [subStats, setSubStats] = useState({ accepted: 0, wrong_answer: 0, runtime_error: 0, compile_error: 0 });
    const [recentActivity, setRecentActivity] = useState({ recentSubmissions: [], recentMatches: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [statsRes, growthRes, matchRes, subRes, activityRes] = await Promise.all([
                    fetch('/api/admin/stats'),
                    fetch('/api/admin/activity/growth?months=6'),
                    fetch('/api/admin/activity/matches'),
                    fetch('/api/admin/activity/submissions'),
                    fetch('/api/admin/activity/recent?limit=10'),
                ]);
                if (statsRes.ok) setStats(await statsRes.json());
                if (growthRes.ok) setGrowth(await growthRes.json());
                if (matchRes.ok) setMatchStats(await matchRes.json());
                if (subRes.ok) setSubStats(await subRes.json());
                if (activityRes.ok) setRecentActivity(await activityRes.json());
            } catch (err) {
                console.error('Dashboard fetch error:', err);
                toast.error('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const statCards = [
        { icon: Users, label: 'Total Users', value: stats?.totalUsers || 0, color: '#58a6ff' },
        { icon: FileCode2, label: 'Total Problems', value: stats?.totalProblems || 0, color: '#a78bfa' },
        { icon: Swords, label: 'Total Matches', value: stats?.totalMatches || 0, color: '#f59e0b' },
        { icon: Send, label: 'Submissions', value: stats?.totalSubmissions || 0, color: '#2ea043' },
        { icon: TrendingUp, label: 'New Users (7d)', value: stats?.newUsers || 0, color: '#f472b6' },
        { icon: UserCheck, label: 'Active Today', value: stats?.onlineToday || 0, color: '#06b6d4' },
    ];

    const matchSegments = [
        { label: 'Ongoing', value: matchStats.ongoing, color: '#f59e0b' },
        { label: 'Completed', value: matchStats.completed, color: '#2ea043' },
        { label: 'Aborted', value: matchStats.aborted, color: '#f85149' },
    ];

    const subSegments = [
        { label: 'Accepted', value: subStats.accepted, color: '#2ea043' },
        { label: 'Wrong Answer', value: subStats.wrong_answer, color: '#f85149' },
        { label: 'Runtime Error', value: subStats.runtime_error, color: '#f59e0b' },
        { label: 'Compile Error', value: subStats.compile_error, color: '#a78bfa' },
    ];

    const statusIcon = {
        accepted: <CheckCircle2 className="w-4 h-4 text-success" />,
        wrong_answer: <XCircle className="w-4 h-4 text-danger" />,
        runtime_error: <AlertTriangle className="w-4 h-4 text-amber-400" />,
        compile_error: <AlertTriangle className="w-4 h-4 text-purple-400" />,
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                <p className="text-sm text-gray-500 mt-1">Overview of platform statistics and activity</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {statCards.map((card, i) => (
                    <StatCard key={card.label} {...card} delay={i * 0.08} />
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* User Growth */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="glass-panel rounded-xl p-6"
                >
                    <h3 className="text-sm font-semibold text-white mb-1">User Growth</h3>
                    <p className="text-xs text-gray-500 mb-2">Last 6 months</p>
                    {growth.length > 0 ? (
                        <MiniBarChart data={growth} color="#58a6ff" />
                    ) : (
                        <p className="text-xs text-gray-600 mt-6 text-center">No data available</p>
                    )}
                </motion.div>

                {/* Match Breakdown */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="glass-panel rounded-xl p-6"
                >
                    <h3 className="text-sm font-semibold text-white mb-1">Match Breakdown</h3>
                    <p className="text-xs text-gray-500 mb-4">By status</p>
                    <DonutChart segments={matchSegments} />
                </motion.div>

                {/* Submission Breakdown */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="glass-panel rounded-xl p-6"
                >
                    <h3 className="text-sm font-semibold text-white mb-1">Submissions</h3>
                    <p className="text-xs text-gray-500 mb-4">By verdict</p>
                    <DonutChart segments={subSegments} />
                </motion.div>
            </div>

            {/* Recent Activity */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="glass-panel rounded-xl p-6"
            >
                <h3 className="text-sm font-semibold text-white mb-4">Recent Submissions</h3>
                {recentActivity.recentSubmissions.length > 0 ? (
                    <div className="space-y-3">
                        {recentActivity.recentSubmissions.map((sub, i) => (
                            <div key={i} className="flex items-center gap-4 px-4 py-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                                {statusIcon[sub.status] || <Clock className="w-4 h-4 text-gray-500" />}
                                <div className="flex-1 min-w-0">
                                    <span className="text-sm text-white font-medium">{sub.userId?.username || 'Unknown'}</span>
                                    <span className="text-gray-500 mx-2">→</span>
                                    <span className="text-sm text-gray-300">{sub.problemId?.title || 'Unknown Problem'}</span>
                                </div>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sub.problemId?.difficulty === 'easy' ? 'bg-success/15 text-success' :
                                    sub.problemId?.difficulty === 'medium' ? 'bg-amber-500/15 text-amber-400' :
                                        'bg-danger/15 text-danger'
                                    }`}>
                                    {sub.problemId?.difficulty || '—'}
                                </span>
                                <span className="text-xs text-gray-500 shrink-0">
                                    {sub.createdAt ? new Date(sub.createdAt).toLocaleTimeString() : ''}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-600 text-center py-8">No recent submissions</p>
                )}
            </motion.div>
        </div>
    );
}
