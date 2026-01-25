import { useEffect, useState } from 'react';
import { setCardId } from '@redux/slices/appSlice';
import { useTypedDispatch, useTypedSelector } from '@redux/store';
import Container from './Container';

const quotes = [
  { text: 'Pain is temporary. Pride is forever.', author: 'Unknown' },
  { text: "The only bad workout is the one that didn't happen.", author: 'Unknown' },
  { text: 'Sweat is just fat crying.', author: 'Unknown' },
  { text: "Your body can stand almost anything. It's your mind you have to convince.", author: 'Unknown' },
  { text: 'The hardest lift is lifting yourself off the couch.', author: 'Unknown' },
  { text: 'Be stronger than your excuses.', author: 'Unknown' },
  {
    text: 'Strength does not come from physical capacity. It comes from an indomitable will.',
    author: 'Mahatma Gandhi'
  },
  { text: "One more rep. You've got this.", author: 'Unknown' },
  { text: 'Champions train, losers complain.', author: 'Unknown' },
  { text: 'The pain you feel today is the strength you feel tomorrow.', author: 'Arnold Schwarzenegger' },
  { text: "Don't stop when you're tired. Stop when you're done.", author: 'David Goggins' },
  { text: 'Results happen over time, not overnight.', author: 'Unknown' },
  { text: 'Push yourself because no one else is going to do it for you.', author: 'Unknown' },
  { text: 'The body achieves what the mind believes.', author: 'Napoleon Hill' },
  { text: 'The last three or four reps is what makes the muscle grow.', author: 'Arnold Schwarzenegger' },
  { text: "Success isn't always about greatness. It's about consistency.", author: 'Dwayne Johnson' },
  { text: 'No pain, no gain. Shut up and train.', author: 'Unknown' },
  { text: 'The clock is ticking. Are you becoming the person you want to be?', author: 'Greg Plitt' },
  { text: 'What hurts today makes you stronger tomorrow.', author: 'Jay Cutler' },
  { text: "Go the extra mile. It's never crowded.", author: 'Wayne Dyer' },
  // Athlete Movement staff quotes
  { text: "If the bar ain't bending, you're just pretending.", author: 'Luke Binding' },
  {
    text: "I didn't choose the gym life. Actually wait, I literally did. I bought a gym.",
    author: 'Luke Binding'
  },
  { text: 'Burpees build character. I have too much character.', author: 'Luke Binding' },
  { text: 'Squats are just aggressive sitting.', author: 'Ben Glasscock' },
  { text: "I'm not sweating, I'm leaking awesome.", author: 'Ben Glasscock' },
  { text: "Deadlifts: because the floor isn't going to pick itself up.", author: 'Ben Glasscock' },
  {
    text: "My gym crush just saw me struggle with the door. We're basically dating.",
    author: 'Kieran Littlejohn'
  },
  {
    text: "My warm-up is your workout. My workout is also my warm-up. I'm confused.",
    author: 'Kieran Littlejohn'
  },
  { text: 'Cardio is hardio, so I just lift things instead.', author: 'Kieran Littlejohn' },
  {
    text: "You miss 100% of the lifts you don't attempt. You also miss some you do attempt.",
    author: 'Joe McLaughlan'
  },
  { text: 'The only BS I need is Burpees and Squats. Actually no, just the squats.', author: 'Joe McLauchlan' },
  { text: 'Sore today, even more sore tomorrow probably.', author: 'Joe MacLachlan' },
  { text: "I've seen your form. We need to talk.", author: 'Alex Fraser' },
  {
    text: 'Injury prevention is easy. Just do exactly what I say. Why is no one doing what I say?',
    author: 'Alex Fraser'
  },
  {
    text: 'I specialise in getting you back to the gym floor. I also specialise in judging how you got injured.',
    author: 'Alex Fraser'
  },
  {
    text: 'I represented Great Britain in powerlifting. Now I represent the snack cupboard at 2am.',
    author: 'Ed Crossley'
  },
  {
    text: "The gym floor has seen things. I have also seen things. We don't talk about it.",
    author: 'Ed Crossley'
  },
  {
    text: 'I speak three languages: English, gym grunts, and passive-aggressive plate reracking.',
    author: 'Ed Crossley'
  },
  { text: "I don't count sets. I count moments of existential clarity between sets.", author: 'Ed Crossley' },
  { text: "I built this app instead of working out. That's basically the same thing.", author: 'Sam Poate' },
  { text: 'My code compiles and my squats are deep. One of those is a lie.', author: 'Sam Poate' },
  { text: "I tell people I'm bulking. I've been bulking for 4 years.", author: 'Sam Poate' },
  { text: "I only came here to use the WiFi but now I'm doing burpees?", author: 'Dave from Accounting' },
  {
    text: 'Is this the heavy side or the light side? They both feel heavy.',
    author: 'Guy Who Forgot His Headphones'
  },
  { text: "I've been here 2 hours and only done 3 exercises. Socialising is cardio.", author: 'Treadmill Terry' },
  { text: "Does anyone know where the muscles are? I can't find mine.", author: 'New Year Resolution Steve' },
  { text: "I'm not lost, I'm just warming up in the wrong room.", author: 'Confused Carol' },
  { text: "That's not sweat, I just walked through someone's cloud.", author: 'Mirror Selfie Mike' },
  {
    text: 'These joggers have outlasted 3 relationships, 2 gym memberships, and my will to live.',
    author: 'Gymshark Loyalty Programme: Platinum Member (1 Item)'
  }
];

interface FooterProps {}

export const Footer: React.FC<FooterProps> = () => {
  const dispatch = useTypedDispatch();
  const cardId = useTypedSelector(state => state.app.cardId);
  const [quoteIndex, setQuoteIndex] = useState(() => Math.floor(Math.random() * quotes.length));

  useEffect(() => {
    if (!cardId) return;

    const interval = setInterval(() => {
      setQuoteIndex(Math.floor(Math.random() * quotes.length));
    }, 45000);

    return () => clearInterval(interval);
  }, [cardId]);

  return (
    <footer className='theme-bg-secondary z-10 py-1'>
      <Container className='flex justify-between items-center text-sm theme-text-muted'>
        <button onClick={() => dispatch(setCardId(null))}>← Back</button>
        {cardId ? (
          <p key={quoteIndex} className='animate-quote text-center font-semibold text-white flex-1 mx-4'>
            <span className='italic'>"{quotes[quoteIndex].text}"</span>
            <span className='ml-2 opacity-70'>- {quotes[quoteIndex].author}</span>
          </p>
        ) : null}
        <p>Sponsored By Sam</p>
      </Container>
    </footer>
  );
};

export default Footer;
