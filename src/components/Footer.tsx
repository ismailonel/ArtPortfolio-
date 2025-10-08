"use client";

import { useI18n } from '@/components/I18nContext';

export default function Footer() {
    const { t } = useI18n();
    const year = new Date().getFullYear();
    return (
        <footer className="mt-20 border-t border-slate-200 py-8 text-center text-sm text-slate-600">
            <div className="container">
                {t('footer.copyright', { year })}
            </div>
        </footer>
    );
}

