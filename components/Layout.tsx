import Image from 'next/image';
import Alert from './Alert';
import Footer from './Footer';
import Meta from './Meta';
import logo from '@image/logos/logo_lg.png';

interface LayoutProps {
  children: React.ReactNode;
  preview?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, preview }) => {
  return (
    <>
      <Meta />
      <div className='flex flex-col h-screen text-white bg-neutral-800'>
        <Alert preview={preview} />
        <div className='fixed h-full w-full'>
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
        <main className='flex flex-col flex-grow'>{children}</main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
