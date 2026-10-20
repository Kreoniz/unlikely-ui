'use client';

import { Button as BaseButton } from '@base-ui/react/button';
import { isValidElement } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg';
interface ButtonBaseProps extends BaseButton.Props {
  /** Visual emphasis for the action. */
  variant?: ButtonVariant;
  /** Show progress, expose aria-busy, and prevent repeated activation. */
  loading?: boolean;
  /**
   * Keep a disabled button focusable. Defaults to the loading state so focus
   * stays on a button while its action is in progress.
   * @default loading
   */
  focusableWhenDisabled?: boolean | undefined;
}
export type ButtonProps = ButtonBaseProps &
  (
    | {
        /** Control size. Icon sizes require an accessible name. */ size?:
          'sm' | 'md' | 'lg';
      }
    | ({ size: 'icon' | 'icon-sm' | 'icon-lg' } & (
        { 'aria-label': string } | { 'aria-labelledby': string }
      ))
  );

const base =
  'u-button ui:inline-flex ui:items-center ui:justify-center ui:gap-2 ui:appearance-none ui:whitespace-nowrap ui:rounded-u-control ui:border ui:border-solid ui:font-u-sans ui:font-medium ui:no-underline ui:select-none ui:cursor-pointer';
const variants: Record<ButtonVariant, string> = {
  primary:
    'ui:bg-u-accent ui:text-u-accent-ink ui:border-u-accent-border ui:hover:bg-u-accent-hover ui:active:bg-u-accent-pressed',
  secondary:
    'ui:bg-u-surface ui:text-u-ink ui:border-u-line ui:hover:bg-u-hover ui:active:bg-u-hover',
  ghost:
    'ui:bg-transparent ui:text-u-ink ui:border-transparent ui:hover:bg-u-hover ui:active:bg-u-hover',
  danger:
    'ui:bg-u-danger-soft ui:text-u-danger ui:border-u-danger-border ui:hover:bg-u-danger-hover ui:active:bg-u-danger-pressed',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className,
  children,
  render,
  ...props
}: ButtonProps) {
  const role =
    props.role ??
    (isValidElement<{ href?: string }>(render) &&
    render.type === 'a' &&
    render.props.href
      ? 'link'
      : undefined);
  return (
    <BaseButton
      {...props}
      render={render}
      role={role}
      disabled={disabled || loading}
      focusableWhenDisabled={props.focusableWhenDisabled ?? loading}
      aria-busy={loading || props['aria-busy']}
      data-variant={variant}
      data-size={size}
      data-loading={loading || undefined}
      className={(state) =>
        [
          base,
          variants[variant],
          typeof className === 'function' ? className(state) : className,
        ]
          .filter(Boolean)
          .join(' ')
      }
    >
      <span className="u-button-label" data-loading={loading || undefined}>
        {children}
      </span>
      {loading && <span className="u-button-spinner" aria-hidden="true" />}
    </BaseButton>
  );
}
