import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hookerra — AI Hook Üretimi',
  description:
    'Gemini API destekli yapay zeka ile sıradan içerikleri durdurulamaz hooklara dönüştürün.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark">
      <body className="min-h-screen bg-[#000000] text-white">{children}</body>
    </html>
  );
}
