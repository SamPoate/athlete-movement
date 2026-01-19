import { useEffect, useState } from 'react';
import { useTypedSelector } from '@redux/store';

const headlines = [
  'BREAKING: Local man re-racks weights, staff in tears of joy',
  'DEVELOPING: Someone actually wiped down equipment after use',
  'URGENT: Squat rack spotted empty for first time since 2019',
  'BREAKING: Man completes full range of motion, witnesses stunned',
  'UPDATE: Person reading machine instructions enters third hour',
  'ALERT: Gym mirror reported missing, 47 selfies now delayed',
  'EXCLUSIVE: Scientists confirm grunting adds 15% to lifts',
  'SHOCKING: Headphone jack works first try, investigation underway',
  "LIVE: Someone just asked 'how many sets left' - tensions high",
  'BREAKING: Treadmill user exceeded 5 minute walk, paramedics on standby',
  'URGENT: Protein shaker found in lost and found, smell evacuates building',
  "DEVELOPING: New Year's Resolution Steve spotted in February",
  'ALERT: Someone skipped chest day, friends and family concerned',
  'EXCLUSIVE: Man finishes workout without taking mirror selfie',
  'BREAKING: Leg day confirmed NOT optional, gym-goers devastated',
  'UPDATE: Water fountain queue now accepting appointments for March',
  'LIVE: Personal space violated in free weights area, mediation ongoing',
  'SHOCKING: Gym playlist features song from this decade',
  'ALERT: Someone returned dumbbells to CORRECT spot on rack',
  'BREAKING: Bench press wait time now shorter than UK visa processing'
];

export const GymTicker: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [headline, setHeadline] = useState('');
  const cardId = useTypedSelector(state => state.app.cardId);

  // Only enable on April 1st (April Fools' Day)
  const isAprilFools = () => {
    const today = new Date();
    return today.getMonth() === 3 && today.getDate() === 1; // Month is 0-indexed
  };

  useEffect(() => {
    if (!cardId || !isAprilFools()) {
      setIsVisible(false);
      return;
    }

    // Random chance to show ticker (roughly every 2-5 minutes on average)
    const checkInterval = setInterval(() => {
      // 10% chance every 30 seconds = roughly once every 5 minutes
      if (Math.random() < 0.1) {
        setHeadline(headlines[Math.floor(Math.random() * headlines.length)]);
        setIsVisible(true);

        // Hide after the animation completes (15 seconds for full scroll)
        setTimeout(() => {
          setIsVisible(false);
        }, 15000);
      }
    }, 30000);

    // Show one shortly after mounting for testing/demo (after 10 seconds)
    const initialTimeout = setTimeout(() => {
      setHeadline(headlines[Math.floor(Math.random() * headlines.length)]);
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 15000);
    }, 10000);

    return () => {
      clearInterval(checkInterval);
      clearTimeout(initialTimeout);
    };
  }, [cardId]);

  if (!isVisible || !cardId) return null;

  return (
    <div className='fixed bottom-0 left-0 right-0 z-50 bg-red-600 text-white py-2 overflow-hidden'>
      <div className='flex items-center'>
        <span className='bg-white text-red-600 font-bold px-3 py-1 text-sm uppercase tracking-wider flex-shrink-0 ml-2'>
          Breaking
        </span>
        <div className='animate-ticker whitespace-nowrap font-semibold text-lg ml-4'>
          📰 {headline} • 📰 {headline} • 📰 {headline}
        </div>
      </div>
    </div>
  );
};

export default GymTicker;
