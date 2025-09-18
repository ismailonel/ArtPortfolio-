"use client";

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';

interface LazyImageProps {
    src: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
    priority?: boolean;
    blurDataURL?: string;
}

export default function LazyImage({ 
    src, 
    alt, 
    width, 
    height, 
    className = "", 
    priority = false,
    blurDataURL 
}: LazyImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(priority);
    const [isMounted, setIsMounted] = useState(false);
    const imgRef = useRef<HTMLDivElement>(null);

    // Ensure consistent hydration by only setting isInView after mount
    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (priority || !isMounted) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            {
                threshold: 0.1,
                rootMargin: '50px'
            }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, [priority, isMounted]);

    return (
        <div ref={imgRef} className={className}>
            {isInView && (
                <Image
                    src={src}
                    alt={alt}
                    width={width}
                    height={height}
                    className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                    loading={priority ? "eager" : "lazy"}
                    priority={priority}
                    placeholder={blurDataURL ? "blur" : "empty"}
                    blurDataURL={blurDataURL}
                    onLoad={() => setIsLoaded(true)}
                />
            )}
            {!isInView && (
                <div 
                    className={`bg-gray-200 animate-pulse ${className}`}
                    style={{ width, height }}
                />
            )}
        </div>
    );
}
