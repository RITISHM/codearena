import React from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

export default function Layout() {
    return (
        <div className="min-h-screen bg-dark-bg flex flex-col relative w-full overflow-hidden">
            {/* Subtle background glow effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

            <Navbar />

            <main className="flex-1 w-full flex flex-col relative z-10">
                <Outlet />
            </main>
        </div>
    );
}
