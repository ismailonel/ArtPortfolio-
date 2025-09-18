"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const links = [
    { href: '/', label: 'Home' },
    { href: '/drawings', label: 'Drawings' },
    { href: '/paintings', label: 'Paintings' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur">
            <div className="container mx-auto flex items-center justify-between py-4">
                <Link href="/" className="text-xl font-semibold tracking-tight">
                    <span className="text-slate-900">Art</span>
                    <span className="text-brand-accent">Portfolio</span>
                </Link>

                <div className="hidden gap-8 md:flex">
                    {links.map((l) => {
                        const active = pathname === l.href;
                        return (
                            <Link key={l.href} href={l.href} className="nav-link relative">
                                {l.label}
                                {active && (
                                    <motion.span
                                        layoutId="activeLink"
                                        className="absolute -bottom-1 left-0 h-0.5 w-full rounded bg-brand-accent"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </div>

                <button
                    className="md:hidden"
                    aria-label="Toggle Menu"
                    onClick={() => setOpen((v) => !v)}
                >
                    <div className="h-5 w-6">
                        <motion.span
                            animate={{ rotate: open ? 45 : 0, y: open ? 7 : 0 }}
                            className="block h-0.5 w-6 bg-slate-900"
                        />
                        <motion.span
                            animate={{ opacity: open ? 0 : 1 }}
                            className="my-1 block h-0.5 w-6 bg-slate-900"
                        />
                        <motion.span
                            animate={{ rotate: open ? -45 : 0, y: open ? -7 : 0 }}
                            className="block h-0.5 w-6 bg-slate-900"
                        />
                    </div>
                </button>
            </div>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden"
                    >
                        <div className="container flex flex-col gap-2 pb-4">
                            {links.map((l) => (
                                <Link key={l.href} href={l.href} className="nav-link py-2" onClick={() => setOpen(false)}>
                                    {l.label}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}

