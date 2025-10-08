"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type Locale = 'en' | 'es' | 'tr';

type Translations = Record<string, any>;

type I18nContextValue = {
    locale: Locale;
    setLocale: (next: Locale) => void;
    t: (key: string, vars?: Record<string, string | number>) => string;
    languages: { code: Locale; label: string }[];
};

const I18nContext = createContext<I18nContextValue | null>(null);

const languages: { code: Locale; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'tr', label: 'Türkçe' },
];

// Static imports allow tree-shaking and type safety with Next.js bundling
import en from '@/i18n/locales/en.json';
import es from '@/i18n/locales/es.json';
import tr from '@/i18n/locales/tr.json';

const LOCALE_COOKIE = 'locale';

function getNested(obj: Translations, path: string): unknown {
    return path.split('.').reduce((acc: any, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
}

function interpolate(template: string, vars?: Record<string, string | number>): string {
    if (!vars) return template;
    return template.replace(/\{(.*?)\}/g, (_, k) => String(vars[k] ?? ''));
}

export function I18nProvider({ initialLocale, children }: { initialLocale: Locale; children: React.ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>(initialLocale);

    const translationsByLocale: Record<Locale, Translations> = useMemo(() => ({ en, es, tr }), []);

    const t = useCallback(
        (key: string, vars?: Record<string, string | number>) => {
            const bundle = translationsByLocale[locale];
            const value = getNested(bundle, key);
            if (typeof value === 'string') return interpolate(value, vars);
            // Fallback to key if missing
            return key;
        },
        [locale, translationsByLocale]
    );

    const setLocale = useCallback((next: Locale) => {
        setLocaleState(next);
        try {
            // Cookie
            document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${60 * 60 * 24 * 365}`;
            // Local storage
            window.localStorage.setItem(LOCALE_COOKIE, next);
            // Update <html lang>
            if (typeof document !== 'undefined') {
                document.documentElement.setAttribute('lang', next);
            }
        } catch {
            // no-op
        }
    }, []);

    useEffect(() => {
        // Sync from localStorage if different (first load on client)
        try {
            const stored = window.localStorage.getItem(LOCALE_COOKIE) as Locale | null;
            if (stored && stored !== locale) {
                setLocale(stored);
            }
        } catch {
            // ignore
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const value: I18nContextValue = useMemo(
        () => ({ locale, setLocale, t, languages }),
        [locale, setLocale, t]
    );

    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
    const ctx = useContext(I18nContext);
    if (!ctx) throw new Error('useI18n must be used within I18nProvider');
    return ctx;
}


