"use client";

import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LazyImage from '@/components/LazyImage';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';

type SaleStatus = 'available' | 'sold';

type GalleryItem = {
    thumb: string;
    full: string;
    alt: string;
    title: string;
    status: SaleStatus;
    price?: string;
};

type Category = 'portraits' | 'still-life' | 'landscape';

const categories = {
    portraits: {
        title: 'Portraits',
        images: [
            {
                thumb: '/images/paintings/portraits/thumbs/work-1thumb.svg',
                full: '/images/paintings/portraits/full/work-1.svg',
                alt: 'Portrait 1',
                title: 'Portrait 1',
                status: 'available' as SaleStatus,
                price: '$550',
            },
            {
                thumb: '/images/paintings/portraits/thumbs/work-2thumb.svg',
                full: '/images/paintings/portraits/full/work-2.svg',
                alt: 'Portrait 2',
                title: 'Portrait 2',
                status: 'sold' as SaleStatus,
            },
        ]
    },
    'still-life': {
        title: 'Still Life',
        images: [
            {
                thumb: '/images/paintings/still-life/thumbs/work-3thumb.svg',
                full: '/images/paintings/still-life/full/work-3.svg',
                alt: 'Still Life 1',
                title: 'Still Life 1',
                status: 'available' as SaleStatus,
                price: '$600',
            },
            {
                thumb: '/images/paintings/still-life/thumbs/work-4thumb.svg',
                full: '/images/paintings/still-life/full/work-4.svg',
                alt: 'Still Life 2',
                title: 'Still Life 2',
                status: 'available' as SaleStatus,
                price: '$650',
            },
        ]
    },
    landscape: {
        title: 'Landscape',
        images: [
            {
                thumb: '/images/paintings/landscape/thumbs/work-5thumb.svg',
                full: '/images/paintings/landscape/full/work-5.svg',
                alt: 'Landscape 1',
                title: 'Landscape 1',
                status: 'available' as SaleStatus,
                price: '$700',
            },
            {
                thumb: '/images/paintings/landscape/thumbs/work-6thumb.svg',
                full: '/images/paintings/landscape/full/work-6.svg',
                alt: 'Landscape 2',
                title: 'Landscape 2',
                status: 'sold' as SaleStatus,
            },
        ]
    }
};

export default function PaintingsPage() {
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get('category') as Category;
    const [activeCategory, setActiveCategory] = useState<Category>(
        categoryParam && Object.keys(categories).includes(categoryParam) ? categoryParam : 'portraits'
    );
    const [activeImage, setActiveImage] = useState<{category: Category, index: number} | null>(null);

    const currentImages = categories[activeCategory].images;

    const goPrev = () => {
        if (activeImage === null) return;
        const currentCategoryImages = categories[activeImage.category].images;
        const prevIndex = (activeImage.index + currentCategoryImages.length - 1) % currentCategoryImages.length;
        setActiveImage({category: activeImage.category, index: prevIndex});
    };

    const goNext = () => {
        if (activeImage === null) return;
        const currentCategoryImages = categories[activeImage.category].images;
        const nextIndex = (activeImage.index + 1) % currentCategoryImages.length;
        setActiveImage({category: activeImage.category, index: nextIndex});
    };

    // Update category when URL parameter changes
    useEffect(() => {
        if (categoryParam && Object.keys(categories).includes(categoryParam)) {
            setActiveCategory(categoryParam);
        }
    }, [categoryParam]);

    // Keyboard navigation
    useEffect(() => {
        if (activeImage === null) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setActiveImage(null);
            if (e.key === 'ArrowLeft') goPrev();
            if (e.key === 'ArrowRight') goNext();
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [activeImage]);

    return (
        <>
            <Navbar />
            <main className="container py-10 md:py-14">
                <h1 className="mb-6 text-3xl font-semibold md:text-4xl">Paintings</h1>
                <p className="mb-10 max-w-2xl text-slate-600">
                    A selection of recent paintings organized by category. Tap any image to view larger.
                </p>
                
                {/* Category Tabs */}
                <div className="mb-8 flex flex-wrap gap-2">
                    {Object.entries(categories).map(([key, category]) => (
                        <button
                            key={key}
                            onClick={() => setActiveCategory(key as Category)}
                            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                                activeCategory === key
                                    ? 'bg-rose-600 text-white'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                        >
                            {category.title}
                        </button>
                    ))}
                </div>

                {/* Category Title */}
                <h2 className="mb-6 text-2xl font-semibold">{categories[activeCategory].title}</h2>

                {/* Images Grid */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4">
                    {currentImages.map((img, idx) => (
                        <button
                            key={`${activeCategory}-${idx}`}
                            onClick={() => setActiveImage({category: activeCategory, index: idx})}
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
                {activeImage !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
                        onClick={() => setActiveImage(null)}
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
                                onClick={() => setActiveImage(null)}
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
                            {activeImage !== null && (
                                <Image
                                    src={categories[activeImage.category].images[activeImage.index].full}
                                    alt={categories[activeImage.category].images[activeImage.index].alt}
                                    width={1600}
                                    height={1200}
                                    className="max-h-[80vh] h-auto w-full rounded-xl object-contain"
                                    priority={true}
                                    loading="eager"
                                />
                            )}
                            {activeImage !== null && (
                                <div className="mt-2 flex items-center justify-between px-2">
                                    <div className="text-sm font-medium text-slate-800">
                                        {categories[activeImage.category].images[activeImage.index].title}
                                    </div>
                                    <span
                                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                            categories[activeImage.category].images[activeImage.index].status === 'sold' 
                                                ? 'bg-rose-600 text-white' 
                                                : 'bg-emerald-600 text-white'
                                        }`}
                                    >
                                        {categories[activeImage.category].images[activeImage.index].status === 'sold' 
                                            ? 'Sold' 
                                            : categories[activeImage.category].images[activeImage.index].price 
                                                ? `Available · ${categories[activeImage.category].images[activeImage.index].price}` 
                                                : 'Available'
                                        }
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

