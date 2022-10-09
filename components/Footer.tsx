import { setCardId } from '@redux/slices/appSlice';
import { useTypedDispatch } from '@redux/store';
import Container from './Container';

interface FooterProps {}

export const Footer: React.FC<FooterProps> = () => {
  const dispatch = useTypedDispatch();

  return (
    <footer className='bg-neutral-700 z-10'>
      <Container className='flex justify-between text-xs'>
        <p className='flex-1'>
          <a href='https://athletemovement.com' className='hover:underline' target='_blank' rel='noreferrer'>
            Athlete Movement
          </a>
        </p>
        <button className='flex-1 text-center' onClick={() => dispatch(setCardId(null))}>
          Home
        </button>
        <p className='text-right flex-1'>
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
