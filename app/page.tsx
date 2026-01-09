'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import cn from 'classnames';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@lib/firebase';
import { useTypedDispatch, useTypedSelector } from '@redux/store';
import { setCardId } from '@redux/slices/appSlice';
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

  const { color: cardColor, image: cardImage } = getClassStyles(classes.find(c => c.id === cardId)?.name);

  if (!cardId) {
    return (
      <Layout>
        <Container className='flex justify-between items-start flex-wrap'>
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
            <p className='text-white text-center text-3xl w-full'>No classes found</p>
          )}
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Card image={cardImage}>
        <div className='p-3'>
          <div className='flex justify-center'>
            <h1 className={cn('font-bold text-6xl tracking-tight text-center mb-1 uppercase', cardColor)}>
              {classes.find(c => c.id === cardId)?.name}
            </h1>
          </div>
          <div className='h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mb-3' />
          {layout === 'list' ? (
            <ul className='space-y-2'>
              {workouts.map((workout, i) => {
                if (workout.name || workout.description) {
                  return (
                    <li key={i} className='bg-neutral-900/40 rounded-lg px-4 py-2'>
                      <div className='flex items-start gap-6'>
                        <div className='w-1/3 shrink-0'>
                          <p className='font-bold text-[3.5rem] leading-tight text-yellow-400 uppercase tracking-wide'>{workout.name}</p>
                        </div>
                        <ul className='flex-1'>
                          {workout.description.split(/\r?\n/).map((item, index) => (
                            <li key={index} className='font-medium text-[3.25rem] leading-tight text-white/95'>
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
                    <li key={i} className='flex flex-col px-4 py-2 rounded-xl bg-neutral-900/50 border border-neutral-700/50'>
                      <p
                        className={cn('font-bold text-center mb-2 text-yellow-400 uppercase tracking-wide', {
                          'text-[4rem] leading-tight': workouts.length < 5,
                          'text-[3.25rem] leading-tight': workouts.length >= 5
                        })}
                      >
                        {workout.name}
                      </p>
                      <div className='h-0.5 bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent mb-2' />
                      <ul>
                        {workout.description.split(/\r?\n/).map((item, index) => (
                          <li
                            key={index}
                            className={cn('font-medium text-white/95', {
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
