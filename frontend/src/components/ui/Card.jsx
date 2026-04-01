import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Card({ children, className, ...props }) {
    return (
        <div
            className={twMerge(clsx('glass-panel rounded-xl overflow-hidden', className))}
            {...props}
        >
            {children}
        </div>
    );
}
