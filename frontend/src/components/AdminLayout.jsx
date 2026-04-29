import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Users,
    FileCode2,
    Activity,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Shield,
    Code2
} from 'lucide-react';

const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/problems', icon: FileCode2, label: 'Problems' },
    { to: '/admin/activity', icon: Activity, label: 'Activity' },
];

export default function AdminLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className="flex h-screen bg-dark-bg overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`${collapsed ? 'w-[72px]' : 'w-64'
                    } flex flex-col border-r border-dark-border bg-dark-panel/60 backdrop-blur-xl transition-all duration-300 ease-in-out relative z-20`}
            >
                {/* Logo */}
                <div className="h-16 flex items-center gap-2 px-4 border-b border-dark-border shrink-0">
                    <div className="p-1.5 rounded-lg bg-primary/10 shrink-0">
                        <Code2 className="w-6 h-6 text-primary" />
                    </div>
                    {!collapsed && (
                        <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
                            Code<span className="text-primary">Arena</span>
                        </span>
                    )}
                </div>

                {/* Admin Badge */}
                <div className={`mx-3 mt-4 mb-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 ${collapsed ? 'justify-center px-2' : ''}`}>
                    <Shield className="w-4 h-4 text-amber-400 shrink-0" />
                    {!collapsed && <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Admin Panel</span>}
                </div>

                {/* Nav Items */}
                <nav className="flex-1 flex flex-col gap-1 px-3 mt-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group
                                ${isActive
                                    ? 'bg-primary/15 text-primary shadow-[0_0_12px_rgba(88,166,255,0.15)]'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }
                                ${collapsed ? 'justify-center px-2' : ''}`
                            }
                        >
                            <item.icon className="w-5 h-5 shrink-0" />
                            {!collapsed && <span>{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>

                {/* User + Logout */}
                <div className="border-t border-dark-border p-3 shrink-0">
                    {!collapsed && (
                        <div className="flex items-center gap-3 px-3 py-2 mb-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                                {user?.username?.charAt(0)?.toUpperCase() || 'A'}
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-white truncate">{user?.username}</p>
                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-danger hover:bg-danger/10 transition-all duration-200 ${collapsed ? 'justify-center px-2' : ''}`}
                    >
                        <LogOut className="w-5 h-5 shrink-0" />
                        {!collapsed && <span>Logout</span>}
                    </button>
                </div>

                {/* Collapse Toggle */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-20 w-6 h-6 bg-dark-panel border border-dark-border rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary/20 transition-all duration-200 z-30"
                >
                    {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative">
                {/* Background glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 blur-[100px] rounded-full pointer-events-none z-0"></div>

                <div className="relative z-10 p-6 lg:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
