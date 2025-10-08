import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const contentType = req.headers.get('content-type') || '';
        let name = '';
        let email = '';
        let message = '';
        let recaptcha = '';
        if (contentType.includes('application/json')) {
            const body = await req.json();
            name = body?.name || '';
            email = body?.email || '';
            message = body?.message || '';
            recaptcha = body?.['g-recaptcha-response'] || '';
        } else {
            const form = await req.formData();
            name = String(form.get('name') || '');
            email = String(form.get('email') || '');
            message = String(form.get('message') || '');
            recaptcha = String(form.get('g-recaptcha-response') || '');
        }

        const FORMSPARK_FORM_ID = process.env.NEXT_PUBLIC_FORMSPARK_FORM_ID;
        // Fallback only in development to ease local testing; prod must use envs
        const isDev = process.env.NODE_ENV !== 'production';
        const formId = FORMSPARK_FORM_ID || (isDev ? 'FqnSFus0g' : '');
        if (!formId) {
            return NextResponse.json({ error: 'Formspark form id missing' }, { status: 500 });
        }
        const endpoint = formId.startsWith('http')
            ? formId
            : `https://submit-form.com/${formId}`;

        const fd = new URLSearchParams();
        fd.set('name', name);
        fd.set('email', email);
        fd.set('message', message);
        if (recaptcha) fd.set('g-recaptcha-response', recaptcha);
        // honeypot optional
        fd.set('_gotcha', '');

        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
            body: fd.toString(),
            // server-side, no CORS issues
            cache: 'no-store',
        });

        const text = await res.text();
        const isJson = (res.headers.get('content-type') || '').includes('application/json');
        let data: unknown = text;
        if (isJson) {
            try { data = JSON.parse(text); } catch {}
        }
        if (!res.ok) {
            return NextResponse.json({ ok: false, status: res.status, data }, { status: 502 });
        }
        return NextResponse.json({ ok: true, data });
    } catch (err) {
        return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
    }
}


