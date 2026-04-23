import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, ArrowRight, AlertCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

const COUNTRIES = [
    "Australia", "Brazil", "Canada", "China", "France", "Germany", "India",
    "Italy", "Japan", "Mexico", "Netherlands", "Russia", "Singapore",
    "South Korea", "Spain", "Sweden", "Switzerland", "United Kingdom",
    "United States", "Other"
];

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ username: '', email: '', password: '', firstName: '', lastName: '', region: '', dob: '' });
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const { login, signup, user } = useAuth();

    // If user is already logged in, redirect them away
    useEffect(() => {
        if (user) {
            navigate('/dashboard', { replace: true });
        }
    }, [user, navigate]);

    // If user came via /signup explicitly initially
    useEffect(() => {
        if (location.pathname === '/signup') setIsLogin(false);
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        let res;
        if (isLogin) {
            res = await login(formData.email, formData.password);
        } else {
            res = await signup(formData.username, formData.email, formData.password, formData.firstName, formData.lastName, formData.region, formData.dob);
        }

        if (res.success) {
            // Navigate to intended page, or default to dashboard
            const from = location.state?.from?.pathname || '/dashboard';
            navigate(from, { replace: true });
        } else {
            setError(res.error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            {/* Background elements */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 blur-[100px] rounded-full mix-blend-screen opacity-50 animate-pulse-slow"></div>
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/20 blur-[120px] rounded-full mix-blend-screen opacity-30"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="w-full max-w-md z-10"
            >
                <div className="flex flex-col items-center mb-8" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    <motion.div
                        initial={{ rotate: -10 }}
                        animate={{ rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                        className="p-3 rounded-2xl bg-dark-panel border border-dark-border glow-primary mb-4"
                    >
                        <Code2 className="w-10 h-10 text-primary" />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Code<span className="text-primary">Arena</span></h1>
                </div>

                <Card className="p-8 backdrop-blur-xl bg-dark-panel/90 shadow-2xl shadow-primary/5">
                    <div className="flex gap-4 mb-6 p-1 bg-dark-bg rounded-lg">
                        <button
                            onClick={() => { setIsLogin(true); setError(''); }}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${isLogin ? 'bg-dark-panel text-white shadow-sm glow-primary' : 'text-gray-400 hover:text-white'}`}
                            type="button"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => { setIsLogin(false); setError(''); }}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${!isLogin ? 'bg-dark-panel text-white shadow-sm glow-primary' : 'text-gray-400 hover:text-white'}`}
                            type="button"
                        >
                            Sign Up
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.form
                            key={isLogin ? 'login' : 'signup'}
                            initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                            transition={{ duration: 0.2 }}
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >
                            {error && (
                                <div className="p-3 bg-danger/10 border border-danger/30 rounded-lg flex items-center gap-2 text-danger text-sm">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    {error}
                                </div>
                            )}

                            {!isLogin && (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-gray-300">First Name</label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-white font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-gray-600"
                                                placeholder="John"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-gray-300">Last Name</label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-white font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-gray-600"
                                                placeholder="Doe"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-gray-300">Region</label>
                                            <select
                                                name="region"
                                                value={formData.region}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-white font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all cursor-pointer"
                                            >
                                                <option value="" disabled>Select Country</option>
                                                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-gray-300">Date of Birth</label>
                                            <input
                                                type="date"
                                                name="dob"
                                                value={formData.dob}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-white font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-gray-600"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-gray-300">Username</label>
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-white font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-gray-600"
                                            placeholder="dev_ninja"
                                        />
                                    </div>
                                </>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-300">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-white font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-gray-600"
                                    placeholder="hacker@codearena.dev"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-medium text-gray-300">Password</label>
                                    {isLogin && <a href="#" className="text-xs text-primary hover:text-blue-400" onClick={(e) => e.preventDefault()}>Forgot?</a>}
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-white font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-gray-600"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="pt-4">
                                <Button type="submit" variant="primary" className="w-full group">
                                    {isLogin ? 'Enter Arena' : 'Create Account'}
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        </motion.form>
                    </AnimatePresence>
                </Card>
            </motion.div>
        </div>
    );
}
