"use client";

import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HomePage() {
    return (
        <>
            <Navbar />
            <main>
                <section className="container flex flex-col items-center gap-6 py-16 text-center md:py-24">
                    <motion.h1
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mx-auto max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-slate-900 md:text-6xl"
                    >
                        Painter & Visual Storyteller
                    </motion.h1>
                    <p className="mx-auto max-w-2xl text-slate-600 md:text-lg">
                        Exploring color, texture, and emotion through contemporary paintings and sketches.
                    </p>
                    <div className="flex gap-4">
                        <Link className="btn-primary" href="/drawings">
                            View Portfolio
                        </Link>
                        <Link className="nav-link inline-flex items-center rounded-full border border-slate-300 px-5 py-2" href="/contact">
                            Contact
                        </Link>
                    </div>
                    <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
                        {['featured-1.svg', 'featured-2.svg', 'featured-3.svg', 'featured-4.svg'].map((src, i) => (
                            <motion.div
                                key={src}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08 }}
                                className="overflow-hidden rounded-xl border border-slate-200"
                            >
                                <Image
                                    src={`/images/${src}`}
                                    alt={`Featured artwork ${i + 1}`}
                                    width={800}
                                    height={600}
                                    className="h-full w-full object-cover"
                                    priority={i < 2}
                                    loading={i < 2 ? "eager" : "lazy"}
                                    placeholder="blur"
                                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                                />
                            </motion.div>
                        ))}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}

