import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import '@/app/globals.css';
import { InquiryProvider } from '@/components/InquiryContext';
import { I18nProvider } from '@/components/I18nContext';
import { cookies, headers } from 'next/headers';

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

export default async function RootLayout({ children }: { children: ReactNode }) {
    // Determine initial locale on the server
    const cookieStore = await cookies();
    const localeCookie = cookieStore.get('locale')?.value as 'en' | 'es' | 'tr' | undefined;

    let initialLocale: 'en' | 'es' | 'tr' = 'en';
    if (localeCookie && ['en', 'es', 'tr'].includes(localeCookie)) {
        initialLocale = localeCookie;
    } else {
        const acceptLanguage = (await headers()).get('accept-language') || '';
        // Very small parser: choose first supported language family
        const supported = ['en', 'es', 'tr'];
        const parts = acceptLanguage
            .split(',')
            .map((p) => p.trim().split(';')[0]?.toLowerCase())
            .filter(Boolean) as string[];
        const found = parts
            .map((code) => {
                // match by primary subtag, so es-AR -> es
                const primary = code.split('-')[0];
                return supported.includes(primary) ? (primary as 'en' | 'es' | 'tr') : undefined;
            })
            .find(Boolean);
        if (found) initialLocale = found;
    }

    return (
        <html lang={initialLocale} className="scroll-smooth">
            <body className={`${inter.className} bg-white text-slate-900 antialiased`}>
                <I18nProvider initialLocale={initialLocale}>
                    <InquiryProvider>
                        {children}
                    </InquiryProvider>
                </I18nProvider>
            </body>
        </html>
    );
}

