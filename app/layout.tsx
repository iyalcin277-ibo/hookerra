import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hookerra — AI Content Factory',
  description:
    'Generate hooks, scripts, captions, CTAs & hashtags in one click with Gemini AI.',
  applicationName: 'Hookerra',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Hookerra',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    title: 'Hookerra — AI Content Factory',
    description: 'Generate hooks, scripts, captions, CTAs & hashtags in one click.',
    siteName: 'Hookerra',
  },
  twitter: {
    card: 'summary',
    title: 'Hookerra — AI Content Factory',
    description: 'Generate hooks, scripts, captions, CTAs & hashtags in one click.',
  },
};

export const viewport: Viewport = {
  themeColor: '#FF0000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#000000] text-white">{children}</body>
    </html>
  );
}
