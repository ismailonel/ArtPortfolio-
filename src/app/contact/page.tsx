"use client";

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useEffect, useState } from 'react';
import { useInquiry } from '@/components/InquiryContext';

export default function ContactPage() {
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const { inquiry, clearInquiry } = useInquiry();

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const initialFullUrl = inquiry.imageUrl
        ? (inquiry.imageUrl.startsWith('http') ? inquiry.imageUrl : `${origin}${inquiry.imageUrl}`)
        : null;

    const [displayedImageUrl, setDisplayedImageUrl] = useState<string | null>(null);

    const prefilledMessage = 'Please give me more information about this painting.';

    useEffect(() => {
        setDisplayedImageUrl(initialFullUrl);
        if (inquiry.imageUrl) {
            const t = setTimeout(() => clearInquiry(), 0);
            return () => clearTimeout(t);
        }
    // We intentionally capture initialFullUrl once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Navbar />
            <main className="container py-10 md:py-14">
                <h1 className="mb-6 text-3xl font-semibold md:text-4xl">Contact</h1>
                <p className="mb-8 max-w-2xl text-slate-600">
                    For inquiries, commissions, or collaboration, send a message using the form
                    below. I will get back to you soon.
                </p>
                <form
                    action="https://formspree.io/f/yourFormId"
                    method="POST"
                    className="max-w-xl space-y-4"
                    onSubmit={() => setStatus('submitting')}
                >
                    <div>
                        <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
                            Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-rose-500/40"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-rose-500/40"
                        />
                    </div>
                    {displayedImageUrl && (
                        <div className="text-sm">
                            <span className="text-slate-600 mr-1">Artwork link:</span>
                            <a href={displayedImageUrl} target="_blank" rel="noreferrer" className="text-rose-600 underline break-all">
                                {displayedImageUrl}
                            </a>
                        </div>
                    )}
                    <div>
                        <label htmlFor="message" className="mb-1 block text-sm font-medium text-slate-700">
                            Message
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            rows={6}
                            required
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-rose-500/40"
                            defaultValue={inquiry.imageUrl ? 'Please give me more information about this painting.' : undefined}
                        />
                    </div>
                    <input type="text" name="_gotcha" className="hidden" />
                    <button className="btn-primary" type="submit" disabled={status === 'submitting'}>
                        {status === 'submitting' ? 'Sending…' : 'Send Message'}
                    </button>
                </form>
                <p className="mt-4 text-sm text-slate-500">
                    Replace the form action with your Formspree endpoint (e.g. https://formspree.io/f/abcde).
                </p>
            </main>
            <Footer />
        </>
    );
}

