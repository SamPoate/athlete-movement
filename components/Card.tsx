import Image, { StaticImageData } from 'next/image';

interface CardProps {
  children: React.ReactNode;
  image: string | StaticImageData;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, image, onClick }) => {
  return (
    <div className='relative w-full h-full bg-neutral-700 cursor-pointer' onClick={onClick}>
      <Image
        src={image}
        alt='background'
        style={{
          objectFit: 'cover',
          objectPosition: 'center'
        }}
        sizes='50vw'
        fill
      />
      <div className='absolute bg-neutral-900 opacity-80 inset-0' />
      <div className='relative flex flex-col'>{children}</div>
    </div>
  );
};

export default Card;
