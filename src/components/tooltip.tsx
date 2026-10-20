'use client';

import {
  Tooltip as BaseTooltip,
  type TooltipRootProps as BaseTooltipRootProps,
} from '@base-ui/react/tooltip';
import { createContext, useContext, useId, useState } from 'react';
import type { ComponentPropsWithRef, ReactNode } from 'react';
import { Theme } from '../theme.js';
import { stateClass } from '../lib/state-class.js';

export interface TooltipRootProps<
  Payload = unknown,
> extends BaseTooltipRootProps<Payload> {
  id?: string;
}
export interface TooltipProviderProps {
  children?: ReactNode;
  /**
   * Hover delay in milliseconds, applied on every hover.
   * @default 300
   */
  delay?: number;
  /**
   * Delay before closing on pointer leave, in milliseconds.
   * @default 0
   */
  closeDelay?: number;
}
export type TooltipTriggerProps<Payload = unknown> = Omit<
  BaseTooltip.Trigger.Props<Payload>,
  'delay' | 'closeDelay'
> & {
  /**
   * Hover delay in milliseconds. Trigger overrides take priority over the Provider.
   * Keyboard focus opens immediately.
   * @default Provider delay, or 300 without a Provider
   */
  delay?: number;
  /**
   * Delay before closing on pointer leave, in milliseconds.
   * @default Provider closeDelay, or 0 without a Provider
   */
  closeDelay?: number;
};
export interface TooltipContentProps extends Omit<
  ComponentPropsWithRef<typeof BaseTooltip.Popup>,
  'id'
> {
  /** Props for the Base UI portal. */
  portalProps?: ComponentPropsWithRef<typeof BaseTooltip.Portal>;
  /** Positioning overrides for the popup and its directional arrow. */
  positionerProps?: ComponentPropsWithRef<typeof BaseTooltip.Positioner>;
}

const TooltipContext = createContext<{
  id: string;
  open: boolean;
  triggerId: string | null;
} | null>(null);
const TooltipTimingContext = createContext({ delay: 300, closeDelay: 0 });

function TooltipProvider({
  delay = 300,
  closeDelay = 0,
  children,
}: TooltipProviderProps) {
  // Base UI's Provider skips delays after a tooltip opens. Share timing only
  // so every hover honors the configured delay without duplicating its timers.
  return (
    <TooltipTimingContext value={{ delay, closeDelay }}>
      {children}
    </TooltipTimingContext>
  );
}

function TooltipRoot<Payload>({
  id: idProp,
  onOpenChange,
  ...props
}: TooltipRootProps<Payload>) {
  const generatedId = useId();
  const [open, setOpen] = useState(props.defaultOpen ?? false);
  const [triggerId, setTriggerId] = useState<string | null>(
    props.defaultTriggerId ?? null,
  );
  return (
    <TooltipContext
      value={{
        id: idProp ?? generatedId,
        open: !props.disabled && (props.open ?? open),
        triggerId: props.triggerId ?? triggerId,
      }}
    >
      <BaseTooltip.Root
        {...props}
        onOpenChange={(nextOpen, details) => {
          onOpenChange?.(nextOpen, details);
          if (!details.isCanceled) {
            setOpen(nextOpen);
            setTriggerId(details.trigger?.id ?? null);
          }
        }}
      />
    </TooltipContext>
  );
}

function TooltipTrigger<Payload>({
  id: idProp,
  delay,
  closeDelay,
  'aria-describedby': describedBy,
  ...props
}: TooltipTriggerProps<Payload>) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const tooltip = useContext(TooltipContext);
  const timing = useContext(TooltipTimingContext);
  const description =
    tooltip?.open && (!tooltip.triggerId || tooltip.triggerId === id)
      ? tooltip.id
      : undefined;
  return (
    <BaseTooltip.Trigger
      {...props}
      delay={delay ?? timing.delay}
      closeDelay={closeDelay ?? timing.closeDelay}
      id={id}
      aria-describedby={
        [describedBy, description].filter(Boolean).join(' ') || undefined
      }
    />
  );
}

function TooltipContent({
  className,
  children,
  portalProps,
  positionerProps,
  ...props
}: TooltipContentProps) {
  const tooltip = useContext(TooltipContext);
  return (
    <BaseTooltip.Portal {...portalProps}>
      <Theme className="u-tooltip-theme">
        <BaseTooltip.Positioner
          positionMethod="fixed"
          sideOffset={8}
          collisionPadding={16}
          {...positionerProps}
        >
          <BaseTooltip.Popup
            role="tooltip"
            {...props}
            id={tooltip?.id}
            className={stateClass(
              'u-tooltip ui:bg-u-raised ui:text-u-ink ui:border ui:border-solid ui:border-u-line',
              className,
            )}
          >
            {children}
            <BaseTooltip.Arrow className="u-tooltip-arrow" />
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </Theme>
    </BaseTooltip.Portal>
  );
}

export const Tooltip = {
  Provider: TooltipProvider,
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
  Content: TooltipContent,
};
