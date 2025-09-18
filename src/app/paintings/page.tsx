"use client";

import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LazyImage from '@/components/LazyImage';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type SaleStatus = 'available' | 'sold';

type GalleryItem = {
    thumb: string;
    full: string;
    alt: string;
    title: string;
    status: SaleStatus;
    price?: string;
};

const images: GalleryItem[] = Array.from({ length: 12 }).map((_, i) => {
    const index = (i % 6) + 1;
    const available = i % 4 !== 0; // mark every 4th as sold
    return {
        thumb: `/images/paintings/thumbs/work-${index}thumb.svg`,
        full: `/images/paintings/full/work-${index}.svg`,
        alt: `Painting ${i + 1}`,
        title: `Painting ${i + 1}`,
        status: available ? 'available' : 'sold',
        price: available ? `$${500 + i * 50}` : undefined,
    };
});

export default function PaintingsPage() {
    const [active, setActive] = useState<number | null>(null);

    const goPrev = () => setActive((idx) => (idx === null ? null : (idx + images.length - 1) % images.length));
    const goNext = () => setActive((idx) => (idx === null ? null : (idx + 1) % images.length));

    // Keyboard navigation
    useEffect(() => {
        if (active === null) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setActive(null);
            if (e.key === 'ArrowLeft') goPrev();
            if (e.key === 'ArrowRight') goNext();
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [active]);

    return (
        <>
            <Navbar />
            <main className="container py-10 md:py-14">
                <h1 className="mb-6 text-3xl font-semibold md:text-4xl">Paintings</h1>
                <p className="mb-10 max-w-2xl text-slate-600">
                    A selection of recent paintings. Tap any image to view larger.
                </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4">
                {images.map((img, idx) => (
                    <button
                        key={`painting-${idx}`}
                        onClick={() => setActive(idx)}
                        className="group relative overflow-hidden rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                    >
                        <span
                            className={`absolute left-2 top-2 z-10 rounded-full px-2.5 py-1 text-xs font-semibold shadow ${img.status === 'sold' ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'}`}
                        >
                            {img.status === 'sold' ? 'Sold' : 'Available'}
                        </span>
                        <LazyImage
                            src={img.thumb}
                            alt={img.alt}
                            width={600}
                            height={600}
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                        />
                    </button>
                ))}
            </div>

            <AnimatePresence>
                {active !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
                        onClick={() => setActive(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.98, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="relative max-h-[90vh] w-full max-w-5xl rounded-2xl bg-white p-2 shadow-2xl flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className="absolute right-3 top-2 z-10 rounded-full bg-white/90 px-3 py-1 text-sm text-slate-700 shadow hover:bg-white"
                                onClick={() => setActive(null)}
                            >
                                Close
                            </button>
                            <button
                                aria-label="Previous image"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goPrev();
                                }}
                                className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 text-slate-800 shadow hover:bg-white"
                            >
                                <span className="sr-only">Previous</span>
                                &#8592;
                            </button>
                            <button
                                aria-label="Next image"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goNext();
                                }}
                                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 text-slate-800 shadow hover:bg-white"
                            >
                                <span className="sr-only">Next</span>
                                &#8594;
                            </button>
                            {active !== null && (
                                <Image
                                    src={images[active].full}
                                    alt={images[active].alt}
                                    width={1600}
                                    height={1200}
                                    className="max-h-[80vh] h-auto w-full rounded-xl object-contain"
                                    priority={true}
                                    loading="eager"
                                />
                            )}
                            {active !== null && (
                                <div className="mt-2 flex items-center justify-between px-2">
                                    <div className="text-sm font-medium text-slate-800">{images[active].title}</div>
                                    <span
                                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${images[active].status === 'sold' ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'}`}
                                    >
                                        {images[active].status === 'sold' ? 'Sold' : images[active].price ? `Available · ${images[active].price}` : 'Available'}
                                    </span>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            </main>
            <Footer />
        </>
    );
}

