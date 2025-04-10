import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    manifest: '/manifest.json',
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://numberblock.vercel.app'),
    title: 'NumberBlock - Kids Number Learning Game',
    description: 'Learn numbers and patterns with fun, interactive blocks. A simple PWA game for kids.',
    keywords: ['numberblocks', 'kids game', 'learning numbers', 'educational game', 'pwa game', 'blocks game'],
    authors: [{ name: 'Your Name or Company Name' }], // Replace with your name/company
    openGraph: {
        title: 'NumberBlock - Kids Number Learning Game',
        description: 'Learn numbers and patterns with fun, interactive blocks.',
        url: 'https://your-app-url.com', // Replace with your actual app URL
        siteName: 'NumberBlock',
        images: [
            {
                url: '/icons/icon-512x512.png', // Or a dedicated OG image
                width: 512,
                height: 512,
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'NumberBlock - Kids Number Learning Game',
        description: 'Learn numbers and patterns with fun, interactive blocks.',
        // creator: '@yourTwitterHandle', // Replace with your Twitter handle
        images: ['/icons/icon-512x512.png'], // Or a dedicated Twitter image
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};

export const viewport: Viewport = {
    themeColor: '#000000',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <meta name="application-name" content="NumberBlock" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                <meta name="apple-mobile-web-app-title" content="NumberBlock" />
                <meta name="format-detection" content="telephone=no" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="msapplication-config" content="/icons/browserconfig.xml" />
                <meta name="msapplication-TileColor" content="#000000" />
                <meta name="msapplication-tap-highlight" content="no" />
                <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192x192.png" />
                <link rel="apple-touch-icon" sizes="512x512" href="/icons/icon-512x512.png" />
            </head>
            <body className={inter.className}>{children}</body>
        </html>
    );
} 