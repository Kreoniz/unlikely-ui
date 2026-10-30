'use client';

import { useId, useLayoutEffect, useRef, useState } from 'react';
import type {
  ComponentProps,
  ComponentPropsWithRef,
  CSSProperties,
  ReactNode,
} from 'react';
import { ContextMenu } from '@base-ui/react/context-menu';
import { Menu } from '@base-ui/react/menu';
import { Button } from '../../../src/components/button.js';
import { Theme } from '../../../src/theme.js';
import './radial.css';

export interface RadialMenuAction {
  /** Stable unique action identity. */
  id: string;
  /** Complete visible label and native typeahead text. */
  label: string;
  /** App-owned decorative icon. */
  icon?: ReactNode;
  /** Base UI disabled action semantics. */
  disabled?: boolean;
}
export interface RadialMenuProps
  extends
    Omit<ComponentPropsWithRef<'div'>, 'onSelect'>,
    Pick<
      ComponentProps<typeof ContextMenu.Root>,
      'open' | 'defaultOpen' | 'onOpenChange'
    > {
  /** Names the menu and its ordinary keyboard/touch opener. */
  label: string;
  /** Clockwise order: upper-left, upper-right, right, lower-right, lower-left, left. */
  items: readonly RadialMenuAction[];
  /** App-owned effects and error handling, shared by fan and list. */
  onAction: (id: string) => void;
  /** List preference; other counts and long labels also use the ordinary list. */
  layout?: 'auto' | 'list';
  disabled?: boolean;
  /** App-owned enabled focus destination after an action changes availability. */
  finalFocus?: ComponentProps<typeof ContextMenu.Popup>['finalFocus'];
}
const point = (radius: number, angle: number) => {
  const rad = (angle * Math.PI) / 180;
  return [50 + radius * Math.cos(rad), 50 + radius * Math.sin(rad)].map(
    (n) => +n.toFixed(3),
  );
};
const xy = (r: number, a: number) => point(r, a).join(' ');
const sectors = Array.from({ length: 6 }, (_, i) => {
  const angle = -120 + i * 60,
    start = angle - 26,
    end = angle + 26;
  const path = `M ${xy(46, start + 2)} A 46 46 0 0 1 ${xy(46, end - 2)} Q ${xy(46, end)} ${xy(44, end)} L ${xy(16.6, end)} Q ${xy(14.6, end)} ${xy(14.6, end - 7)} A 14.6 14.6 0 0 0 ${xy(14.6, start + 7)} Q ${xy(14.6, start)} ${xy(16.6, start)} L ${xy(44, start)} Q ${xy(46, start)} ${xy(46, start + 2)} Z`;
  const outer = Array.from({ length: 15 }, (_, j) =>
    point(49, angle - 29 + (j * 58) / 14),
  );
  const inner = Array.from({ length: 9 }, (_, j) =>
    point(12, angle + 29 - (j * 58) / 8),
  );
  const hit =
    'polygon(' +
    [...outer, ...inner].map(([x, y]) => `${x}% ${y}%`).join(',') +
    ')';
  const [x, y] = point(31, angle),
    rad = (angle * Math.PI) / 180;
  return { path, hit, x, y, dx: Math.cos(rad) * 5, dy: Math.sin(rad) * 5 };
});

