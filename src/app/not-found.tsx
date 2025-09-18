import Link from 'next/link';

export default function NotFound() {
    return (
        <main className="container py-20 text-center">
            <h1 className="mb-4 text-4xl font-semibold">Page not found</h1>
            <p className="mb-6 text-slate-600">The page you requested does not exist.</p>
            <Link href="/" className="btn-primary">
                Go Home
            </Link>
        </main>
    );
}

