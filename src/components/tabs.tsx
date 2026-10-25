'use client';

import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import type { ComponentPropsWithRef } from 'react';
import { stateClass } from '../lib/state-class.js';

export type TabsRootProps = ComponentPropsWithRef<typeof BaseTabs.Root>;
export type TabsListProps = ComponentPropsWithRef<typeof BaseTabs.List>;
export type TabsTabProps = ComponentPropsWithRef<typeof BaseTabs.Tab>;
export type TabsPanelProps = ComponentPropsWithRef<typeof BaseTabs.Panel>;
export type TabsIndicatorProps = ComponentPropsWithRef<
  typeof BaseTabs.Indicator
>;

function TabsRoot({ className, ...props }: TabsRootProps) {
  return (
    <BaseTabs.Root {...props} className={stateClass('u-tabs', className)} />
  );
}
function TabsList({ className, ...props }: TabsListProps) {
  return (
    <BaseTabs.List
      {...props}
      className={stateClass('u-tabs-list', className)}
    />
  );
}
function TabsTab({ className, ...props }: TabsTabProps) {
  return (
    <BaseTabs.Tab {...props} className={stateClass('u-tabs-tab', className)} />
  );
}
function TabsPanel({ className, ...props }: TabsPanelProps) {
  return (
    <BaseTabs.Panel
      {...props}
      className={stateClass('u-tabs-panel', className)}
    />
  );
}
function TabsIndicator({ className, ...props }: TabsIndicatorProps) {
  return (
    <BaseTabs.Indicator
      {...props}
      className={stateClass('u-tabs-indicator', className)}
    />
  );
}

export const Tabs = {
  Root: TabsRoot,
  List: TabsList,
  Tab: TabsTab,
  Panel: TabsPanel,
  Indicator: TabsIndicator,
};
