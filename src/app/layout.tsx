import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import CursorGlow from '@/components/ui/CursorGlow';
import PhoenixCompanion from '@/components/phoenix/PhoenixCompanion';
import ParticleField from '@/components/ui/ParticleField';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'PhoenixLearn — Rise Through Knowledge',
    template: '%s | PhoenixLearn',
  },
  description:
    'The most advanced adaptive learning platform. Master mathematics, science, and coding with AI-powered personalization, 3D visualizations, and the Phoenix companion.',
  keywords: [
    'adaptive learning', 'RD Sharma', 'JEE preparation', 'AI tutor',
    'mathematics', 'physics', 'chemistry', 'biology', 'coding',
    'online education', 'personalized learning', 'knowledge gap',
  ],
  authors: [{ name: 'PhoenixLearn' }],
  creator: 'PhoenixLearn',
  metadataBase: new URL('https://phoenixlearn.app'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://phoenixlearn.app',
    title: 'PhoenixLearn — Rise Through Knowledge',
    description: 'The most advanced adaptive learning platform for Class 9-12 students.',
    siteName: 'PhoenixLearn',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PhoenixLearn — Rise Through Knowledge',
    description: 'AI-powered adaptive learning platform.',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#ff6b35',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-void min-h-screen antialiased font-body overflow-x-hidden">
        {/* Custom cursor */}
        <CursorGlow />

        {/* Ambient particle field */}
        <ParticleField />

        {/* Main content */}
        <main className="relative z-10">
          {children}
        </main>

        {/* Phoenix Companion — always present */}
        <PhoenixCompanion />

        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(17,17,24,0.95)',
              border: '1px solid rgba(255,107,53,0.25)',
              color: '#fff',
              backdropFilter: 'blur(20px)',
            },
          }}
        />
      </body>
    </html>
  );
}
