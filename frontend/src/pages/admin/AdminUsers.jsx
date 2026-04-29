import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Filter, ChevronLeft, ChevronRight, Shield, ShieldOff,
    Ban, CheckCircle2, Trash2, X, User, Mail, Calendar, MapPin, Trophy
} from 'lucide-react';

// ─── Confirmation Modal ──────────────────────────────────────────
function ConfirmModal({ open, title, message, onConfirm, onCancel, danger = false }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-panel rounded-2xl p-6 w-full max-w-md mx-4"
            >
                <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-400 mb-6">{message}</p>
                <div className="flex justify-end gap-3">
                    <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors">Cancel</button>
                    <button onClick={onConfirm} className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors ${danger ? 'bg-danger hover:bg-red-400' : 'bg-primary hover:bg-blue-400'}`}>{danger ? 'Delete' : 'Confirm'}</button>
                </div>
            </motion.div>
        </div>
    );
}

// ─── User Detail Drawer ──────────────────────────────────────────
function UserDrawer({ user, open, onClose }) {
    if (!open || !user) return null;
    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm" onClick={onClose}>
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-full max-w-md bg-dark-panel border-l border-dark-border h-full overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-white">User Details</h3>
                        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Avatar */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-2xl font-bold text-white shrink-0">
                            {user.username?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                            <p className="text-xl font-bold text-white">{user.username}</p>
                            <p className="text-sm text-gray-500">{user.firstName} {user.lastName}</p>
                        </div>
                    </div>

                    {/* Fields */}
                    <div className="space-y-4">
                        <InfoRow icon={Mail} label="Email" value={user.email} />
                        <InfoRow icon={Shield} label="Role" value={user.role} badge badgeColor={user.role === 'admin' ? 'bg-amber-500/15 text-amber-400' : 'bg-primary/15 text-primary'} />
                        <InfoRow icon={user.status === 'active' ? CheckCircle2 : Ban} label="Status" value={user.status || 'active'} badge badgeColor={user.status === 'banned' ? 'bg-danger/15 text-danger' : 'bg-success/15 text-success'} />
                        <InfoRow icon={Calendar} label="Joined" value={user.joined ? new Date(user.joined).toLocaleDateString() : '—'} />
                        <InfoRow icon={MapPin} label="Region" value={user.region || '—'} />
                        <InfoRow icon={Trophy} label="Matches" value={`${user.win || 0}W / ${user.matches || 0} total`} />
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

function InfoRow({ icon: Icon, label, value, badge = false, badgeColor = '' }) {
    return (
        <div className="flex items-center justify-between py-2 border-b border-dark-border/50">
            <div className="flex items-center gap-2 text-gray-400">
                <Icon className="w-4 h-4" />
                <span className="text-sm">{label}</span>
            </div>
            {badge ? (
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${badgeColor}`}>{value}</span>
            ) : (
                <span className="text-sm text-white">{value}</span>
            )}
        </div>
    );
}

