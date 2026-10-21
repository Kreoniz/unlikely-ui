'use client';

import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area';
import type { ComponentPropsWithRef } from 'react';
import { stateClass } from '../lib/state-class.js';

export type ScrollAreaRootProps = ComponentPropsWithRef<
  typeof BaseScrollArea.Root
>;
export type ScrollAreaViewportProps = ComponentPropsWithRef<
  typeof BaseScrollArea.Viewport
>;
export type ScrollAreaContentProps = ComponentPropsWithRef<
  typeof BaseScrollArea.Content
>;
export type ScrollAreaScrollbarProps = ComponentPropsWithRef<
  typeof BaseScrollArea.Scrollbar
>;
export type ScrollAreaThumbProps = ComponentPropsWithRef<
  typeof BaseScrollArea.Thumb
>;
export type ScrollAreaCornerProps = ComponentPropsWithRef<
  typeof BaseScrollArea.Corner
>;

/** Groups the viewport and scrollbars. Give the root a bounded size to create overflow. */
function ScrollAreaRoot({ className, ...props }: ScrollAreaRootProps) {
  return (
    <BaseScrollArea.Root
      {...props}
      className={stateClass('u-scroll-area', className)}
    />
  );
}

/** Native scrolling surface. Put the accessible region name, scroll handlers and viewport ref here. */
function ScrollAreaViewport({ className, ...props }: ScrollAreaViewportProps) {
  return (
    <BaseScrollArea.Viewport
      {...props}
      className={stateClass('u-scroll-viewport', className)}
    />
  );
}

/** Observes content size changes and leaves room for the overlaid scrollbars. */
function ScrollAreaContent({ className, ...props }: ScrollAreaContentProps) {
  return (
    <BaseScrollArea.Content
      {...props}
      className={stateClass('u-scroll-content', className)}
    />
  );
}

function ScrollAreaThumb({ className, ...props }: ScrollAreaThumbProps) {
  return (
    <BaseScrollArea.Thumb
      {...props}
      className={stateClass('u-scroll-thumb', className)}
    />
  );
}

/** A vertical scrollbar by default, with a styled thumb included. Supply children to customize the thumb. */
function ScrollAreaScrollbar({
  className,
  children,
  ...props
}: ScrollAreaScrollbarProps) {
  return (
    <BaseScrollArea.Scrollbar
      {...props}
      className={stateClass('u-scrollbar', className)}
    >
      {children ?? <ScrollAreaThumb />}
    </BaseScrollArea.Scrollbar>
  );
}

function ScrollAreaCorner({ className, ...props }: ScrollAreaCornerProps) {
  return (
    <BaseScrollArea.Corner
      {...props}
      className={stateClass('u-scroll-corner', className)}
    />
  );
}

export const ScrollArea = {
  Root: ScrollAreaRoot,
  Viewport: ScrollAreaViewport,
  Content: ScrollAreaContent,
  Scrollbar: ScrollAreaScrollbar,
  Thumb: ScrollAreaThumb,
  Corner: ScrollAreaCorner,
};
