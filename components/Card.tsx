interface CardProps {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children }) => {
  return <div className='flex flex-col h-full px-10 py-4 bg-neutral-700 shadow-md rounded-md'>{children}</div>;
};

export default Card;
