import '@styles/index.css';
import { Toaster } from 'sonner';
import { Providers } from './providers';
import { Inter, Orbitron, Bebas_Neue, Rajdhani } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron' });
const bebasNeue = Bebas_Neue({ weight: '400', subsets: ['latin'], variable: '--font-bebas' });
const rajdhani = Rajdhani({ weight: ['400', '600', '700'], subsets: ['latin'], variable: '--font-rajdhani' });

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
    <html lang="en" className={`${inter.variable} ${orbitron.variable} ${bebasNeue.variable} ${rajdhani.variable}`}>
      <body>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