/** Reference-led contextual fan; Base UI owns opening, collision, menu keys and dismissal. */
export function RadialMenu({
  label,
  items,
  onAction,
  layout = 'auto',
  disabled = false,
  open,
  defaultOpen,
  onOpenChange,
  finalFocus,
  className,
  children,
  onContextMenu,
  onTouchStart,
  ...props
}: RadialMenuProps) {
  const id = useId().replace(/:/g, '');
  const button = useRef<HTMLButtonElement>(null);
  const menuActions = useRef<ContextMenu.Root.Actions | null>(null);
  const isOpen = useRef(open ?? defaultOpen ?? false);
  useLayoutEffect(() => {
    if (open !== undefined) isOpen.current = open;
  }, [open]);
  const [origin, setOrigin] = useState<'context' | 'button'>('button');
  const radial =
    layout === 'auto' &&
    items.length === 6 &&
    items.every((item) => Array.from(item.label).length <= 14);
  return (
    <ContextMenu.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={(next, details) => {
        onOpenChange?.(next, details);
        if (!details.isCanceled) isOpen.current = open ?? next;
      }}
      actionsRef={menuActions}
      disabled={disabled}
    >
      <div className={['radial-control', className].filter(Boolean).join(' ')}>
        <ContextMenu.Trigger
          {...props}
          className="radial-context-surface"
          onContextMenu={(event) => {
            setOrigin('context');
            onContextMenu?.(event);
          }}
          onTouchStart={(event) => {
            setOrigin('context');
            onTouchStart?.(event);
          }}
        >
          {children}
        </ContextMenu.Trigger>
        <Menu.Trigger
          ref={button}
          render={<Button variant="secondary" />}
          className="radial-open-button"
          onPointerDown={() => setOrigin('button')}
          onKeyDown={(event) => {
            setOrigin('button');
            // Escape can arrive here before popup focus/dismissal mounts.
            if (event.key === 'Escape' && isOpen.current) {
              event.preventDefault();
              menuActions.current?.close();
            }
          }}
          disabled={disabled}
        >
          {label}
        </Menu.Trigger>
      </div>
      <ContextMenu.Portal>
        <Theme className="radial-theme">
          <ContextMenu.Positioner
            className="radial-positioner"
            anchor={origin === 'button' ? button : undefined}
            side="bottom"
            align={radial ? 'center' : 'start'}
            collisionPadding={12}
            collisionAvoidance={{ side: 'shift', align: 'shift' }}
            sideOffset={({ positioner, anchor }) =>
              radial ? -(positioner.height + anchor.height) / 2 : 8
            }
          >
            <ContextMenu.Popup
              aria-label={label}
              className="radial-popup"
              data-layout={radial ? 'radial' : 'list'}
              finalFocus={finalFocus ?? button}
            >
              <span className="radial-origin" aria-hidden="true" />
              {items.map((item, index) => {
                const shape = sectors[index % 6]!;
                return (
                  <ContextMenu.Item
                    key={item.id}
                    label={item.label}
                    disabled={item.disabled}
                    onClick={() => onAction(item.id)}
                    className="radial-sector"
                    style={
                      {
                        '--radial-hit': shape.hit,
                        '--radial-x': `${shape.x}%`,
                        '--radial-y': `${shape.y}%`,
                        '--radial-dx': `${shape.dx}px`,
                        '--radial-dy': `${shape.dy}px`,
                        '--radial-delay': `${index * 18}ms`,
                      } as CSSProperties
                    }
                  >
                    <svg
                      className="radial-sector-shape"
                      viewBox="0 0 100 100"
                      aria-hidden="true"
                    >
                      <defs>
                        <linearGradient
                          id={`${id}-${index}`}
                          x1="0"
                          y1="0"
                          x2=".6"
                          y2="1"
                        >
                          <stop stopColor="var(--u-physical-inset)" />
                          <stop
                            offset="1"
                            stopColor="color-mix(in srgb, var(--u-physical-inset), var(--u-physical-casing) 4%)"
                          />
                        </linearGradient>
                      </defs>
                      <path
                        className="radial-sector-base"
                        d={shape.path}
                        transform="translate(0 1.25)"
                      />
                      <path
                        className="radial-sector-face"
                        d={shape.path}
                        fill={`url(#${id}-${index})`}
                      />
                    </svg>
                    <span className="radial-sector-content">
                      <span className="radial-sector-icon" aria-hidden="true">
                        {item.icon}
                      </span>
                      <span dir="auto">{item.label}</span>
                    </span>
                  </ContextMenu.Item>
                );
              })}
            </ContextMenu.Popup>
          </ContextMenu.Positioner>
        </Theme>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}
