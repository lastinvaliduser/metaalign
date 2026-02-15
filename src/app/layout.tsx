import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-sans",
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://metaalign.vercel.app";

export const metadata: Metadata = {
    metadataBase: new URL(baseUrl),
    title: "MetaAlign - Technical SEO Auto-Fixer & Tag Analyzer",
    description:
        "Analyze any website's SEO meta tags instantly. Get AI-powered optimization suggestions for title, description, and Open Graph tags. Free forever, no signup required.",
    keywords: [
        "SEO analyzer",
        "meta tag checker",
        "SEO tool",
        "title tag optimizer",
        "meta description generator",
        "Open Graph checker",
        "free SEO tool",
    ],
    authors: [{ name: "MetaAlign" }],
    openGraph: {
        type: "website",
        locale: "en_US",
        url: baseUrl,
        siteName: "MetaAlign",
        title: "MetaAlign - Technical SEO Auto-Fixer",
        description:
            "Check your SEO tags in 3 seconds. Get optimized title, description & OG tags instantly. Free forever.",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "MetaAlign - SEO Meta Tag Analyzer",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "MetaAlign - Technical SEO Auto-Fixer",
        description:
            "Check your SEO tags in 3 seconds. Get optimized title, description & OG tags instantly.",
        images: ["/og-image.png"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
        },
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <head>
                <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "WebApplication",
                            name: "MetaAlign",
                            url: baseUrl,
                            description:
                                "Free SEO meta tag analyzer and optimizer. Get AI-powered suggestions for title, description, and Open Graph tags.",
                            applicationCategory: "SEO Tool",
                            operatingSystem: "Web",
                            offers: {
                                "@type": "Offer",
                                price: "0",
                                priceCurrency: "USD",
                            },
                        }),
                    }}
                />
            </head>
            <body className={`${inter.variable} font-sans antialiased`}>
                {children}
            </body>
        </html>
    );
}
