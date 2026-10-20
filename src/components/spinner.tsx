import type { ComponentPropsWithRef } from 'react';

export interface SpinnerProps extends Omit<
  ComponentPropsWithRef<'svg'>,
  'children'
> {
  /** Accessible progress label. Null makes the spinner decorative. */
  label?: string | null;
  /** Size of the spinner graphic. */
  size?: 'sm' | 'md' | 'lg';
}
export function Spinner({
  label = 'Loading',
  size = 'md',
  className,
  ...props
}: SpinnerProps) {
  return (
    <svg
      {...props}
      className={['u-spinner', className].filter(Boolean).join(' ')}
      data-size={size}
      role={label ? 'status' : undefined}
      aria-label={label ?? undefined}
      aria-hidden={label ? undefined : true}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="9" opacity="0.2" />
      <path d="M12 3a9 9 0 0 1 9 9" />
    </svg>
  );
}
