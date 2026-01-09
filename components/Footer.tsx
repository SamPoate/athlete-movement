import { useEffect, useState } from 'react';
import { setCardId } from '@redux/slices/appSlice';
import { useTypedDispatch, useTypedSelector } from '@redux/store';
import Container from './Container';

const quotes = [
  "Pain is temporary. Pride is forever.",
  "The only bad workout is the one that didn't happen.",
  "Sweat is just fat crying.",
  "Your body can stand almost anything. It's your mind you have to convince.",
  "The hardest lift is lifting yourself off the couch.",
  "Be stronger than your excuses.",
  "Embrace the suck.",
  "One more rep. You've got this.",
  "Champions train, losers complain.",
  "The pain you feel today is the strength you feel tomorrow.",
  "Don't stop when you're tired. Stop when you're done.",
  "Results happen over time, not overnight.",
  "Push yourself because no one else is going to do it for you.",
  "The body achieves what the mind believes.",
  "Fall in love with taking care of yourself."
];

interface FooterProps {}

export const Footer: React.FC<FooterProps> = () => {
  const dispatch = useTypedDispatch();
  const cardId = useTypedSelector(state => state.app.cardId);
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    if (!cardId) return;
    
    const interval = setInterval(() => {
      setQuoteIndex(prev => (prev + 1) % quotes.length);
    }, 30000);

    return () => clearInterval(interval);
  }, [cardId]);

  return (
    <footer className='theme-bg-secondary z-10 py-1'>
      <Container className='flex justify-between items-center text-sm theme-text-muted'>
        <button onClick={() => dispatch(setCardId(null))}>← Back</button>
        {cardId ? (
          <p key={quoteIndex} className='animate-quote text-center flex-1 mx-4 italic'>
            "{quotes[quoteIndex]}"
          </p>
        ) : null}
        <p>Sponsored By Sam</p>
      </Container>
    </footer>
  );
};

export default Footer;
