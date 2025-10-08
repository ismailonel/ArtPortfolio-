"use client";

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useEffect, useRef, useState } from 'react';
import { useInquiry } from '@/components/InquiryContext';
import { useI18n } from '@/components/I18nContext';
import HCaptcha from '@hcaptcha/react-hcaptcha';

export default function ContactPage() {
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const { inquiry, clearInquiry } = useInquiry();
    const { t } = useI18n();
    const formRef = useRef<HTMLFormElement | null>(null);
    const hcaptchaRef = useRef<any>(null);

    const FORMSPARK_FORM_ID = process.env.NEXT_PUBLIC_FORMSPARK_FORM_ID;
    const formsparkAction = FORMSPARK_FORM_ID
        ? (FORMSPARK_FORM_ID.startsWith('http') ? FORMSPARK_FORM_ID : `https://submit-form.com/${FORMSPARK_FORM_ID}`)
        : '';
    const HCAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || '';

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const initialFullUrl = inquiry.imageUrl
        ? (inquiry.imageUrl.startsWith('http') ? inquiry.imageUrl : `${origin}${inquiry.imageUrl}`)
        : null;

    const [displayedImageUrl, setDisplayedImageUrl] = useState<string | null>(null);

    const prefilledMessage = t('contact.prefilled');

    useEffect(() => {
        setDisplayedImageUrl(initialFullUrl);
        if (inquiry.imageUrl) {
            const t = setTimeout(() => clearInquiry(), 0);
            return () => clearTimeout(t);
        }
    // We intentionally capture initialFullUrl once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!formsparkAction || !HCAPTCHA_SITE_KEY) {
            setStatus('error');
            return;
        }
        setStatus('submitting');
        try {
            const token = await hcaptchaRef.current?.execute({ async: true });
            if (!token || !formRef.current) throw new Error('hcaptcha');
            const fd = new FormData(formRef.current);
            fd.append('h-captcha-response', token);
            const res = await fetch(formsparkAction, { method: 'POST', body: fd });
            setStatus(res.ok ? 'success' : 'error');
        } catch {
            setStatus('error');
        } finally {
            try { hcaptchaRef.current?.resetCaptcha(); } catch {}
        }
    }

    return (
        <>
            <Navbar />
            <main className="container py-10 md:py-14">
                <h1 className="mb-6 text-3xl font-semibold md:text-4xl">{t('contact.title')}</h1>
                <p className="mb-8 max-w-2xl text-slate-600">{t('contact.subtitle')}</p>
                <form
                    action={formsparkAction || undefined}
                    method="POST"
                    className="max-w-xl space-y-4"
                    ref={formRef}
                    onSubmit={handleSubmit}
                >
                    <div>
                        <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">{t('contact.form.name')}</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-rose-500/40"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">{t('contact.form.email')}</label>
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
                            <span className="text-slate-600 mr-1">{t('contact.artworkLink')}</span>
                            <a href={displayedImageUrl} target="_blank" rel="noreferrer" className="text-rose-600 underline break-all">
                                {displayedImageUrl}
                            </a>
                        </div>
                    )}
                    <div>
                        <label htmlFor="message" className="mb-1 block text-sm font-medium text-slate-700">{t('contact.form.message')}</label>
                        <textarea
                            id="message"
                            name="message"
                            rows={6}
                            required
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-rose-500/40"
                            defaultValue={inquiry.imageUrl ? t('contact.prefilled') : undefined}
                        />
                    </div>
                    {HCAPTCHA_SITE_KEY ? (
                        <HCaptcha
                            sitekey={HCAPTCHA_SITE_KEY}
                            size="invisible"
                            ref={hcaptchaRef}
                            onError={() => setStatus('error')}
                        />
                    ) : null}
                    <input type="text" name="_gotcha" className="hidden" />
                    <button className="btn-primary" type="submit" disabled={status === 'submitting'}>
                        {status === 'submitting' ? t('contact.form.sending') : t('contact.form.send')}
                    </button>
                </form>
                <p className="mt-4 text-sm text-slate-500">{t('contact.formspreeNote')}</p>
            </main>
            <Footer />
        </>
    );
}

