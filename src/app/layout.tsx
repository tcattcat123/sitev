import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vitaliy Petrov - IT Solutions',
  description: 'Full-stack разработчик, специализирующийся на MVP, стартапах, автоматизации и ИИ. Работаю с проектами от макета до финального развертывания. Стек: Go, Python, React, Next.js.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap" rel="stylesheet" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js" async></script>
      </head>
      <body className="font-body antialiased">
        {children}
      </body>
    </html>
  );
}
