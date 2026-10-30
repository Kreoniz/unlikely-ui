// Adapted from shadcn/ui (MIT); see THIRD_PARTY_NOTICES.md.

import type { ComponentPropsWithRef } from 'react';

export interface CardProps extends ComponentPropsWithRef<'div'> {
  /** Standard panel padding or a compact panel. */
  size?: 'default' | 'sm';
}
function CardRoot({ className, size = 'default', ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      data-size={size}
      {...props}
      className={['u-card', className].filter(Boolean).join(' ')}
    />
  );
}
export function CardHeader({
  className,
  ...props
}: ComponentPropsWithRef<'div'>) {
  return (
    <div
      data-slot="card-header"
      {...props}
      className={['u-card-header', className].filter(Boolean).join(' ')}
    />
  );
}
export function CardTitle({
  className,
  ...props
}: ComponentPropsWithRef<'h2'>) {
  return (
    <h2
      data-slot="card-title"
      {...props}
      className={['u-card-title', className].filter(Boolean).join(' ')}
    />
  );
}
export function CardDescription({
  className,
  ...props
}: ComponentPropsWithRef<'p'>) {
  return (
    <p
      data-slot="card-description"
      {...props}
      className={['u-card-description', className].filter(Boolean).join(' ')}
    />
  );
}
export function CardContent({
  className,
  ...props
}: ComponentPropsWithRef<'div'>) {
  return (
    <div
      data-slot="card-content"
      {...props}
      className={['u-card-content', className].filter(Boolean).join(' ')}
    />
  );
}
export function CardFooter({
  className,
  ...props
}: ComponentPropsWithRef<'div'>) {
  return (
    <div
      data-slot="card-footer"
      {...props}
      className={['u-card-footer', className].filter(Boolean).join(' ')}
    />
  );
}
export function CardAction({
  className,
  ...props
}: ComponentPropsWithRef<'div'>) {
  return (
    <div
      {...props}
      data-slot="card-action"
      className={['u-card-action', className].filter(Boolean).join(' ')}
    />
  );
}

/** A shared panel. Compound properties remain compatibility aliases. */
export const Card = Object.assign(CardRoot, {
  Root: CardRoot,
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
  Action: CardAction,
});