// ─── Main Users Page ─────────────────────────────────────────────
export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [confirmModal, setConfirmModal] = useState({ open: false, title: '', message: '', onConfirm: null, danger: false });
    const limit = 15;

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page, limit, search, role: roleFilter, status: statusFilter });
            const res = await fetch(`/api/admin/users?${params}`);
            if (res.ok) {
                const data = await res.json();
                setUsers(data.users);
                setTotal(data.total);
                setTotalPages(data.totalPages);
            }
        } catch (err) {
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    }, [page, search, roleFilter, statusFilter]);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    // Debounced search
    const [searchInput, setSearchInput] = useState('');
    useEffect(() => {
        const t = setTimeout(() => { setSearch(searchInput); setPage(1); }, 400);
        return () => clearTimeout(t);
    }, [searchInput]);

    const handleRoleChange = async (userId, newRole) => {
        try {
            const res = await fetch(`/api/admin/users/${userId}/role`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole }),
            });
            if (res.ok) {
                toast.success(`Role updated to ${newRole}`);
                fetchUsers();
            } else {
                toast.error('Failed to update role');
            }
        } catch (err) { toast.error('Network error'); }
    };

    const handleStatusToggle = async (userId, currentStatus) => {
        const newStatus = currentStatus === 'banned' ? 'active' : 'banned';
        try {
            const res = await fetch(`/api/admin/users/${userId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                toast.success(`User ${newStatus === 'banned' ? 'banned' : 'unbanned'} successfully`);
                fetchUsers();
            } else {
                toast.error('Failed to update status');
            }
        } catch (err) { toast.error('Network error'); }
    };

    const handleDelete = (userId, username) => {
        setConfirmModal({
            open: true,
            title: 'Delete User',
            message: `Are you sure you want to permanently delete "${username}"? This action cannot be undone.`,
            danger: true,
            onConfirm: async () => {
                try {
                    const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
                    if (res.ok) {
                        toast.success('User deleted');
                        fetchUsers();
                    } else {
                        toast.error('Failed to delete user');
                    }
                } catch (err) { toast.error('Network error'); }
                setConfirmModal({ open: false });
            },
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">User Management</h1>
                <p className="text-sm text-gray-500 mt-1">{total} users registered</p>
            </div>

            {/* Search + Filters */}
            <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-[240px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search by username, email, name..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-dark-panel border border-dark-border rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                </div>
                <select
                    value={roleFilter}
                    onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
                    className="px-4 py-2.5 bg-dark-panel border border-dark-border rounded-lg text-sm text-gray-300 focus:outline-none focus:border-primary/50 cursor-pointer"
                >
                    <option value="">All Roles</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
                <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                    className="px-4 py-2.5 bg-dark-panel border border-dark-border rounded-lg text-sm text-gray-300 focus:outline-none focus:border-primary/50 cursor-pointer"
                >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="banned">Banned</option>
                </select>
            </div>

            {/* Table */}
            <div className="glass-panel rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-dark-border">
                                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Email</th>
                                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Joined</th>
                                <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-16">
                                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                                </td></tr>
                            ) : users.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-16 text-gray-600">No users found</td></tr>
                            ) : (
                                users.map((u, i) => (
                                    <motion.tr
                                        key={u._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.03 }}
                                        className="border-b border-dark-border/50 hover:bg-white/[0.02] transition-colors cursor-pointer"
                                        onClick={() => { setSelectedUser(u); setDrawerOpen(true); }}
                                    >
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/80 to-blue-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                                                    {u.username?.charAt(0)?.toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white">{u.username}</p>
                                                    <p className="text-xs text-gray-500 md:hidden">{u.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5 text-gray-400 hidden md:table-cell">{u.email}</td>
                                        <td className="px-5 py-3.5">
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${u.role === 'admin' ? 'bg-amber-500/15 text-amber-400' : 'bg-primary/15 text-primary'}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${(u.status || 'active') === 'banned' ? 'bg-danger/15 text-danger' : 'bg-success/15 text-success'}`}>
                                                {u.status || 'active'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-gray-500 hidden lg:table-cell">
                                            {u.joined ? new Date(u.joined).toLocaleDateString() : '—'}
                                        </td>
                                        <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button
                                                    onClick={() => handleRoleChange(u._id, u.role === 'admin' ? 'user' : 'admin')}
                                                    title={u.role === 'admin' ? 'Demote to user' : 'Promote to admin'}
                                                    className="p-1.5 rounded-lg text-gray-500 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
                                                >
                                                    {u.role === 'admin' ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                                                </button>
                                                <button
                                                    onClick={() => handleStatusToggle(u._id, u.status || 'active')}
                                                    title={(u.status || 'active') === 'banned' ? 'Unban user' : 'Ban user'}
                                                    className="p-1.5 rounded-lg text-gray-500 hover:text-danger hover:bg-danger/10 transition-colors"
                                                >
                                                    {(u.status || 'active') === 'banned' ? <CheckCircle2 className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(u._id, u.username)}
                                                    title="Delete user"
                                                    className="p-1.5 rounded-lg text-gray-500 hover:text-danger hover:bg-danger/10 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-5 py-3.5 border-t border-dark-border">
                        <p className="text-xs text-gray-500">Page {page} of {totalPages}</p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page <= 1}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page >= totalPages}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Drawer & Modal */}
            <AnimatePresence>
                {drawerOpen && <UserDrawer user={selectedUser} open={drawerOpen} onClose={() => setDrawerOpen(false)} />}
            </AnimatePresence>
            <ConfirmModal {...confirmModal} onCancel={() => setConfirmModal({ open: false })} />
        </div>
    );
}
