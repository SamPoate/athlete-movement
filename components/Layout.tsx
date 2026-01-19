import Image from 'next/image';
import Alert from './Alert';
import Footer from './Footer';
import GymTicker from './GymTicker';
import Meta from './Meta';
import logo from '@image/logos/logo_lg.png';
import { useTypedSelector } from '@redux/store';
import cn from 'classnames';

interface LayoutProps {
  children: React.ReactNode;
  preview?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, preview }) => {
  const theme = useTypedSelector(state => state.app.theme);

  return (
    <>
      <Meta />
      <div className={cn('flex flex-col h-screen theme-text theme-bg theme-font', `theme-${theme}`)}>
        <Alert preview={preview} />
        <div className='fixed h-full w-full theme-bg'>
          <Image
            src={logo}
            alt='Logo'
            className='opacity-10 p-10'
            style={{
              objectFit: 'contain',
              objectPosition: 'center'
            }}
            fill
            priority
          />
        </div>
        {/* Vice City palm trees */}
        {theme === 'vice' && (
          <>
            <div className='fixed bottom-0 left-0 text-[12rem] opacity-20 pointer-events-none z-0 leading-none'>
              🌴
            </div>
            <div className='fixed bottom-0 right-0 text-[10rem] opacity-15 pointer-events-none z-0 leading-none scale-x-[-1]'>
              🌴
            </div>
          </>
        )}
        {/* Chinese New Year decorations */}
        {theme === 'cny' && (
          <>
            <div className='fixed top-4 left-4 text-[4rem] opacity-60 pointer-events-none z-0 animate-lantern'>
              🏮
            </div>
            <div
              className='fixed top-4 right-4 text-[4rem] opacity-60 pointer-events-none z-0 animate-lantern'
              style={{ animationDelay: '0.5s' }}
            >
              🏮
            </div>
            <div className='fixed bottom-20 right-8 text-[6rem] opacity-30 pointer-events-none z-0'>🐍</div>
          </>
        )}
        {/* Barbie sparkles */}
        {theme === 'barbie' && (
          <>
            <div className='fixed top-10 left-10 text-[3rem] opacity-60 pointer-events-none z-0 animate-sparkle'>
              ✨
            </div>
            <div
              className='fixed top-20 right-16 text-[2rem] opacity-50 pointer-events-none z-0 animate-sparkle'
              style={{ animationDelay: '0.3s' }}
            >
              💖
            </div>
            <div
              className='fixed bottom-32 left-20 text-[2.5rem] opacity-40 pointer-events-none z-0 animate-sparkle'
              style={{ animationDelay: '0.6s' }}
            >
              ✨
            </div>
            <div
              className='fixed top-40 left-1/4 text-[2rem] opacity-30 pointer-events-none z-0 animate-sparkle'
              style={{ animationDelay: '0.9s' }}
            >
              💎
            </div>
          </>
        )}
        {/* Vaporwave 90s decorations */}
        {theme === 'vaporwave' && (
          <>
            <div className='fixed bottom-10 left-10 text-[5rem] opacity-30 pointer-events-none z-0'>🌺</div>
            <div className='fixed top-20 right-10 text-[4rem] opacity-20 pointer-events-none z-0'>🗿</div>
            <div className='fixed bottom-40 right-20 text-[3rem] opacity-25 pointer-events-none z-0'>🌴</div>
          </>
        )}
        {/* Matrix rain effect via pseudo grid */}
        {theme === 'matrix' && (
          <div className='fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-10'>
            <div className='matrix-rain' />
          </div>
        )}
        <main className='flex flex-col flex-grow z-10'>{children}</main>
        <Footer />
        <GymTicker />
      </div>
    </>
  );
};

export default Layout;
