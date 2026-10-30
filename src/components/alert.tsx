import type { ComponentPropsWithRef } from 'react';
import type { StatusTone } from './badge.js';

export interface AlertProps extends ComponentPropsWithRef<'div'> {
  /** Status treatment. Use descriptive text alongside the color. */
  tone?: StatusTone;
}
function AlertRoot({
  tone = 'info',
  className,
  role = 'status',
  ...props
}: AlertProps) {
  return (
    <div
      data-slot="alert"
      {...props}
      role={role}
      data-tone={tone}
      className={['u-alert', className].filter(Boolean).join(' ')}
    />
  );
}
export function AlertTitle({
  className,
  ...props
}: ComponentPropsWithRef<'div'>) {
  return (
    <div
      data-slot="alert-title"
      {...props}
      className={['u-alert-title', className].filter(Boolean).join(' ')}
    />
  );
}
export function AlertDescription({
  className,
  ...props
}: ComponentPropsWithRef<'div'>) {
  return (
    <div
      data-slot="alert-description"
      {...props}
      className={['u-alert-description', className].filter(Boolean).join(' ')}
    />
  );
}
export function AlertActions({
  className,
  ...props
}: ComponentPropsWithRef<'div'>) {
  return (
    <div
      {...props}
      className={['u-alert-actions', className].filter(Boolean).join(' ')}
    />
  );
}
export const Alert = Object.assign(AlertRoot, {
  Root: AlertRoot,
  Title: AlertTitle,
  Description: AlertDescription,
  Actions: AlertActions,
});
