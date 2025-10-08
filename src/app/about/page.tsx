"use client";

import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useI18n } from '@/components/I18nContext';

export default function AboutPage() {
    const { t } = useI18n();
    return (
        <>
            <Navbar />
            <main className="container py-10 md:py-14">
                <div className="grid items-start gap-8 md:grid-cols-[220px,1fr]">
                    <div className="overflow-hidden rounded-2xl border border-slate-200">
                        <Image
                            src="/images/profile.svg"
                            alt={t('about.profileAlt')}
                            width={600}
                            height={600}
                            className="h-auto w-full object-cover"
                            priority
                        />
                    </div>
                    <div className="container-prose">
                        <h1>{t('about.title')}</h1>
                        <p>{t('about.bio1')}</p>
                        <p>{t('about.bio2')}</p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

