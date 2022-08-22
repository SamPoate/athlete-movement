import Container from './Container';

interface FooterProps {}

export const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className='bg-neutral-700'>
      <Container className='flex justify-between text-xs'>
        <p className='text-center'>
          <a href='https://athletemovement.com' className='hover:underline' target='_blank' rel='noreferrer'>
            Athlete Movement
          </a>
        </p>
        <p className='text-center'>
          Made with love by{' '}
          <a
            href='https://sampoate.com'
            className='text-fuchsia-300 hover:underline'
            target='_blank'
            rel='noreferrer'
          >
            Sam Poate
          </a>
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
