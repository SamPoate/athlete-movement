import Head from 'next/head';
import Image from 'next/image';
import cn from 'classnames';
import { useTypedDispatch, useTypedSelector } from '@redux/store';
import { useGetClassesQuery } from '@redux/slices/classesApi';
import { setCard } from '@redux/slices/appSlice';
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
  const card = useTypedSelector(state => state.app.card);

  const { data } = useGetClassesQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true
  });

  const dispatch = useTypedDispatch();

  const getClassStyles = (title?: string) => {
    let color = 'text-white';
    let image = huckle;

    switch (title) {
      case 'Sweatcon':
        color = 'text-am-yellow';
        break;
      case 'Metcon':
        color = 'text-am-blue';
        image = plates;
        break;
      case 'Metstrong':
        color = 'text-am-red';
        image = totallyNotADickShot;
        break;
      case 'Academy':
        color = 'text-blue-300';
        image = plates;
        break;
      case 'Weightlifting':
        color = 'text-red-600';
        image = kettlebells;
        break;
      case 'Barbellas':
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
                  onClick={() => dispatch(setCard(item))}
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
          <Container>
            <h2 className={cn('font-semibold lg:text-7xl leading-none text-5xl text-center mb-5', cardColor)}>
              {card.attributes.title}
            </h2>
            <hr className='border-yellow-300 mb-5 mx-auto' />
            <ul>
              {card.attributes.workouts.map((workout, i) => (
                <li key={i}>
                  <div className='flex justify-between items-center'>
                    <p className='w-1/3 font-semibold lg:text-5xl text-2xl whitespace-pre-wrap leading-tight'>
                      {workout.column_one}
                    </p>
                    <p className='w-2/3 pl-2 font-semibold lg:text-4xl text-2xl lg:leading-relaxed leading-relaxed whitespace-pre-wrap '>
                      {workout.column_two}
                    </p>
                  </div>
                  <hr className='border-yellow-300 my-5 mx-5' />
                </li>
              ))}
            </ul>
          </Container>
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
