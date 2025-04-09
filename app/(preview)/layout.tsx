import './globals.css';
import { Metadata } from 'next';
import { Toaster } from 'sonner';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://day-planner-lac.vercel.app'),
  title: 'Smart Day Planner - AI-Powered Daily Schedule',
  description:
    'Get an AI-optimized daily schedule that considers your energy levels, task types, and personal preferences. Plan your perfect day with smart time allocation and built-in breaks.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <Toaster position='top-center' richColors />
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
