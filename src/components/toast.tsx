'use client';

import { Toast as BaseToast } from '@base-ui/react/toast';
import type { ComponentPropsWithRef } from 'react';
import { Theme } from '../theme.js';
import { Button } from './button.js';

export interface ToastViewportProps extends Omit<
  ComponentPropsWithRef<typeof BaseToast.Viewport>,
  'children'
> {
  /** Accessible label on each toast's dismiss button. */
  closeLabel?: string;
  /** Props for the Base UI portal. */
  portalProps?: ComponentPropsWithRef<typeof BaseToast.Portal>;
}
function ToastViewport({
  closeLabel = 'Dismiss notification',
  portalProps,
  className,
  ...props
}: ToastViewportProps) {
  const manager = BaseToast.useToastManager();
  return (
    <BaseToast.Portal {...portalProps}>
      <Theme className="u-toast-theme">
        <BaseToast.Viewport
          {...props}
          className={(state) =>
            [
              'u-toast-viewport',
              typeof className === 'function' ? className(state) : className,
            ]
              .filter(Boolean)
              .join(' ')
          }
        >
          {manager.toasts.map((toast) => (
            <BaseToast.Root
              key={toast.id}
              toast={toast}
              className="u-toast"
              data-tone={toast.type ?? 'neutral'}
            >
              <BaseToast.Content className="u-toast-content">
                <div>
                  <BaseToast.Title className="u-toast-title" />
                  <BaseToast.Description className="u-toast-description" />
                </div>
                {toast.actionProps && (
                  <BaseToast.Action className="u-toast-action" />
                )}
                <BaseToast.Close
                  aria-label={closeLabel}
                  aria-hidden={false}
                  render={
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      aria-label={closeLabel}
                    />
                  }
                >
                  <svg
                    viewBox="0 0 16 16"
                    width="16"
                    height="16"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    aria-hidden="true"
                  >
                    <path d="m4 4 8 8m0-8-8 8" />
                  </svg>
                </BaseToast.Close>
              </BaseToast.Content>
            </BaseToast.Root>
          ))}
        </BaseToast.Viewport>
      </Theme>
    </BaseToast.Portal>
  );
}
export const Toast = {
  Provider: BaseToast.Provider,
  Viewport: ToastViewport,
  useToastManager: BaseToast.useToastManager,
  createToastManager: BaseToast.createToastManager,
};
