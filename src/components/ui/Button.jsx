import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    className,
    glow = true,
    ...props
}) {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: `bg-primary text-dark-bg hover:bg-blue-400 ${glow ? 'hover:glow-primary' : ''} focus:ring-primary`,
        secondary: 'bg-dark-panel text-gray-200 border border-dark-border hover:bg-dark-border focus:ring-secondary',
        danger: `bg-danger text-white hover:bg-red-400 ${glow ? 'hover:glow-danger' : ''} focus:ring-danger`,
        success: `bg-success text-white hover:bg-green-400 ${glow ? 'hover:glow-success' : ''} focus:ring-success`,
        ghost: 'bg-transparent text-gray-300 hover:text-white hover:bg-dark-panel',
    };

    const sizes = {
        sm: 'text-sm px-3 py-1.5',
        md: 'text-base px-5 py-2.5',
        lg: 'text-lg px-8 py-3',
        icon: 'p-2',
    };

    const mergedClasses = twMerge(clsx(baseStyles, variants[variant], sizes[size], className));

    return (
        <button className={mergedClasses} {...props}>
            {children}
        </button>
    );
}
