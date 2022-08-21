import cn from 'classnames';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({ children, className }) => {
  return <div className={cn('container p-4 mx-auto', className)}>{children}</div>;
};

export default Container;
