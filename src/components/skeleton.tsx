import type { ComponentPropsWithRef } from 'react';

export type SkeletonProps = ComponentPropsWithRef<'div'>;
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      {...props}
      aria-hidden="true"
      className={['u-skeleton', className].filter(Boolean).join(' ')}
    />
  );
}
