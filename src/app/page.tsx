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
                    <div className="flex justify-center">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 max-w-3xl">
                        {[
                            { src: 'featured-1.svg', category: 'portraits', title: 'Portraits' },
                            { src: 'featured-2.svg', category: 'still-life', title: 'Still Life' },
                            { src: 'featured-3.svg', category: 'landscape', title: 'Landscape' }
                        ].map((item, i) => (
                            <motion.div
                                key={item.src}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08 }}
                                className="group overflow-hidden rounded-xl border border-slate-200"
                            >
                                <Link href={`/paintings?category=${item.category}`} className="block">
                                    <div className="relative">
                                        <Image
                                            src={`/images/${item.src}`}
                                            alt={`Featured ${item.title.toLowerCase()} artwork ${i + 1}`}
                                            width={800}
                                            height={600}
                                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                            priority={i < 2}
                                            loading={i < 2 ? "eager" : "lazy"}
                                            placeholder="blur"
                                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                                        />
                                        <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/20" />
                                        <div className="absolute bottom-2 left-2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-800 opacity-0 transition duration-300 group-hover:opacity-100">
                                            View {item.title}
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}

