import { Toaster } from "react-hot-toast";
import "./globals.css";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'App Pedagógico',
  description: 'TCC',
  manifest: '/manifest.json',
  icons: {apple: '/icon.png'},
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
