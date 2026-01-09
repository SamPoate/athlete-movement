'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import cn from 'classnames';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@lib/firebase';
import { useTypedDispatch, useTypedSelector } from '@redux/store';
import { setCardId, setTheme, Theme } from '@redux/slices/appSlice';
import Container from '@components/Container';
import Layout from '@components/Layout';
import Card from '@components/Card';
import huckle from '@image/beautiful-huckle.jpg';
import highFive from '@image/high-five.jpg';
import plates from '@image/plates.jpg';
import kettlebells from '@image/kettlebells.jpg';
import totallyNotADickShot from '@image/totally-not-a-dick-shot.jpg';

export default function Home() {
  const [classes, setClasses] = useState<(IClass & { id: string })[]>([]);
  const [workouts, setWorkouts] = useState<(IClassWorkout & { id: string })[]>([]);

  const cardId = useTypedSelector(state => state.app.cardId);
  const layout = useTypedSelector(state => state.app.layout);
  const theme = useTypedSelector(state => state.app.theme);

  const dispatch = useTypedDispatch();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'classes'), collection => {
      let allClasses: (IClass & { id: string })[] = [];

      collection.forEach(doc => {
        allClasses = [
          ...allClasses,
          {
            ...doc.data(),
            id: doc.id
          } as IClass & { id: string }
        ];
      });

      setClasses(allClasses);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    let unsubscribe = () => {};

    if (cardId) {
      unsubscribe = onSnapshot(collection(db, 'classes', cardId as string, 'workouts'), collection => {
        let allWorkouts: (IClassWorkout & { id: string })[] = [];

        collection.forEach(doc => {
          allWorkouts = [
            ...allWorkouts,
            {
              ...doc.data(),
              id: doc.id
            } as IClassWorkout & { id: string }
          ];
        });

        setWorkouts(allWorkouts.sort((a, b) => a.order - b.order));
      });
    } else {
      unsubscribe();
    }

    return () => {
      unsubscribe();
    };
  }, [cardId]);

  const getClassStyles = (title?: string) => {
    let color = 'text-white';
    let image = huckle;

    switch (title?.toLowerCase()) {
      case 'sweatcon':
        color = 'text-am-yellow';
        break;
      case 'metcon':
        color = 'text-am-blue';
        image = plates;
        break;
      case 'metstrong':
        color = 'text-am-red';
        image = totallyNotADickShot;
        break;
      case 'academy':
        color = 'text-blue-300';
        image = plates;
        break;
      case 'weightlifting':
        color = 'text-red-600';
        image = kettlebells;
        break;
      case 'barbellas':
        color = 'text-pink-400';
        image = highFive;
        break;
      default:
        color = 'text-white';
    }

    return { color, image };
  };

  const themes: { id: Theme; name: string; preview: string; icon: string }[] = [
    { id: 'dark', name: 'Dark', preview: 'bg-neutral-800', icon: '🌙' },
    { id: 'midnight', name: 'Midnight', preview: 'bg-[#0f0f1a]', icon: '✨' },
    { id: 'neon', name: 'Neon', preview: 'bg-[#0a0a14]', icon: '💚' },
    { id: 'retro', name: 'Retro', preview: 'bg-[#1a0a1a]', icon: '📼' },
    { id: 'vice', name: 'Vice City', preview: 'bg-[#1a1a2e]', icon: '🌴' },
    { id: 'cny', name: 'CNY', preview: 'bg-[#8b0000]', icon: '🏮' },
    { id: 'barbie', name: 'Barbie', preview: 'bg-[#ff69b4]', icon: '💅' },
    { id: 'vaporwave', name: '90s', preview: 'bg-[#2d1b4e]', icon: '💿' },
    { id: 'matrix', name: 'Matrix', preview: 'bg-black', icon: '💊' }
  ];

  const { color: cardColor, image: cardImage } = getClassStyles(classes.find(c => c.id === cardId)?.name);

  if (!cardId) {
    return (
      <Layout>
        <Container className='flex flex-col h-full'>
          <div className='flex justify-between items-start flex-wrap flex-1'>
            {classes.length ? (
              classes.map((item, index) => {
                const { color, image } = getClassStyles(item.name);

              if (!item.published) return null;

              return (
                <button
                  key={index}
                  className={cn(
                    'relative flex justify-center items-center w-[calc(50%_-_1rem)] px-16 pt-8 pb-10 mb-8 bg-neutral-700 hover:bg-neutral-400 cursor-pointer shadow-md rounded-md overflow-hidden'
                  )}
                  onClick={() => dispatch(setCardId(item.id))}
                >
                  <Image
                    src={image}
                    alt='background'
                    style={{
                      objectFit: 'cover',
                      objectPosition: 'center'
                    }}
                    fill
                  />
                  <div className='absolute bg-neutral-900 opacity-80 inset-0 z-0' />
                  <p className={cn('text-6xl font-semibold leading-none z-10', color)}>{item.name}</p>
                </button>
              );
            })
          ) : (
            <p className='theme-text text-center text-3xl w-full'>No classes found</p>
          )}
          </div>
          <div className='flex justify-center gap-2 py-4 mt-auto'>
            {themes.map(t => (
              <button
                key={t.id}
                onClick={() => dispatch(setTheme(t.id))}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border',
                  t.preview,
                  theme === t.id 
                    ? 'border-white/50 scale-105' 
                    : 'border-transparent opacity-50 hover:opacity-80'
                )}
              >
                <span>{t.icon}</span>
                <span>{t.name}</span>
              </button>
            ))}
          </div>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Card image={cardImage}>
        <div className='p-3'>
          <div className='flex justify-center'>
            <h1 className={cn('font-bold text-6xl tracking-tight text-center mb-1 uppercase retro-title', cardColor)}>
              {classes.find(c => c.id === cardId)?.name}
            </h1>
          </div>
          <div className='h-1 theme-divider mb-3' />
          {layout === 'list' ? (
            <ul className='space-y-2'>
              {workouts.map((workout, i) => {
                if (workout.name || workout.description) {
                  return (
                    <li 
                      key={i} 
                      className='animate-workout theme-card-bg rounded-lg px-4 py-2 border theme-border'
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      <div className='flex items-start gap-6'>
                        <div className='w-1/3 shrink-0'>
                          <p className='font-bold text-[3.5rem] leading-tight theme-accent uppercase tracking-wide retro-glow'>{workout.name}</p>
                        </div>
                        <ul className='flex-1'>
                          {workout.description.split(/\r?\n/).map((item, index) => (
                            <li key={index} className='font-medium text-[3.25rem] leading-tight theme-text'>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  );
                }
              })}
            </ul>
          ) : (
            <ul className='flex flex-wrap justify-center gap-3'>
              {workouts.map(
                (workout, i) =>
                  (workout.name || workout.description) && (
                    <li 
                      key={i} 
                      className='animate-workout flex flex-col px-4 py-2 rounded-xl theme-card-bg border theme-border'
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      <p
                        className={cn('font-bold text-center mb-2 theme-accent uppercase tracking-wide retro-glow', {
                          'text-[4rem] leading-tight': workouts.length < 5,
                          'text-[3.25rem] leading-tight': workouts.length >= 5
                        })}
                      >
                        {workout.name}
                      </p>
                      <div className='h-0.5 theme-divider mb-2' />
                      <ul>
                        {workout.description.split(/\r?\n/).map((item, index) => (
                          <li
                            key={index}
                            className={cn('font-medium theme-text', {
                              'text-[4.5rem] leading-tight': workouts.length < 5,
                              'text-[3.5rem] leading-tight': workouts.length >= 5
                            })}
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </li>
                  )
              )}
            </ul>
          )}
        </div>
      </Card>
    </Layout>
  );
}
