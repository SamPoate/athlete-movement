import { useRef } from 'react';
import { setCardId } from '@redux/slices/appSlice';
import { useTypedDispatch } from '@redux/store';
import Container from './Container';

interface FooterProps {}

export const Footer: React.FC<FooterProps> = () => {
  const dispatch = useTypedDispatch();

  return (
    <footer className='bg-neutral-700 z-10'>
      <Container className='flex justify-between text-xs'>
        <button className='flex-1 text-left' onClick={() => dispatch(setCardId(null))}>
          Home
        </button>
        <p className='text-right flex-1'>
          Sponsored By Sam
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
