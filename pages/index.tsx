import Head from 'next/head';
import Image from 'next/image';
import cn from 'classnames';
import { useTypedDispatch, useTypedSelector } from '@redux/store';
import { useGetClassesQuery } from '@redux/slices/classesApi';
import { setCardId } from '@redux/slices/appSlice';
import Container from '@components/Container';
import Layout from '@components/Layout';
import Card from '@components/Card';
import logo from '@image/logos/logo_lg.png';
import huckle from '@image/beautiful-huckle.jpg';
import highFive from '@image/high-five.jpg';
import plates from '@image/plates.jpg';
import kettlebells from '@image/kettlebells.jpg';
import totallyNotADickShot from '@image/totally-not-a-dick-shot.jpg';

interface Props {
  preview: any;
}

export const Home: React.FC<Props> = ({ preview }) => {
  const cardId = useTypedSelector(state => state.app.cardId);

  const { data } = useGetClassesQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true
  });

  const dispatch = useTypedDispatch();

  const card = data?.data.find(item => item.id === cardId);

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
    }

    return {
      color,
      image
    };
  };

  const { color: cardColor, image: cardImage } = getClassStyles(card?.attributes.title);

  if (!card) {
    return (
      <Layout preview={preview}>
        <Head>
          <title>Athlete Movement Classes</title>
        </Head>
        <div className='fixed h-full w-full'>
          <Image
            src={logo}
            alt='Logo'
            layout='fill'
            objectFit='contain'
            objectPosition='center'
            className='opacity-10'
          />
        </div>
        <Container className='flex justify-between items-start flex-wrap'>
          {data?.data && data.data.length ? (
            data.data.map((item, index) => {
              const { color, image } = getClassStyles(item.attributes.title);

              return (
                <button
                  key={index}
                  className={cn(
                    'relative flex justify-center items-center w-[calc(50%_-_1rem)] px-16 pt-8 pb-10 mb-8 bg-neutral-700 hover:bg-neutral-400 cursor-pointer shadow-md rounded-md overflow-hidden'
                  )}
                  onClick={() => dispatch(setCardId(item.id))}
                >
                  <Image src={image} alt='background' layout='fill' objectFit='cover' objectPosition='center' />
                  <div className='absolute bg-neutral-900 opacity-80 inset-0 z-0' />
                  <p className={cn('text-6xl font-semibold leading-none z-10', color)}>{item.attributes.title}</p>
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
    <>
      <Layout preview={preview}>
        <Head>
          <title>Athlete Movement Classes</title>
        </Head>
        <Card image={cardImage}>
          <div className='p-4'>
            <h2 className={cn('font-semibold lg:text-7xl leading-none text-5xl text-center mb-5', cardColor)}>
              {card.attributes.title}
            </h2>
            <hr className='border-yellow-300 mb-4 mx-auto' />
            <ul>
              {card.attributes.workouts.map(
                (workout, i) =>
                  (workout.column_one || workout.column_two) && (
                    <li key={i} className='mb-4'>
                      <div className='flex items-center justify-between'>
                        <div className='w-1/4 mr-16'>
                          <p
                            className={cn('font-semibold', {
                              'text-[4.5rem] leading-[4.75rem]': card.attributes.workouts.length < 5,
                              'text-[3.75rem] leading-[4rem]': card.attributes.workouts.length >= 5
                            })}
                          >
                            {workout.column_one}
                          </p>
                        </div>
                        <ul className='w-3/4'>
                          {workout.column_two.split(/\r?\n/).map((item, index) => (
                            <li
                              key={index}
                              className={cn('mb-2 font-semibold', {
                                'text-[5rem] leading-[5.25rem]': card.attributes.workouts.length < 5,
                                'text-[4rem] leading-[5rem]': card.attributes.workouts.length >= 5
                              })}
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <hr className='border-yellow-300 mt-5 mb-3 mx-5' />
                    </li>
                  )
              )}
            </ul>
          </div>
        </Card>
      </Layout>
    </>
  );
};

export default Home;

export async function getStaticProps({ preview = null }) {
  //   const allPosts = (await getAllPostsForHome(preview)) || []

  return {
    props: { allPosts: [], preview }
  };
}
