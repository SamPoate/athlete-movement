import Head from 'next/head';
import cn from 'classnames';
import { Autoplay, EffectCoverflow } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useGetClassesQuery } from '@redux/slices/classesApi';
import Container from '@components/Container';
import Layout from '@components/Layout';
import Card from '@components/Card';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/effect-cards';

interface Props {
  preview: any;
}

export const Index: React.FC<Props> = ({ preview }) => {
  const { data } = useGetClassesQuery();

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

              switch (title) {
                case 'Sweatcon':
                  color = 'text-yellow-300';
                  break;
                case 'Metcon':
                  color = 'text-blue-300';
                  break;
                case 'Metstrong':
                  color = 'text-red-600';
                  break;
              }

              return (
                <SwiperSlide key={index}>
                  <Card>
                    <h2 className={cn('font-semibold text-7xl text-center mb-10', color)}>{title}</h2>
                    <ul>
                      {workouts.map(workout => (
                        <li key={workout.title}>
                          <div className='flex justify-between'>
                            <span className='font-semibold text-4xl mr-5'>{workout.title}</span>
                            <span className='font-semibold text-3xl'>{workout.description}</span>
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
