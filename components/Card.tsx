import Image, { StaticImageData } from 'next/image';

interface CardProps {
  children: React.ReactNode;
  image: string | StaticImageData;
}

export const Card: React.FC<CardProps> = ({ children, image }) => {
  return (
    <div className='relative h-full px-10 py-4 bg-neutral-700 shadow-md rounded-md overflow-hidden'>
      <Image src={image} alt='background' layout='fill' objectFit='cover' objectPosition='center' />
      <div className='absolute bg-neutral-900 opacity-90 inset-0' />
      <div className='relative flex flex-col'>{children}</div>
    </div>
  );
};

export default Card;
