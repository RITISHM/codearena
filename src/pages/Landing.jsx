import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code2, Zap, Trophy, Shield, ArrowRight, Terminal } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div className="min-h-[calc(100vh-64px)] w-full overflow-hidden flex flex-col pt-12">
            {/* Dynamic Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-primary/10 blur-[150px] rounded-full mix-blend-screen opacity-50 animate-pulse-slow"></div>
                <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-600/10 blur-[120px] rounded-full mix-blend-screen opacity-40"></div>
                {/* Grid pattern overlay */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDQwIEwgNDAgNDAgTCA0MCAwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-50"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10 flex-1 flex flex-col items-center justify-center text-center pb-20">

                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mt-10 md:mt-20"
                >
                  

                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight">
                        The Ultimate <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400 glow-text drop-shadow-[0_0_15px_rgba(88,166,255,0.5)]">
                            Coding Battleground
                        </span>
                    </h1>

                    <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Challenge developers worldwide in real-time algorithmic battles. Write code faster, use abilities to disrupt opponents, and climb the global leaderboard.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Button
                            size="lg"
                            className="text-lg px-10 py-4 h-auto rounded-xl group relative overflow-hidden"
                            onClick={() => navigate('/login')}
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                            <span className="relative flex items-center gap-2">
                                Enter The Arena <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Button>
                        <Button
                            variant="secondary"
                            size="lg"
                            className="text-lg px-10 py-4 h-auto rounded-xl flex items-center gap-2"
                            onClick={() => navigate('/leaderboard')}
                        >
                            <Trophy className="w-5 h-5 text-yellow-500" />
                            Leaderboard
                        </Button>
                    </div>
                </motion.div>

                {/* Features Section */}
                <div className="grid md:grid-cols-3 gap-8 mt-32 w-full max-w-5xl text-left">
                    {[
                        {
                            icon: <Zap className="w-6 h-6 text-warning" />,
                            title: "Real-Time Battles",
                            desc: "Write, run, and submit code against opponents in real-time. Every second counts."
                        },
                        {
                            icon: <Terminal className="w-6 h-6 text-primary" />,
                            title: "Pro-Grade Editor",
                            desc: "Powered by Monaco Editor. Enjoy syntax highlighting, auto-completion, and a native IDE feel."
                        },
                        {
                            icon: <Shield className="w-6 h-6 text-success" />,
                            title: "Strategic Abilities",
                            desc: "Freeze your opponent's editor, delete their lines, or shield yourself to secure the win."
                        }
                    ].map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 + (idx * 0.1) }}
                            className="p-8 rounded-2xl bg-dark-panel/50 backdrop-blur-sm border border-dark-border hover:border-primary/50 transition-colors group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-dark-bg border border-dark-border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform group-hover:border-primary/50">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                            <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* How It Works Section */}
                <div className="mt-40 w-full max-w-5xl text-left">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">How It Works</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">Three simple steps to prove you are the best coder in the arena.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 relative">
                        <div className="hidden md:block absolute top-12 left-[16%] w-[68%] h-0.5 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 z-0"></div>

                        {[
                            { step: "1", title: "Join a Room", desc: "Create a private lobby with friends or join a public battle." },
                            { step: "2", title: "Solve Problems", desc: "Read the algorithm challenge and write an optimized solution." },
                            { step: "3", title: "Deploy Abilities", desc: "Use power-ups to sabotage opponents and claim victory." }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2 }}
                                className="relative z-10 flex flex-col items-center text-center"
                            >
                                <div className="w-24 h-24 rounded-full bg-dark-bg border-4 border-dark-border flex items-center justify-center text-3xl font-black text-white mb-6 shadow-xl relative">
                                    {item.step}
                                    <div className="absolute inset-0 rounded-full border border-primary/30 animate-pulse"></div>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="mt-40 w-full max-w-4xl bg-gradient-to-tr from-primary/20 to-purple-500/10 border border-primary/20 rounded-3xl p-12 text-center relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                    <h2 className="text-4xl font-bold text-white mb-6">Ready to climb the ranks?</h2>
                    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        Join thousands of developers competing daily to improve their algorithmic skills under pressure.
                    </p>
                    <Button size="lg" className="px-12 py-4 text-lg rounded-xl glow-primary" onClick={() => navigate('/signup')}>
                        Create Free Account
                    </Button>
                </motion.div>

            </div>

            {/* Footer */}
            <footer className="border-t border-dark-border bg-dark-bg/80 backdrop-blur-md mt-auto relative z-10">
                <div className="container mx-auto px-4 py-12">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div className="col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-1 rounded-md bg-primary/10">
                                    <Code2 className="w-5 h-5 text-primary" />
                                </div>
                                <span className="text-lg font-bold text-white">Code<span className="text-primary">Arena</span></span>
                            </div>
                            <p className="text-gray-400 max-w-sm mb-6 leading-relaxed">
                                The premier platform for competitive programming battles. Build skills, climb ranks, and dominate the arena.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-4">Platform</h4>
                            <ul className="space-y-3 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-primary transition-colors">Play</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Leaderboard</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Tournaments</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-4">Community</h4>
                            <ul className="space-y-3 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-primary transition-colors">Discord</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Twitter</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">GitHub</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-dark-border pt-8 flex flex-col md:flex-row items-center justify-between text-gray-500 text-sm">
                        <p>© {new Date().getFullYear()} CodeArena. All rights reserved.</p>
                        <div className="flex gap-6 mt-4 md:mt-0">
                            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
