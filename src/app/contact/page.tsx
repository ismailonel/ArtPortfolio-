"use client";

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useEffect, useRef, useState } from 'react';
import { useInquiry } from '@/components/InquiryContext';
import { useI18n } from '@/components/I18nContext';
import ReCAPTCHA from 'react-google-recaptcha';

export default function ContactPage() {
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const { inquiry, clearInquiry } = useInquiry();
    const { t } = useI18n();
    const formRef = useRef<HTMLFormElement | null>(null);
    const recaptchaRef = useRef<ReCAPTCHA | null>(null);
    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

    const FORMSPARK_FORM_ID = process.env.NEXT_PUBLIC_FORMSPARK_FORM_ID;
    // Fallbacks only in development to ease local testing; prod must use envs
    const isDev = typeof window !== 'undefined' && process.env.NODE_ENV !== 'production';
    const formsparkAction = FORMSPARK_FORM_ID
        ? (FORMSPARK_FORM_ID.startsWith('http') ? FORMSPARK_FORM_ID : `https://submit-form.com/${FORMSPARK_FORM_ID}`)
        : (isDev ? 'https://submit-form.com/FqnSFus0g' : '');
    const internalAction = '/api/contact';
    const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || (isDev ? '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI' : '');

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const initialFullUrl = inquiry.imageUrl
        ? (inquiry.imageUrl.startsWith('http') ? inquiry.imageUrl : `${origin}${inquiry.imageUrl}`)
        : null;

    const [displayedImageUrl, setDisplayedImageUrl] = useState<string | null>(null);

    const prefilledMessage = t('contact.prefilled');
    const messageWithArtwork = inquiry.imageUrl 
        ? `${prefilledMessage}\n\n${t('contact.artworkLink')} ${initialFullUrl}`
        : undefined;

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
        if (!formsparkAction) {
            setStatus('error');
            return;
        }
        setStatus('submitting');
        try {
            if (!formRef.current) throw new Error('form');
                const fd = new FormData(formRef.current);
                if (recaptchaToken) {
                    fd.set('g-recaptcha-response', recaptchaToken);
                }
            const res = await fetch(internalAction, {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                body: fd
            });
            if (res.ok) {
                setStatus('success');
                try { formRef.current.reset(); } catch {}
            } else {
                setStatus('error');
            }
            if (!res.ok) {
                try { console.error('Formspark error', await res.text()); } catch {}
            }
        } catch (err) {
            setStatus('error');
        } finally {
            try { recaptchaRef.current?.reset(); setRecaptchaToken(null); } catch {}
        }
    }

    return (
        <>
            <Navbar />
            <main className="container py-10 md:py-14">
                <h1 className="mb-6 text-3xl font-semibold md:text-4xl">{t('contact.title')}</h1>
                <p className="mb-8 max-w-2xl text-slate-600">{t('contact.subtitle')}</p>
                <form
                    action={internalAction}
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
                    <div>
                        <label htmlFor="message" className="mb-1 block text-sm font-medium text-slate-700">{t('contact.form.message')}</label>
                        <textarea
                            id="message"
                            name="message"
                            rows={6}
                            required
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-rose-500/40"
                            defaultValue={messageWithArtwork}
                        />
                    </div>
                    {RECAPTCHA_SITE_KEY ? (
                        <ReCAPTCHA
                            sitekey={RECAPTCHA_SITE_KEY}
                            onChange={(val: string | null) => setRecaptchaToken(val)}
                            ref={recaptchaRef}
                        />
                    ) : null}
                    <input type="text" name="_gotcha" className="hidden" />
                    <button className="btn-primary" type="submit" disabled={status === 'submitting' || status === 'success'}>
                        {status === 'submitting' ? t('contact.form.sending') : (status === 'success' ? 'Sent' : t('contact.form.send'))}
                    </button>
                </form>
                {status === 'success' && (
                    <p className="mt-4 text-sm text-emerald-600">{t('contact.form.success')}</p>
                )}
                {status === 'error' && (
                    <p className="mt-4 text-sm text-rose-600">{t('contact.form.error')}</p>
                )}
            </main>
            <Footer />
        </>
    );
}

