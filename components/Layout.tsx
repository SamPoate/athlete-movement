import Alert from './Alert';
import Footer from './Footer';
import Meta from './Meta';

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
        <main className='flex flex-col flex-grow'>{children}</main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
