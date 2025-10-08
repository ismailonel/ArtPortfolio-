import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import '@/app/globals.css';
import { InquiryProvider } from '@/components/InquiryContext';

export const metadata: Metadata = {
    title: {
        default: 'Ismail Onel | Painter',
        template: '%s | Art Portfolio',
    },
    description:
        "A modern, responsive portfolio showcasing original paintings, sketches, and artworks.",
    openGraph: {
        title: 'Ismail Onel | Painter',
        description:
            'A modern, responsive portfolio showcasing original paintings, sketches, and artworks.',
        type: 'website',
        url: 'https://example.com',
        images: [{ url: '/images/og-cover.jpg', width: 1200, height: 630 }],
    },
    metadataBase: new URL('https://example.com'),
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <html lang="en" className="scroll-smooth">
            <body className={`${inter.className} bg-white text-slate-900 antialiased`}>
                <InquiryProvider>
                    {children}
                </InquiryProvider>
            </body>
        </html>
    );
}

