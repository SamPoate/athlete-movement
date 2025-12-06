import '@styles/index.css';
import { Toaster } from 'sonner';
import { Providers } from './providers';

export const metadata = {
  title: 'Athlete Movement',
  description: 'Athlete Movement Training Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
