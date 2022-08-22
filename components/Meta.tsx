import Head from 'next/head';
import { HOME_OG_IMAGE_URL } from '@lib/constants';

interface MetaProps {}

export const Meta: React.FC<MetaProps> = () => {
  return (
    <Head>
      <meta name='msapplication-TileColor' content='#000000' />
      <meta name='theme-color' content='#191919' />
      <meta name='description' content='Home of the Athlete Movement Classes' />
      <meta property='og:image' content={HOME_OG_IMAGE_URL} />
    </Head>
  );
};

export default Meta;
