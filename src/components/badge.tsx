import type { ComponentPropsWithRef } from 'react';

export type StatusTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';
export interface BadgeProps extends ComponentPropsWithRef<'span'> {
  /** Status treatment when no category is supplied. */
  tone?: StatusTone;
  /** Stable categorical fill, independent of status. Takes precedence over tone. */
  category?: 1 | 2 | 3 | 4 | 5 | 6;
}
export function Badge({
  tone = 'neutral',
  category,
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      {...props}
      className={['u-badge', className].filter(Boolean).join(' ')}
      data-tone={tone}
      data-category={category}
    />
  );
}
