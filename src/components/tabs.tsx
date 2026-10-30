'use client';

// Adapted from shadcn/ui (MIT); see THIRD_PARTY_NOTICES.md.

import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { useDirection } from '@base-ui/react/direction-provider';
import { useLayoutEffect, useState } from 'react';
import type { ComponentPropsWithRef } from 'react';
import { stateClass } from '../lib/state-class.js';

export type TabsRootProps = ComponentPropsWithRef<typeof BaseTabs.Root>;
export interface TabsListProps extends ComponentPropsWithRef<
  typeof BaseTabs.List
> {
  /** Filled tabs or a simple underline. */
  variant?: 'default' | 'line';
}
export type TabsTabProps = ComponentPropsWithRef<typeof BaseTabs.Tab>;
export type TabsPanelProps = ComponentPropsWithRef<typeof BaseTabs.Panel>;
export type TabsIndicatorProps = ComponentPropsWithRef<
  typeof BaseTabs.Indicator
>;

function TabsRoot({ className, ...props }: TabsRootProps) {
  return (
    <BaseTabs.Root
      {...props}
      data-slot="tabs"
      className={stateClass('u-tabs', className)}
    />
  );
}
export function TabsList({
  className,
  variant = 'default',
  ...props
}: TabsListProps) {
  return (
    <BaseTabs.List
      data-slot="tabs-list"
      data-variant={variant}
      {...props}
      className={stateClass('u-tabs-list', className)}
    />
  );
}
export function TabsTrigger({ className, ...props }: TabsTabProps) {
  return (
    <BaseTabs.Tab
      {...props}
      data-slot="tabs-trigger"
      className={stateClass('u-tabs-tab', className)}
    />
  );
}
export function TabsContent({ className, ...props }: TabsPanelProps) {
  return (
    <BaseTabs.Panel
      data-slot="tabs-content"
      {...props}
      className={stateClass('u-tabs-panel', className)}
    />
  );
}
export function TabsIndicator({ className, ...props }: TabsIndicatorProps) {
  const direction = useDirection();
  const [measuredDirection, setMeasuredDirection] = useState(direction);
  // Let Base UI measure after the direction has reached the DOM. Its current
  // resize observer does not invalidate coordinates when only direction changes.
  useLayoutEffect(() => setMeasuredDirection(direction), [direction]);
  return (
    <BaseTabs.Indicator
      key={measuredDirection}
      {...props}
      className={stateClass('u-tabs-indicator', className)}
    />
  );
}

export const Tabs = Object.assign(TabsRoot, {
  Root: TabsRoot,
  List: TabsList,
  Tab: TabsTrigger,
  Panel: TabsContent,
  Indicator: TabsIndicator,
});
