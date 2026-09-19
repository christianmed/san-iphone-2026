import './globals.css';

export const metadata = {
  title: 'Tanda iPhone 18 Pro Max - Dashboard',
  description: 'Sistema de control y seguimiento en tiempo real para tandas de motocicletas.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="light" suppressHydrationWarning>
      <body className="min-h-screen theme-transition" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
