import { useRef } from 'react';
import { setCardId } from '@redux/slices/appSlice';
import { useTypedDispatch } from '@redux/store';
import Container from './Container';

interface FooterProps {}

export const Footer: React.FC<FooterProps> = () => {
  const dispatch = useTypedDispatch();

  return (
    <footer className='bg-neutral-900/60 z-10 py-1'>
      <Container className='flex justify-between items-center text-sm text-neutral-400'>
        <button onClick={() => dispatch(setCardId(null))}>← Back</button>
        <p>Sponsored By Sam</p>
      </Container>
    </footer>
  );
};

export default Footer;
