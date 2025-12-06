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
import snowCap1 from '@image/snow-cap-1.png';
import snowCap2 from '@image/snow-cap-2.png';
import snowCap3 from '@image/snow-cap-3.png';
import christmasHat from '@image/christmas-hat.png';
import Snowfall from 'react-snowfall';

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
        <div className='p-4'>
          <div className='flex justify-center'>
            <div className='relative'>
              <h2 className={cn('font-semibold lg:text-7xl leading-none text-5xl text-center mb-5', cardColor)}>
                {classes.find(c => c.id === cardId)?.name}
              </h2>
              <Image src={christmasHat} alt='Christmas hat' width={40} className='absolute top-[-5px] left-[-16px]' />
            </div>
          </div>
          <hr className='border-yellow-300 mb-4 mx-auto' />
          {layout === 'list' ? (
            <ul>
              {workouts.map((workout, i) => {
                if (workout.name || workout.description) {
                  let snowImage = snowCap1;
                  let width = 250;
                  let position = 'left-0 top-[-12px]';

                  if (i % 3 === 0) {
                    snowImage = snowCap2;
                    width = 100;
                    position = 'right-[15px] top-[-12px]';
                  } else if (i % 3 === 1) {
                    snowImage = snowCap3;
                    width = 110;
                    position = 'left-[300px] top-[-8px]';
                  }

                  return (
                    <li key={i} className='mb-4'>
                      <div className='flex items-center justify-between'>
                        <div className='w-1/4 mr-16'>
                          <p className='font-semibold text-[3.75rem] leading-[4rem]'>{workout.name}</p>
                        </div>
                        <ul className='w-3/4'>
                          {workout.description.split(/\r?\n/).map((item, index) => (
                            <li key={index} className='mb-2 font-semibold text-[4rem] leading-[5rem]'>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className='relative'>
                        <Image
                          src={snowImage}
                          alt='Snow cap'
                          width={width}
                          className={cn('absolute', position)}
                        />
                        <hr className='border-yellow-300 mt-5 mb-3 mx-5' />
                      </div>
                    </li>
                  );
                }
              })}
            </ul>
          ) : (
            <ul className='flex flex-wrap justify-between'>
              {workouts.map(
                (workout, i) =>
                  (workout.name || workout.description) && (
                    <li key={i} className='flex flex-col mb-4 mx-2 px-4 py-1 rounded-lg bg-neutral-800'>
                      <p
                        className={cn('font-semibold text-center mt-1 mb-2', {
                          'text-[4.5rem] leading-[4.75rem]': workouts.length < 5,
                          'text-[3.75rem] leading-[4rem]': workouts.length >= 5
                        })}
                      >
                        {workout.name}
                      </p>
                      <hr className='border-yellow-300 mx-5' />
                      <ul>
                        {workout.description.split(/\r?\n/).map((item, index) => (
                          <li
                            key={index}
                            className={cn('mb-2 font-semibold', {
                              'text-[5rem] leading-[5.25rem]': workouts.length < 5,
                              'text-[4rem] leading-[5rem]': workouts.length >= 5
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
      <Snowfall snowflakeCount={50} />
    </Layout>
  );
}
