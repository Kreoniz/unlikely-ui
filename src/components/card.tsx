import type { ComponentPropsWithRef } from 'react';

export type CardProps = ComponentPropsWithRef<'div'>;
function CardRoot({ className, ...props }: CardProps) {
  return (
    <div
      {...props}
      className={['u-card', className].filter(Boolean).join(' ')}
    />
  );
}
function CardHeader({ className, ...props }: ComponentPropsWithRef<'div'>) {
  return (
    <div
      {...props}
      className={['u-card-header', className].filter(Boolean).join(' ')}
    />
  );
}
function CardTitle({ className, ...props }: ComponentPropsWithRef<'h2'>) {
  return (
    <h2
      {...props}
      className={['u-card-title', className].filter(Boolean).join(' ')}
    />
  );
}
function CardDescription({ className, ...props }: ComponentPropsWithRef<'p'>) {
  return (
    <p
      {...props}
      className={['u-card-description', className].filter(Boolean).join(' ')}
    />
  );
}
function CardContent({ className, ...props }: ComponentPropsWithRef<'div'>) {
  return (
    <div
      {...props}
      className={['u-card-content', className].filter(Boolean).join(' ')}
    />
  );
}
function CardFooter({ className, ...props }: ComponentPropsWithRef<'div'>) {
  return (
    <div
      {...props}
      className={['u-card-footer', className].filter(Boolean).join(' ')}
    />
  );
}
export const Card = {
  Root: CardRoot,
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
};
