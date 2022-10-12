import { useRef, useState } from 'react';
import { usePopper } from 'react-popper';
import cn from 'classnames';
import { useOnClickOutside } from 'usehooks-ts';
import { setCardId } from '@redux/slices/appSlice';
import { useTypedDispatch } from '@redux/store';
import Container from './Container';

interface FooterProps {}

export const Footer: React.FC<FooterProps> = () => {
  const [showPopper, setShowPopper] = useState<boolean>(false);
  const [referenceElement, setReferenceElement] = useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);

  const footerRef = useRef<HTMLDivElement>(null);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [{ name: 'arrow', options: { element: arrowElement } }],
    placement: 'top-start'
  });

  const dispatch = useTypedDispatch();

  useOnClickOutside(footerRef, () => setShowPopper(false));

  return (
    <footer ref={footerRef} className='bg-neutral-700 z-10'>
      <Container className='flex justify-between text-xs'>
        <button
          ref={setReferenceElement}
          className='flex-1 text-left'
          onClick={() => {
            setShowPopper(!showPopper);
            console.log(popperElement?.focus);
          }}
        >
          Options
        </button>
        <div
          ref={setPopperElement}
          style={styles.popper}
          className={cn(
            'bg-neutral-800 text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48',
            { hidden: !showPopper }
          )}
          onBlur={() => {
            console.log('blur');
            setShowPopper(false);
          }}
          {...attributes.popper}
        >
          <div ref={setArrowElement} style={styles.arrow} />
          <button
            className='text-3xl font-semibold px-4 pt-2 pb-4 min-w-[300px] w-full whitespace-nowrap leading-none hover:bg-neutral-700'
            onClick={() => document.body.requestFullscreen()}
          >
            Fullscreen
          </button>
          {/* <p className='text-3xl font-semibold px-4 py-2 min-w-[300px] w-full whitespace-nowrap text-left'>Zoom</p>
          <button
            className='text-3xl font-semibold px-4 py-2 min-w-[300px] w-full whitespace-nowrap leading-none hover:bg-neutral-700'
            onClick={() => {}}
          >
            Zoom
          </button> */}
        </div>
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
