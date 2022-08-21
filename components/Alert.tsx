import Link from 'next/link';
import Container from './Container';

interface AlertProps {
  preview: any;
}

export const Alert: React.FC<AlertProps> = ({ preview }) => {
  if (!preview) {
    return null;
  }

  return (
    <div className='border-b bg-accent-7 border-accent-7'>
      <Container className='p-2'>
        <div className='text-center text-sm'>
          This page is a preview.{' '}
          <Link href='/api/exit-preview' passHref>
            <a className='underline hover:text-fuchsia-400 duration-200 transition-colors'>Click here</a>
          </Link>{' '}
          to exit preview mode.
        </div>
      </Container>
    </div>
  );
};

export default Alert;
