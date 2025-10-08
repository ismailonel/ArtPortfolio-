"use client";

import { useI18n } from '@/components/I18nContext';

export default function LanguageSelector() {
    const { locale, setLocale, languages } = useI18n();
    return (
        <label className="relative inline-flex items-center gap-2 text-sm text-slate-700">
            <span className="sr-only">Language</span>
            <select
                aria-label="Language selector"
                className="rounded-full border border-slate-300 bg-white px-3 py-1.5 pr-8 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500/40"
                value={locale}
                onChange={(e) => setLocale(e.target.value as any)}
            >
                {languages.map((l) => (
                    <option key={l.code} value={l.code}>
                        {l.label}
                    </option>
                ))}
            </select>
        </label>
    );
}


