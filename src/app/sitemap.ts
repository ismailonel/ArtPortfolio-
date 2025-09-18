import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://example.com';

    return [
        { url: `${baseUrl}/`, lastModified: new Date() },
        { url: `${baseUrl}/drawings`, lastModified: new Date() },
        { url: `${baseUrl}/paintings`, lastModified: new Date() },
        { url: `${baseUrl}/about`, lastModified: new Date() },
        { url: `${baseUrl}/contact`, lastModified: new Date() },
    ];
}

