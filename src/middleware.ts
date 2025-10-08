import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const SUPPORTED = ['en', 'es', 'tr'] as const;
type Supported = typeof SUPPORTED[number];

function pickLocaleFromAcceptLanguage(header: string | null): Supported {
    if (!header) return 'en';
    const parts = header
        .split(',')
        .map((p) => p.trim().split(';')[0]?.toLowerCase())
        .filter(Boolean) as string[];
    for (const part of parts) {
        const primary = part.split('-')[0];
        if ((SUPPORTED as readonly string[]).includes(primary)) return primary as Supported;
    }
    return 'en';
}

export function middleware(req: NextRequest) {
    const res = NextResponse.next();

    const cookieLocale = req.cookies.get('locale')?.value as Supported | undefined;
    if (!cookieLocale || !(SUPPORTED as readonly string[]).includes(cookieLocale)) {
        const headerLocale = pickLocaleFromAcceptLanguage(req.headers.get('accept-language'));
        res.cookies.set('locale', headerLocale, { path: '/', maxAge: 60 * 60 * 24 * 365 });
    }

    return res;
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

