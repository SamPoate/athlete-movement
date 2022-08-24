import Head from 'next/head';
import cn from 'classnames';
import { Autoplay, EffectCoverflow } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useTypedDispatch, useTypedSelector } from '@redux/store';
import { useGetClassesQuery } from '@redux/slices/classesApi';
import { setCard } from '@redux/slices/appSlice';
import Container from '@components/Container';
import Layout from '@components/Layout';
import Card from '@components/Card';
import huckle from '@image/beautiful-huckle.jpg';
import highFive from '@image/high-five.jpg';
import plates from '@image/plates.jpg';
import totallyNotADickShot from '@image/totally-not-a-dick-shot.jpg';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/effect-cards';

interface Props {
  preview: any;
}

export const Index: React.FC<Props> = ({ preview }) => {
  const card = useTypedSelector(state => state.app.card);

  const { data } = useGetClassesQuery();

  const dispatch = useTypedDispatch();

  if (!card) {
    return (
      <Layout preview={preview}>
        <Head>
          <title>Athlete Movement Classes</title>
        </Head>
        <Container className='flex justify-between'>
          {data?.data.map(({ attributes: { title } }, index) => (
            <button
              key={index}
              className='relative h-full px-10 py-4 bg-neutral-700 hover:bg-neutral-400 cursor-pointer shadow-md rounded-md overflow-hidden'
              onClick={() => dispatch(setCard(title?.toLowerCase()))}
            >
              {title}
            </button>
          ))}
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
        <Container className='flex clex-col flex-grow py-10'>
          <Swiper
            spaceBetween={50}
            slidesPerView={1}
            modules={[Autoplay, EffectCoverflow]}
            autoplay={{
              delay: 10000
            }}
            effect='coverflow'
            loop
          >
            {data?.data.map(({ attributes: { title, workouts } }, index) => {
              let color = 'text-white';
              let image = huckle;

              switch (title) {
                case 'Sweatcon':
                  color = 'text-yellow-300';
                  break;
                case 'Metcon':
                  color = 'text-blue-300';
                  image = plates;
                  break;
                case 'Metstrong':
                  color = 'text-red-600';
                  image = totallyNotADickShot;
                  break;
              }

              return (
                <SwiperSlide key={index}>
                  <Card image={image}>
                    <h2 className={cn('font-semibold lg:text-7xl text-5xl text-center mb-10', color)}>{title}</h2>
                    <ul>
                      {workouts.map((workout, i) => (
                        <li key={i}>
                          <div className='flex justify-between columns-3'>
                            <p className='w-1/5 font-semibold lg:text-4xl text-3xl mr-5'>{workout.column_one}</p>
                            <p className='w-2/5 pl-2 font-semibold lg:text-3xl text-2xl whitespace-pre-wrap'>
                              {workout.column_two}
                            </p>
                            <p className='w-2/5 pl-2 font-semibold lg:text-3xl text-2xl lg:leading-relaxed leading-relaxed whitespace-pre-wrap '>
                              {workout.column_three}
                            </p>
                          </div>
                          <hr className='border-yellow-300 my-5 mx-5' />
                        </li>
                      ))}
                    </ul>
                  </Card>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </Container>
      </Layout>
    </>
  );
};

export default Index;

export async function getStaticProps({ preview = null }) {
  //   const allPosts = (await getAllPostsForHome(preview)) || []

  return {
    props: { allPosts: [], preview }
  };
}
